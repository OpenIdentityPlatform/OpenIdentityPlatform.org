---
layout: home
landing-title: "OpenAM 15.2.2 Released"
landing-title2: "OpenAM 15.2.2 Released"
description: Open Identity Platform Community released OpenAM 15.2.2. Critical CVE resolutions, dependency updates, documentation enhancements, and authentication module reference generation.
keywords: 'OpenAM, Release 15.2.2, Open Identity Platform, CVE, Cassandra, Netty, requirejs, documentation, OpenDJ'
imageurl: 'openam-og.png'
share-buttons: true

---
# OpenAM 15.2.2 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/15.2.2)

## What's New
* [CVE-2025-8916](https://nvd.nist.gov/vuln/detail/CVE-2025-8916) – Fixed unrestricted resource allocation (no throttling) vulnerability
* [CVE-2025-9288](https://nvd.nist.gov/vuln/detail/CVE-2025-9288) – Resolved missing type checks in `ha.js` that allowed hash reset via crafted data  
* [CVE-2025-26467](https://nvd.nist.gov/vuln/detail/CVE-2025-26467) – Prevented privilege escalation in Apache Cassandra when user holds MODIFY permissions on all keyspaces  
* [CVE-2025-5889](https://nvd.nist.gov/vuln/detail/CVE-2025-5889) – Patched Regular Expression DoS in `brace-expansion` library  
* [CVE-2024-38999](https://nvd.nist.gov/vuln/detail/CVE-2024-38999) – Mitigated prototype pollution in `requirejs v2.3.6`  
* [CVE-2025-58056](https://nvd.nist.gov/vuln/detail/CVE-2025-58056) – Fixed request smuggling in Netty due to improper chunk extension parsing 
* [CVE-2025-8662](https://nvd.nist.gov/vuln/detail/CVE-2025-8662) – Addressed tampering attack that could corrupt internal cache and break SAML IdP functionality
* Resolved JavaDoc build failure in GitHub Actions workflows
* Upgraded dependency: bumped `org.openidentityplatform.opendj` to version **4.10.2**


Full changeset: [compare 15.2.1…15.2.2](https://github.com/OpenIdentityPlatform/OpenAM/compare/15.2.1...15.2.2)

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i></i>  
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i></i>  
<i id="tsujiguchitky"><i>3. <a href="https://github.com/tsujiguchitky" target="_blank">tsujiguchitky</a></i></i>
