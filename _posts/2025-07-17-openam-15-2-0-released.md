---
layout: home
landing-title: "OpenAM 15.2.0 Released"
landing-title2: "OpenAM 15.2.0 Released"
description: Open Identity Community released OpenAM 15.2.0
keywords: 'OpenAM, Release 15.2.0, Open Identity Platform, Security Fixes, CVE, Docker, OpenDJ'
imageurl: 'openam-og.png'
share-buttons: true

---
# OpenAM 15.2.0 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/15.2.0)

## What's new
* [CVE-2019-11358](https://nvd.nist.gov/vuln/detail/CVE-2019-11358), [CVE-2020-11023](https://nvd.nist.gov/vuln/detail/CVE-2020-11023): Updated jQuery to 3.7.1
* [CVE-2025-48976](https://nvd.nist.gov/vuln/detail/CVE-2025-48976): Fixed Apache Commons FileUpload denial of service vulnerability via part headers
* [CVE-2025-48924](https://nvd.nist.gov/vuln/detail/CVE-2025-48924): Fixed Apache Commons Lang uncontrolled recursion vulnerability caused by long inputs
* [CVE-2025-48734](https://nvd.nist.gov/vuln/detail/CVE-2025-48734): Fixed Apache Commons improper access control vulnerability 
* [CVE-2018-8039](https://nvd.nist.gov/vuln/detail/CVE-2018-8039): Fixed Apache CXF TLS hostname verification issue with com.sun.net.ssl.*
* Return Bad Request error if CORS fails
* Added root group permission to Docker $CATALINA_HOME directory
* Upgraded OpenDJ to 4.10.0
* Enhanced Docker integration tests with a separate OpenDJ instance
* Increased Chrome startup timeout to 60 seconds
* Migrated deployment from legacy OSSRH to Central Portal
* Migrated tests from fest-assert to AssertJ

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenAM/compare/15.1.6...15.2.0))

## Thanks for the contributions

<i id="FireBurn"><i>1. <a href="https://github.com/FireBurn" target="_blank">Mike Lothian</a></i>

<i id="aldaris"><i>2. <a href="https://github.com/aldaris" target="_blank">Peter Major</a></i>

<i id="vharseko"><i>3. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>

<i id="maximthomas"><i>4. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>