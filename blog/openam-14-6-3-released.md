---
layout: home
landing-title: "OpenAM 14.6.3 Released"
landing-title2: "OpenAM 14.6.3 Released"
description: Open Identity Platform Community just released OpenAM v14.6.3
keywords: 'OpenAM, Access Management, Authentication, SSO, Single Sign On, Open Identity Platform, Release, OAuth2, Authentication, Apache Cassandra'
imageurl: 'openam-og.png'
---
# OpenAM 14.6.3 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/14.6.3)
## What's new

### Improvements

* OpenID Connect checkSession endpoint
* Updating base docker image to latest 8.5.x tomcat
* Apache Cassandra user datastore improvements
* Apache Cassandra token datastore improvements
* Add same site cookie settings
* Make possible auth chain manipulation at a runtime
* Add QR auth module XUI template
* Significant performance improvements

### Fixes

* Apache Cassandra user datastore: fix escape materialized view name
* Apache Cassandrda: fix error with index (replace "-" -> "_")
* fix guice module CoreTokenServiceGuiceModule errors 
* CVE-2021-29156 ForgeRock OpenAM allows LDAP injection via the Webfinger protocol. For example, an unauthenticated attacker can perform character-by-character retrieval


[All changes](https://github.com/OpenIdentityPlatform/OpenAM/compare/b23cc71b518781356da7098424c958374227902a...7529aa91ad0aca109b916758e91d5fecacd18b07)

## Thanks for the contributions

<i id="lscorcia"><i>1. <a href="https://github.com/lscorcia" target="_blank">Luca Leonardo Scorcia</a></i>

<i id="aaronhagopian"><i>2. <a href="https://github.com/aaronhagopian" target="_blank">Aaron Hagopian</a></i>

<i id="aaronhagopian"><i>3. <a href="https://github.com/bagnos" target="_blank">bagnos</a></i>

