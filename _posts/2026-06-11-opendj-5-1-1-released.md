---
layout: home
landing-title: "OpenDJ 5.1.1 Released"
landing-title2: "OpenDJ 5.1.1 Released"
description: OpenDJ 5.1.1 addresses critical security vulnerabilities including CVE-2026-46495 RCE via JMX RMI and CVE-2026-42198 CPU exhaustion DoS, plus performance improvements and bug fixes
keywords: 'OpenDJ, LDAP, directory server, release 5.1.1, security update, CVE-2026-46495, CVE-2026-42198, JMX RMI, Bouncy Castle FIPS'
imageurl: 'opendj-og.png'
share-buttons: true
---
# OpenDJ 5.1.1 Released
[Download](https://github.com/OpenIdentityPlatform/OpenDJ/releases/tag/5.1.1)

## What's new
* Addressed critical security vulnerabilities:
    * [CVE-2026-46495](https://nvd.nist.gov/vuln/detail/CVE-2026-46495) - OpenDJ Unauthenticated RCE via Java Deserialization in JMX RMI
    * [CVE-2026-42198](https://nvd.nist.gov/vuln/detail/CVE-2026-42198) - pgjdbc: Unbounded PBKDF2 iterations in SCRAM authentication allows CPU exhaustion DoS
* Fixed slow `DN.valueOf` / `AVA` normalization for nested DN-syntax values
* Bumped Bouncy Castle FIPS dependencies to latest 2.1.x patch releases
* Added native access JVM flag for Bouncy Castle FIPS on newer Java releases
* Docker base DN entry creation opt-in and improved bootstrap LDIF loading resilience
* Updated org.openidentityplatform.commons to 3.1.1
* Fixed JMX RMI connector startup failure introduced by CVE-2026-46495 hardening

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenDJ/compare/5.1.0...5.1.1))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<br/>
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>
<br/>
<i id="anvo1115"><i>3. <a href="https://github.com/anvo1115" target="_blank">anvo1115</a></i>
<br/>
<i id="wodzen"><i>4. <a href="https://github.com/wodzen" target="_blank">wodzen</a></i></i>
