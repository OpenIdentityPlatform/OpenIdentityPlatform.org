---
layout: home
landing-title: "OpenDJ 4.8.1 Released"
landing-title2: "OpenDJ 4.8.1 Released"
description: Open Identity Community released OpenDJ v4.8.1
keywords: 'OpenDJ, Directory Service, Directory Services, LDAP, Open Identity Platform, release'
imageurl: 'opendj-og.png'
share-buttons: true

---
# OpenDJ 4.8.1 Released
[Download](https://github.com/OpenIdentityPlatform/OpenDJ/releases/tag/4.8.1)

## What's new
* Added JDK 23 support
* Migrated documentation to the AciiDoc format and deploy docs to Antora
* Changed default SSL HandshakeTimeout to 10s 
* Changed "Object class violation (65)" to "Naming violation (64)" LDAP result code for DIT Structure Rule violation 
* Docker: Use tail instead of sleep to allow the container to be stopped with SIGTERM 
* Added maven.compiler.release=8 for cross compile compatibility
* Workaround: Entry is invalid according to the server schema because there is no DIT structure rule that applies to that entry, but there is a DIT structure rule for the parent entry

## Fixed bugs
* Fixed DIT SUP delimeter
* Root DSE missing objectClass additions
* Fixed delete entries bug in overlapping backends


Full chageset ([more details](https://github.com/OpenIdentityPlatform/OpenDJ/compare/4.8.0...4.8.1))

## Thanks for the contibutions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>

<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>

<i id="JesseCoretta"><i>3. <a href="https://github.com/JesseCoretta" target="_blank">Jesse Coretta</a></i>

<i id="PyRowMan"><i>4. <a href="https://github.com/PyRowMan" target="_blank">PyRowMan</a></i>



