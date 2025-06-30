---
layout: home
title: "Using LLM in Access Management with OpenAM and Spring AI as an example."
landing-title2: "Using LLM in Access Management with OpenAM and Spring AI as an example."
description: "In this article, we will deploy an access control system and request an LLM to analyze the configuration, returning recommendations."
keywords: 'OpenAM, LLM, large launguage models, audit,  OpenAM security audit, Spring AI authentication, LLM access control analysis, Access management security, OpenAM configuration audit'
share-buttons: true
products: 
- openam

---

## Introduction

This article is a continuation of a previous [article](/blog/2025-06-06-llm-in-access-management) on the use of LLMs in access control systems. We concluded that the optimal use of LLM would be to audit the configuration of an access management system.

In this article, we will deploy an access control system and request an LLM to analyze the configuration, returning recommendations.

We will use an open-source solution [OpenAM](https://github.com/OpenIdentityPlatform/OpenAM) (Open Access Manager) with its default configuration as the access control system.

## Install OpenAM

Deploy OpenAM in a Docker container with the command:

```
docker run -h openam.example.org -p 8080:8080 --name openam openidentityplatform/openam
```

After the container starts, we perform the initial configuration with the command:

```
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

Once the configuration is complete, let's verify that OpenAM is working. Call the authentication API for the `demo` account:

```
curl -X POST \
 --header "X-OpenAM-Username: demo" \
 --header "X-OpenAM-Password: changeit" \
 http://openam.example.org:8080/openam/json/authenticate
{"tokenId":"AQIC5wM2LY4SfczeNbGH-CImBSl6bCnAKM1oxqS110Kkb9I.*AAJTSQACMDEAAlNLABM0MTM4NDQ3MTQyOTI5Njk1MTA3AAJTMQAA*","successUrl":"/openam/console","realm":"/"}
```

## Spring AI Application for Auditing

An application based on [Spring Boot](https://spring.io/projects/spring-boot) and [Spring AI](https://spring.io/projects/spring-ai/) is developed to automate auditing.

The application receives the configuration of authentication modules, suggests recommended settings and analyzes authentication chains. It then offers recommendations to optimize the settings and recommends new authentication chains to be configured.

For demonstration purposes and so as not to clutter the article, the application will run in console mode.

The source code of the application is located at the [link](https://github.com/OpenIdentityPlatform/openam-ai-analyzer).

### Quick Start

Before we dive into the technical details, let's verify that the audit application works, and then we'll dive into the implementation details. The JDK must be installed at least version 17 to run the application.

Let's run the application:

```
./mvnw spring-boot:run

2025-06-09T10:21:51.016+03:00  INFO 11080 --- [OpenAM AI Analyzer] [           main] o.o.openam.ai.analyzer.cmd.Runner        : analyzing access modules...
2025-06-09T10:21:51.016+03:00  INFO 11080 --- [OpenAM AI Analyzer] [           main] o.o.o.a.a.s.AccessManagerAnalyzerService : querying OpenAM for a prompt data...
2025-06-09T10:21:51.532+03:00  INFO 11080 --- [OpenAM AI Analyzer] [           main] o.o.o.a.a.s.AccessManagerAnalyzerService : generated client prompt:
SYSTEM: You are an information security expert with 20 years of experience.
USER: I have an access management system with the following modules:
'''json
{
  "modules": [
    ...
    {
      "name": "LDAP",
      "settings": {
        "LDAP Connection Heartbeat Interval": 10,
        "Bind User DN": "cn=Directory Manager",
        "LDAP Connection Heartbeat Time Unit": "SECONDS",
        "Return User DN to DataStore": true,
        "Minimum Password Length": "8",
        "Search Scope": "SUBTREE",
        "Primary LDAP Server": [
          "openam.example.org:50389"
        ],
        "Attributes Used to Search for a User to be Authenticated": [
          "uid"
        ],
        "DN to Start User Search": [
          "dc=openam,dc=example,dc=org"
        ],
        "Overwrite User Name in sharedState upon Authentication Success": false,
        "User Search Filter": null,
        "LDAP Behera Password Policy Support": true,
        "Trust All Server Certificates": false,
        "Secondary LDAP Server": [],
        "LDAP Connection Mode": "LDAP",
        "Authentication Level": 0,
        "Attribute Used to Retrieve User Profile": "uid",
        "Bind User Password": null,
        "LDAP operations timeout": 0,
        "User Creation Attributes": [],
        "LDAPS Server Protocol Version": "TLSv1"
      }
    },
    {
      "name": "OATH",
      "settings": {
        "Minimum Secret Key Length": "32",
        "Clock Drift Attribute Name": "",
        "Counter Attribute Name": "",
        "TOTP Time Step Interval": 30,
        "The Shared Secret Provider Class": "org.forgerock.openam.authentication.modules.oath.plugins.DefaultSharedSecretProvider",
        "Add Checksum Digit": "False",
        "Maximum Allowed Clock Drift": 0,
        "Last Login Time Attribute": "",
        "Secret Key Attribute Name": "",
        "OATH Algorithm to Use": "HOTP",
        "One Time Password Length ": "6",
        "TOTP Time Steps": 2,
        "Truncation Offset": -1,
        "HOTP Window Size": 100,
        "Authentication Level": 0
      }
    },
    ...
}
'''

Analyze each module option and suggest security and performance improvements.
Consider an optimal tradeoff between security and user experience.
Provide a recommended value for each option where possible and there is a difference from the provided value.
Format the response with proper indentation and consistent structure. The response format:
{ "modules": { <module_name>: {"settings": {"<option>": {"suggested_improvement": <suggested improvement>, "recommended_value": <recommended_value>}}}}}
omit any additional text

2025-06-09T10:21:51.533+03:00  INFO 11080 --- [OpenAM AI Analyzer] [           main] o.o.o.a.a.s.AccessManagerAnalyzerService : querying LLM for an answer...
2025-06-09T10:22:37.441+03:00  INFO 11080 --- [OpenAM AI Analyzer] [           main] o.o.openam.ai.analyzer.cmd.Runner        : modules advice:
{
  "modules" : {
    ...
    "LDAP" : {
      "settings" : {
        "LDAP Connection Heartbeat Interval" : {
          "suggested_improvement" : "Adjust based on network latency and reliability",
          "recommended_value" : "30"
        },
        "Bind User DN" : {
          "suggested_improvement" : "Use a less privileged account for binding",
          "recommended_value" : "cn=readonly,dc=openam,dc=example,dc=org"
        },
        "Minimum Password Length" : {
          "suggested_improvement" : "Increase minimum password length",
          "recommended_value" : "12"
        },
        "Primary LDAP Server" : {
          "suggested_improvement" : "Add failover servers",
          "recommended_value" : [ "openam1.example.org:50389", "openam2.example.org:50389" ]
        },
        "Trust All Server Certificates" : {
          "suggested_improvement" : "Disable to enforce certificate validation",
          "recommended_value" : false
        },
        "LDAP Connection Mode" : {
          "suggested_improvement" : "Use LDAPS for encrypted connections",
          "recommended_value" : "LDAPS"
        },
        "Authentication Level" : {
          "suggested_improvement" : "Increase authentication level for LDAP operations",
          "recommended_value" : "1"
        },
        "LDAPS Server Protocol Version" : {
          "suggested_improvement" : "Use latest TLS version",
          "recommended_value" : "TLSv1.2"
        }
      }
    },
    "OATH" : {
      "settings" : {
        "Minimum Secret Key Length" : {
          "suggested_improvement" : "Increase key length for better security",
          "recommended_value" : "64"
        },
        "TOTP Time Step Interval" : {
          "suggested_improvement" : "Balance between security and usability",
          "recommended_value" : "60"
        },
        "Maximum Allowed Clock Drift" : {
          "suggested_improvement" : "Allow slight clock drift",
          "recommended_value" : "1"
        },
        "OATH Algorithm to Use" : {
          "suggested_improvement" : "Use TOTP instead of HOTP for better security",
          "recommended_value" : "TOTP"
        },
        "One Time Password Length" : {
          "suggested_improvement" : "Increase OTP length",
          "recommended_value" : "8"
        },
        "Authentication Level" : {
          "suggested_improvement" : "Increase authentication level for OATH",
          "recommended_value" : "2"
        }
      }
    },
  }
}
```

As you can see from the output of the command above (JSON has been formatted for better readability), the application receives the configuration of the authentication modules from OpenAM, generates a prompt to analyze the configuration in LLM, and returns the result in JSON format.

Let's see what configuration recommendations the LLM returns and whether we can use them.

Let's take the LDAP authentication module as an example and check the `Bind User DN: cn=Directory Manager` configuration recommendation. The LLM recommendation for this setting is:

```json
"Bind User DN" : {
  "suggested_improvement" : "Use a less privileged account for binding",
  "recommended_value" : "cn=readonly,dc=openam,dc=example,dc=org"
},
```

LLM recommends using an account with fewer privileges for authentication. Indeed, `cn=Directory Manager` has administrative privileges, although a read-only account is sufficient to implement authentication.

Let's look at another example from the OATH module, the one-time password authentication module. For the `OATH Algorithm to Use: HOTP` setting, the LLM recommendation returned is as follows:

```json
"OATH Algorithm to Use" : {
  "suggested_improvement" : "Use TOTP instead of HOTP for better security",
  "recommended_value" : "TOTP"
},
```

LLM recommends using [TOTP](https://en.wikipedia.org/wiki/Time-based_one-time_password) instead of [HOTP](https://en.wikipedia.org/wiki/HOTP). Indeed, the TOTP (Time-based one-time password**)** algorithm for authentication with one-time passwords has replaced HOTP (HMAC-based one-time password), is more modern and secure, and is recommended for use.

In other words, LLM recommendations can be taken into account when analyzing access control systems.

Now for some technical details. Let's describe how exactly the application generates a prompt for analysis.

### Obtaining OpenAM Configuration via API

The application calls several APIs to retrieve settings and their values from OpenAM. For simplicity, we'll use examples using the [curl](https://curl.se/) utility instead of programmatic API calls.

First, let's get the OpenAM authentication token:

```
curl -X POST \
 --header "X-OpenAM-Username: amadmin" \
 --header "X-OpenAM-Password: passw0rd" \
 http://openam.example.org:8080/openam/json/authenticate
 
{
   "realm" : "/",
   "successUrl" : "/openam/console",
   "tokenId" : "AQIC5wM2LY4SfcyDgAXiN7z4jGvfcK9CKHghI-BGMriZUGM.*AAJTSQACMDEAAlNLABEyMTc1NDgwMDA5MzUxMTczOQACUzEAAA..*"
}
```

The token (field `tokenId`) from the response will be used to get the OpenAM configuration.

Get the list of authentication modules:

```
curl -H "iPlanetDirectoryPro: AQIC5wM2LY4SfcyDgAXiN7z4jGvfcK9CKHghI-BGMriZUGM.*AAJTSQACMDEAAlNLABEyMTc1NDgwMDA5MzUxMTczOQACUzEAAA..*" \
  -H "Accept: application/json" \
  "http://openam.example.org:8080/openam/json/realms/root/realm-config/authentication/modules?_queryFilter=true"

{
   "pagedResultsCookie" : null,
   "remainingPagedResults" : -1,
   "result" : [
      {
         "_id" : "HOTP",
         "_rev" : "120870935",
         "type" : "hotp",
         "typeDescription" : "HOTP"
      },
      ...
      {
         "_id" : "LDAP",
         "_rev" : "1968417813",
         "type" : "ldap",
         "typeDescription" : "LDAP"
      }
   ],
   "resultCount" : 8,
   "totalPagedResults" : 8,
   "totalPagedResultsPolicy" : "EXACT"
}  
  
```

For each of the modules, we get the settings:

```
curl -H "iPlanetDirectoryPro: AQIC5wM2LY4SfcyDgAXiN7z4jGvfcK9CKHghI-BGMriZUGM.*AAJTSQACMDEAAlNLABEyMTc1NDgwMDA5MzUxMTczOQACUzEAAA..*" \
  -H "Accept: application/json" \
  "http://openam.example.org:8080/openam/json/realms/root/realm-config/authentication/modules/oath/OATH"
  
{
   "_id" : "OATH",
   "_rev" : "37804103",
   "_type" : {
      "_id" : "oath",
      "collection" : true,
      "name" : "OATH"
   },
   "addChecksum" : "False",
   "authenticationLevel" : 0,
   "forgerock-oath-maximum-clock-drift" : 0,
   "forgerock-oath-observed-clock-drift-attribute-name" : "",
   "forgerock-oath-sharedsecret-implementation-class" : "org.forgerock.openam.authentication.modules.oath.plugins.DefaultSharedSecretProvider",
   "hotpCounterAttribute" : "",
   "hotpWindowSize" : 100,
   "lastLoginTimeAttribute" : "",
   "minimumSecretKeyLength" : "32",
   "oathAlgorithm" : "HOTP",
   "passwordLength" : "6",
   "secretKeyAttribute" : "",
   "stepsInWindow" : 2,
   "timeStepSize" : 30,
   "truncationOffset" : -1
}
```

And for the LLM to understand what each setting means, let's get a description of the settings from the OpenAM metadata:

```
curl -X "POST" \
  -H "iPlanetDirectoryPro: AQIC5wM2LY4SfcyDgAXiN7z4jGvfcK9CKHghI-BGMriZUGM.*AAJTSQACMDEAAlNLABEyMTc1NDgwMDA5MzUxMTczOQACUzEAAA..*" \
  -H "Accept: application/json" \
  "http://openam.example.org:8080/openam/json/realms/root/realm-config/authentication/modules/oath?_action=schema"
{
   "properties" : {
      "addChecksum" : {
         "description" : "This adds a checksum digit to the OTP.<br><br>This adds a digit to the end of the OTP generated to be used as a checksum to verify the OTP was generated correctly. This is in addition to the actual password length. You should only set this if your device supports it.",
         "enum" : [
            "True",
            "False"
         ],
         "exampleValue" : "",
         "options" : {
            "enum_titles" : [
               "Yes",
               "No"
            ]
         },
         "propertyOrder" : 800,
         "required" : true,
         "title" : "Add Checksum Digit",
         "type" : "string"
      },
      "authenticationLevel" : {
         "description" : "The authentication level associated with this module.<br><br>Each authentication module has an authentication level that can be used to indicate the level of security associated with the module; 0 is the lowest (and the default).",
         "exampleValue" : "",
         "propertyOrder" : 100,
         "required" : true,
         "title" : "Authentication Level",
         "type" : "integer"
      },
     ...
      "timeStepSize" : {
         "description" : "The TOTP time step in seconds that the OTP device uses to generate the OTP.<br><br>This is the time interval that one OTP is valid for. For example, if the time step is 30 seconds, then a new OTP will be generated every 30 seconds. This makes a single OTP valid for only 30 seconds.",
         "exampleValue" : "",
         "propertyOrder" : 1000,
         "required" : true,
         "title" : "TOTP Time Step Interval",
         "type" : "integer"
      },
      "truncationOffset" : {
         "description" : "This adds an offset to the generation of the OTP.<br><br>This is an option used by the HOTP algorithm that not all devices support. This should be left default unless you know your device uses a offset.",
         "exampleValue" : "",
         "propertyOrder" : 900,
         "required" : true,
         "title" : "Truncation Offset",
         "type" : "integer"
      }
   },
   "type" : "object"
}

```

Put all the data together and the result is the data for the prompt to the LLM.

```json
{
  "modules": [
    ...
    {
      "name": "LDAP",
      "settings": {
        "LDAP Connection Heartbeat Interval": 10,
        "Bind User DN": "cn=Directory Manager",
        "LDAP Connection Heartbeat Time Unit": "SECONDS",
        "Return User DN to DataStore": true,
        "Minimum Password Length": "8",
        "Search Scope": "SUBTREE",
        "Primary LDAP Server": [
          "openam.example.org:50389"
        ],
        "Attributes Used to Search for a User to be Authenticated": [
          "uid"
        ],
        "DN to Start User Search": [
          "dc=openam,dc=example,dc=org"
        ],
        "Overwrite User Name in sharedState upon Authentication Success": false,
        "User Search Filter": null,
        "LDAP Behera Password Policy Support": true,
        "Trust All Server Certificates": false,
        "Secondary LDAP Server": [],
        "LDAP Connection Mode": "LDAP",
        "Authentication Level": 0,
        "Attribute Used to Retrieve User Profile": "uid",
        "Bind User Password": null,
        "LDAP operations timeout": 0,
        "User Creation Attributes": [],
        "LDAPS Server Protocol Version": "TLSv1"
      }
    },
    {
      "name": "OATH",
      "settings": {
        "Minimum Secret Key Length": "32",
        "Clock Drift Attribute Name": "",
        "Counter Attribute Name": "",
        "TOTP Time Step Interval": 30,
        "The Shared Secret Provider Class": "org.forgerock.openam.authentication.modules.oath.plugins.DefaultSharedSecretProvider",
        "Add Checksum Digit": "False",
        "Maximum Allowed Clock Drift": 0,
        "Last Login Time Attribute": "",
        "Secret Key Attribute Name": "",
        "OATH Algorithm to Use": "HOTP",
        "One Time Password Length ": "6",
        "TOTP Time Steps": 2,
        "Truncation Offset": -1,
        "HOTP Window Size": 100,
        "Authentication Level": 0
      }
    },
    ...
```

### Request Recommendations from LLM using Spring AI

Let's generate a prompt for the LLM

From the `application.yaml` configuration file, let's take a system prompt that will make the LLM understand the task context and its own role:

```java
var systemMessage = new SystemMessage(promptConfiguration.system())
```

In the custom prompt template, we insert the configuration of authentication modules obtained from OpenAM and ask for recommendations.

```java
var userTemplate = PromptTemplate.builder()
                .renderer(StTemplateRenderer.builder().startDelimiterToken('<').endDelimiterToken('>').build())
                .template(promptConfiguration.modules().user())
          .build();

var userMessage = userTemplate.render(Map.of("modules", promptModulesJson))
        .concat(System.lineSeparator())
  .concat(promptConfiguration.modules().task());

```

Build a final prompt for the LLM:

```java
var propmt = Prompt.builder().messages(
        new SystemMessage(systemMessage),
        new UserMessage(userMessage)).build();
```

The final prompt along with the data from OpenAM:

```
SYSTEM: You are an information security expert with 20 years of experience.
USER: I have an access management system with the following modules:
'''json
{
  "modules": [
    ...
    {
      "name": "LDAP",
      "settings": {
        "LDAP Connection Heartbeat Interval": 10,
        "Bind User DN": "cn=Directory Manager",
        "LDAP Connection Heartbeat Time Unit": "SECONDS",
        "Return User DN to DataStore": true,
        "Minimum Password Length": "8",
        "Search Scope": "SUBTREE",
        "Primary LDAP Server": [
          "openam.example.org:50389"
        ],
        "Attributes Used to Search for a User to be Authenticated": [
          "uid"
        ],
        "DN to Start User Search": [
          "dc=openam,dc=example,dc=org"
        ],
        "Overwrite User Name in sharedState upon Authentication Success": false,
        "User Search Filter": null,
        "LDAP Behera Password Policy Support": true,
        "Trust All Server Certificates": false,
        "Secondary LDAP Server": [],
        "LDAP Connection Mode": "LDAP",
        "Authentication Level": 0,
        "Attribute Used to Retrieve User Profile": "uid",
        "Bind User Password": null,
        "LDAP operations timeout": 0,
        "User Creation Attributes": [],
        "LDAPS Server Protocol Version": "TLSv1"
      }
    },
    {
      "name": "OATH",
      "settings": {
        "Minimum Secret Key Length": "32",
        "Clock Drift Attribute Name": "",
        "Counter Attribute Name": "",
        "TOTP Time Step Interval": 30,
        "The Shared Secret Provider Class": "org.forgerock.openam.authentication.modules.oath.plugins.DefaultSharedSecretProvider",
        "Add Checksum Digit": "False",
        "Maximum Allowed Clock Drift": 0,
        "Last Login Time Attribute": "",
        "Secret Key Attribute Name": "",
        "OATH Algorithm to Use": "HOTP",
        "One Time Password Length ": "6",
        "TOTP Time Steps": 2,
        "Truncation Offset": -1,
        "HOTP Window Size": 100,
        "Authentication Level": 0
      }
    },
    ...
}
'''

Analyze each module option and suggest security and performance improvements.
Consider an optimal tradeoff between security and user experience.
Provide a recommended value for each option where possible and there is a difference from the provided value.
Format the response with proper indentation and consistent structure. The response format:
{ "modules": { <module_name>: {"settings": {"<option>": {"suggested_improvement": <suggested improvement>, "recommended_value": <recommended_value>}}}}}
omit any additional text

```

Let's send the received prompt to LLM and log the result:

```java
var clientPrompt = chatClient.prompt(prompt).advisors(new SimpleLoggerAdvisor());
var modulesAdvice = clientPrompt.call().entity(Map.class);
logger.info("modules advice:\n{}", objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(modulesAdvice));
```

## Local Application Launch

You can customize the solution for use in your infrastructure:

The application is configured via the [`application.yaml`](https://github.com/OpenIdentityPlatform/openam-ai-analyzer/blob/master/src/main/resources/application.yml) file.

The options are described in the table below:

| Option                                      | Description                                                                              |
|---------------------------------------------|------------------------------------------------------------------------------------------|
| `spring.ai.openai.base_url`                 | LLM API source address                                                                   |
| `spring.ai.openai.api-key`                  | Model API key                                                                            |
| `spring.ai.openai.chat.options.model`       | LLM model                                                                                | 
| `spring.ai.openai.chat.options.temperature` | Temperature. The lower the temperature, the more deterministic the response from the LLM |
| `prompt.system`                             | General system prompt                                                                    |
| `prompt.modules.user`                       | User prompt for analyzing authentication modules                                         |
| `prompt.modules.task`                       | LLM task prompt for analyzing authentication modules                                     |
| `prompt.flows.user`                         | User prompt for analyzing authentication chains                                          |
| `prompt.flows.task`                         | LLM task prompt for analyzing authentication chains                                      |
| `openam.url`                                | OpenAM URL                                                                               |
| `openam.login`                              | OpenAM account login                                                                     |
| `openam.password`                           | OpenAM account password                                                                  |


## Conclusion

LLM has shown pretty good results of OpenAM configuration auditing. Artificial intelligence can identify vulnerabilities in the configuration and offers recommendations that comply with modern information security standards.

As the next steps, it is possible to extend the application to analyze authorization policies, and connection parameters to external data sources, as well as to implement an [MCP](https://modelcontextprotocol.io/introduction) server based on the developed application for automating the configuration of access control systems via LLM.
