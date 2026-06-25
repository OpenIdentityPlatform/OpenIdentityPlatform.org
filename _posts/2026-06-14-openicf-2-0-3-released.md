---
layout: home
landing-title: "OpenICF 2.0.3 Released"
landing-title2: "OpenICF 2.0.3 Released"
description: OpenICF 2.0.3 addresses critical security vulnerabilities including CVE-2025-67030, CVE-2026-0636, CVE-2024-7254, replaces Nashorn with Rhino, and updates OpenDJ to 5.1.1
keywords: 'OpenICF, Identity Connector Framework, 2.0.3, security update, CVE-2025-67030, CVE-2026-0636, CVE-2024-7254, Nashorn, Rhino, OpenDJ 5.1.1'
share-buttons: true
---
# OpenICF 2.0.3 Released
[Download](https://github.com/OpenIdentityPlatform/OpenICF/releases/tag/2.0.3)

## What's new
* Addressed critical security vulnerabilities:
    * [CVE-2025-67030](https://nvd.nist.gov/vuln/detail/CVE-2025-67030) - Plexus-Utils Directory Traversal vulnerability in extractFile method
    * [CVE-2026-0636](https://nvd.nist.gov/vuln/detail/CVE-2026-0636) - Bouncy Castle LDAP injection
    * [CVE-2024-7254](https://nvd.nist.gov/vuln/detail/CVE-2024-7254) - Unbounded recursion when parsing deeply nested SGROUP tags causes stack overflow DoS
* Replace Nashorn with Rhino as JavaScript engine fallback
* Update OpenDJ dependency to version 5.1.1

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenICF/compare/2.0.2...2.0.3))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<br/>
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i></i>
