---
layout: home
landing-title: "OpenIDM 7.0.1 Released"
landing-title2: "OpenIDM 7.0.1 Released"
description: Major update with JakartaEE 10 migration, Java 17+ support, Java 25 LTS compatibility, and critical security fixes
keywords: 'OpenIDM, Identity Management, 7.0.1, JakartaEE 10, Java 17, Java 25 LTS, CVE-2024-38999, security, OpenICF 2.0.1, Pax Web 11'
imageurl: 'openam-og.png'
share-buttons: true
---
# OpenIDM 7.0.1 Released
[Download](https://github.com/OpenIdentityPlatform/OpenIDM/releases/tag/7.0.1)

## What's new
* Updated target JDK to 17 and migrated to JakartaEE 10 with Pax Web 11 for enhanced performance and modern Java compatibility
* Added support for LTS JDK 25, ensuring long-term stability and security
* Updated base Docker image to Java version 25 LTS for optimized containerized deployments
* Updated OpenICF dependency to version 2.0.1 with latest improvements
* Addressed security vulnerabilities:
    * [CVE-2024-38999](https://nvd.nist.gov/vuln/detail/CVE-2024-38999): Prototype pollution vulnerability in requirejs v2.3.6

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenIDM/compare/6.3.0...7.0.1))
 
## Thanks for the contributions
<i id="maximthomas"><i>1. <a href="https://github.com/maximthomas" target="_blank">maximthomas</a></i></i>
<i id="vharseko"><i>2. <a href="https://github.com/vharseko" target="_blank">vharseko</a></i></i>