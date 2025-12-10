---
layout: home
landing-title: "OpenAM 16.0.4 Released"
landing-title2: "OpenAM 16.0.4 Released"
description: OpenAM 16.0.4 includes security updates, bug fixes, and dependency upgrades to address multiple CVEs and improve stability
keywords: 'OpenAM, 16.0.4, release, security update, CVE fixes, ESAPI, Jakarta, Fedlet, Rhino, LZ4, OpenDJ, identity management, access management'
imageurl: 'openam-og.png'
share-buttons: true
---
# OpenAM 16.0.4 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/16.0.4)

## What's new
* Updated ESAPI to version 2.7.0.0 with Jakarta classifier for improved security and compatibility
* Fixed Fedlet blank index page issue to restore proper functionality
* Updated OpenDJ dependency to version 5.0.2 for enhanced directory services
* Addressed critical security vulnerabilities:
  * [CVE-2025-66453](https://nvd.nist.gov/vuln/detail/CVE-2025-66453) Resolved Rhino high CPU usage and potential DoS vulnerability
  * [CVE-2025-12183](https://nvd.nist.gov/vuln/detail/CVE-2025-12183) LZ4 Java Compression has Out-of-bounds memory operations which can cause DoS
  * [CVE-2025-66566](https://nvd.nist.gov/vuln/detail/CVE-2025-66566) yawkat LZ4 Java has a possible information leak in Java safe decompressor

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenAM/compare/16.0.3...16.0.4))
 
## Thanks for the contributions
<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">vharseko</a></i>
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank"></a></i>