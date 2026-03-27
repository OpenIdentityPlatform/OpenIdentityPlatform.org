---
layout: home
landing-title: "OpenDJ 5.0.4 Released"
landing-title2: "OpenDJ 5.0.4 Released"
description: OpenDJ 5.0.4 with security fixes, a temp directory fallback improvement, dependency upgrades, and documentation updates
keywords: 'OpenDJ, LDAP, directory server, release, 5.0.4, security update, CVE-2025-24970, CVE-2025-12194, Netty, logback, caffeine'
imageurl: 'opendj-og.png'
share-buttons: true
---
# OpenDJ 5.0.4 Released
[Download](https://github.com/OpenIdentityPlatform/OpenDJ/releases/tag/5.0.4)

## What's new
* Addressed security vulnerabilities:
    * [CVE-2025-24970](https://nvd.nist.gov/vuln/detail/CVE-2025-24970) - Netty `SslHandler` does not correctly validate packets, which can lead to a native crash when using the native SSLEngine
    * [CVE-2025-12194](https://nvd.nist.gov/vuln/detail/CVE-2025-12194) - JVM garbage collector overrun related to the use of the disposal daemon under Java 17 and Java 21
* Added fallback to `$HOME/tmp` as a temporary directory when the instance root is mounted as `noexec`
* Migrated cache library from Guava to Caffeine 3
* Updated `commons` dependency from version 3.0.2 to 3.0.4
* Fixed short version number in the upgrade guide documentation

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenDJ/compare/5.0.3...5.0.4))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<br/>
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>
<br/>
<i id="prthakre"><i>3. <a href="https://github.com/prthakre" target="_blank">prthakre</a></i>