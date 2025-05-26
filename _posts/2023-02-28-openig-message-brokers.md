---
layout: home
title: "How to Integrate OpenIG and Message Brokers"
landing-title2: "How to Integrate OpenIG and Message Brokers"
description: "How to send and receive message broker messages to http and backwards"
keywords: 'apache kafka, ibm mq, message broker, openig, gateway, http'
share-buttons: true
products: 
- openig

---

# How to Integrate OpenIG and Message Brokers

Original article: [https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-to-Integrate-OpenIG-and-Message-Brokers](https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-to-Integrate-OpenIG-and-Message-Brokers)


- [Introduction](#introduction)
- [Use Cases](#use-cases)
  * [Send HTTP Requests to Apache Kafka](#send-http-requests-to-apache-kafka)
  * [Send Apache Kafka Messages to HTTP Endpoint](#send-apache-kafka-messages-to-http-endpoint)
  * [Embedded Apache Kafka](#embedded-apache-kafka)
  * [Send HTTP Requests to IBM MQ](#send-http-requests-to-ibm-mq)
  * [Send IBM MQ Messages to HTTP Endpoint](#send-ibm-mq-messages-to-http-endpoint)


## Introduction

Open Identity Platform implemented message broker integration in [OpenIG](/openig){:target="_blank"} starting with 5.0.12 version. [Apache Kafka](https://kafka.apache.org){:target="_blank"} and [IBM MQ](https://www.ibm.com/products/mq){:target="_blank"} are supported.

The following article shows an example how to send and receive messages from and to message brokers using [OpenIG](/openig){:target="_blank"}

You can use the following project as a base: [https://github.com/maximthomas/openig-mb-example](https://github.com/maximthomas/openig-mb-example){:target="_blank"}

## Use Cases

### Send HTTP Requests to Apache Kafka

The following setup allows to receive messages via HTTP protocol and send them to Apache Kafka topic.

Create Apache Kafka topic:

```bash
kafka-topics.sh --create --topic topic1 --bootstrap-server localhost:9092
```

Add Apache Kafka consumer handler to the heap in OpenIG configuration file:

`config.json`

```json
{
  "heap": [
    ...
    {
      "name": "kafka-producer",
      "type": "MQ_Kafka",
      "config": {
        "bootstrap.servers": "kafka:9092",
        "topic.produce": "incoming-messages"
      }
    },
    ...
  ]
}
```
Some important **MQ_Kafka** handler settings:

|Setting| Name|
|-|-|
| `boostrap.server` | Comma-separated list of host and port pairs that are the addresses of the Kafka brokers |
| `topic.produce` | To which topic OpenIG should send messages |
| `topic.consume` | From which topic should OpenIG consume messages |
| `uri` | OpenIG route endpoint |
| `method` | HTTP method, which OpenIG uses to send requests to the HTTP endpoint |


Add OpenIG route to `routes` folder to process HTTP requests:

`10-http2kafka.json`
```json
{
  "name": "${(request.method == 'PUT') and matches(request.uri.path, '^/http2kafka$')}",
  "condition": "${(request.method == 'PUT') and matches(request.uri.path, '^/http2kafka$')}",
  "monitor": true,
  "timer": true,
  "handler": {
    "type": "Chain",
    "config": {
    "filters": [],
      "handler": {
        "type": "DispatchHandler",
        "config": {
          "bindings": [
            {
              "handler": "kafka-consumer"
            }
          ]
        }
      }
    }
  }
}
```

Send HTTP request to OpenIG and then check received messages in `topic1` topic:

```bash
$ curl -v -X PUT --data '{"data": "test"}' -H 'Content-Type: application/json' 'http://localhost:8080/http2kafka'
*   Trying 127.0.0.1:8080...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> PUT /http2kafka HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.68.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 16
> 
* upload completely sent off: 16 out of 16 bytes
* Mark bundle as not supporting multiuse
< HTTP/1.1 202 Accepted
< Server: Apache-Coyote/1.1
< Content-Length: 0
< Date: Wed, 13 Apr 2022 12:34:03 GMT
< 
* Connection #0 to host localhost left intact
```


```bash
$ kafka-console-consumer.sh --topic topic1 --from-beginning --bootstrap-server localhost:9092
{"data": "test"}
```

### Send Apache Kafka Messages to HTTP Endpoint

In the following configuration OpenIG will receive messages from Apache Kafka `topic2` topic and send them to a HTTP endpoint

Create new Apache Kafka topic:

```bash
kafka-topics.sh --create --topic topic2 --bootstrap-server localhost:9092
```

Add Apache Kafka consumer handler to the heap in the OpenIG configuration file

`config.json`
```json
{
  "heap": [
    ...
    {
      "name": "kafka-consumer",
      "type": "MQ_Kafka",
      "config": {
        "bootstrap.servers": "kafka:9092",
        "topic.consume": "topic2",
        "method": "POST"
      }
    },
    ...
  ]
}
```

Add OpenIG route to `routes` folder to process Apache Kafka messages:

`10-kafka2http.json`
```json
{
  "name": "${(request.method == 'POST') and matches(request.uri.path, '^/kafka2http$')}",
  "condition": "${(request.method == 'POST') and matches(request.uri.path, '^/kafka2http$')}",
  "monitor": true,
  "timer": true,
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [],
      "handler": {
      "type": "DispatchHandler",
        "config": {
          "bindings": [{
              "handler": "ClientHandler",
              "capture": "all",
              "baseURI": "${system['endpoint.api']}"
          }]
        }
      }
    }
  }
}

```

Send test data to the Apache Kafka topic:
```bash
$ kafka-console-producer.sh --topic topic2 --bootstrap-server localhost:9092
>{"data": "test"}
```

There is a new record in the sample service log:
```
2022-04-21 07:26:14.645 DEBUG 1 --- [nio-8080-exec-6] o.s.w.f.CommonsRequestLoggingFilter      : After request [POST /kafka2http, headers=[kafka-offset:"29", kafka-topic:"topic2", content-length:"16", host:"sample-service:8080", connection:"Keep-Alive", user-agent:"Apache-HttpAsyncClient/4.1.4 (Java/1.8.0_212)"], payload={"data": "test"}]
```

### Embedded Apache Kafka

If there are no message brokers in the infrastructure, but there is a need to receive and redirect Kafka messages, OpenIG offers embedded Apache Kafka.
To setup embedded kafka, add `EmbeddedKafka` to OpenIG config.json file.

`config.json`
```json
{
  "heap": [
    ...
      {
        "name": "EmbeddedKafka",
        "type": "EmbeddedKafka",
        "config": {
          "zookeper.port": "${system['zookeper.port']}",
          "security.inter.broker.protocol": "${empty system['keystore.location'] ?'PLAINTEXT':'SSL'}",
          "listeners": "${system['kafka.bootstrap']}",
          "advertised.listeners": "${system['kafka.bootstrap']}",
          "ssl.endpoint.identification.algorithm": "",
          "ssl.enabled.protocols":"TLSv1.2",
          "ssl.keystore.location":"${system['keystore.location']}",
          "ssl.keystore.password":"${empty system['keystore.password']?'changeit':system['keystore.password']}",
          "ssl.key.password":"${empty system['key.password']?'changeit':system['key.password']}",
          "ssl.truststore.location":"${system['truststore.location']}",
          "ssl.truststore.password":"${empty system['truststore.password']?'changeit':system['truststore.password']}"			
        },
    ...
  ]
}
```

Some significant **EmbeddedKafka** settings:

|Setting| Name|
|-|-|
| `zookeper.port` | Zookeeper port for Embedded Apache Kafka. If not set Kafka won't start  |
| `listeners` | Port and hosts which Kafka binds to for listening |
| `advertised.listeners` |Port and hosts which Kafka clients listening |

Add kafka listener to OpenIG heap and create a route that listens Kafka message and redirects it to HTTP endpoint (you can also redirect the message to another message broker).

`config.json`
```json
{
  "heap": [
    ...
      {
      "name": "kafka-consumer",
      "type": "MQ_Kafka",
      "config": {
        "bootstrap.servers": "openig:9092",
        "topic.consume": "topic1",
        "method": "POST",
        "uri": "/kafka2http"
      }
    ...
  ]
}
```

`10-kafka2http.json`
```json
{
  "name": "${(request.method == 'POST') and matches(request.uri.path, '^/kafka2http$')}",
  "condition": "${(request.method == 'POST') and matches(request.uri.path, '^/kafka2http$')}",
  "monitor": true,
  "timer": true,
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [],
      "handler": {
      "type": "DispatchHandler",
        "config": {
          "bindings": [{
              "handler": "ClientHandler",
              "capture": "all",
              "baseURI": "${system['endpoint.api']}"
          }]
        }
      }
    }
  }
}
```

Start OpenIG.
Now you can create a topic in embedded OpenIG Kafka and send messages to the topic.

```bash
$ kafka-console-producer.sh --topic topic1 --bootstrap-server localhost:9092
>{"data": "test"}
```

There is a new record in the sample service log:
```
2022-04-21 07:26:14.645 DEBUG 1 --- [nio-8080-exec-6] o.s.w.f.CommonsRequestLoggingFilter      : After request [POST /kafka2http, headers=[kafka-offset:"29", kafka-topic:"topic2", content-length:"16", host:"sample-service:8080", connection:"Keep-Alive", user-agent:"Apache-HttpAsyncClient/4.1.4 (Java/1.8.0_212)"], payload={"data": "test"}]
```

### Send HTTP Requests to IBM MQ

The following setup allows to receive messages via HTTP protocol and send them to IBM MQ topic.

Add IBM MQ consumer handler to the heap in the OpenIG configuration file:

`config.json`

```json
{
  "heap": [
    ...
    {
      "name": "mq-producer",
      "type": "MQ_IBM",
      "config": {
        "XMSC_WMQ_CONNECTION_NAME_LIST":"mq(1414)",
        "XMSC_WMQ_CHANNEL":"DEV.APP.SVRCONN",
        "XMSC_WMQ_QUEUE_MANAGER":"QM1",
        "XMSC_USERID":"app",
        "XMSC_PASSWORD":"passw0rd",
        "topic.produce": "DEV.QUEUE.1"
      }
    },
    ...
  ]
}
```

Some important **MQ_IBM** handler settings:

|Setting| Name|
|-|-|
| `XMSC_WMQ_CONNECTION_NAME_LIST` | Comma-separated list of host and port that are the addresses of the IBM MQ brokers |
| `XMSC_WMQ_CHANNEL` | IBM MQ channel name, used for connection |
| `XMSC_USERID` | IBM MQ user id |
| `XMSC_PASSWORD` |  IBM MQ user password |
| `topic.produce` | To which topic OpenIG should send messages |
| `topic.consume` | From which topic should OpenIG consume messages |
| `uri` | OpenIG route endpoint |
| `method` | HTTP method, which OpenIG uses to send requests to the HTTP endpoint |

Add OpenIG route to `routes` folder to process HTTP requests:

`10-http2mq.json`
```json
{
  "name": "${(request.method == 'PUT') and matches(request.uri.path, '^/http2mq$')}",
  "condition": "${(request.method == 'PUT') and matches(request.uri.path, '^/http2mq$')}",
  "monitor": true,
  "timer": true,
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [],
      "handler": {
        "type": "DispatchHandler",
        "config": {
          "bindings": [
            {
              "handler": "mq-producer"
            }
          ]
        }
      }
    }
  }
}
```

Send HTTP request to OpenIG and then check received messages in `DEV.QUEUE.1` topic

```bash
$ curl -v -X PUT --data '{"data": "test"}' -H 'Content-Type: application/json' 'http://localhost:8080/http2mq'
*   Trying 127.0.0.1:8080...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> PUT /http2mq HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.68.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 16
> 
* upload completely sent off: 16 out of 16 bytes
* Mark bundle as not supporting multiuse
< HTTP/1.1 202 Accepted
< Server: Apache-Coyote/1.1
< Content-Length: 0
< Date: Wed, 13 Apr 2022 12:34:03 GMT
< 
* Connection #0 to host localhost left intact
```
Open IBM MQ web console [https://localhost:9443/ibmmq/console/](https://localhost:9443/ibmmq/console/#/), in the `DEV.QUEUE.1` you should see new message in the console:

![IBM MQ DEV.QUEUE1](/assets/img/openig-message-brokers/ibm-mq-console-queue1.png)

### Send IBM MQ Messages to HTTP Endpoint

Add IBM MQ producer handler to the heap in OpenIG configuration file

`config.json`

```json
{
  "heap": [
    ...
    {
      "name": "mq-consumer",
      "type": "MQ_IBM",
      "config": {
        "XMSC_WMQ_CONNECTION_NAME_LIST":"mq(1414)",
        "XMSC_WMQ_CHANNEL":"DEV.APP.SVRCONN",
        "XMSC_WMQ_QUEUE_MANAGER":"QM1",
        "XMSC_USERID":"app",
        "XMSC_PASSWORD":"passw0rd",
        "topic.consume": "DEV.QUEUE.2",
        "uri": "/mq2http",
        "method": "POST"
      }
    }
    ...
  ]
}
```

Add OpenIG route to `routes` folder to process IBM MQ messages:

`10-mq2http.json`

```json
{
  "name": "${(request.method == 'POST') and matches(request.uri.path, '^/mq2http$')}",
  "condition": "${(request.method == 'POST') and matches(request.uri.path, '^/mq2http$')}",
  "monitor": true,
  "timer": true,
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [],
      "handler": {
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
    }
  }
}

```

Log in to the IBM MQ console, and create a message for DEV.QUEUE.2 topic

![IBM MQ DEV.QUEUE1](/assets/img/openig-message-brokers/ibm-mq-console-create-message.png)

In the sample-service log you should see the following record:

```
2022-04-21 08:32:35.007 DEBUG 1 --- [nio-8080-exec-1] o.s.w.f.CommonsRequestLoggingFilter      : After request [POST /mq2http, headers=[jms_ibm_character_set:"UTF-8", jms_ibm_encoding:"273", jms_ibm_format:"MQSTR", jms_ibm_msgtype:"8", jms_ibm_putappltype:"6", jms_ibm_putdate:"20220421", jms_ibm_puttime:"08323434", jmsxappid:"com.ibm.mq.webconsole", jmsxdeliverycount:"1", jmsxuserid:"unknown", content-length:"16", host:"sample-service:8080", connection:"Keep-Alive", user-agent:"Apache-HttpAsyncClient/4.1.4 (Java/1.8.0_212)"], payload={"data": "test"}]
```

If you have any additional questions, [feel free to ask us](https://github.com/OpenIdentityPlatform/OpenIG/discussions){:target="_blank"}!
