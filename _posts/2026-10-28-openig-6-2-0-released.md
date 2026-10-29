---
layout: home
landing-title: "OpenIG 6.2.0 Released"
landing-title2: "OpenIG 6.2.0 Released"
description: OpenIG 6.2.0 updates the OpenAM libraries to 16.1.4, so the SAML v2.0 federation handler no longer accepts unsigned assertions, addresses Bouncy Castle, Apache Kafka, lz4-java, jose4j and HttpComponents Core vulnerabilities, closes WebSocket sessions reliably, keeps secrets out of logs and temporary files, and hardens the Docker image
keywords: 'OpenIG, identity gateway, release, 6.2.0, security update, GHSA-3j2f-qhrc-rjfj, SAML, Bouncy Castle, Apache Kafka, lz4-java, jose4j, HttpComponents, WebSocket, Docker, CodeQL, Trivy, Java 27'
imageurl: 'openig-og.png'
share-buttons: true
---
# OpenIG 6.2.0 Released
[Download](https://github.com/OpenIdentityPlatform/OpenIG/releases/tag/6.2.0)

## What's new

### Security vulnerabilities
* Updated the OpenAM libraries from 16.1.1 to [16.1.4](/blog/2026-10-22-openam-16-1-4-released). The SAML v2.0 federation handler of OpenIG is built on them, so it gets the fix for:
    * [GHSA-3j2f-qhrc-rjfj](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-3j2f-qhrc-rjfj) - SAML v2.0 service provider accepts unsigned assertions on some bindings, allowing unauthenticated account takeover
* Addressed third-party dependency vulnerabilities:
    * [CVE-2026-8763](https://github.com/advisories/GHSA-9pwp-9qqc-pr26) - Bouncy Castle Name Constraints bypass via a trailing dot in rfc822Name and URI
    * [CVE-2026-13506](https://github.com/advisories/GHSA-qp49-qgx5-5m26) - Bouncy Castle denial of service via lazy ASN.1 sequence processing
    * [CVE-2026-5598](https://github.com/advisories/GHSA-p93r-85wp-75v3) - Bouncy Castle private key leakage via non-constant time comparisons
    * [CVE-2025-14813](https://github.com/advisories/GHSA-574f-3g2m-x479) - Bouncy Castle GOST 28147 CTR mode reuses the keystream after 255 blocks
    * [CVE-2026-35554](https://github.com/advisories/GHSA-5qcv-4rpc-jp93) - Apache Kafka producer message corruption and misrouting via a buffer pool race condition
    * [CVE-2024-29371](https://github.com/advisories/GHSA-3677-xxcr-wjqv) - jose4j denial of service via compressed JWE content
    * [CVE-2025-12183](https://github.com/advisories/GHSA-vqf4-7m7x-wgfc), [CVE-2025-66566](https://github.com/advisories/GHSA-cmp6-m4wj-q63q), [CVE-2026-106451](https://github.com/advisories/GHSA-mcr4-qmvw-px4g) - lz4-java out-of-bounds memory operations, information leak in the safe decompressor and native library hijack via a shared temporary directory
    * [CVE-2026-54399](https://github.com/advisories/GHSA-hf6x-8p5f-cgmf), [CVE-2026-54428](https://github.com/advisories/GHSA-v3jc-474w-2wm6) - Apache HttpComponents Core memory exhaustion via excessive HTTP/1 headers and oversized HTTP/2 HPACK header blocks

### Upgrade notes
* The SAML v2.0 federation handler refuses a response with `assertionNotSigned` when neither the response nor every one of its assertions is signed, on every binding. An identity provider that sends unsigned responses over HTTP-Artifact, as an OpenAM identity provider does with the default settings, is affected: set `WantAssertionsSigned="true"` in the OpenIG service provider metadata, the identity provider's copy included, before upgrading. See [GHSA-3j2f-qhrc-rjfj](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-3j2f-qhrc-rjfj)
* The `org.openidentityplatform.openig.websocket.ttl` system property, the number of seconds a WebSocket authorization result is cached, is read once at startup. Changing it at runtime with `System.setProperty` no longer has an effect, and an invalid value falls back to 180 seconds with a warning instead of failing every WebSocket message

### Security hardening
* The temporary RSA key pair that `JwtSession` generates when no `keystore` is configured is 2048 bits long instead of 1024
* Entries of the Studio UI archive are checked on extraction, so none can be written outside the unpack directory (Zip Slip)
* The cache of inline Groovy scripts, which may embed credentials, is created readable by its owner only (`0700` directory, `0600` files) and without a window between creating and securing it
* `TokenTransformationFilter` no longer writes the issued token to the trace log, only its length
* Line breaks in consumed IBM MQ and Kafka messages are replaced before the message is logged, so a message cannot forge log records, and the IBM MQ connection password is masked in the debug dump of the connection factory settings
* The UMA sample pages load jQuery 3.7.1 over HTTPS with Subresource Integrity instead of `jquery-latest` (1.11.1) over HTTP

### Fixes
* WebSocket proxying:
    * A client is closed with `upstream not connected` when the upstream connection is missing or closed, instead of being left open with its messages silently dropped
    * Close reasons longer than the 123-byte protocol limit are cut and end with `…`, so a long error message no longer prevents the close
    * A client whose access is revoked is closed at once, without waiting for the upstream first
    * An error on the client connection closes the upstream with the abnormal closure code and the error as the reason
* Studio rejects route ids with commas, as its "Use only lowercase letters, numbers and dash" message says
* `OAuth2ClientFilter` turns a non-numeric `expires_in` in the token response into an OAuth 2.0 `server_error` instead of a `NumberFormatException`, and restores the missing space in the message about an ID token that cannot be decoded
* `ICAPFilter` names the field when `connect_timeout` or `read_timeout` is not a number
* Log and exception messages show the values they used to drop: the class of a heaplet that cannot be instantiated, the `$location` value that cannot be resolved and both URIs of a resource mismatch in `PolicyEnforcementFilter`
* Fixed Asciidoctor warnings in the OpenIG guides

### Dependencies and packaging
* Bumped dependencies: OpenAM 16.1.4, Bouncy Castle (`bcprov`, `bcpkix`, `bcutil-jdk15to18`) 1.86, `kafka-clients` 3.9.2, jose4j 0.9.6, lz4-java 1.11.4 (`at.yawk.lz4` instead of `org.lz4`), HttpComponents Core 5.4.4, HttpClient 5.6.5
* Docker image:
    * Applies Ubuntu security updates at build time
    * Installs `curl` and `unzip` without their recommended packages
    * No longer contains the unused `/usr/bin/pebble` of the Ubuntu base image, whose Go runtime package updates never patch

### Quality and CI
* Added CodeQL code scanning and fixed alerts of every severity in the Java and JavaScript code
* Added Trivy vulnerability scanning of the Docker images and SHA-pinned GitHub Actions with least-privilege token permissions
* The CI build runs the integration tests and the Studio UI QUnit suite in headless Chrome
* Javadoc warnings fail the build
* The CI build covers Java 27

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenIG/compare/6.1.1...6.2.0))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<br/>
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i></i>
