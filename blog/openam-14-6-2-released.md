---
layout: home
landing-title: "OpenAM 14.6.2 Released"
landing-title2: "OpenAM 14.6.2 Released"
description: Open Identity Platform Community just released OpenAM v14.6.2
keywords: 'OpenAM, Access Management, Authentication,  SSO, Single Sign On, Open Identity Platform, Release, OAuth2, Authentication, Apache Cassandrd'
imageurl: 'openam-og.png'
---
# OpenAM 14.6.2 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/14.6.2)
## What's new

### Improvements

* Removed OpenDJ git submodule
* Changed default notification expiration time in IdRepo for JAX-RPC interface
* Updated Apache Cassandra version
* Increase Cassandra DataStore perfomance: replace secondary indexes with materialized views
* Added RS384, RS512, ES256, ES384, ES512 STS signature types
* Added allow STS claim mapping for empty+null (remove) and constants with quotes ""
* Allow use DMZ host without domain
* Allow ignore status in STS claim-maps
* WindowsDesktopSSO allow fallback from Kerberos if SUFFICIENT module in service chain
* Allowed to configure embedded cassandra path
* Improved generateSessionId perfomance (exclude search by handle)
* Improved session quota exhaustion performance: replace parallel execution with thread pool
* Migration to Apache Cassandra 4
* Added MD5 hash digest password encryption for Mysql IDP data store
* Added kid (key alias) to JWS STS tokens
* Add encryption to sensitive CTS data: SESSION_ID + SESSION_HANDLE
* Modified login check for selfService, this correct making it disapear on stage 2


### Fixes

* JWT is always considered invalid
* OpenID Connect - Wrong condition in CheckSession
* Fixed CVE-2019-10172: A flaw was found in org.codehaus.jackson:jackson-mapper-asl:1.9.x libraries


[All changes](https://github.com/OpenIdentityPlatform/OpenAM/compare/76a8030021c498b487d7d9f7644350fd7bdb74b7...367beb855c519014d908e352b29a54527e9c53fe)

## Thanks for the contributions

<i id="lscorcia"><i>1. <a href="https://github.com/lscorcia" target="_blank">Luca Leonardo Scorcia</a></i>

<i id="AndreaVida"><i>2. <a href="https://github.com/AndreaVida" target="_blank">Andrea</a></i>


