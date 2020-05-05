---
layout: home
title: "How to Add Authentication and Protect Your Application With OpenAM and OpenIG Stack"
landing-title2: "How to Add Authentication and Protect Your Application With OpenAM and OpenIG Stack"
description: "We will add OpenAM authentication for an application, and setup proxying to the application using OpenIG so an unauthenticated user could not access the application."
keywords: 'OpenAM, proxy, authentication, OpenIG, SSO'
imageurl: 'openam-og.png'
share-buttons: true
---
<h1>How to Add Authorization and Protect Your Application With OpenAM and OpenIG Stack</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Add-Authorization-and-Protect-Your-Application-With-OpenAM-and-OpenIG-Stack](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Add-Authorization-and-Protect-Your-Application-With-OpenAM-and-OpenIG-Stack)

## Table of Contents
- [What is this article about?](#what-is-this-article-about-)
- [Preparation](#preparation)
- [Configure OpenIG](#configure-openig)
- [OpenAM configuration](#openam-configuration)
  * [OpenAM Installation](#openam-installation)
  * [OpenAM Configuration](#openam-configuration)
    + [Setup Cookie Domain](#setup-cookie-domain)
    + [Setup Security Token Service (STS)](#setup-security-token-service--sts-)
- [Integrate OpenAM Authentication with OpenIG](#integrate-openam-authentication-with-openig)
  * [Check everything works](#check-everything-works)

## What is this article about?
We will add OpenAM authentication for an application, and set up proxying to the application using OpenIG so an unauthenticated user could not access the application.

We will use Docker and docker-compose to simplify the deployment.

Authorization diagram is on the picture below:

![OpenAM OpenIG auth scheme](/assets/img/openam-openig/openam-openig-auth-scheme.png)

As a service that needs to be protected, we will use `maximthomas/sample-service` from DockerHub. The source code for sample service is on the GitHub [https://github.com/maximthomas/openig-protect-ws/tree/master/sample-service](https://github.com/maximthomas/openig-protect-ws/tree/master/sample-service):

This service returns request headers as well as authentication JWT data in JSON format.

Let's create `docker-compose.yaml` file and add `sample-service` to the file:

`docker-compose.yaml`
```yaml
version: '3'
services:
  sample-service:
    image: maximthomas/sample-service
    restart: always
    ports:  
        - "8080:8080"
    networks:
      openam_network:
        aliases:
          - sample-service
networks:
  openam_network:
    driver: bridge
```

Test service
```bash
$ curl http://localhost:8080/secured | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    88    0    88    0     0   8800      0 --:--:-- --:--:-- --:--:--  8800
{
   "headers" : {
      "user-agent" : "curl/7.58.0",
      "host" : "localhost:8080",
      "accept" : "*/*"
   },
   "jwt" : {}
}

```

If we will open `http://localhost:8080/secured` URL in a browser, the resulst will be the same JSON.

So, now we need to secure `http://localhost:8080/secured`, so an unauthenticated user could not access the endpoint.

## Preparation

Add FQDN openam.example.org and openig.example.org to `hosts` file:

`127.0.0.1 openam.example.org openig.example.org`


## Configure OpenIG
Now we will proxy all requests to `sample-service/secured` endpoint via OpenIG

To do this, create an `openig-config` folder and add 2 files there.
`admin.json`

```json
{
    "prefix" : "openig",
    "mode": "PRODUCTION"
}
```
 and
`config.json`

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

In the `openig-config` folder create the `routes` folder and add the route for the closed service `10-secured.json`.

`10-secured.json`
```json
{
   "name":"${matches(request.uri.path, '^/secured')}",
   "condition":"${matches(request.uri.path, '^/secured')}",
   "monitor":true,
   "timer":true,
   "handler":{
      "type":"Chain",
      "config":{
         "filters":[

         ],
         "handler":"EndpointHandler"
      }
   },
   "heap":[
      {
         "name":"EndpointHandler",
         "type":"DispatchHandler",
         "config":{
            "bindings":[
               {
                  "handler":"ClientHandler",
                  "capture":"all",
                  "baseURI":"${matchingGroups(system['secured'],\"((http|https):\/\/(.[^\/]*))\")[1]}"
               }
            ]
         }
      }
   ]
}
```

Then add OpenIG to `docker-compose.yaml` file:

```yaml
version: '3'
services:
  sample-service:
    image: maximthomas/sample-service
    restart: always
  networks:
    openam_network:
      aliases:
        - sample-service
  openig:
    image: openidentityplatform/openig
    volumes:
      - ./openig-config:/usr/local/openig-config/config:ro
    ports:  
      - "8080:8080"
    environment:
      CATALINA_OPTS: -Dopenig.base=/usr/local/openig-config -Dsecured=http://sample-service:8080 -Dopenam=http://openam.example.org:8080/openam
    networks:
      openam_network:
        aliases:
          - openig.example.org
networks:
  openam_network:
    driver: bridge          
```

Now OpenIG proxies all requests to `secured` endpoint and one cant access `sample-service` directly

Then we will add authentication via OpenAM

## OpenAM configuration

And add OpenAM to `docker-compose.yaml` file:

```yaml
version: '3.7'
services:
  sample-service:
    image: maximthomas/sample-service
    restart: always
    networks:
      openam_network:
        aliases:
          - sample-service

  openig:
    image: openidentityplatform/openig
    volumes:
      - ./openig-config:/usr/local/openig-config/config:ro
    ports:  
      - "8081:8080"
    environment:
      CATALINA_OPTS: -Dopenig.base=/usr/local/openig-config -Dsecured=http://sample-service:8080 -Dopenam=http://openam.example.org:8080/openam
    networks:
      openam_network:
        aliases:
          - openig.example.org

  openam:
    image: openidentityplatform/openam
    volumes:
      - ./data/openam:/usr/openam/config
    ports:  
      - "8080:8080"
    user: root
    networks:
      openam_network:
        aliases:
          - openam.example.org

networks:
  openam_network:
    driver: bridge
```

### OpenAM Installation

Start docker-compose and open OpenAM link in browser: [http://openam.example.org:8080/openam/](http://openam.example.org:8080/openam/)

![OpenAM Setup](/assets/img/openam-openig/openam-setup.png)

Choose **Create Default Configuration**, enter passwords for `amAdmin` and `Default Policy Agent` and press **Crate Configuration**

![OpenAM Setup Passwords](/assets/img/openam-openig/openam-setup-passwords.png)

After successful configuration authenticate to OpenAM console

![OpenAM Console Authentication](/assets/img/openam-openig/openam-console-auth.png)

### OpenAM Configuration

#### Setup Cookie Domain

In OpenAM console go to Configure -> Global Services -> Platform

Add `.example.org` to Cookie Domain setting

#### Setup Security Token Service (STS)

In OpenAM console go to Realms -> Top Level Realm

![OpenAM Console Realm](/assets/img/openam-openig/openam-console-realm.png)

In the left menu click **STS** and create new **STS Instance** with the following settings:

| Setting | Value |
|--|--|
|Supported Token Transforms|OPENAM->OPENIDCONNECT;don't invalidate interim OpenAM session|
|Deployment Url Element|jwt|
|The id of the OpenID Connect Token Provider| https://openam.example.org/openam|
|Client secret | changeme|
|Confirm client secret | changeme |
|The audience for issued tokens | https://openam.example.org/openam|

Then press **Create** and **Back to Access Control**


## Integrate OpenAM Authentication with OpenIG

Open `openig-config/routes/10-secured.json` file and add three filters:
* The first conditional filter takes OpenAM authentication token form request if it exists and converts authentication token to a JWT
* The second filter creates Authorization header with the JWT
* The third filter redirects the client to OpenAM authentication if there's not valid OpenAM token in the request

`10-secured.json`
```json
{
    "name": "${matches(request.uri.path, '^/secured')}",
    "condition": "${matches(request.uri.path, '^/secured')}",
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
                    "Authorization","JWT"
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
                      "Content-Type": ["application/json"],
                      "Location": ["${system['openam']}/UI/Login?org=/&goto=${urlEncode(contexts.router.originalUri)}"]
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
              "baseURI": "${matchingGroups(system['secured'],\"((http|https):\/\/(.[^\/]*))\")[1]}"
            }
          ]
        }
      }
    ]
  }
```

### Check if everything works

Open http://openig.example.org:8081/secured in a browser

OpenIG will redirect to authentication in OpenAM:

![OpenIG Redirect OpenAM](/assets/img/openam-openig/openig-redirect-openam.png)

Let's authenticate with amadmin user:

After successful authentication, OpenAM will redirect to [http://openig.example.org:8081/secured](http://openig.example.org:8081/secured)

In the response secured service returns Authorization header with JWT token:
```json
{"headers":{"authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbWFkbWluIiwiaXAiOiIxNzIuMTguMC4xIiwiaXNzIjoiaHR0cHM6Ly9vcGVuYW0uZXhhbXBsZS5vcmcvb3BlbmFtIiwibm9uY2UiOiJhOTdmNzk3My0zODcwLTRjYjMtYjVmZi0xYTk2MzA4MGJhNmIiLCJhdWQiOiJodHRwczovL29wZW5hbS5leGFtcGxlLm9yZy9vcGVuYW0iLCJhdXRoOnNlcnZpY2UiOiJsZGFwU2VydmljZSIsImF1dGg6bW9kdWxlIjoiRGF0YVN0b3JlIiwiYXV0aDp0aW1lIjoxNTg4MjMzNTYwLCJhdXRoOmxldmVsIjoiMCIsImF1dGg6dGltZTptYXgiOjE1ODg2NjU1MDAsInJlYWxtIjoiLyIsImF1dGg6dGltZTptYXg6aWRsZSI6MTU4ODIzNTM2MCwiZXhwIjoxNTg4MjM0MTYwLCJpYXQiOjE1ODgyMzM1NjAsImF1dGg6Y3R4aWQiOiIyMjQ4MThlOGVkZjQwOWFmMDEiLCJqdGkiOiJlNDYyNmM5My05ZWJhLTRiNWEtYWRlNi1lMTZjZmM0MjVjOTEifQ.PsdpW9rckgwnhU0w5Xgp2PMUD3XlGtCEiLSot-UAMJ8","referer":"http://openam.example.org:8080/openam/XUI/?org=/&goto=http%3A%2F%2Fopenig.example.org%3A8081%2Fsecured","accept-language":"en-US;q=1,en;q=0.9,ru;q=0.8","cookie":"amlbcookie=01; iPlanetDirectoryPro=AQIC5wM2LY4Sfcwl2X8fnzaMmd3RPnJ4EnXuRIlCYswUKkI.*AAJTSQACMDEAAlNLABMzMDYyNjc5ODcxODk5ODE4OTEzAAJTMQAA*","host":"openig.example.org:8081","upgrade-insecure-requests":"1","connection":"Keep-Alive","accept-encoding":"gzip, deflate","accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9","user-agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36"},"jwt":{"header":{"typ":"JWT","alg":"HS256"},"body":{"sub":"amadmin","ip":"172.18.0.1","iss":"https://openam.example.org/openam","nonce":"a97f7973-3870-4cb3-b5ff-1a963080ba6b","aud":"https://openam.example.org/openam","auth:service":"ldapService","auth:module":"DataStore","auth:time":1588233560,"auth:level":"0","auth:time:max":1588665500,"realm":"/","auth:time:max:idle":1588235360,"exp":1588234160,"iat":1588233560,"auth:ctxid":"224818e8edf409af01","jti":"e4626c93-9eba-4b5a-ade6-e16cfc425c91"}}}
```

Let's do the same with `curl` tool:

Try access  [http://openig.example.org:8081/secured](http://openig.example.org:8081/secured) URL without an authentication token

```bash
$ curl -v http://openig.example.org:8081/secured
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to openig.example.org (127.0.0.1) port 8081 (#0)
> GET /secured HTTP/1.1
> Host: openig.example.org:8081
> User-Agent: curl/7.58.0
> Accept: */*
>
< HTTP/1.1 302 Found
< Server: Apache-Coyote/1.1
< Location: http://openam.example.org:8080/openam/UI/Login?org=/&goto=http%3A%2F%2Fopenig.example.org%3A8081%2Fsecured
< Content-Type: application/json
< Content-Length: 123
< Date: Thu, 30 Apr 2020 08:02:34 GMT
<
* Connection #0 to host openig.example.org left intact
```

OpenIG returns 302 Status with OpenAM location header

Let's authenticate OpenAM with curl

```bash
$ curl -v -X POST -H "X-OpenAM-Username: amadmin" -H "X-OpenAM-Password: ampassword" -H "Content-Type: application/json" -H "Accept-API-Version: resource=2.1" http://openam.example.org:8080/openam/json/realms/root/authenticate
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to openam.example.org (127.0.0.1) port 8080 (#0)
> POST /openam/json/realms/root/authenticate HTTP/1.1
> Host: openam.example.org:8080
> User-Agent: curl/7.58.0
> Accept: */*
> X-OpenAM-Username: amadmin
> X-OpenAM-Password: ampassword
> Content-Type: application/json
> Accept-API-Version: resource=2.1
>
< HTTP/1.1 200
< X-Frame-Options: SAMEORIGIN
< Set-Cookie: amlbcookie=01; Domain=example.org; Path=/
< Set-Cookie: amlbcookie=01; Domain=openam.example.org; Path=/
< Cache-Control: no-cache, no-store, must-revalidate
< Content-API-Version: resource=2.1
< Expires: 0
< Pragma: no-cache
< Content-Type: application/json;charset=UTF-8
< Content-Length: 163
< Date: Thu, 30 Apr 2020 08:08:36 GMT
<
* Connection #0 to host openam.example.org left intact
{"tokenId":"AQIC5wM2LY4SfczD-B2nuUiXZX0u77ac03pjxJvxGortWZM.*AAJTSQACMDEAAlNLABQtODI1MzA5MjkwMTk1OTk5Mzk4NQACUzEAAA..*","successUrl":"/openam/console","realm":"/"}
```
Got authentication token from the response

Now try to access [http://openig.example.org:8081/secured](http://openig.example.org:8081/secured) URL with issued authentication token

```bash
$ curl -v \
--cookie "iPlanetDirectoryPro=AQIC5wM2LY4SfczD-B2nuUiXZX0u77ac03pjxJvxGortWZM.*AAJTSQACMDEAAlNLABQtODI1MzA5MjkwMTk1OTk5Mzk4NQACUzEAAA..*" \
"http://openig.example.org:8081/secured" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to openig.example.org (127.0.0.1) port 8081 (#0)
> GET /secured HTTP/1.1
> Host: openig.example.org:8081
> User-Agent: curl/7.58.0
> Accept: */*
> Cookie: iPlanetDirectoryPro=AQIC5wM2LY4SfczD-B2nuUiXZX0u77ac03pjxJvxGortWZM.*AAJTSQACMDEAAlNLABQtODI1MzA5MjkwMTk1OTk5Mzk4NQACUzEAAA..*
>
< HTTP/1.1 200 OK
< Server: Apache-Coyote/1.1
< Date: Thu, 30 Apr 2020 08:12:18 GMT
< Content-Type: application/json
< Transfer-Encoding: chunked
<
{ [1455 bytes data]
100  1448    0  1448    0     0  24542      0 --:--:-- --:--:-- --:--:-- 24542
* Connection #0 to host openig.example.org left intact
{
   "jwt" : {
      "header" : {
         "alg" : "HS256",
         "typ" : "JWT"
      },
      "body" : {
         "auth:level" : "0",
         "exp" : 1588234938,
         "auth:module" : "DataStore",
         "auth:time:max:idle" : 1588236138,
         "auth:time" : 1588234116,
         "jti" : "b86e6dc1-eeca-443f-b73d-44235f41f818",
         "auth:time:max" : 1588652958,
         "auth:service" : "ldapService",
         "iat" : 1588234338,
         "aud" : "https://openam.example.org/openam",
         "iss" : "https://openam.example.org/openam",
         "nonce" : "54da63fd-f8f1-49fc-96cf-b5d211f0588b",
         "realm" : "/",
         "auth:ctxid" : "606dc841c299b0f01",
         "sub" : "amadmin",
         "ip" : "172.18.0.1"
      }
   },
   "headers" : {
      "user-agent" : "curl/7.58.0",
      "connection" : "Keep-Alive",
      "accept" : "*/*",
      "authorization" : "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbWFkbWluIiwiaXAiOiIxNzIuMTguMC4xIiwiaXNzIjoiaHR0cHM6Ly9vcGVuYW0uZXhhbXBsZS5vcmcvb3BlbmFtIiwibm9uY2UiOiI1NGRhNjNmZC1mOGYxLTQ5ZmMtOTZjZi1iNWQyMTFmMDU4OGIiLCJhdWQiOiJodHRwczovL29wZW5hbS5leGFtcGxlLm9yZy9vcGVuYW0iLCJhdXRoOnNlcnZpY2UiOiJsZGFwU2VydmljZSIsImF1dGg6bW9kdWxlIjoiRGF0YVN0b3JlIiwiYXV0aDp0aW1lIjoxNTg4MjM0MTE2LCJhdXRoOmxldmVsIjoiMCIsImF1dGg6dGltZTptYXgiOjE1ODg2NTI5NTgsInJlYWxtIjoiLyIsImF1dGg6dGltZTptYXg6aWRsZSI6MTU4ODIzNjEzOCwiZXhwIjoxNTg4MjM0OTM4LCJpYXQiOjE1ODgyMzQzMzgsImF1dGg6Y3R4aWQiOiI2MDZkYzg0MWMyOTliMGYwMSIsImp0aSI6ImI4NmU2ZGMxLWVlY2EtNDQzZi1iNzNkLTQ0MjM1ZjQxZjgxOCJ9.LdtU3SwN0jbaTc44VFxwGvxJcZlAj3Qr_iNTsGzREOY",
      "host" : "openig.example.org:8081",
      "cookie" : "iPlanetDirectoryPro=AQIC5wM2LY4SfczD-B2nuUiXZX0u77ac03pjxJvxGortWZM.*AAJTSQACMDEAAlNLABQtODI1MzA5MjkwMTk1OTk5Mzk4NQACUzEAAA..*"
   }
}

```

Everything works!
