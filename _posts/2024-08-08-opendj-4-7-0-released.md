---
layout: home
landing-title: "OpenDJ 4.7.0 Released"
landing-title2: "OpenDJ 4.7.0 Released"
description: Open Identity Community released OpenDJ v4.7.0
keywords: 'OpenDJ, Directory Service, Directory Services, LDAP, Open Identity Platform, Cassandra, Relax Rules, alias dereferencing, release'
imageurl: 'opendj-og.png'
share-buttons: true
canonical: https://github.com/OpenIdentityPlatform/OpenDJ/releases/tag/4.7.0
---
# OpenDJ 4.7.0 Released
[Download](https://github.com/OpenIdentityPlatform/OpenDJ/releases/tag/4.7.0)

## What's new
* Added LDAP [Relax Rules Control](https://tools.ietf.org/html/draft-zeilenga-ldap-relax-03) 
* Added [alias dereferencing](https://docs.oracle.com/cd/E21043_01/oid.1111/e10029/oid_alias_entries.htm) for search requests
* Added Apache Cassandra keyspace property `-Dkeyspace=ldap_opendj`

## Fixed bugs
* Fixed [RFC3671](https://datatracker.ietf.org/doc/html/rfc3671): collective attribute values should be merged. Virtuals with other virtuals and real values
* Fixed incorrect entry-Based ACIs is defined with only "deny" permission without "allow" 
* Fixed control panel schema errors in remote mode

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenDJ/compare/4.6.5...4.7.0))

## Thanks for the contibutions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>

<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>


