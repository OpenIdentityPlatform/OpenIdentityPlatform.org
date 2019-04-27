---
layout: home
landing-title: "How To Protect Web Services with OpenIG"
landing-title2: "How To Protect Web Services with OpenIG"
description: "How To Protect Web Services with OpenIG"
keywords: 'OpenIG, API Gateway, Security, Authentication, Authorization, OSWAP, Single Sign On,  Open Identity Platform'
---

# How To Protect Web Services with OpenIG

Original article: (https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-To-Protect-Web-Services-with-OpenIG)-https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-To-Protect-Web-Services-with-OpenIG]


## Introduction

Securing web services is critical part of production environment to prevent compromising application from attacks. In microservice architecture, there is no need to implement security for each microservice. Each microservice should be responsible for its atomic functionality.  To protect services you need to user API Gateway application. Consider how to protect simple web service with Open Identity Gateway (OpenIG) in the following article.

Source code for this article: (https://github.com/maximthomas/openig-protect-ws/)[https://github.com/maximthomas/openig-protect-ws/]

## Sample Service
Consider service application with 2 endpoints http://localhost:8080/ - public http://localhost:8080/secure - private, so only authenticated users should have access to it.
This service implemented with [Spring Boot:](https://spring.io/projects/spring-boot)
```java
package org.openidentityplatform.sampleservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.Map;

@SpringBootApplication
public class SampleServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SampleServiceApplication.class, args);
    }

    @RestController
    public class IndexController {
        @RequestMapping("/")
        public Map<String, String> index() {
            return Collections.singletonMap("hello", "world");
        }

        @RequestMapping("/secure")
        public Map<String, String> secure(HttpServletRequest request) {
            return Collections.singletonMap("hello", request.getHeader("X-Auth-Username"));
        }
    }
}
```
### Running Sample Service
Clone project from gihub:
```
$ git clone https://github.com/maximthomas/openig-protect-ws.git
```
then run:
```
cd ./openig-protect-ws
$ ./mvnw spring-boot:run -f sample-service
```
Check service working
```
~$ curl -v -X GET http://localhost:8080/
Note: Unnecessary use of -X or --request, GET is already inferred.
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> GET / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.58.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Server: Apache-Coyote/1.1
< Date: Wed, 24 Apr 2019 15:06:17 GMT
< Content-Type: application/json;charset=UTF-8
< Transfer-Encoding: chunked
<
* Connection #0 to host localhost left intact
{"hello":"world"}
```

### Runing Sample Service in Docker container
At first you need to build `sample-service`
```
$ ./mvnw install
```

`Dockerfile` for sample service looks like this:
```Dockerfile
FROM openjdk:8-jdk-alpine
COPY ./target/*.jar app.jar
ENTRYPOINT ["java", "-jar","/app.jar"]
```

Build and run docker image with `docker-compose`:
`docker-compose.yaml`

```yaml
version: '3.1'

services:
  sample-service:
    build:
      context: ./sample-service
    restart: always
```
Then run
```
$ docker-compose up --build
```

# OpenIG Setup
Create OpenIG configuration folder `openig-config`. In this folder create another folder `config` with configuration files. In `openig-config/config` folder create 2 files:

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

Add OpenIG service to `docker-compose.yaml`
Mount `openig-config` folder with OpenIG configuration files to Docker container. `-Dopenig.base` option should point to this mounted folder:
```yaml
version: '3.1'

services:
  sample-service:
    build:
      context: ./sample-service
    restart: always

  #OpenIG service
  openig:
    image: openidentityplatform/openig:latest
    restart: always
    volumes:
      - ./openig-config:/usr/local/openig-config
    environment:
      #OpenIG options
      CATALINA_OPTS: -Dopenig.base=/usr/local/openig-config
    ports:
      - "8080:8080"
```

### Proxy Requests to Sample Service
Setup proxy requests through OpenIG to `sample-service`. Add system property - `sample-service` endpoint url `-Dendpoint.api`. This setting will be used in OpenIG routes configuration files.

`docker-compose.yaml`:
```yaml
version: '3.1'

...
  openig:
    image: openidentityplatform/openig:latest
    restart: always
    volumes:
      - ./openig-config:/usr/local/openig-config
    environment:
      #OpenIG options
      CATALINA_OPTS: -Dopenig.base=/usr/local/openig-config -Dendpoint.api=http://sample-service:8080/
    ports:
      - "8080:8080"
```
Add folder `routes` to `openig-config/config/` and add file
`10-api.json` - main route to this folder. `10-api.json` route makes OpenIG proxy requests to `sample-sevice`

`10-api.json`:
```json
{
  "name": "${matches(request.uri.path, '^/')}",
  "condition": "${matches(request.uri.path, '^/')}",
  "monitor": true,
  "timer": true,
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [

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
            "baseURI": "${system['endpoint.api']}"
          }
        ]
      }
    }
  ]
}
```
Add default route, which returns 404 status to all other requests

`99-default.json`:
```json
{
  "name": "99-default",
  "handler": {
    "type": "StaticResponseHandler",
    "config": {
      "status": 404,
      "reason": "Not Found",
      "headers": {
        "Content-Type": [ "application/json" ]
      },
      "entity": "{ \"error\": \"Something went wrong, please contact your system administrator.\"}"
    }
  },
  "audit": "/404"
}
```
Start `samplse-service` and OpenIG container:
```
$ docker-compose up --build
```

Lets check service:
```
~$ curl -v -X GET http://localhost:8080/
Note: Unnecessary use of -X or --request, GET is already inferred.
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> GET / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.58.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Server: Apache-Coyote/1.1
< Date: Wed, 24 Apr 2019 15:06:17 GMT
< Content-Type: application/json;charset=UTF-8
< Transfer-Encoding: chunked
<
* Connection #0 to host localhost left intact
{"hello":"world"}
```

```
$ curl -v -X GET http://localhost:8080/secure
Note: Unnecessary use of -X or --request, GET is already inferred.
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> GET /secure HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.58.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Server: Apache-Coyote/1.1
< Date: Wed, 24 Apr 2019 15:04:49 GMT
< Content-Type: application/json;charset=UTF-8
< Transfer-Encoding: chunked
<
* Connection #0 to host localhost left intact
{"name":null}
```
If everything works file, lets move forward to setup service security

## Securing Sample Service

There are [OSWAP recomendations](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/REST_Security_Cheat_Sheet.md) to secure REST services:

### HTTP Methods Restriction

We will restrict HTTP methods, leave only GET and POST methods allowed. To do that add `SwitchFilter` to `10-api.json`:
```json
{
  "name": "${matches(request.uri.path, '^/')}",
  "condition": "${matches(request.uri.path, '^/')}",
  "monitor": true,
  "timer": true,
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [
        {
          "type": "SwitchFilter",
          "config": {
            "onRequest": [
              {
                "condition": "${request.method != 'POST' and request.method != 'GET'}",
                "handler": {
                  "type": "StaticResponseHandler",
                  "config": {
                    "status": 405,
                    "reason": "Method not allowed",
                    "headers": {
                      "Content-Type": [
                        "application/json"
                      ]
                    },
                    "entity": "{ \"error\": \"Method not allowed\"}"
                  }
                }
              }
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
            "baseURI": "${system['endpoint.api']}"
          }
        ]
      }
    }
  ]
}
```
Lets check. If the method is different form GET or POST, OpenIG will return status `405 Method not allowed`:

```
$ curl -v -X PUT http://localhost:8080/
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> PUT / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.58.0
> Accept: */*
>
< HTTP/1.1 405 Method Not Allowed
< Server: Apache-Coyote/1.1
< Content-Type: application/json
< Content-Length: 32
< Date: Wed, 24 Apr 2019 15:13:04 GMT
<
* Connection #0 to host localhost left intact
{ "error": "Method not allowed"}
```

### Validate Content-Type Request Header
Lets make our service accept only `Content-Type: application/json` header for POST requests. To do that add into `SwitchFilter` `Content-Type` request header condition:

`10-api.json`:
```json
...
      {
          "type": "SwitchFilter",
          "config": {
            "onRequest": [
              {
                "condition": "${request.method != 'POST' and request.method != 'GET'}",
                "handler": {
                  "type": "StaticResponseHandler",
                  "config": {
                    "status": 405,
                    "reason": "Method not allowed",
                    "headers": {
                      "Content-Type": [
                        "application/json"
                      ]
                    },
                    "entity": "{ \"error\": \"Method not allowed\"}"
                  }
                }
              },
              {
                "condition": "${request.method == 'POST' and request.headers['Content-Type'][0].split(';')[0] != 'application/json'}",
                "handler": {
                  "type": "StaticResponseHandler",
                  "config": {
                    "status": 415,
                    "reason": "Unsupported Media Type",
                    "headers": {
                      "Content-Type": [ "application/json" ]
                    },
                    "entity": "{ \"error\": \"Unsupported Media Type\"}"
                  }
                }
              }
            ]
          }
        }
...        
```
Then check request with `Content-Type: application/xml` header:
```
$ curl -v -X POST -H 'Content-Type: application/xml' http://localhost:8080/
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> POST / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.58.0
> Accept: */*
> Content-Type: application/xml
>
< HTTP/1.1 415 Unsupported Media Type
< Server: Apache-Coyote/1.1
< Content-Type: application/json
< Content-Length: 36
< Date: Wed, 24 Apr 2019 15:21:04 GMT
<
* Connection #0 to host localhost left intact
{ "error": "Unsupported Media Type"}
```

### Validate Accept Request Header and Content-Type Response Header
`Accept` request header should match `Content-Type` response header. Add this condition into `SwitchFilter/config` object:

`10-api.json`:

```json
...
          "onResponse" : [
              {
                "condition" : "${response.headers['Content-Type'][0].split(';')[0] != request.headers['Accept'][0].split(';')[0] }",
                "handler": {
                  "type": "StaticResponseHandler",
                  "config": {
                    "status": 406,
                    "reason": "Not Acceptable",
                    "headers": {
                      "Content-Type": [ "application/json" ]
                    },
                    "entity": "{ \"error\": \"Not Acceptable\"}"
                  }
                }
              }
            ]
...            
```
Lets check request:
```
$ curl -v -X POST -H 'Content-Type: application/json' -H 'Accept: application/xml'  http://localhost:8080/
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> POST / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.58.0
> Content-Type: application/json
> Accept: application/xml
>
< HTTP/1.1 406 Not Acceptable
< Server: Apache-Coyote/1.1
< Content-Type: application/json
< Content-Length: 28
< Date: Wed, 24 Apr 2019 15:28:54 GMT
<
* Connection #0 to host localhost left intact
{ "error": "Not Acceptable"}
```

### Add Response Security Headers X-Frame-Options and X-Content-Type-Options

OpenIG should return `X-Frame-Options: deny` and `X-Content-Type-Options: nosniff` headers to client to prevent XSS and  drag'n drop clickjacking attacks in older browsers.
To do that, add `HeaderFilter` to filter chain after `SwitchFilter`:

`10-api.json`:
```json
       {
          "type": "HeaderFilter",
          "comment": "Add security headers to response",
          "config": {
            "messageType": "response",
            "add": {
              "X-Frame-Options": [ "deny" ],
              "X-Content-Type-Options": [ "nosniff" ]
            }
          }
        }
```

Check response headers:
```
$ curl -v -X POST -H 'Content-Type: application/json' -H 'Accept: application/json'  http://localhost:8080/
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> POST / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.58.0
> Content-Type: application/json
> Accept: application/json
>
< HTTP/1.1 200 OK
< Server: Apache-Coyote/1.1
< Date: Wed, 24 Apr 2019 15:31:31 GMT
< X-Content-Type-Options: nosniff
< X-Frame-Options: deny
< Content-Type: application/json;charset=UTF-8
< Transfer-Encoding: chunked
<
* Connection #0 to host localhost left intact
{"hello":"world"}
```

### Authentication Check

If you need to protect services from unauthenticatead access, there is no need to implement access control on each service. You can check access to the service with OpenIG, and if access has been granted, enrich request with the headers containing identity information. For example, authentication service returns to the client signed [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token) (JWT) and client use this JWT to authenticate in service. There is a public key on OpenIG and OpenIG verifies JWT Sign and enrich

Genereate keys:

private:
```
$ openssl genrsa -out private_key.pem 4096
```
and public:
```
$ openssl rsa -pubout -in private_key.pem -out public_key.pem
```

Example keys are in source folder:
https://github.com/maximthomas/openig-protect-ws/tree/master/openig-config/keys

Lets generate with https://jwt.io/ and generated `private_key.pem` signed JWT token

Sample token:
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYW1wbGUtc2VydmljZSIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjJ9.Vxo5eGo9WVhHrf5cVO1Rjam9RfyrUSCdVeAr6mZz7bsNbR7cPz-qHHH-2Odrrk1INVyPgQH0yukf-n58WWZhAG0rTOkMF__eSSLDj-I85PxniJQvd85-cHdCyaklHJ1hA4LVSP27tJMc_7VBEuwnFB2XlqQs7dLbqmCd6skvDpMJASLHcwYadg-i-2os9hJsc6d1uzlpeJaaUxb-TD-ofEJpAfD9YaMO595bOFJvtNVhbXRxEDgAn2w73MS9GkC-uL91SuS1nQEy9HKxRQUHBstLNiuPtW3zdmI9f0SWqbaTqEz428S67VKQ6RuMVIMN5vjlqclJqVYNO2nyrc4TkyV-1PYJdlWyDRdbcCHuh0JWdC2aBa7bEBN0QTAOhCx6hflo5DEW8ehTp_9LsSI1hJTcyGBmQkc5EhvDMsrjxh2K1x-Zsa_2cBJbczSvk4TL70FT32FRpzJs-mdwID_lvoK4LFnA51z79jN0e8yXlHXJLPGsv8DhZxTziDGbBSBEiqxLGkelto6x85b8YJ-Y4dUgpoIlXJ7B6SsgNo6jcQBuYvgtD5c7cKHraGIZCu_i_exCyqd6CupsBzONTIqKwnzEVNtx1Ars5PfN3ncVN6CE_tIYOYYVBD_Dl9vlAWtImqhaxb5XoEOv5bKUbRNMIEDYy-3_K5w_BLquESc39MM
```

### JWT Validation
To validate JWT for `/secure` URL lets add to mail filter chain another `SwitchFilter`, which will toggle `Chain` handler if target url matches `/secure`.
Add to `Chain` handler `ScriptableFilter` with `jwt.groovy` script, which will validate JWT and enrich request with authentication data headers.

`10-api.json`:
```json
...
        {
          "type": "SwitchFilter",
          "config": {
            "onRequest": [
              {
                "condition": "${matches(request.uri.path, '^/secure')}",
                "handler": {
                  "type": "Chain",
                  "config": {
                    "filters": [
                      {
                        "type": "ScriptableFilter",
                        "config": {
                          "type": "application/x-groovy",
                          "file": "jwt.groovy",
                          "args": {
                            "iss": {
                              "sample-service": "${read('/usr/local/openig-config/keys/public_key.pem')}"
                            }
                          }
                        }
                      }
                    ],
                    "handler": "EndpointHandler"
                  }
                }
              }
            ]
          }
        }
...        
```        

Add `jwt.groovy` file to `/openig-config/scripts/groovy/`. This script verifies JWT signature with the public key and if signature verified, checks JWT expiration. If JWT is valid, script adds header with name JWT claim to the request. Otherwise, script returns 401 HTTP status.

`jwt.groovy`:
```Groovy
import java.security.KeyFactory
import org.forgerock.json.jose.builders.JwtBuilderFactory
import org.forgerock.json.jose.jws.SignedJwt
import org.forgerock.json.jose.jws.SigningManager
import org.forgerock.http.protocol.Status
import java.security.spec.X509EncodedKeySpec

//extract jwt from request header
def jwt = request.headers['Authorization']?.firstValue

if (jwt!=null && jwt.startsWith("Bearer eyJ")) {
    jwt=jwt.replace("Bearer ", "")

    try {
        //parse jwt
        def sjwt=new JwtBuilderFactory().reconstruct(jwt, SignedJwt.class)

        //verify jwt signature
        if (!sjwt.verify(new SigningManager().newRsaSigningHandler(getKey(sjwt.getClaimsSet()))))
            throw new Exception("invalid signature")

        //check jwt expiration
        if ((sjwt.getClaimsSet().getExpirationTime()!=null && sjwt.getClaimsSet().getExpirationTime().before(new Date())))
            throw new Exception("signature expired "+sjwt.getClaimsSet().getExpirationTime())

        //add name from JWT claim to header
        request.headers.put('X-Auth-Username', sjwt.getClaimsSet().getClaim("name"))

        return next.handle(new org.forgerock.openig.openam.StsContext(context, jwt), request)
    }catch(Exception e) {
        return getUnauthorizedResponse(e.getMessage())
    }
} else {
    //returns 401 status if JWT not present in request
    return getUnauthorizedResponse("Not Authenticated")
}

return next.handle(context, request)


def getUnauthorizedResponse(message) {
    def response = new Response()
    response.status = Status.UNAUTHORIZED
    response.headers['Content-Type'] = "application/json"
    response.setEntity("{'error' : '" + message + "'}")
    return response
}

def getKey(claims) {
    def pem=iss[claims.getIssuer()]
    if (pem != null) {
        def pemReplaced = pem.replaceFirst("(?m)(?s)^---*BEGIN.*---*\$(.*)^---*END.*---*\$.*", "\$1")
        byte[] encoded = Base64.getMimeDecoder().decode(pemReplaced)
        def kf = KeyFactory.getInstance("RSA")
        def pubKey = kf.generatePublic(new X509EncodedKeySpec(encoded))
        println 'got pub key' + pubKey
        return pubKey
    }

    throw new Exception('Unknown issuer')
}
```

Lets check valid request
```
$ curl -v -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYW1wbGUtc2VydmljZSIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjJ9.Vxo5eGo9WVhHrf5cVO1Rjam9RfyrUSCdVeAr6mZz7bsNbR7cPz-qHHH-2Odrrk1INVyPgQH0yukf-n58WWZhAG0rTOkMF__eSSLDj-I85PxniJQvd85-cHdCyaklHJ1hA4LVSP27tJMc_7VBEuwnFB2XlqQs7dLbqmCd6skvDpMJASLHcwYadg-i-2os9hJsc6d1uzlpeJaaUxb-TD-ofEJpAfD9YaMO595bOFJvtNVhbXRxEDgAn2w73MS9GkC-uL91SuS1nQEy9HKxRQUHBstLNiuPtW3zdmI9f0SWqbaTqEz428S67VKQ6RuMVIMN5vjlqclJqVYNO2nyrc4TkyV-1PYJdlWyDRdbcCHuh0JWdC2aBa7bEBN0QTAOhCx6hflo5DEW8ehTp_9LsSI1hJTcyGBmQkc5EhvDMsrjxh2K1x-Zsa_2cBJbczSvk4TL70FT32FRpzJs-mdwID_lvoK4LFnA51z79jN0e8yXlHXJLPGsv8DhZxTziDGbBSBEiqxLGkelto6x85b8YJ-Y4dUgpoIlXJ7B6SsgNo6jcQBuYvgtD5c7cKHraGIZCu_i_exCyqd6CupsBzONTIqKwnzEVNtx1Ars5PfN3ncVN6CE_tIYOYYVBD_Dl9vlAWtImqhaxb5XoEOv5bKUbRNMIEDYy-3_K5w_BLquESc39MM' http://localhost:8080/secure
Note: Unnecessary use of -X or --request, GET is already inferred.
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> GET /secure HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.58.0
> Content-Type: application/json
> Accept: application/json
> Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYW1wbGUtc2VydmljZSIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjJ9.Vxo5eGo9WVhHrf5cVO1Rjam9RfyrUSCdVeAr6mZz7bsNbR7cPz-qHHH-2Odrrk1INVyPgQH0yukf-n58WWZhAG0rTOkMF__eSSLDj-I85PxniJQvd85-cHdCyaklHJ1hA4LVSP27tJMc_7VBEuwnFB2XlqQs7dLbqmCd6skvDpMJASLHcwYadg-i-2os9hJsc6d1uzlpeJaaUxb-TD-ofEJpAfD9YaMO595bOFJvtNVhbXRxEDgAn2w73MS9GkC-uL91SuS1nQEy9HKxRQUHBstLNiuPtW3zdmI9f0SWqbaTqEz428S67VKQ6RuMVIMN5vjlqclJqVYNO2nyrc4TkyV-1PYJdlWyDRdbcCHuh0JWdC2aBa7bEBN0QTAOhCx6hflo5DEW8ehTp_9LsSI1hJTcyGBmQkc5EhvDMsrjxh2K1x-Zsa_2cBJbczSvk4TL70FT32FRpzJs-mdwID_lvoK4LFnA51z79jN0e8yXlHXJLPGsv8DhZxTziDGbBSBEiqxLGkelto6x85b8YJ-Y4dUgpoIlXJ7B6SsgNo6jcQBuYvgtD5c7cKHraGIZCu_i_exCyqd6CupsBzONTIqKwnzEVNtx1Ars5PfN3ncVN6CE_tIYOYYVBD_Dl9vlAWtImqhaxb5XoEOv5bKUbRNMIEDYy-3_K5w_BLquESc39MM
>
< HTTP/1.1 200 OK
< Server: Apache-Coyote/1.1
< Date: Thu, 25 Apr 2019 07:58:34 GMT
< X-Content-Type-Options: nosniff
< X-Frame-Options: deny
< Content-Type: application/json;charset=UTF-8
< Transfer-Encoding: chunked
<
* Connection #0 to host localhost left intact
{"name":"John Doe"}
```

Request without JWT:
```
$ curl -v -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer'  http://localhost:8080/secure
Note: Unnecessary use of -X or --request, GET is already inferred.
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> GET /secure HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.58.0
> Content-Type: application/json
> Accept: application/json
> Authorization: Bearer
>
< HTTP/1.1 401 Unauthorized
< Server: Apache-Coyote/1.1
< X-Content-Type-Options: nosniff
< X-Frame-Options: deny
< Content-Type: application/json
< Content-Length: 31
< Date: Thu, 25 Apr 2019 07:58:07 GMT
<
* Connection #0 to host localhost left intact
{'error' : 'Not Authenticated'}
```
