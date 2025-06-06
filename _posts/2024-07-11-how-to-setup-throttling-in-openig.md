---
layout: home
title: "API Throughput Control (Throttling) with OpenIG Authorization Gateway"
landing-title2: "API Throughput Control (Throttling) with OpenIG Authorization Gateway"
description: "This article explains API throttling use cases and how to setup various throttling policies with OpenIG"
keywords: 'openig, throttling, api, authorization'
imageurl: 'openig-og.png'
share-buttons: true
products: 
- openig
---
<h1>API Throughput Control (Trotting) with OpenIG Authorization Gateway</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-to-Setup-API-Throughput-Control-%28Throttling%29](https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-to-Setup-API-Throughput-Control-%28Throttling%29)

# Introduction

Why do I need to limit the number of requests? Experienced colleagues can skip this section and go straight to the configuration section. 

- **Confront [DDoS](https://en.wikipedia.org/wiki/Denial-of-service_attack#Distributed_DoS) attacks.** DDoS attacks are one of the most common. The goal of the attack is to overload the targeted service with a large number of requests. As a result, the service does not have sufficient resources to process all requests, causing the response time to increase, and ultimately leading to the service becoming unresponsive. A similar situation can arise with an unexpected influx of clients to the service, resembling a DDoS attack.
- **Service Level Agreement Control.** Throttling is necessary when an organization provides APIs with different service levels. For instance, a regular client may be limited to 10 API calls per minute, while a premium client can make up to 1000 calls.
- **Prevent database "leaks"**. For example, during normal work, an employee may request data for 5 customers per minute. If this limit is exceeded, this behavior is like the employee is trying to download the entire database. Limiting the number of calls helps prevent such an attack.

# Demo Project

For demonstration purposes clone the project with the following command:

```bash
git clone -b features/throttling https://github.com/maximthomas/openig-protect-ws.git
```

And run the project:
```bash
docker compose up
```

## Brief Demo Project Description

In the `docker-compose.yaml` file two services are defined: OpenIG and the `sample-service` demo service, which is protected by OpenIG. 

The demo service has two endpoints - the root `/`, to which all users have access, and `/secure`, to which only authenticated users have access.

The routes to these endpoints in OpenIG are `openig-config/config/routes/10-api.json` and `openig-config/config/routes/20-secure.json`.

For authorization, `/secure` uses a signed JWT with the private key `openig-config/keys/private_key.pem` .  

The `ScriptableFilter` uses the `openig-config/scripts/groovy/jwt.groovy` script. The script parses the JWT, checks the public key signature `openig-config/config/config.json` and writes `role` and `sub` claims into the context. 

The `openig-config/config/config.json` file describes filters that are triggered for all routes, and also defines filters that can be used in specific routes.

The configuration was described in detail in the [article](https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-To-Protect-Web-Services-with-OpenIG).

# Request Throttling Setup

## Basic Throttling

Now that we have OpenIG and the protected service running, let's add a filter to the route that filters all unauthenticated requests to the service with a limit of no more than 5 requests per 5 seconds.

Open the route file `10-api.json` in the `openig-config/config/routes` directory and add a filter with type `ThrottlingFilter` to the filter chain.

The `numberOfRequests` and `duration` attributes of the `rate` object define the limit of requests per time.

`10-api.json`:
```json
{
  "name": "${matches(request.uri.path, '^/$')}",
  "condition": "${matches(request.uri.path, '^/$')}",
  "monitor": true,
  "timer": true,
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [
        {
          "type": "ThrottlingFilter",
          "name": "simple-throttling",
          "config": {
            "requestGroupingPolicy": "",
            "rate": {
              "numberOfRequests": 5,
              "duration": "5 s"
            }
          }
        },
...       
```

## Grouped Throttling

DDoS attacks are conducted only from a fixed set of IP addresses. And to ensure the normal work of users, you can limit the number of requests for each IP address. 

Let's add the IP address of the request to the `requestGroupingPolicy` attribute of the `ThrottlingFilter` filter.

```json
{
  "type": "ThrottlingFilter",
  "name": "simple-throttling",
  "config": {
    "requestGroupingPolicy": "${(not empty request.headers['X-Real-Ip'][0])?request.headers['X-Real-Ip'][0]:contexts.client.remoteAddress}",
    "rate": {
      "numberOfRequests": 5,
      "duration": "5 s"
    }
  }
},
```

In the expression in the listing above, `ThrottlingFilter` filter first checks the value of the X-Real-Ip header (the header can be set by a load balancer), and if it is not empty, uses the header value. Otherwise, the filter uses the IP address of the request.

Let's check the configuration by running the curl command several times:
```bash
for i in `seq 7`; \
 do curl --trace-time -v -H "Content-Type: application/json" -H "Accept: application/json" --data '{"test": "test"}' http://localhost:8080; \
done 2>&1 | grep '< HTTP'
15:55:44.207986 < HTTP/1.1 200 
15:55:45.237957 < HTTP/1.1 200 
15:55:45.278702 < HTTP/1.1 200 
15:55:45.319421 < HTTP/1.1 200 
15:55:45.352789 < HTTP/1.1 200 
15:55:45.376685 < HTTP/1.1 429 
15:55:45.395739 < HTTP/1.1 429 
```
As you can see from the output of the `curl` command, OpenIG returns 429 HTTP status for requests starting from the sixth. 

A complete response example:

```bash
15:56:09.535261 < HTTP/1.1 429 
15:56:09.535302 < Retry-After: 1
15:56:09.535330 < Retry-After-Partition: 10.1.1.5
15:56:09.535357 < Retry-After-Rate: 5/5 SECONDS
15:56:09.535384 < Retry-After-Rule: simple-throttling
...
```

Note the headers that the `ThrottlingFilter` returns when the limit is exceeded:

| Header | Description |
| --- | --- |
| Retry-After | Number of seconds to wait until the next request |
| Retry-After-Partition | The value of the grouping by which the frequency of requests is counted |
| Retry-After-Rate | Maximum request frequency rate |
| Retry-After-Rule | The name of the OpenIG filter |

## Mapped Throttling Configuration

Now let's configure throttling more flexibly. Set the throttling for authenticated users on the `/secure` endpoint. The throttling will work individually for each user, similar to the IP address from the example above. The throttling will be grouped by the value of JWT `sub` claim. Regular users can send a maximum of 5 requests in 10 seconds, while users with the `supervisor` need a significantly larger amount of data and can send up to 10 requests in 10 seconds. The property value will be taken from the JWT `role` claim in the `jwt.groovy` script.

Let's add a `ThrottlingFilter` filter to the `20-secure.json` route after the `ScriptableFilter` filter that parses the JWT.

```json
{
  "type": "ThrottlingFilter",
  "name": "auth-users-throttling",
  "config": {
    "requestGroupingPolicy": "${attributes['sub']}",
    "throttlingRatePolicy": {
      "type": "MappedThrottlingPolicy",
      "config": {
        "throttlingRateMapper": "${attributes['role']}",
        "throttlingRatesMapping": {
          "supervisor": {
            "numberOfRequests": 10,
            "duration": "5 s"
          }
        },
        "defaultRate": {
          "numberOfRequests": 5,
          "duration": "5 s"
        }
      }
    }
  }
}
```

Instead of `rate` object add the `throttlingRatePolicy` with the type `MappedThrottlingPolicy`.

Thus for JWT with the `supervisor` role, 10 requests in 10 seconds are allowed, for all others - 5 requests.

Let's check the throttling for a regular user:

```bash
export OPENAM_JWT=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYW1wbGUtc2VydmljZSIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzI2MjM5MDIyfQ.bhzhwj2cY1iYbpx7Mzbukfi1jOCvWP-Pdd9dm3hf7lZDDuokNVDUXU3jvHial4QN-bOTSNCUKVy907hokcVeQaFwbiYoZs485Kr230Z0y9MU6zbDe8yQp68-71TDgJGIZ78YYOKvJTrzCWgWgE_Py1DskG_ViSxfGFlETpFQa056Rk2bty-9iuc_Cx5_Wr6RCcJTG6WYRrBtdWGIFxljEjxSAcJYmGPPA8dHHORDOnmka2OAjWURnsqbz50aI_SrWpnqp4i2eXVA1b5QD5rlsgc_QAqJptghrijBlRPhasTk1N-kXE8Ozboa0FwGfIRr7gNiG-3if7INZe2R5NUCmjlAlywcSfOunWuSzY8tLGTHV2swnQPP8lBXwVJcS5nJMqBNIbcLcFWHk3ryvvtf-LYty_jAY8v1zDe9-DwFPWI0rry8fmiZj7yhAnvX5EHZHvSQtp_zyPpVWvOXFPwasI0jdKoxhWvyJpbmw-D95J5CgJAMfkrWPDQKVt3ipebwnMJStA3xAPPyl28mTBYhJrT6gzIOS3DseoVKK4adn34ZrQi2Hm-wyUtbdulopK739MKM73NYgoFXSJeVUqcy4iw3-In5XmOhdRnUL50TSiaNBbkys8iK7r00HD3kI3CH0GfaPdrcgRgaFXKmVDhX-tEaPJYcuEUTHfQAxWwMdiw 
for i in `seq 7`; \
 do curl --trace-time -v GET -H "Content-Type: application/json" -H "Accept: application/json" -H "Authorization: Bearer ${OPENAM_JWT}" http://localhost:8080/secure; \
done 2>&1 | grep '< HTTP'
15:57:33.514169 < HTTP/1.1 200 
15:57:33.545997 < HTTP/1.1 200 
15:57:33.580583 < HTTP/1.1 200 
15:57:33.615292 < HTTP/1.1 200 
15:57:33.647661 < HTTP/1.1 200 
15:57:33.672396 < HTTP/1.1 429 
15:57:33.696753 < HTTP/1.1 429 
```

And for a supervisor:

```bash
export OPENAM_JWT_SUPERVISOR=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYW1wbGUtc2VydmljZSIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJyb2xlIjoic3VwZXJ2aXNvciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzI2MjM5MDIyfQ.ccigmz0n1gP1fIe0HP5jMAjHWKkD1cwAViGfSapfVZ86GxKY9wkOWegYABmDyEXWwHWAcwFFFu1ZF7JYRiBmci87cRj5MSbw6Mrb1M_8rZj6aP9y9qTyWY80PtMJw6Udcn_wqvfCeMlKLlaItnUYc6-bth1rb_tJNd9FxDcpMZt-5q1uMGfeEPWsyF4a81kSFmNr2aD4rp8ftpLv6VoObkEdYmwkn9aRKLAxNjD9Ze8rdKQBgCk_rR3hTzURyPO_2QZsLDfpPMQx0O3Qbx9x_4om5D_hlrBOdNp6k435J1ZT2sllaJaP_HEQSGgWAwS1I9me9jwfIuA-Fhcxa6si7P0MlSX7Bj6Zki492RBvw2dsspnDZ_BOiVFteMYorS2KZoahQyYtxPubZSdCNqJ3fG8qX3zDj1EESS2srFQrF6baZfpJMHUNMCO_2QSioBBi8ffatG2snwHLQKiTr2TD-YqBx_rU3BGV3wGa9bXSAaTJCvn9x8Id_ie8x5xfaZXJL0r0gunj1LZuYKsNjo4VMMTn-pu5UZtttg9s30OozCEzvC5fM3LXDR2R_klanvFWWQlDabiF1kUnzQuSD9uj37pnbHgv0NOG3RePO0hujqelmj5HVzEE-h6ULKeUKJAxNZ9otMJb25RpQr_cZvIX3UPzFbLqbI7hyfzjZP6258Q

for i in `seq 12`; \
 do curl --trace-time -v GET -H "Content-Type: application/json" -H "Accept: application/json" -H "Authorization: Bearer ${OPENAM_JWT_SUPERVISOR}" http://localhost:8080/secure; \
done 2>&1 | grep '< HTTP'
15:58:05.830975 < HTTP/1.1 200 
15:58:05.860576 < HTTP/1.1 200 
15:58:05.890634 < HTTP/1.1 200 
15:58:05.922926 < HTTP/1.1 200 
15:58:05.957944 < HTTP/1.1 200 
15:58:05.986881 < HTTP/1.1 200 
15:58:05.019237 < HTTP/1.1 200 
15:58:05.051065 < HTTP/1.1 200 
15:58:05.084710 < HTTP/1.1 200 
15:58:05.114731 < HTTP/1.1 200 
15:58:05.140818 < HTTP/1.1 429 
15:58:05.165421 < HTTP/1.1 429 
```

