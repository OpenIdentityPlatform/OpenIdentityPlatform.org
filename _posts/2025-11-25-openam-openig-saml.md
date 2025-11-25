---
layout: home
title: "SSO Configuration: OpenIG as SAML Service Provider for OpenAM"
landing-title2: "SSO Configuration: OpenIG as SAML Service Provider for OpenAM"
description: "Implement SAML 2.0 Single Sign-On (SSO) instantly using OpenIG as a proxy and OpenAM as your Identity Provider. This guide details the setup of OpenAM Fedlet and OpenIG configurations via Docker, allowing you to add robust SAML authentication to any application without modifying its source code. Achieve enterprise-grade access management with minimal effort."
keywords: 'SAML 2.0, Single Sign-On, SSO, OpenIG, OpenAM, Identity Provider, Service Provider, IdP, SP, Fedlet, Open Identity Platform, enterprise security, authentication, proxy, Docker, access management, technical guide, SAML configuration, OpenAM configuration, OpenIG configuration, secure applications, no-code authentication'
imageurl: 'openam-og.png'
share-buttons: true
products: 
- openam
- openig
---

# SSO Configuration: OpenIG as SAML Service Provider for OpenAM

## Introduction

The SAML 2.0 protocol is the standard for Single Sign-On (SSO) in enterprise environments. In this guide, we will show you how to use OpenIG as a proxy and service provider to easily add SAML authentication to any of your applications without changing its code.

## Preparation

1. To simplify service deployment, we will use OpenAM and OpenIG's Docker images. Therefore, you must have Docker installed.
2. Enter the host names for OpenAM and OpenIG in the `hosts` file. On Windows systems, the hosts file is located in the `C:\Windows/System32/drivers/etc/hosts` directory, and on Linux or Mac OS, it is located in `/etc/hosts`.
    
    ```
    127.0.0.1    openam.example.org openig.example.org
    ```

## Configuring OpenAM

### Installing OpenAM

Deploy the OpenAM container with the command:

```bash
docker run -h openam.example.org -p 8080:8080 --name openam openidentityplatform/openam
```

And perform the initial configuration:

```bash
docker exec -w '/usr/openam/ssoconfiguratortools' openam bash -c \
'echo "ACCEPT_LICENSES=true
SERVER_URL=http://openam.example.org:8080
DEPLOYMENT_URI=/$OPENAM_PATH
BASE_DIR=$OPENAM_DATA_DIR
locale=en_US
PLATFORM_LOCALE=en_US
AM_ENC_KEY=
ADMIN_PWD=passw0rd
AMLDAPUSERPASSWD=p@passw0rd
COOKIE_DOMAIN=example.org
ACCEPT_LICENSES=true
DATA_STORE=embedded
DIRECTORY_SSL=SIMPLE
DIRECTORY_SERVER=openam.example.org
DIRECTORY_PORT=50389
DIRECTORY_ADMIN_PORT=4444
DIRECTORY_JMX_PORT=1689
ROOT_SUFFIX=dc=openam,dc=example,dc=org
DS_DIRMGRDN=cn=Directory Manager
DS_DIRMGRPASSWD=passw0rd" > conf.file && java -jar openam-configurator-tool*.jar --file conf.file'
```

### OpenAM Identity Provider Setup

1. Access the administrator console via the link [http://openam.example.org:8080/openam](http://openam.example.org:8080/openam). Use the login `amadmin` and password `passw0rd`.
2. Select Top Level Realm
3. Go to **Create SAMLv2 Providers** → **Create Hosted Identity Provider**
4. Set Metadata Name: `openam`
5. In the Signing Key setting, select `test`
6. Enter the name of the Circle of Trust, for example, `cot`
7. In the Attribute Mapping section, add the mapping uid → uid, mail → mail
8. Click **Configure**

### OpenAM Fedlet Configuration

1. Open the administrator console
2. Select Top Level Realm
3. Go to **Create Fedlet Configuration**
4. Enter the fedlet name in the Name field, for example, openig.
5. Set the **Destination URL of the Service Provider which will include the Fedlet** to the URL that points to OpenIG: `http://openig.example.org:8081/saml`
6. In the Attribute Mapping section, add the mapping uid → uid, mail → mail
7. Click **Create**
    
    The Fedlet settings will be saved in the container in the directory `/usr/openam/config/myfedlets/openig/Fedlet.zip`.
    
    Copy the settings to the host machine using the command:
    
    ```bash
    docker cp openam:/usr/openam/config/myfedlets/openig/Fedlet.zip .
    ```

### Preparing a test user

1. Open the administrator console
2. Select Top Level Realm
3. In the left pane, select Subjects
4. In the list of accounts, open the `demo` account
5. In the Email Address field, enter `demo@example.org` or another valid email
6. Click **Save**

## OpenIG Setup

### Preparing OpenIG Configuration Files

1. Create a directory for OpenIG configuration files `openig-saml`
2. Add a directory `config` to it
3. In the `config` directory, create the files `admin.json` and `config.json`:
    
    `admin.json`:
    ```json
    {
      "prefix" : "openig",
      "mode": "PRODUCTION"
    }
    ```
    
    `config.json`:
    ```json
    {
      "heap": [
        {
          "name": "JwtSession",
          "type": "JwtSession"
        },
        {
          "name": "capture",
          "type": "CaptureDecorator",
          "config": {
            "captureEntity": true,
            "_captureContext": true
          }
        }
      ],
      "handler": {
        "type": "Chain",
        "config": {
          "filters": [],
          "handler": {
            "type": "Router",
            "name": "_router",
            "capture": "all"
          }
        }
      }
    }
    ```
    
4. Add a directory for routes named `routes` to the `config` directory.
5. Add the default route `99-default.json` to the `routes` directory. OpenIG will serve static content on this route and will not require authentication:
    
    ```json
    {
      "handler": {
        "type": "DispatchHandler",
        "config": {
          "bindings": [
            {
              "handler": {
                "type": "StaticResponseHandler",
                "config": {
                  "status": 200,
                  "reason": "OK",
                  "entity":
    "<!doctype html>
    <html>
    <head>
      <title>Home</title>
      <meta charset='UTF-8'>
    </head>
    <body>
      <h1><a href='/app'>Login</a></h1>   
    </body>
    </html>"
                }
              }
            }
          ]
        }
      },
      "session": "JwtSession"
    }
    ```
    
6. Start the OpenIG Docker container with the command. Note the mounted directory `/app-saml`.
    
    ```bash
    docker run -h openig.example.org -p 8081:8080 --name openig \
      -v ./app-saml:/usr/local/app-saml:ro \
      -e "CATALINA_OPTS=-Dopenig.base=/usr/local/app-saml" \
      openidentityplatform/openig
    ```

7. Check if the application is working:    

    ```bash
    $ curl -v http://openig.example.org:8081
    *   Trying 127.0.0.1:8081...
    * Connected to openig.example.org (127.0.0.1) port 8081 (#0)
    > GET / HTTP/1.1
    > Host: openig.example.org:8081
    > User-Agent: curl/7.81.0
    > Accept: */*
    > 
    * Mark bundle as not supporting multiuse
    < HTTP/1.1 200 
    < Content-Length: 146
    < Date: Mon, 24 Nov 2025 12:46:56 GMT
    < 
    <!doctype html>
    <html>
    <head>
      <title>Home</title>
      <meta charset='UTF-8'>
    </head>
    <body>
      <h1><a href='/app'>Login</a></h1>   
    </body>
    ```
### Configuring SAML Fedlet in OpenIG

1. In the `openig-saml` directory, create a directory named `SAML`.
2. Copy the contents of the Fedlet.zip archive that you received from OpenAM into this directory.
    
    ```bash
    unzip Fedlet.zip
    cp conf/* app-saml/SAML/
    ```

3. Create a route for obtaining credentials from SAML assertions `05-saml.json`
     ```json
    {
      "handler": {
        "type": "SamlFederationHandler",
        "config": {
          "assertionMapping": {
            "uid": "uid",
            "mail": "mail"
          },
          "redirectURI": "/app"
        }
      },
      "condition": "${matches(request.uri.path, '^/saml')}",
      "session": "JwtSession"
    }
    ```

4. Create a route for the application requiring SAML authentication `05-app.json`:

    ```json
    {
      "handler": {
        "type": "DispatchHandler",
        "config": {
          "bindings": [
            {
              "condition": "${empty session.uid}",
              "handler": {
                "type": "StaticResponseHandler",
                "config": {
                  "status": 302,
                  "reason": "Found",
                  "headers": {
                    "Location": [
                      "http://openig.example.org:8081/saml/SPInitiatedSSO"
                    ]
                  }
                }
              }
            },
            {
              "handler": {
              "handler": {
                "type": "StaticResponseHandler",
                "config": {
                  "status": 200,
                  "reason": "OK",
                  "entity":
    "<!doctype html>
    <html>
    <head>
      <title>OpenID Connect Discovery</title>
      <meta charset='UTF-8'>
    </head>
    <body>
      <h1>User: ${session.uid}, email: ${session.mail} </h1>            
    </body>
    </html>"
                }
              }
            }
            }
          ]
        }
      },
      "condition": "${matches(request.uri.path, '^/app')}",
      "session": "JwtSession"
    }
    ```

5. Start the OpenIG container:
    
    ```bash
    docker run -h openig.example.org -p 8081:8080 --name openig \
      -v ./app-saml:/usr/local/app-saml:ro \
      -e “CATALINA_OPTS=-Dopenig.base=/usr/local/app-saml” \
      openidentityplatform/openig
    ```

## Test the Solution

1. Exit the OpenAM console or open your browser in incognito mode.
2. Open the link to the OpenIG application, which does not require authentication: [http://openig.example.org:8081/](http://openig.example.org:8081/). 

    ![OpenIG Application Login](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-saml/0-openig-application-login.png)

3. Click on the `Login` link.
4. The OpenAM authentication form will open.
5. Enter the demo user credentials. Login: `demo`, password: `changeit`, and click the **Login** button.
    
    ![OpenAM Login](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-saml/1-openam-login.png)
    
6. You will be redirected to the application with the demo user credentials:
    
    ![OpenIG Logged In](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-saml/2-openig-logged-in.png)
    

## Conclusion.

We have successfully configured OpenIG as a Service Provider and implemented SAML 2.0 authentication via OpenAM. You can now use this approach to secure any applications in your infrastructure. The next step could be to configure Log Out.

For more details on configuring OpenAM and OpenIG, please refer to the documentation:

- [https://doc.openidentityplatform.org/openam](https://doc.openidentityplatform.org/openam/)
- [http://doc.openidentityplatform.org/openig](http://doc.openidentityplatform.org/openig)    