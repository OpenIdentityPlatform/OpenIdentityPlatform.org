---
layout: home
landing-title: "OpenAM 16.0.3 Released"
landing-title2: "OpenAM 16.0.3 Released"
description: OpenAM 16.0.3 updates the target JDK to 11 and JakartaEE 9, adds support for LTS JDK 25, updates the base Docker image to Java 25, addresses multiple security vulnerabilities
keywords: 'OpenAM release, access management, identity platform, security fixes, JDK 25 support, Java 11, Jakarta EE, CVE fixes, OpenAM Docker image'
imageurl: 'openam-og.png'
share-buttons: true
---

# OpenAM 16.0.3 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/16.0.3)

## What's new
* Update target JDK to 11 and move to JakartaEE 9
* Add support LTS JDK 25
* Update base docker image Java version to 25 LTS
* Fix OAuth2 issues: Restore 'none' token endpoint auth method. Do not add default openid scope if non-empty
* Update OpenDJ to 5.0.1
* Addressed critical security vulnerabilities:
  * [CVE-2023-45133](https://nvd.nist.gov/vuln/detail/CVE-2023-45133): Babel vulnerable to arbitrary code execution when compiling specifically crafted malicious code
  * [CVE-2024-53382](https://nvd.nist.gov/vuln/detail/CVE-2024-53382): PrismJS DOM Clobbering vulnerability (update swagger-ui) 
  * [CVE-2025-64099](https://nvd.nist.gov/vuln/detail/CVE-2025-64099): Using arbitrary OIDC requested claims values in id_token and user_info is allowed

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenAM/compare/15.2.2...16.0.3))

## Thanks for the contributions

<i id="maximthomas"><i>1. <a href="https://github.com/maximthomas" target="_blank">maximthomas</a></i>

<i id="vharseko"><i>2. <a href="https://github.com/vharseko" target="_blank">vharseko</a></i>