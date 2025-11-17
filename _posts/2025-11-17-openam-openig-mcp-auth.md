---
layout: home
title: "How to Protect Model Context Protocol (MCP) Servers with OpenAM and OpenIG"
landing-title2: "How to Protect Model Context Protocol (MCP) Servers with OpenAM and OpenIG"
description: "Secure your Spring AI MCP server with OAuth 2.1 using OpenAM authentication and OpenIG as an authorization gateway. Full step-by-step tutorial with Docker Compose, OpenIdentityPlatform, and VS Code Copilot integration."
keywords: 'mcp server oauth, model context protocol security, mcp oauth 2.1, spring ai mcp server oauth, secure mcp server, mcp server openam openig tutorial, protect mcp server with oauth, spring ai mcp oauth2 authentication, openig oauth2 resource server filter, openam mcp integration, vscode copilot mcp oauth, openidentityplatform mcp example, openam openig mcp, spring ai mcp server docker, how to add oauth 2.1 to spring ai mcp server, secure model context protocol server with openam and openig, docker compose openam openig mcp server, oauth2 protection for llm agents mcp, openig oauth2resourceserverfilter mcp example, model context protocol authorization, oauth 2.1 mcp specification, openam dynamic client registration mcp, openig proxy mcp server, llm agent security oauth, spring boot mcp server with oauth gateway'
imageurl: 'openam-og.png'
share-buttons: true
products: 
- openam
---

# How to Protect Model Context Protocol (MCP) Servers with OpenAM and OpenIG

## Introduction

Large language model (LLM) agents can perform various tasks, from writing code or texts to booking airline tickets. Agents consist of a client that interacts with the user and a server that performs the required tasks. The interaction between the client, server, and LLM occurs via the Model Context Protocol [MCP](https://modelcontextprotocol.io/docs/getting-started/intro).

MCP servers often have access to sensitive information, such as an internal source code repository or a customer database. Of course, not all users should have access to this data, even through an agent. To protect against unauthorized access, the Model Context Protocol specification describes the possibility of authorization based on OAuth 2.1: [https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization).

In this article, we will deploy a simple MCP server developed based on [Spring AI](https://spring.io/projects/spring-ai) and close it with the [OpenIG](https://github.com/OpenIdentityPlatform/OpenIG) authorization gateway. The [OpenAM](https://github.com/OpenIdentityPlatform/OpenAM) authentication service will be responsible for authentication. 

We will use VS Code with the Copilot extension as the MCP client.

## Project description

The source code for the OpenAM, OpenIG, and MCP server configuration is available at: [https://github.com/OpenIdentityPlatform/openam-openig-mcp-example](https://github.com/OpenIdentityPlatform/openam-openig-mcp-example)

The project consists of three services described in the `docker-compose.yml` file. 

```yaml
services:
  openig:
    build:
      context: ./openig-docker
      dockerfile: Dockerfile
    container_name: openig
    volumes:
      - ./openig-config:/usr/local/openig-config:ro
    ports:  
      - "8081:8080"
    environment:
      CATALINA_OPTS: -Dopenig.base=/usr/local/openig-config -Dopenam=http://openam.example.org:8080/openam
    networks:
      openam_network:
        aliases:
          - openig.example.org
  
  openam:
    build:
      context: ./openam-docker
      dockerfile: Dockerfile
    container_name: openam
    restart: always
    hostname: openam.example.org
    ports:
      - "8080:8080"
    volumes:
      - openam-data:/usr/openam/config
    networks:
      openam_network:
        aliases:
          - openam.example.org
          
  time-mcp-server:
    build:
      context: ./timeserver
      dockerfile: Dockerfile
    container_name: time-mcp-server
    ports:
      - "8082:8080"
    networks:
      openam_network:
        aliases:
          - timeserver.example.org
networks:
  openam_network:
    driver: bridge

volumes:
  openam-data:
```

## Preparing for launch

For example, the host name for OpenAM will be `openam.example.org`, and for OpenIG it will be `openig.example.org`. Open the `hosts` file and add the host names and IP addresses to it, for example 

```
127.0.0.1 openam.example.org openig.example.org
```

On Windows systems, the hosts file is located in the `C:\Windows/System32/drivers/etc/hosts` directory, and on Linux or Mac OS in `/etc/hosts`.

## MCP Server

The MCP server has a method for returning the current time in ISO 8601 format.

```java
@Service
public class TimeService {

    @Tool(name = "current_time_service", description = "Returns current time in ISO 8601 format")
    public String getTime() {
        return  Instant.now().toString();
    }
}
```

For more details on creating an MCP server, please refer to the [documentation](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html) or in the Spring AI [blog](https://spring.io/blog/2025/09/16/spring-ai-mcp-intro-blog).

Start the OpenAM, OpenIG, and MCP server Docker containers with the command:

```bash
docker compose up --build
```

Check the availability of the running MCP server with the command:

```bash
curl -X POST  --location  "http://localhost:8082/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d '{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {}
  }
}'

{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "capabilities": {
      "completions": {},
      "prompts": {
        "listChanged": false
      },
      "resources": {
        "listChanged": false,
        "subscribe": false
      },
      "tools": {
        "listChanged": false
      }
    },
    "protocolVersion": "2025-03-26",
    "serverInfo": {
      "name": "time-server-mcp",
      "version": "0.0.1"
    }
  }
}
```

Let's check the availability of tools in the MCP server:

```bash
curl -X POST  --location  "http://localhost:8082/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}' 

{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "current_time_service",
        "description": "Returns current time in ISO 8601 format",
        "inputSchema": {
          "type": "object",
          "properties": {},
          "required": [],
          "additionalProperties": false
        }
      }
    ]
  }
}
```

## Configuring OpenAM

OpenAM will be responsible for user authentication, issuing OAuth 2 `access_token` tokens, and validating them.

If you have not yet configured OpenAM, perform a quick setup by running the command:

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

### Configuring OAuth 2 in OpenAM

Open the OpenAM console at [http://openam.example.org:8080/openam/console](http://openam.example.org:8080/openam/console). Enter the administrator login and password in the `User Name` and `Password` fields. In this case, they will be `amadmin` and `passw0rd`, respectively. 

Select `Top Level Realm` from the Realm list.

![OpenAM Realms List](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/0-openam-realms-list.png)

Next, `Configure OAuth Provider`.

![OpenAM Configure OAuth Provider](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/1-openam-configure-oauth-provider.png)

Then select `Configure OAuth 2.0`.

![OpenAM Configure OAuth 2.0](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/2-openam-configure-oauth2.png)

In the form that opens, you can leave the default settings unchanged. Click `Create`.

![OpenAM Configure OAuth 2.0 Step 2](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/3-openam-configure-oauth2-step-2.png)

In the Realm settings, select Services from the menu on the left and open the OAuth2 Provider settings.

![OpenAM Realm Services](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/4-openam-realm-services.png)

Add the value `profile` to the `Scopes` and `Default Clients Scopes` settings. This scope will allow you to obtain basic information about the user. Enable the `Issue Refresh Tokens` and `Issue Refresh Tokens on Refreshing Access Tokens` options. Also, allow dynamic client registration by enabling the `Allow Open Dynamic Client Registration` option. This will allow the MCP client (VS Code) to automatically register with OpenAM without requiring any additional action from the user.

For more information on configuring OpenAM, please refer to the [documentation](https://doc.openidentityplatform.org/openam/).

## Configuring OpenIG

OpenIG will be responsible for authorizing requests. It will check the validity of `access_token` issued by OpenAM and proxy requests to OpenAM and the MCP server.

Now let's check the OpenIG route configuration for proxying requests.

### Proxying requests to the MCP server.

The route will receive the `access_token` issued by OpenAM, passed in the `Authorization` header. If the `access_token` is valid, it will pass the request to the MCP server and return a response. If the `access_token` is invalid, OpenIG will return HTTP status 401.

`openig-config/config/routes/10-mcp.json`

```json
{
   "name": "${matches(request.uri.path, '^/mcp')}",
   "condition": "${matches(request.uri.path, '^/mcp')}",
   "monitor": true,
   "timer": true,
   "handler": {
      "type": "Chain",
      "config": {
         "filters": [
            {
               "type": "OAuth2ResourceServerFilter",
               "config": {
                  "requireHttps": false,
                  "providerHandler": "ClientHandler", 
                  "scopes": [
                     "profile"
                  ],
                  "tokenInfoEndpoint": "${system['openam'].concat('/oauth2/tokeninfo')}" 
               }
            },
            {
               "type": "ConditionEnforcementFilter",
               "config": {
                  "condition": "${not empty contexts['oauth2']}",
                  "failureHandler": "RequireAuth"
               }
            }
         ],
         "handler": "EndpointHandler"
      }
   },
   "heap": [
      {
         "name": "RequireAuth",
         "type": "StaticResponseHandler",
         "config": {
            "status": 401,
            "headers": {
               "WWW-Authenticate": [
                  "Bearer realm=\"OpenIG\""
               ]
            },
            "entity": "Authentication required"
         }
      },
      {
         "name": "EndpointHandler",
         "type": "DispatchHandler",
         "config": {
            "bindings": [
               {
                  "handler": "ClientHandler",
                  "baseURI": "http://time-mcp-server:8080/mcp"
               }
            ]
         }
      }
   ]
}
```

The route consists of two filters. The first filter, `OAuth2ResourceServerFilter`, validates the `access_token` and, if successful, writes the data received from the `access_token` to the request context. The second filter, `ConditionEnforcementFilter`, checks the context and, if successful, forwards the request to the MCP server. Otherwise, it returns HTTP status 401.

Let's make an unauthorized request to the MCP server and verify that OpenIG requires authorization.

```bash
curl -v http://openig.example.org:8081/mcp
*   Trying 127.0.0.1:8081...
* Connected to openig.example.org (127.0.0.1) port 8081 (#0)
> GET /mcp HTTP/1.1
> Host: openig.example.org:8081
> User-Agent: curl/8.1.2
> Accept: */*
> 
< HTTP/1.1 401 
< WWW-Authenticate: Bearer realm="OpenIG"
< Content-Length: 0
< Date: Mon, 22 Sep 2025 08:00:48 GMT

```

Proxying to `.well-known` endpoints

According to the MCP specification, the client obtains data about the authorization server from endpoints located at the URL `<MCP server host>/.well-known/*`. The endpoints are located on OpenAM at the URL `<OpenAM host>/openam/.well-known`. The route for forwarding HTTP requests to MCP on OpenAM is as follows:

`openig-config/config/routes/20-well-known.json`

```json
{
  "name": "${matches(request.uri.path, '^/.well-known/.*}",
  "condition": "${matches(request.uri.path, '^/.well-known/.*')}",
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
                "${matchingGroups(system['openam'],\"(http|https):\/\/(.[^\/]*)\")[2]}"
              ]
            },
            "remove": [
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
            "expression": "${matches(request.uri.path, '^/.well-known/openid-configuration$')}",
            "handler": "ClientHandler",
            "baseURI": "${system['openam'].concat('/oauth2/.well-known/openid-configuration')}"
          }
        ]
      }
    }
  ]
}
```

The `HeaderFilter` filter adds the OpenAM Host HTTP header specified in the `openam` system parameter in the `docker-compose.yaml` file, and the `EndpointHandler` handler forwards the request to the `/openam/.well-known/openid-configuration` endpoint deployed in the `openam` Docker container.

Let's check the endpoint operation:

```bash
 curl -v http://openig.example.org:8081/.well-known/openid-configuration
 
 {
   "acr_values_supported" : [],
   "authorization_endpoint" : "http://openam.example.org:8080/openam/oauth2/authorize",
   "check_session_iframe" : "http://openam.example.org:8080/openam/oauth2/connect/checkSession",
   "claims_parameter_supported" : false,
   "claims_supported" : [],
   "device_authorization_endpoint" : "http://openam.example.org:8080/openam/oauth2/device/code",
   "end_session_endpoint" : "http://openam.example.org:8080/openam/oauth2/connect/endSession",
   "id_token_encryption_alg_values_supported" : [
      "RSA-OAEP",
      "RSA-OAEP-256",
      "A128KW",
      "RSA1_5",
      "A256KW",
      "dir",
      "A192KW"
   ],
   "id_token_encryption_enc_values_supported" : [
      "A256GCM",
      "A192GCM",
      "A128GCM",
      "A128CBC-HS256",
      "A192CBC-HS384",
      "A256CBC-HS512"
   ],
   "id_token_signing_alg_values_supported" : [
      "ES384",
      "HS256",
      "HS512",
      "ES256",
      "RS256",
      "HS384",
      "ES512"
   ],
   "issuer" : "http://openam.example.org:8080/openam/oauth2",
   "jwks_uri" : "http://openam.example.org:8080/openam/oauth2/connect/jwk_uri",
   "registration_endpoint" : "http://openam.example.org:8080/openam/oauth2/connect/register",
   "response_types_supported" : [
      "code",
      "code token",
      "token"
   ],
   "scopes_supported" : [],
   "subject_types_supported" : [
      "public"
   ],
   "token_endpoint" : "http://openam.example.org:8080/openam/oauth2/access_token",
   "token_endpoint_auth_methods_supported" : [
      "client_secret_post",
      "private_key_jwt",
      "none",
      "client_secret_basic"
   ],
   "userinfo_endpoint" : "http://openam.example.org:8080/openam/oauth2/userinfo",
   "version" : "3.0"
}
```

For more details on configuring OpenIG, please refer to the documentation.

Configuring VS Code to work with the MCP server

You must have the extensions for working with Copilot, GitHub Copilot, and GitHub Copilot Chat installed and configured. Instructions on how to do this are available at: [https://code.visualstudio.com/docs/copilot/setup](https://code.visualstudio.com/docs/copilot/setup).

Add the MCP server to VS Code.

For example, to add MCP to your workspace, create a file named `mcp.json` in the `.vscode` directory of your workspace:

 `mcp.json`:

```json
{
  "servers": {
    "time-mcp-server": {
      "type": "http",
      "url": "http://openig.example.org:8081/mcp"
    }
  }
}
```

Other ways to add an MCP server are described at: [https://code.visualstudio.com/docs/copilot/customization/mcp-servers#_add-an-mcp-server](https://code.visualstudio.com/docs/copilot/customization/mcp-servers#_add-an-mcp-server)

In the VS Code extensions list, click on the settings for the added MCP server and select `Start Server` from the menu that appears.

![VS Code Start MCP Server](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/5-vscode-mcp-start-server.png)

Allow the MCP server to authenticate on the OpenIG host

![VS Code MCP Authenticate](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/6-vscode-mcp-authenticate.png)

A browser window with authentication will open. 

![OpenAM Login](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/7-openam-login.png)

Enter the login and password for the test user: `demo`  and `changeit`, respectively

Confirm access to data for the Visual Studio Code application. If you want to disable the data access confirmation dialog, enable `Allow clients to skip consent` in the OAuth2 Provider settings in OpenAM. 

![OpenAM OAuth2 Consent](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/8-openam-oauth2-consent.png)

After confirming, you will be redirected back to VS Code.

Open the chat with GitHub Copilot. To do this, select **Show and Run Commands** from the command menu:

![OpenAM Run Commands](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/9-openam-run-commands.png)

Then select **Chat: New Chat**:

![OpenAM New Chat](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/10-copilot-new-chat.png)

In the chat window that opens, enter the question: `What is the current time?` . Copilot will respond that it does not have access to the current time:

![OpenAM Time Request](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/11-copolot-time-request.png)

Now switch the chat to Agent mode at the bottom and ask the question again:

![Copilot Set the Agent Mode](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/12-copulot-set-agent-mode.png)

Allow access to the function for obtaining the current time in the MCP server:

![Copilot Allow MCP Call](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/13-copilot-allow-mcp-call.png)

Copilot will receive information about the current time from the MCP server and return the correct response.

![Copilot Successfol response](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/openam-openig-mcp/14-copilot-successful-response.png)

## Conclusion

In this article, we demonstrated the practical integration of OpenAM and OpenIG to provide secure access to the MCP server based on OAuth 2.1. OpenAM acts as a reliable authentication and authorization center, issuing and validating tokens, while OpenIG filters requests, blocking unauthorized access and proxying traffic to protected resources. This approach minimizes the risk of sensitive data leaks - from internal repositories to customer databases.

Download the source code from GitHub, test the configuration, and integrate it into your projects. For in-depth study, refer to the official documentation: [OpenAM](https://doc.openidentityplatform.org/openam/) and [OpenIG](https://doc.openidentityplatform.org/openig/).