---
layout: home
landing-title: "OpenIG 6.0.1 Released"
landing-title2: "OpenIG 6.0.1 Released"
description: Major update with JakartaEE 9 migration, JDK 25 LTS support, and critical security fixes
keywords: 'OpenIG, Identity Gateway, release, JakartaEE 9, JDK 25, security updates, CVE fixes'
imageurl: 'openig-og.png'
share-buttons: true
---
# OpenIG 6.0.1 Released
[Download](https://github.com/OpenIdentityPlatform/OpenIG/releases/tag/6.0.1)

## What's new
* Updated target JDK to 11 and migrated to JakartaEE 9
* Added support for LTS JDK 25
* Updated base Docker image Java version to 25 LTS
* Updated OpenAM to 16.0.3
* Addressed critical security vulnerabilities:
  * [CVE-2024-38999](https://nvd.nist.gov/vuln/detail/CVE-2024-38999): Prototype pollution vulnerability in requirejs v2.3.6
  * [CVE-2025-58457](https://nvd.nist.gov/vuln/detail/CVE-2025-58457): Apache ZooKeeper: Insufficient Permission Check in AdminServer Snapshot/Restore Commands

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenIG/compare/5.4.0...6.0.1))

## Thanks for the contributions

<i id="maximthomas"><i>1. <a href="https://github.com/maximthomas" target="_blank">maximthomas</a></i>
<i id="vharseko"><i>2. <a href="https://github.com/vharseko" target="_blank">vharseko</a></i>