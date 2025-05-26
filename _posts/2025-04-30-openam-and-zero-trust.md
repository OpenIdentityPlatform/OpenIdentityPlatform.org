---
layout: home
title: "OpenAM and Zero Trust: Confirming Critical Operations"
landing-title2: "OpenAM and Zero Trust: Confirming Critical Operations"
description: "How to configuree Open Identity Platfrom stack to add extra protection to a critical service"
keywords: 'OAuth2, OIDC, SSO, OpenAM, Identity Provider, Service Provider'
imageurl: 'openam-og.png'
share-buttons: true
products: 
- openam
---

<h1>OpenAM and Zero Trust: Confirming Critical Operations</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Zero-Trust:-Confirming-Critical-Operations](https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Zero-Trust:-Confirming-Critical-Operations)

## Introduction

One of the principles of Zero Trust states: *Never trust, always verify*. In this article, we will explore how to implement this principle in an authentication system using open-source products [OpenAM](https://github.com/OpenIdentityPlatform/OpenAM) and [OpenIG](https://github.com/OpenIdentityPlatform/OpenIG).

A practical example of this principle can be seen in banking applications. When confirming a payment, banks almost always want to ensure that it is *you* conducting the transaction, not a malicious actor. To verify this, they send a one-time code to a trusted device via push notification or SMS.

Alternatively, the user may be asked to confirm their biometric data, such as a fingerprint, use a hardware token, or rely on a specialized application like Microsoft Authenticator or Google Authenticator.

## Solution Design

The solution consists of three components:

- **Protected Application**: Any application (in this case, a simple Node.js application) where users authenticate. It includes two pages: a profile page and a page with sensitive data.
- **Authentication Service (OpenAM)**: Handles user authentication and authorization.
- **Authorization Gateway (OpenIG)**: Sends a request to OpenAM to verify policy compliance. If successful, it grants access to the protected application; otherwise, it redirects the user for authentication. When attempting to access sensitive information, OpenAM will check whether the user has authenticated using a one-time code, ensuring no more than 20 seconds have passed since the last authentication.

As a second authentication factor, one-time passwords generated using the [TOTP algorithm](https://en.wikipedia.org/wiki/Time-based_one-time_password) will be used, along with mobile applications like [Microsoft Authenticator](https://support.microsoft.com/en-us/account-billing/download-microsoft-authenticator-351498fc-850a-45da-b7b6-27e523b8702a) or [Google Authenticator](https://support.google.com/accounts/answer/1066447).

## Preparation

The complete solution code is available at this link: [https://github.com/OpenIdentityPlatform/openam-openig-otp-example](https://github.com/OpenIdentityPlatform/openam-openig-otp-example).

### Preparing the Hosts File

Let’s assume the hostname for the authentication service will be `openam.example.org` and for the gateway `openig.example.org`. Before running the setup, add these hostnames and IP addresses to the `hosts` file, for example:  
`127.0.0.1 openam.example.org openig.example.org`

- On **Windows**, the `hosts` file is located at: `C:\Windows\System32\drivers\etc\hosts`
- On **Linux** and **Mac**, it is located at: `/etc/hosts`

### Authenticator Application

Install the mobile application [Microsoft Authenticator](https://support.microsoft.com/en-us/account-billing/download-microsoft-authenticator-351498fc-850a-45da-b7b6-27e523b8702a) or [Google Authenticator](https://support.google.com/accounts/answer/1066447) on your device.

### Docker Compose

For simplicity, all services will be launched using `docker compose`.

Create an empty file named `docker-compose.yml` and add the `services` object:

```yaml
services:
```

## Demo Application

For demonstration purposes, we will use a simple Node.js application with two URLs:  
- **Profile Page (`/`)** – Displays user profile information  
- **Sensitive Data Page (`/sensitive`)** – Contains protected sensitive information  

The application code can be found at [this link](https://github.com/OpenIdentityPlatform/openam-openig-otp-example/tree/master/demo-app).


```jsx
const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use((req, res, next) => {
    console.log(req.headers)
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send("Unauthorized");
    }
    next()
})

app.get("/", (req, res) => {
    const token = req.headers.authorization;
    const jwtPayload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const user = { name: jwtPayload.sub };
    res.render("profile", { user });
});

app.get("/sensitive", (req, res) => {
    const sensitiveData = { bankAccount: "1234-5678-9012-3456", secretKey: "MY_SUPER_SECRET_KEY" };
    res.render("sensitive", { sensitiveData });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
```

Add a demo application to the `docker-compose.yml` file in the `services` object

```yaml
services:
  demo-app:
    build: ./demo-app
    container_name: demo-app
```

Run the application with the command `docker compose up -d --build demo-app`

## OpenAM Authentication Service Configuration

Add the OpenAM seris to the `docker-compose.yml` file in the `services` object:

```yaml
services:
...
  openam:
    image: openidentityplatform/openam:latest
    container_name: openam
    hostname: openam.example.org
    ports:
      - "8080:8080"
```

Start the OpenAM container with the command `docker compose up openam`. Wait for the container to start and perform the initial installation with the command:

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

Wait until the installation is complete.


### Configuring MFA in OpenAM

Open the OpenAM administrator console at [http://openam.example.org:8080/openam](http://openam.example.org:8080/openam). 

Enter the administrator login and password. In this case, it is `amadmin` and `passw0rd` respectively.

In the console, select **Top Level Realm**. In the left menu, select **Authentication** → **Modules** and create a new module `totp` with type `Authenticator (OATH)`.

![New TOTP Module.png](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/0-new-totp-module.png)

In the settings, select **OATH Algorithm to Use: TOTP**, also specify **Name of the Issuer**, e.g. **OpenAM**. The rest of the settings can be left unchanged. Save the `totp` module settings.

![TOTP module settings](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/1-totp-module-settings.png)

Next, let's configure the authentication chain

In the administrator console, open the Top Level Realm, then go to **Authentication** → **Chains** in the left menu and create a new authentication chain `totp`.

![New TOTP authentication chain](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/2-new-totp-chain.png)

Add the created `totp` module to the chain and save the changes.

![TOTP authentication chain settings](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/3-totp-chain-settings.png)

### Configuring OpenAM Authorization Policy

Now let's move on to configuring the authorization policy in OpenAM for the `/sensitive` endpoint of the demo application. The policy will be configured so that the user is required to authenticate with a one-time code in the `totp` authentication chain, but the authentication will only be valid for 20 seconds.

Open the OpenAM administrator console. Open Top Level Realm. From the menu on the left, select **Authorization** → **Policy Sets**.  Select the **Default Policy Set**. Create a new `demo-sensitive` policy.

Select URL as the resource type and specify the resource as shown in the example in the figure below. Click **Add** and then **Create**.

![OpenAM new policy](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/4-new-policy.png)

For the created policy, on the Resources tab, allow GET and POST requests.

![Policy Actions](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/5-policy-actions.png)

On the Subjects tab, add the Authenticated Users type.

![Policy Subjects](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/6-policy-subjects.png)

On the Environments tab, add the Authentication by Module Chain condition and add the `totp` chain.

![Policy Environments](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/7-policy-environments.png)

Save the changes. This policy will authorize requests authenticated by the `totp` chain. 

Now configure the policy so that access is only valid for 20 seconds. OpenAM doesn't have such a policy out of the box, so we'll configure a policy script. But first let's prepare OpenAM to work with the time from the script. In the top menu, go to Configure → Global Services. In the list that opens, select Scripting. Click the Secondary Configuration tab.

![Configure Scripting](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/8-configure-scripting.png)

Open the `POLICY_CONDITION` configuration. On the Secondary Configurations tab, select EngineConfiguration.

![Scripting Policy Condition](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/9-scripting-policy-condition.png)

In the **Java class whitelist**, add `java.time.*` to allow Groovy scripts to work with time and date.

Save the changes. From the console's top menu, select Realms → Top Level Realm and select Scripts from the menu on the left. Create a new script Auth Time Policy Condition. 

![New Script](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/10-new-script.png)

Script type - POLICY_CONDITION.  Language - Groovy.

![Auth Time Policy Condition](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/11-auth-time-policy-condition.png)

```groovy
import java.time.Instant;
import java.time.temporal.ChronoUnit;

logger.warning("Session: " + session) 
def authInstant = session.getProperty("authInstant")

logger.warning("Auth time expired at1: " + authInstant)

def instant = Instant.parse(authInstant)
def expired = instant.plus(20, ChronoUnit.SECONDS)
if (Instant.now().compareTo(expired) > 0) {
  logger.warning("Auth time expired at: " + expired)   
  authorized = false
} else {
  authorized = true                
}
```

Save the policy changes.

Now let's configure the use of the script in the authorization policy. In the left menu, go to **Authorization** → **Policy Sets** → **Default Policy Set** → **demo-sensitive**. 

On the Environments tab, add a condition with the Script type and the value Auth Time Policy Condition.

![Policy Script](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/12-policy-script.png)

Save the changes.

Now let's configure the use of MFA for the `demo` user. This account was created when OpenAM was installed.

### OpenAM User Setup

Log out of the admin console, or open a browser in Incognito mode and go to [http://openam.example.org:8080/openam/XUI/#login](http://openam.example.org:8080/openam/XUI/#login)

In the login and password fields, enter `demo` and `changeit` respectively. This will open the user profile.

Now, start the authentication process on the `totp` chain. For this, open the link [http://openam.example.org:8080/openam/XUI/#login/&service=totp&ForceAuth=true](http://openam.example.org:8080/openam/XUI/#login/&service=totp&ForceAuth=true)

A window will open asking you to register a new device

![OpenAM Register Device](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/13-openam-register-device.png)

Click **Register Device** to register the device.

A page with a QR code will be displayed.

![OpenAM QR Code](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/14-openam-qr-code.png)

Open the authenticator app on your mobile device and scan the issued QR code in it. Click the **Login Using Verification Code** button.

Enter the code from the mobile app and click **Submit**.

![OpenAM verification code](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/15-openam-verification-code.png)

`MFA` for user `demo` is configured

### Configuring Authentication Token Conversion to JWT

After successful authentication, OpenAM creates a session and writes the session ID, which is a random character set, in a cookie to the browser. We will configure OpenAM so that third-party applications, such as OpenIG, can exchange the authentication token to the JWT to make it easier for third-party applications to work with.

Open the OpenAM admin console as described earlier. Select **Top Level Realm**. From the menu on the left, select **STS**. In the list that opens, create a new **Rest STS** instance. Fill in the settings

| **Setting** | **Value** |
| --- | --- |
| Supported Token Transforms | OPENAM->OPENIDCONNECT;don't invalidate interim OpenAM session |
| Deployment Url Element | jwt |
| The id of the OpenID Connect Token Provider | [https://openam.example.org/openam](https://openam.example.org/openam) |
| Client secret | changeme |
| Confirm client secret | changeme |
| The audience for issued tokens | [https://openam.example.org/openam](https://openam.example.org/openam) |

Save the Rest STS instance conversion settings.

You can read more about installing and configuring OpenAM in the documentation: [https://doc.openidentityplatform.org/openam/](https://doc.openidentityplatform.org/openam/)

## Configure the OpenIG authorization gateway

Add the OpenIG service to the `docker-compose.yml` file

```yaml
services:
...
  openig:
    image: openidentityplatform/openig:latest
    container_name: openig
    hostname: openig.example.org
    volumes:
      - ./openig:/usr/local/openig-config:ro
    environment:
      CATALINA_OPTS: -Dopenig.base=/usr/local/openig-config -Ddemo.app=http://demo-app:3000 -Dopenam=http://openam.example.org:8080/openam
    ports:
      - "8081:8080"
```

Note the arguments in the `CATALINA_OPTS` environment variable:

- `openig.base` - the path to the OpenIG configuration files
- `demo.app` - URL of the demo application to which OpenIG will proxy the request
- `openam` - the OpenAM URL to which OpenIG will redirect the user to authenticate and receive the JWT.

### General Settings

Create a `openig-config` folder and in it another `config` folder. In the `config` folder, create an `admin.json` file with the following contents:

```json
{
    "prefix": "openig",
    "mode": "PRODUCTION"
}
```

In the same folder, create a `config.json` file. 

```json
{
  "heap": [
    {
      "name": "EndpointHandler",
      "type": "DispatchHandler",
      "config": {
        "bindings": [
          {
            "handler": "ClientHandler",
            "capture": "all",
            "baseURI": "${system['demo.app']}"
          }
        ]
      }
    }
  ],
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [
        {
          "name": "STSFilter",
          "type": "ConditionalFilter",
          "config": {
            "condition": "${empty contexts.sts.issuedToken and not empty request.cookies['iPlanetDirectoryPro'][0].value}",
            "delegate": {
              "type": "TokenTransformationFilter",
              "config": {
                "openamUri": "${system['openam']}",
                "realm": "/",
                "instance": "jwt",
                "from": "OPENAM",
                "to": "OPENIDCONNECT",
                "idToken": "${request.cookies['iPlanetDirectoryPro'][0].value}"
              }
            }
          }
        },
        {
          "name": "AuthorizationHeaderFilter",
          "type": "ConditionalFilter",
          "config": {
            "condition": "${not empty contexts.sts.issuedToken}",
            "delegate": {
              "type": "HeaderFilter",
              "config": {
                "messageType": "REQUEST",
                "remove": [
                  "Authorization",
                  "JWT"
                ],
                "add": {
                  "Authorization": [
                    "Bearer ${contexts.sts.issuedToken}"
                  ]
                }
              }
            }
          }
        },
        {
          "name": "AuthenticationRedirectionFilter",
          "type": "ConditionEnforcementFilter",
          "config": {
            "condition": "${not empty contexts.sts.issuedToken}",
            "failureHandler": {
              "type": "StaticResponseHandler",
              "config": {
                "status": 302,
                "reason": "Found",
                "headers": {
                  "Content-Type": [
                    "application/json"
                  ],
                  "Location": [
                    "${system['openam']}/XUI/#login&goto=${urlEncode(contexts.router.originalUri)}"
                  ]
                },
                "entity": "{ \"Redirect\": \"${system['openam']}/XUI/#login&goto=${urlEncode(contexts.router.originalUri)}\"}"
              }
            }
          }
        }
      ],
      "handler": {
        "type": "Router",
        "name": "_router",
        "capture": "all"
      }
    }
  }
}
```

The `config.json` file defines a filter chain for each request to the demo application:

- `STSFilter` - if the HTTP request contains a cookie from OpenAM, the filter gets a JWT from this cookie, which is written to the context for further use
- `AuthorizationHeaderFilter` - adds the JWT received from OpenAM to the request in the `Authorization` header for use in the protected application
- `AuthenticationRedirectionFilter` - if the JWT is not present in the request context, redirects the user to authenticate with OpenAM.

An `EndpointHandler` handler is defined in the `heap` object that proxies requests in OpenIG to the demo application.

### Configure Routes to the Demo Application

In the `config` folder, create a `routes` folder and add a `10-home.json` route


```json
{
  "name": "${matches(request.uri.path, '^/$')}",
  "condition": "${matches(request.uri.path, '^/$')}",
  "monitor": true,
  "timer": true,
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [],
      "handler": "EndpointHandler"
    }
  },
  "heap": [
    
  ]
} 
```

The route simply proxies requests to the demo application using the `EndpointHandler` defined in the `config.json` configuration file.

We will add the route to a URL with sensitive information of the demo application. We will then configure a filter for the route so that it uses the authorization policy from OpenAM.

Add the `20-sensitive.json` route to the `routes` folder

```json
{
  "name": "${matches(request.uri.path, '^/sensitive')}",
  "condition": "${matches(request.uri.path, '^/sensitive')}",
  "monitor": true,
  "timer": true,
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [
        {
          "name": "MFAPEPFilter",
          "type": "PolicyEnforcementFilter",
          "config": {
            "openamUrl": "${system['openam']}",
            "pepUsername": "amadmin",
            "pepPassword": "ampassword",
            "ssoTokenSubject": "${request.cookies['iPlanetDirectoryPro'][0].value}",
            "failureHandler": {
              "type": "StaticResponseHandler",
              "config": {
                "status": 403,
                "headers": {
                  "Content-Type": [
                    "application/json"
                  ]
                },
                "entity": "{ \"attributes\": \"${system['openam']}/XUI/#login&service=totp&ForceAuth=true&goto=${urlEncode(contexts.router.originalUri)}\"}"
              }
            }
          },
          "handler": "ClientHandler"
        }
      ],
      "handler": "EndpointHandler"
    }
  },
  "heap": []
}
```

The route uses `MFAPEPFilter` to get the result of the authorization policy from OpenAM. And, if the policy check fails, redirects to authentication with a one-time code.

You can read more about installing and configuring OpenIG in the documentation:  [https://doc.openidentityplatform.org/openig/](https://doc.openidentityplatform.org/openig/)

## Test the Solution

Start OpenIG with the `docker compose ui openig` command.

Log out of OpenAM if you are still authenticated.

Open the URL of the OpenIG protected demo application: [http://openig.example.org:8081/](http://openig.example.org:8081/). You will be redirected to authenticate to OpenAM. Enter the test user login and password: `demo` and `changeit`.

After authentication, you will be redirected to the main screen of the demo application


![Demo Profile Page](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/16-demo-profile-page.png)

Click the **Sensitive data** link. You will be redirected to additional authentication with a one-time code in OpenAM. 

![TOTP Verification](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/17-totp-verification.png)

Enter the code from the authenticator application and click Submit. If successful, you will be redirected back to the page with sensitive data

![Demo Sensitive Page](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-otp-zts/18-demo-sensitive-page.png)

Wait 30 seconds and reload the page. You will be redirected to authentication with a one-time code again.
