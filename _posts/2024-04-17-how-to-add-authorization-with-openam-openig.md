---
layout: home
title: "How to Add Authentication and Protect Your Application With OpenAM and OpenIG Stack"
landing-title2: "How to Add Authentication and Protect Your Application With OpenAM and OpenIG Stack"
description: "We will add OpenAM authentication for an application, and setup proxying to the application using OpenIG so an unauthenticated user could not access the application."
keywords: 'OpenAM, proxy, authentication, OpenIG, SSO'
imageurl: 'openam-og.png'
share-buttons: true
products: 
- openam

---
<h1>How to Add Authorization and Protect Your Application With OpenAM and OpenIG Stack</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Add-Authorization-and-Protect-Your-Application-With-OpenAM-and-OpenIG-Stack](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Add-Authorization-and-Protect-Your-Application-With-OpenAM-and-OpenIG-Stack)

# Table of Contents

# Introduction

In the following article, we will set up centralized authentication with OpenAM and set up gateway access to a test application with OpenIG. OpenIG will use an authentication session issued by OpenAM for authorization. 
We will use an application developed using Spring Boot and Spring Security as the protected application.
The source code of the application is located on [GitHub](https://github.com/OpenIdentityPlatform/openam-openig-springboot-example).
For the demonstration purposes, we will run services in Docker containers with the `docker compose` tool.

The authorization diagram is in the picture below:

![OpenAM OpenIG auth scheme](/assets/img/openam-openig/openam-openig-auth-scheme.png)

# Run the Test Application

Create a `docker-compose.yaml` file and add `spring-service` to the services section.
Map the 8081 port to test for a functional check

`docker-compose.yaml`
```yaml
services:
  spring-service:
    container_name: spring-service
    image: openidentityplatform/spring-security-openam-example
    restart: always
    ports:
      - "8081:8081"
    environment:
      JAVA_OPTS: -Dspring.profiles.active=jwt
    networks:
      openam_network:
        aliases:
          - spring-service

networks:
  openam_network:
    driver: bridge
```

Once the application is running, let's check access to the API for which we need to add authentication.

```bash
curl http://localhost:8081/api/protected-jwt | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   105    0   105    0     0  12684      0 --:--:-- --:--:-- --:--:-- 13125
{
   "error" : "Unauthorized",
   "path" : "/protected-jwt",
   "status" : 401,
   "timestamp" : "2024-04-16T06:01:25.331+00:00"
}
```
For successful authentication, a valid JWT must be passed to the API in the Authorization HTTP header. This is what the OpenAM and OpenIG stack will be responsible for. Shut down the test service with the `docker compose down` command for now.

## OpenAM Setup

Let's configure the OpenAM authentication service. It will be responsible for authentication and converting the authentication token to JWT (see below).

Add the OpenAM and OpenIG hostnames to the `hosts` file, for example `127.0.0.1 openam.example.org openig.example.org`.
On Windows systems, the hosts file is located at `C:\Windows\System32\drivers\etc\hosts`, on Linux and Mac it is located at `/etc/hosts`.
Add the OpenAM service to the `docker-compose.yaml` file:

```yaml
...
  openam:
    image: openidentityplatform/openam:latest
    container_name: openam
    ports:
      - "8080:8080"
    networks:
      openam_network:
        aliases:
          - openam.example.org
...
```

Start OpenAM with the `docker compose up openam` command. Once OpenAM is running, configure using the following command:

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
And wait for the command execution to complete.

## STS Setup
STS (Security Token Service) converts an OpenAM token to a JWT. After authentication, OpenAM returns an authentication token, which is a randomly generated sequence of characters. The STS service is responsible for converting the authentication token into a JWT, which contains information about the authenticated user. OpenIG will use STS for authorization.
To configure STS, go to the administrator console URL
[http://openam.example.org:8080/openam/XUI/#login/](http://openam.example.org:8080/openam/XUI/#login/)
In the login field enter the `amadmin` value, in the password field enter the value from the `ADMIN_PWD` parameter of the setup command, in this case, `passw0rd`.

![OpenAM Console Realm](/assets/img/openam-openig/openam-console-realm.png)

In the left menu click **STS** and create a new **STS Instance** with the following settings:

| Setting | Value |
|--|--|
|Supported Token Transforms|OPENAM->OPENIDCONNECT;don't invalidate interim OpenAM session|
|Deployment Url Element|jwt|
|The id of the OpenID Connect Token Provider| https://openam.example.org/openam|
|Client secret | changeme|
|Confirm client secret | changeme |
|The audience for issued tokens | https://openam.example.org/openam|

Then press the **Create** button

## Setting up a test user
In the OpenAM admin console, navigate to the root realm and select `Subjects` from the left menu. Set the password for the `demo` user. To do this, select it in the list of users, and click the `Edit` link under Password. Enter and save the new password. Next, log out of the administrator console.

# OpenIG Setup

OpenIG is responsible for authorization policies for back-end services. It converts the authentication token to a JWT in the OpenAM service and after successful authorization, passes the JWT to the back-end services in the HTTP Authorization header.

Create an `openig-config` folder and add two files to it: `admin.json`
```json
{
    "prefix" : "openig",
    "mode": "PRODUCTION"
}
```

 and `config.json`:
```json
{
  "heap": [
  ],
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [

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

Next, add a route that will proxy user requests to the test application, enriching the request with an Authorization header with a JWT token obtained from OpenAM.
Create a folder `openig-config/routes/` and add the `10-protected.json` file to the folder.

`10-protected.json`
```json
{
    "name": "${matches(request.uri.path, '^/api/protected-jwt') || matches(request.uri.path, '^/protected-jwt')}",
    "condition": "${matches(request.uri.path, '^/api/protected-jwt') || matches(request.uri.path, '^/protected-jwt')}",
    "monitor": true,
    "timer": true,
    "handler": {
        "type": "Chain",
        "config": {
            "filters": [
                {
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
                                        "${system['openam']}/UI/Login?org=/&goto=${urlEncode(contexts.router.originalUri)}"
                                    ]
                                },
                                "entity": "{ \"Redirect\": \"${system['openam']}/UI/Login?org=/&goto=${urlEncode(contexts.router.originalUri)}\"}"
                            }
                        }
                    }
                }
            ],
            "handler": "EndpointHandler"
        }
    },
    "heap": [
        {
            "name": "EndpointHandler",
            "type": "DispatchHandler",
            "config": {
                "bindings": [
                    {
                        "handler": "ClientHandler",
                        "capture": "all",
                        "baseURI": "${matchingGroups(system['spring-service'],\"((http|https):\/\/(.[^\/]*))\")[1]}"
                    }
                ]
            }
        }
    ]
}
```
This route authorizes two endpoints: API - `/api/protected-jwt` and UI - `/protected-jwt`.
Add the OpenIG service to the `docker-compose.yaml` file and remove the port mapping from the `spring-service`. Now this service is available only through OpenIG.

```yaml
services:
  openam:
    image: openidentityplatform/openam:latest
    container_name: openam
    ports:
      - "8080:8080"
    networks:
      openam_network:
        aliases:
          - openam.example.org
    
  openig:
    image: openidentityplatform/openig:latest
    container_name: openig
    volumes:
      - ./openig-config:/usr/local/openig-config:ro
    environment:
      CATALINA_OPTS: -Dopenig.base=/usr/local/openig-config -Dspring-service=http://spring-service:8081 -Dopenam=http://openam.example.org:8080/openam
    ports:
      - "8081:8080"
    networks:
      openam_network:
        aliases:
          - openig.example.org

  spring-service:
    container_name: spring-service
    image: openidentityplatform/spring-security-openam-example
    restart: always
    # ports:
    #   - "8081:8081"
    environment:
      JAVA_OPTS: -Dspring.profiles.active=jwt
    networks:
      openam_network:
        aliases:
          - spring-service

networks:
  openam_network:
    driver: bridge
```

Start OpenIG and the demo application services with the `docker compose up openig spring-service` command.

# Test the Solution

## Test the API Authorization

Get the OpenAM authentication token for the `demo` user:

```bash
curl -X POST -H "X-OpenAM-Username: demo" -H "X-OpenAM-Password: passw0rd" \ 
  -H "Content-Type: application/json" -H "Accept-API-Version: resource=2.1" \
  http://openam.example.org:8080/openam/json/realms/root/authenticate | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   159  100   159    0     0   4197      0 --:--:-- --:--:-- --:--:--  4297
{
   "realm" : "/",
   "successUrl" : "/openam/console",
   "tokenId" : "AQIC5wM2LY4Sfcze3DbBXVSXggTyZNpGfwOoFPLnHwmqLG0.*AAJTSQACMDEAAlNLABM2MTY1Mjg2MzI5Mzc4ODM0MzQ5AAJTMQAA*"
}
```

Call with the received token `/api/protected-jwt` endpoint:

```bash
curl  --cookie "iPlanetDirectoryPro=AQIC5wM2LY4Sfcze3DbBXVSXggTyZNpGfwOoFPLnHwmqLG0.*AAJTSQACMDEAAlNLABM2MTY1Mjg2MzI5Mzc4ODM0MzQ5AAJTMQAA*" \
 "http://openig.example.org:8081/api/protected-jwt" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    30    0    30    0     0   1071      0 --:--:-- --:--:-- --:--:--  1111
{
   "method" : "JWT",
   "user" : "demo"
}
```

OpenIG, via OpenAM, converted the authentication token passed in the `iPlanetDirectoryPro` cookie into a JWT and passed this JWT to the `spring-service` test application. The test application retrieved the user information from the JWT and returned a successful response.

## Test the UI Authorization

Log out of the OpenAM administrator console or open the browser in Incognito mode
Open the [http://openig.example.org:8081/protected-jwt](http://openig.example.org:8081/protected-jwt) URL in your browser. OpenIG will not find the authentication token cookie and will redirect the browser to OpenAM authentication. Enter the login `demo`, and password and click the `Log In` button.

![OpenAM demo login](/assets/img/openam-openig/openam-demo-login.png)

After successful authentication, the gateway will redirect the request to the Spring Boot application. It will receive a cookie with an authentication token from the http request, convert the token in OpenAM in STS service to JWT, and pass the received JWT to the demo application. The demo application will verify the JWT and return a successful response.

![OpenAM demo login](/assets/img/openam-openig/protected-app.png)

The source code for the demo application is available at [https://github.com/OpenIdentityPlatform/spring-security-openam-example](https://github.com/OpenIdentityPlatform/spring-security-openam-example).

The source code for the docker compose configuration and OpenIG routes for the article can be found at [https://github.com/OpenIdentityPlatform/openam-openig-springboot-example](https://github.com/OpenIdentityPlatform/openam-openig-springboot-example).