---
layout: home
landing-title: "Configuring Authorization for Access to an MCP Server Using OpenIG"
landing-title2: "Configuring Authorization for Access to an MCP Server Using OpenIG"
description: Learn how to configure MCP server authorization using OpenIG. Restrict unsafe MCP tools and secure access step by step.
keywords: 'CP server, Model Context Protocol, OpenIG, OpenAM, MCP authorization, MCP security, MCP tools filter, OpenIdentityPlatform, JSON-RPC, IAM, API security, DevSecOps, Zero Trust'
imageurl: 'openig-og.png'
share-buttons: true
---

# Configuring Authorization for Access to an MCP Server Using OpenIG

## Introduction
This article continues the [previous guide](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Protect-Model-Context-Protocol-(MCP)-Servers-with-OpenAM-and-OpenIG) on protecting
the MCP server using the OpenAM and OpenIG stack. In the previous article, we added authentication for accessing the MCP server capabilities. In this article, we will add access restrictions for MCP clients to selected server tools.

## Project Description

The project consists of an OpenAM authentication server, an OpenIG authorization gateway, and a demonstration MCP server called `timeserver`. The `timeserver` MCP server provides methods to get and set the current time. In this article, we restrict access to the time-setting method.

## Configuring Access to the MCP Server Functionality

To do this, add the `McpToolsFilter` filter to the filter chain in the source route to the MCP server.

`10-mcp.json`

```json
...
{
   "name": "McpToolsFilter",
   "type": "ScriptableFilter",
   "config": {
      "type": "application/x-groovy",
      "file": "McpToolsFilter.groovy",
      "args": {
         "deny": []
      }
   }
}
...
```

Leave the `deny` parameter as an empty array. For testing purposes, temporarily remove the OpenAM authentication requirement. Comment out the `ProtectedResourceFilter` and `ConditionEnforcementFilter` filters in the route for now.

Add the `McpToolsFilter.groovy` script to the `openig-config/scripts` folder.

```groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput
import org.forgerock.http.protocol.Request
import org.forgerock.http.protocol.Status

def generateMcpErrorResponse(status, entity) {
    def response = new Response()
    response.status = status
    response.headers['Content-Type'] = "application/json"
    response.setEntity(entity)
    return response
}

def filterResponse(requestMethod, response) {

    def slurper = new JsonSlurper()
    def responseObj = slurper.parseText(response.entity.getString())
    
    if(requestMethod == "tools/list") {
        logger.info("denied tools: {}, {}", deny, requestMethod)
        if(responseObj.result.tools) {
            responseObj.result.tools = responseObj.result.tools.findAll{ !deny.contains(it.name) }
        }
        logger.info("filtered response: {}", responseObj)

        def newEntity = JsonOutput.toJson(responseObj)
        response.entity.setString(newEntity)    
    } 
    return response
}

logger.info('request: {}', request.entity)

def slurper = new JsonSlurper()
def requestObj = slurper.parseText(request.entity.getString())
def requestMethod = requestObj.method

if (requestMethod == "tools/call") {
    if(deny.contains(requestObj.params.name)) {
        logger.info("method denied: {}", requestObj.params.name)
        def errorObject = [
            jsonrpc: "2.0",
            id     : requestObj.id,
            error  : [
                code   : -32602,
                message: "Unknown tool: invalid_tool_name",
                data   : "Tool not found: " + requestObj.params.name
            ]
        ]
        return generateMcpErrorResponse(Status.OK, JsonOutput.toJson(errorObject))
    }
}

return next.handle(context, request)
    .then({response -> 
        logger.info('response: {}', response.entity)
        response = filterResponse(requestMethod, response)
        return response
    })
```

The script filters the list of available tools specified in the filter settings.

If the client attempts to call a tool that is prohibited by the filter, an error with code `-32602` is returned in accordance with the Model Context Protocol specification.

Let's send a request to the MCP server to get the available tools.

```bash
 curl -X POST  --location  "http://localhost:8081/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}' | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   789    0   714  100    75   112k  12102 --:--:-- --:--:-- --:--:--  128k
{
   "id" : 1,
   "jsonrpc" : "2.0",
   "result" : {
  "tools" : [
         {
            "annotations" : {
               "destructiveHint" : true,
               "idempotentHint" : false,
               "openWorldHint" : true,
               "readOnlyHint" : false,
               "title" : ""
            },
            "description" : "Returns current time in ISO 8601 format",
            "inputSchema" : {
               "properties" : {},
               "required" : [],
               "type" : "object"
            },
            "name" : "current_time_service",
            "title" : "current_time_service"
         },
         {
            "annotations" : {
               "destructiveHint" : true,
               "idempotentHint" : false,
               "openWorldHint" : true,
               "readOnlyHint" : false,
               "title" : ""
            },
            "description" : "Sets the current time in ISO 8601 format",
            "inputSchema" : {
               "properties" : {
                  "timeStr" : {
                     "description" : "new server time",
                     "type" : "string"
                  }
               },
               "required" : [
                  "timeStr"
               ],
               "type" : "object"
            },
            "name" : "set_current_time_service",
            "title" : "set_current_time_service"
         }
      ]
   }
}
```

```bash
 curl -X POST  --location  "http://localhost:8081/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}' | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   789    0   714  100    75   112k  12102 --:--:-- --:--:-- --:--:--  128k
{
   "id" : 1,
   "jsonrpc" : "2.0",
   "result" : {
  "tools" : [
         {
            "annotations" : {
               "destructiveHint" : true,
               "idempotentHint" : false,
               "openWorldHint" : true,
               "readOnlyHint" : false,
               "title" : ""
            },
            "description" : "Returns current time in ISO 8601 format",
            "inputSchema" : {
               "properties" : {},
               "required" : [],
               "type" : "object"
            },
            "name" : "current_time_service",
            "title" : "current_time_service"
         },
         {
            "annotations" : {
               "destructiveHint" : true,
               "idempotentHint" : false,
               "openWorldHint" : true,
               "readOnlyHint" : false,
               "title" : ""
            },
            "description" : "Sets the current time in ISO 8601 format",
            "inputSchema" : {
               "properties" : {
                  "timeStr" : {
                     "description" : "new server time",
                     "type" : "string"
                  }
               },
               "required" : [
                  "timeStr"
               ],
               "type" : "object"
            },
            "name" : "set_current_time_service",
            "title" : "set_current_time_service"
         }
      ]
   }
}
```

The response shows that the MCP server provides two tools: `current_time_service` for obtaining the current time and `set_current_time_service` for setting the time.

`set_current_time_service` is an unsafe operation. Therefore, let's prohibit its call from the MCP client.

Let's add `set_current_time_service` to the list of tools prohibited from being called in the `McpToolsFilter` filter. 

Next, try to get a list of available tools:

```json
...
{
   "name": "McpToolsFilter",
   "type": "ScriptableFilter",
   "config": {
      "type": "application/x-groovy",
      "file": "McpToolsFilter.groovy",
      "args": {
         "deny": ["set_current_time_service"]
      }
   }
}
...
```

```bash
curl -X POST  --location  "http://localhost:8081/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}' | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   416  100   341  100    75  14981   3295 --:--:-- --:--:-- --:--:-- 18909
{
   "id" : 1,
   "jsonrpc" : "2.0",
   "result" : {
      "tools" : [
         {
            "annotations" : {
               "destructiveHint" : true,
               "idempotentHint" : false,
               "openWorldHint" : true,
               "readOnlyHint" : false,
               "title" : ""
            },
            "description" : "Returns current time in ISO 8601 format",
            "inputSchema" : {
               "properties" : {},
               "required" : [],
               "type" : "object"
            },
            "name" : "current_time_service",
            "title" : "current_time_service"
         }
      ]
   }
}
```

As you can see from the response text, the `set_current_time_service` tool is no longer in the list.

Then, try calling the `set_current_time_service` tool directly.

```bash
curl -X POST  --location  "http://localhost:8081/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d '{
  "jsonrpc": "2.0",
  "id": 9,
  "method": "tools/call",
  "params": {
    "_meta": {
      "progressToken": 9
    },
    "name": "set_current_time_service",
    "arguments": {
      "timeStr": "2026-01-20T10:31:35.903756042Z"
    }
  }
}' | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   382  100   142  100   240  17924  30295 --:--:-- --:--:-- --:--:-- 54571
{
   "error" : {
      "code" : -32602,
      "data" : "Tool not found: set_current_time_service",
      "message" : "Unknown tool: invalid_tool_name"
   },
   "id" : 9,
   "jsonrpc" : "2.0"
}
```

Uncomment the `ProtectedResourceFilter` and `ConditionEnforcementFilter` filters.

Similarly, you can restrict access to other MCP server tools, resources, or prompts, and add RBAC, ABAC, or more complex policies, depending on your organization's requirements.
For more information on configuring OpenIG, please refer to the documentation (https://doc.openidentityplatform.org/openig/).