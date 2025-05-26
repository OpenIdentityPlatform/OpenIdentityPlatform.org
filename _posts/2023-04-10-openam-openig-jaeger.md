---
layout: home
title: "Setup Tracing with OpenTelemetry and Jaegers"
landing-title2: "How to setup tracing with OpenTelemetry and Jaeger"
description: "In this article we will setup OpenTelemetry and Jaeger to monitor OpenAM and OpenIG applications"
keywords: 'openam, openig, jaeger, opentelemetry'
share-buttons: true
products: 
- openam
- openig
---

# Setup Tracing with OpenTelemetry and Jaeger

[Original article](https://github.com/OpenIdentityPlatform/OpenAM/wiki/Setup-Tracing-with--OpenTelemetry-and-Jaeger)

## Preconditions
Download the OpenTelemetry agent file opentelemetry-javaagent.jar by link [https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest](https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest) each OpenAM и OpenIG host

If Jaeger is not installed it can be run as a Docker container:

```bash
docker run -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.43
```
## OpenAM
Set environment variables

Variable | Example | Description
-- | -- | --
OTEL_TRACES_EXPORTER | jaeger | An exporter of traces
OTEL_SERVICE_NAME |openam | Service name for monitoring
OTEL_EXPORTER_JAEGER_TIMEOUT | 10000 | Jaeger connection timeout in milliseconds
OTEL_EXPORTER_JAEGER_ENDPOINT | http://localhost:14250 | gRPC Jaeger URL endpoint
JAVA_TOOL_OPTIONS | -javaagent:/path/to/opentelemetry-javaagent.jar | Path to OpenTelemetry Java agent

Restart OpenAM instance

## OpenIG
Set environment variables

Variable | Example | Description
-- | -- | --
OTEL_TRACES_EXPORTER | jaeger | An exporter of traces
OTEL_SERVICE_NAME | openig | Service name for monitoring
OTEL_EXPORTER_JAEGER_TIMEOUT | 10000 | Jaeger connection timeout in milliseconds
OTEL_EXPORTER_JAEGER_ENDPOINT | http://localhost:14250 | gRPC Jaeger URL endpoint
JAVA_TOOL_OPTIONS | -javaagent:/path/to/opentelemetry-javaagent.jar | Path to OpenTelemetry Java agent

Restart OpenIG instance

If you have any additional questions, [feel free to ask us](https://github.com/OpenIdentityPlatform/OpenAM/discussions)!