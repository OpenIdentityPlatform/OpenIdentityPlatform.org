---
layout: home
landing-title: "OpenICF 2.0.4 Released"
landing-title2: "OpenICF 2.0.4 Released"
description: OpenICF 2.0.4 stabilizes the WebSocket connector server and the batch API, runs the LDAP connector tests against an embedded OpenDJ, modernizes the Docker images and updates OpenDJ to 5.1.2
keywords: 'OpenICF, Identity Connector Framework, 2.0.4, WebSocket, connector server, batch API, LDAP connector, embedded OpenDJ, Jetty, Grizzly, Docker, CodeQL, OpenDJ 5.1.2'
imageurl: 'openicf-logo.png'
share-buttons: true
---
# OpenICF 2.0.4 Released
[Download](https://github.com/OpenIdentityPlatform/OpenICF/releases/tag/2.0.4)

## What's new
* Connector server and batch API stability fixes:
    * Fixed WebSocket client wedging that made `OpenICFWebSocketTest` flaky
    * Serialized WebSocket message dispatch per socket to prevent out-of-order processing
    * Fixed lost pre-handshake responses that caused `testAsynchronousBatch` to hang
    * Fixed a race in `BatchApiOpImpl.CompletionListener.start()` causing an intermittent `IllegalThreadStateException`
    * Delivered `CancelOpRequest` messages arriving before the operation registers
    * Gave each Jetty connection its own endpoint and closed cached principals
    * Called `adapter.close()` from the Grizzly WebSocket close callbacks
* Migrated `connector-server-jetty` off the deprecated `org.eclipse.jetty.util.log` API
* Switched the LDAP connector tests to run against an embedded OpenDJ, allowing 30 s for it to start and stop, and made the changelog wait in `SunDSChangeLogSyncStrategyTests` deterministic
* Modernized the OpenICF Docker images and broadened their multi-architecture build matrix
* Added a CodeQL code-scanning workflow, trimmed the macOS/Windows build matrix and added workflow concurrency
* Enabled Javadoc doclint `all,-missing` with `failOnWarnings` and bumped the Javadoc plugin to 3.12.0
* Kept the Derby test dependency on a Java 11-compatible release (10.15.2.0)
* Updated OpenDJ dependency to version 5.1.2

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenICF/compare/2.0.3...2.0.4))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i></i>
