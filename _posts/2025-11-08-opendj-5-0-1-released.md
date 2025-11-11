---
layout: home
landing-title: "OpenDJ 5.0.1 Released"
landing-title2: "OpenDJ 5.0.1 Released"
description: OpenDJ 5.0.1 introduces Java 11 support, Jakarta EE 9 migration, critical security fixes for CVEs in dependencies
keywords: 'OpenDJ, LDAP server, directory services, security fixes, Java 11, Jakarta EE, CVE fixes'
imageurl: 'openam-og.png'
share-buttons: true
---

# OpenDJ 5.0.1 Released
[Download](https://github.com/OpenIdentityPlatform/OpenDJ/releases/tag/5.0.1)

## What's new
* Updated target JDK to 11 and migrated to Jakarta EE 9 for modern platform compatibility 
* Migrated from sun.security.x509 to Bouncy Castle API for improved security portability
* Fixed unavailable monitoring attributes over JMX for better observability 
* Improved ReplicationDomainTest stability to enhance testing reliability 
* Addressed critical security vulnerabilities in dependencies:
  * [CVE-2025-12194](https://nvd.nist.gov/vuln/detail/CVE-2025-12194): Updated Bouncy Castle to fix uncontrolled resource consumption
  * [CVE-2025-59250](https://nvd.nist.gov/vuln/detail/CVE-2025-59250): Updated JDBC Driver for SQL Server to resolve improper input validation
  * [CVE-2025-11226](https://nvd.nist.gov/vuln/detail/CVE-2025-11226): Updated logback-core to mitigate arbitrary code execution through file processing

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenDJ/compare/4.10.2...5.0.1))

## Thanks for the contributions

<i id="maximthomas"><i>1. <a href="https://github.com/maximthomas" target="_blank">maximthomas</a></i>

<i id="vharseko"><i>2. <a href="https://github.com/vharseko" target="_blank">vharseko</a></i>
