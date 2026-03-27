---
layout: home
landing-title: "OpenIG 6.1.0 Released"
landing-title2: "OpenIG 6.1.0 Released"
description: OpenIG 6.1.0 with new AI gateway filters for LLM prompt injection protection and token usage control, MCP policy enforcement, JWT building, OpenAPI validation, a security fix, and JDK 26 support
keywords: 'OpenIG, identity gateway, release, 6.1.0, LLM, AI gateway, prompt injection, MCP, Model Context Protocol, JWT, OpenAPI, Swagger, CVE-2026-24308, JDK 26'
imageurl: 'openig-og.png'
share-buttons: true
---
# OpenIG 6.1.0 Released
[Download](https://github.com/OpenIdentityPlatform/OpenIG/releases/tag/6.1.0)

## What's new
* Added [JwtBuilderFilter](https://doc.openidentityplatform.org/openig/reference/filters-conf#JwtBuilderFilter) — creates a JSON Web Token (JWT) from runtime data and injects it into the request context
* Added [OpenApiValidationFilter](https://doc.openidentityplatform.org/openig/reference/filters-conf#OpenApiValidationFilter) — validates inbound HTTP requests and outbound HTTP responses against an OpenAPI specification (Swagger 2.x or OpenAPI 3.x)
* Added [LLMPromptGuardFilter](https://doc.openidentityplatform.org/openig/reference/filters-conf#LLMPromptGuardFilter) — intercepts outgoing LLM API requests and scans every prompt for prompt-injection attacks before the request reaches the downstream model; implements mitigations for OWASP LLM Top 10 (2025) risks LLM01 (Prompt Injection) and LLM07 (System Prompt Leakage)
* Added [LLMProxyFilter](https://doc.openidentityplatform.org/openig/reference/filters-conf#LLMProxyFilter) — controls LLM token usage per user
* Added [MCPServerFeaturesFilter](https://doc.openidentityplatform.org/openig/reference/filters-conf#MCPServerFeaturesFilter) — enforces allow/deny policies for Model Context Protocol (MCP) features exchanged as JSON-RPC payloads; inspects both incoming requests and outgoing responses and removes or rejects features according to configured rules
* Added JDK 26 support to the build pipeline
* Updated OpenAM dependency to version 16.0.6
* Addressed security vulnerability:
    * [CVE-2026-24308](https://nvd.nist.gov/vuln/detail/CVE-2026-24308) - Apache ZooKeeper improper handling of configuration values

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenIG/compare/6.0.2...6.1.0))

## Thanks for the contributions

<i id="maximthomas"><i>1. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>
<br/>
<i id="vharseko"><i>2. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>