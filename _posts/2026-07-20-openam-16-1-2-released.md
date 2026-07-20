---
layout: home
landing-title: "OpenAM 16.1.2 Released"
landing-title2: "OpenAM 16.1.2 Released"
description: OpenAM 16.1.2 with dependency security fixes for js-yaml, ws and websocket-driver, a revocation endpoint in the OpenID Connect discovery document, and an updated embedded OpenDJ 5.1.2
keywords: 'OpenAM, access management, SSO, release, 16.1.2, security update, CVE-2026-53550, CVE-2026-45736, CVE-2026-48779, CVE-2026-54466, CVE-2026-54490, OpenID Connect, revocation endpoint, OpenDJ 5.1.2'
imageurl: 'openam-og.png'
share-buttons: true
---
# OpenAM 16.1.2 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/16.1.2)

## What's new
* Addressed third-party dependency vulnerabilities:
    * [CVE-2026-53550](https://github.com/advisories/GHSA-h67p-54hq-rp68) - `js-yaml` quadratic-complexity DoS in merge key handling via repeated aliases
    * [CVE-2026-45736](https://github.com/advisories/GHSA-58qx-3vcg-4xpx) - `ws` uninitialized memory disclosure
    * [CVE-2026-48779](https://github.com/advisories/GHSA-96hv-2xvq-fx4p) - `ws` memory exhaustion DoS from tiny fragments and data chunks
    * [CVE-2026-54466](https://github.com/advisories/GHSA-xv26-6w52-cph6) - `websocket-driver` message corruption via abuse of protocol length headers
    * [CVE-2026-54490](https://github.com/advisories/GHSA-mp7j-qc5w-4988) - `websocket-driver` resource limit bypass via message compression
* Added `revocation_endpoint` to the OpenID Connect discovery document
* Fixed `NotCondition.equals` reflexivity and enabled the OpenFM unit tests
* Fixed non-resolvable parent POM for the `openam-mcp-server` module
* Added the `openam-samples` modules to the main reactor
* Removed the dead `jwt-generator` tool module and the obsolete `openam-test` integration test suite
* Added CodeQL code scanning and enabled Javadoc doclint on JDK 11 and JDK 26
* Updated embedded OpenDJ dependency to version 5.1.2

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenAM/compare/16.1.1...16.1.2))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<br/>
<i id="dairoca90"><i>2. <a href="https://github.com/dairoca90" target="_blank">dairoca90</a></i></i>
