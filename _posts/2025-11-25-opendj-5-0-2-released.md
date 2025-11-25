---
layout: home
landing-title: "OpenDJ 5.0.2 Released"
landing-title2: "OpenDJ 5.0.2 Released"
description: OpenDJ 5.0.2 fixes installation issues, improves Windows upgrade process, and adds Docker data generation support
keywords: 'OpenDJ, LDAP, directory server, release 5.0.2, bug fixes, Docker, Windows upgrade'
imageurl: 'openam-og.png'
share-buttons: true
---
# OpenDJ 5.0.2 Released
[Download](https://github.com/OpenIdentityPlatform/OpenDJ/releases/tag/5.0.2)

## What's new
* Fixed an UnsatisfiedLinkError during installation related to bc-fips library loading from /tmp directory
* Resolved a Windows upgrade error with Upgrade.bat script that caused "unexpected" error with quotation marks
* Added `SAMPLE_DATA` environment variable for Docker deployments to automatically generate sample data during setup

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenDJ/compare/5.0.1...5.0.2))
 
## Thanks for the contributions
<i id="maximthomas"><i>1. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>
<i id="vharseko"><i>2. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<i id="muralicbe1983"><i>3. <a href="https://github.com/muralicbe1983" target="_blank">muralicbe1983</a></i>
<i id="marcdegasperi"><i>4. <a href="https://github.com/marcdegasperi" target="_blank">marcdegasperi</a></i>