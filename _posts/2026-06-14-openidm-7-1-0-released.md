---
layout: home
landing-title: "OpenIDM 7.1.0 Released"
landing-title2: "OpenIDM 7.1.0 Released"
description: OpenIDM 7.1.0 addresses critical security vulnerabilities including CVE-2026-1605, CVE-2026-33227, CVE-2026-39304, CVE-2018-1294, CVE-2026-42198, and adds new features
keywords: 'OpenIDM, identity management, release, 7.1.0, security update, CVE-2026-1605, CVE-2026-33227, CVE-2026-39304, CVE-2018-1294, CVE-2026-42198'
share-buttons: true
---
# OpenIDM 7.1.0 Released
[Download](https://github.com/OpenIdentityPlatform/OpenIDM/releases/tag/7.1.0)

## What's new
* Addressed critical security vulnerabilities:
    * [CVE-2026-1605](https://nvd.nist.gov/vuln/detail/CVE-2026-1605) - Eclipse Jetty Gzip request memory leak when response is not compressed
    * [CVE-2026-33227](https://nvd.nist.gov/vuln/detail/CVE-2026-33227) - Apache ActiveMQ classpath path traversal via Stomp consumer and Web console
    * [CVE-2026-39304](https://nvd.nist.gov/vuln/detail/CVE-2026-39304) - Apache ActiveMQ Denial of Service via Out of Memory through TLSv1.3 handshake KeyUpdates
    * [CVE-2026-27903](https://nvd.nist.gov/vuln/detail/CVE-2026-27903), [CVE-2026-27904](https://nvd.nist.gov/vuln/detail/CVE-2026-27904), [CVE-2026-26996](https://nvd.nist.gov/vuln/detail/CVE-2026-26996) - UI: updated grunt to 1.6.2 to address multiple vulnerabilities
    * [CVE-2018-1294](https://nvd.nist.gov/vuln/detail/CVE-2018-1294) - Apache Commons Email header injection via bounce address
    * [CVE-2026-42198](https://nvd.nist.gov/vuln/detail/CVE-2026-42198) - pgjdbc: Unbounded PBKDF2 iterations in SCRAM authentication allows CPU exhaustion DoS
* Make REST context path configurable via `openidm.context.path` system property
* Add `onQueryResult` script hook to filter managed object query results
* Upgrade OrientDB from 2.1.25 to 3.2.51
* Fix SCR deadlock in SecurityManager by making repoService a dynamic reference
* Fix Property mapping /authzRoles transformation script exception
* Fix Felix Web Console `PreferencesConfigurationPrinter` not enabled
* Update OpenICF dependency to version 2.0.3

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenIDM/compare/7.0.2...7.1.0))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<br/>
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>
<br/>
<i id="vliefooghe-adeo"><i>3. <a href="https://github.com/vliefooghe-adeo" target="_blank">20107589 Vincent Liefooghe</a></i></i>
