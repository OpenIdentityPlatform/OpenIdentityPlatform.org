---
layout: home
landing-title: "OpenDJ 4.10.0 Released"
landing-title2: "OpenDJ 4.10.0 Released"
description: Open Identity Community released OpenDJ 4.10.0
keywords: 'OpenDJ, LDAP, Directory Server, Identity, Open Identity, Open Source, Security, LDAP Transactions'
imageurl: 'opendj-og.png'
share-buttons: true

---
# OpenDJ 4.10.0 Released
[Download](https://github.com/OpenIdentityPlatform/OpenDJ/releases/tag/4.10.0)

## What's new
* Added support for LDAP transactions as per RFC 5805 to improve atomicity and data consistency.
* Updated core dependencies including RxJava 3.x, BouncyCastle FIPS 2.1.x, and OpenIdentityPlatform Commons 2.4.0 for enhanced stability and security.
* Improved OSGi bundle handling by excluding conflicting packages such as BouncyCastle and RxJava3 imports.
* Migrated deployment from OSSRH to Central Portal to streamline release management.

## Fixed bugs
* Patched security vulnerability CVE-2025-49146 preventing fallback to insecure authentication with channelBinding=require.
* Fixed makeldif templates by adding missing objectClass attribute to baseDN to improve import/export reliability.

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenDJ/compare/4.9.4...4.10.0))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>

<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>

<i id="prthakre"><i>3. <a href="https://github.com/prthakre" target="_blank">Prashant</a></i>





