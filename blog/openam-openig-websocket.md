---
layout: home
title: "How to Protect WebSocket Connection with OpenAM and OpenIG"
landing-title2: "How to Protect WebSocket Connection with OpenAM and OpenIG"
description: "How to setup OpenAM and OpenIG stack to protect WebSocket connection"
keywords: 'openam, openig, gateway, websocket'
share-buttons: true
---

# How to Integrate OpenIG and Message Brokers

Original article: []()

## Introduction

This article is a continuation of the article [How to Add Authorization and Protect Your Application With OpenAM and OpenIG Stack
](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Add-Authorization-and-Protect-Your-Application-With-OpenAM-and-OpenIG-Stack). The previous article described how to protect regular HTTP endpoints. In the following we will proctect WebSocket connection with OpenAM authentication. To simplyfy setup and deployment of services we will use Docker and Docker Compose tools.


## Sample Websocket Service Introduction

To test WebSocket we will use a Sping Framework based [Sample Socket Service](https://github.com/maximthomas/openig-protect-ws). To tun the serive in Docker, create `docker-compose.yml` file and add sample-service:

`docker-compose.yml`:
```yml
version: '3'
services:
  sample-service:
    image: maximthomas/sample-service
    restart: always
    ports:  
        - "8082:8080"
    networks:
      openam_network:
        aliases:
          - sample-service
networks:
  openam_network:
    driver: bridge
```

Run docker compose up command and after the service is started, open your browser and navigate to [http://localhost:8082/ui/ws](http://localhost:8082/ui/ws). You will see a web page from which you can connect to the WebSocker, send messages and see the replies from the server. Establish connection by pressing the Connect button and send message by pressing the Send Message button. After a message is received by the server it responds by current server tome.

![Sample Service WebSocket UI](/assets/img/openam-openig-websocket/sample-service-ws-ui.png)

## OpenIG Setup
Let's setup access to the sample service instance via OpenIG. Remove `ports` section from the `docker-compose.yml` file and add OpenIG.

### Create OpenIG Configuration

Create folder `openig-config` go to the folder and create two files `admin.json` and `config.json` with the followin contents:

`admin.json`
```json
{
    "prefix" : "openig",
    "mode": "PRODUCTION"
}
```

`confin.json`
```json
{
  "heap": [],
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

Then add OpenIG routes for `sample-service` UI and WebSocket endpoints. Create `routes` folder in `openig-config` folder.
In `routes` folder create `10-ui.json` for UI and `10-websocket.json` as well.
`10-ui.json`
```json
{
   "name": "${matches(request.uri.path, '^/ui/*')}",
   "condition": "${matches(request.uri.path, '^/ui/*')}",
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
      {
         "name": "EndpointHandler",
         "type": "DispatchHandler",
         "config": {
            "bindings": [
               {
                  "handler": "ClientHandler",
                  "capture": "all",
                  "baseURI": "${system['secured']}"
               }
            ]
         }
      }
   ]
}
```
`10-websocket.json`
```json
{
  "name": "${matches(request.uri.path, '^/ws-handler')}",
  "condition": "${matches(request.uri.path, '^/ws-handler')}",
  "monitor": true,
  "timer": true,
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [
        {
          "type": "HeaderFilter",
          "config": {
            "messageType": "REQUEST",
            "add": {
              "Host": [
                "${matchingGroups(system['ws.secured'],\"(http|https):\/\/(.[^\/]*)\")[2]}"
              ]
            },
            "remove": [
              "Sec-Websocket-Key",
              "Sec-Websocket-Version",
              "Host",
              "Origin"
            ]
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
            "baseURI": "${system['ws.secured']}"
          }
        ]
      }
    }
  ]
}
```
We need to remove headers fromt the client original HTTP request to establish a proper WebSocket connection from OpenIG instance to secured-service.

Add OpenIG service to the `docker-compose.yml` file.

```yml
...
  openig:
    image: openidentityplatform/openig
    build: .
    volumes:
      - ./openig-config:/usr/local/openig-config/config:ro
    ports:  
      - "8081:8080"
    environment:
      CATALINA_OPTS: -Dopenig.base=/usr/local/openig-config -Dsecured=http://sample-service:8080 -Dopenam=http://openam.example.org:8080/openam -Dws.secured=ws://sample-service:8080 -org.openidentityplatform.openig.websocket.ttl=180
    networks:
      openam_network:
        aliases:
          - openig.example.org
...
```
System properties from OpenIG example configuration

|Peroperty|Description|
|-|-|
|secured|points to the HTTP service|
|ws.secured|Points to the WebSocket service|
|openam|points to OpenAM instance (we will use this setting in future)|
|org.openidentityplatform.openig.websocket.ttl|The interval in seconds, during which the validity of the session is checked (default 180)|

Run the docker compose with the followin file. After OpenIG and sample servie are up, open [http://localhost:8080/ui/ws](http://localhost:8080/ui/ws) URL in your browser. You'll be able to establish WebSocket connection and all interactions will be proxied by OpenIG.

## OpenAM Setup

Let's add OpenAM authentication to our stack. 
Add OpenAM service to the `docker-compose.yml` file.

```yml
...
  openam:
    image: openidentityplatform/openam
    volumes:
      - ./data/openam:/usr/openam/config
    ports:  
      - "8080:8080"
    networks:
      openam_network:
        aliases:
          - openam.example.org
...
```
The `./data/openam` folder is needed to store OpenAM persistent configuration.


Add FQDN openam.example.org and openig.example.org to `hosts` file:
`127.0.0.1 openam.example.org openig.example.org`

Run `docker-compose` file, setup OpenAM, add cookie domain and setup `jwt` endpoint as described in [How to Add Authorization and Protect Your Application With OpenAM and OpenIG Stack
](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Add-Authorization-and-Protect-Your-Application-With-OpenAM-and-OpenIG-Stack#openam-installation) article.

Add OpenAM token validation filters to the `10-websocket.json` file.

```json
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
                "status": 401,
                "reason": "Found",
                "headers": {
                  "Content-Type": [
                    "application/json"
                  ],
                },
                "entity": "{ \"Error\": \"Unauthorized\"}"
              }
            }
          }
        }
```

These three filters do the following:
The first filter converts OpenAM token to JWT and sets to the request contest. The second filter adds JWT to the OpenIG to target service request. The third filter checks if there is a JWT in the request context and if not, responds with the `401` error. If authentication

## Test Solution

Navigate to [http://openig.example.org:8081/ui/ws](http://openig.example.org:8081/ui/ws) and press the `Connect` button. You will see the connection error message.

```
Log:
connecting...
socket error occurred
socket connection closed
```

Open the next tab in your browser and navigate to OpenAM URL [http://openam.example.org:8080/openam](http://openam.example.org:8080/openam)

Login to OpenAM, return to [http://openig.example.org:8081/ui/ws](http://openig.example.org:8081/ui/ws) tab and try to connect again. 

You will see the following
```
connecting...
connected
```

Press the `Send Message` button and you should see the following messages
```
sending message...</br>
got response message from server: current time: Mon Mar 13 12:57:45 UTC 2023
```

Let's logout from OpenAM go back to [http://openig.example.org:8081/ui/ws](http://openig.example.org:8081/ui/ws) wait 3 minutes (as set in the `org.openidentityplatform.openig.websocket.ttl` setting) and try to send a message.

We will see the following:

```
sending message...
socket connection closed
```

![Sample Service WebSocket UI and OpenAM](/assets/img/openam-openig-websocket/sample-service-ws-ui-openam.png)
