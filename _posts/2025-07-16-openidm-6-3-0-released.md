---
layout: home
landing-title: "OpenIDM 6.3.0 Released"
landing-title2: "OpenIDM 6.3.0 Released"
description: Open Identity Community released OpenIDM 6.3.0
keywords: 'OpenIDM, identity management, release, update, security fixes, CVE, Apache ActiveMQ, Apache Commons, Pax Web, Docker'
imageurl: 'openidm-og.png'
share-buttons: true

---
# OpenIDM 6.3.0 Released
[Download](https://github.com/OpenIdentityPlatform/OpenIDM/releases/tag/6.3.0)

## What's new
* [CVE-2019-11358](https://nvd.nist.gov/vuln/detail/CVE-2019-11358), [CVE-2020-11023](https://nvd.nist.gov/vuln/detail/CVE-2020-11023): Updated jQuery to version 3.7.1, addressing.
* [CVE-2025-27533](https://nvd.nist.gov/vuln/detail/CVE-2025-27533): Fixed unchecked buffer length in Apache ActiveMQ to prevent excessive memory allocation.
* [CVE-2025-48734](https://nvd.nist.gov/vuln/detail/CVE-2025-48734), [CVE-2020-15250](https://nvd.nist.gov/vuln/detail/CVE-2020-15250): Resolved Apache Commons improper access control vulnerabilities.
* [CVE-2025-48976](https://nvd.nist.gov/vuln/detail/CVE-2025-48976): Mitigated Apache Commons FileUpload denial of service vulnerabilities via part headers.
* [CVE-2025-48924](https://nvd.nist.gov/vuln/detail/CVE-2025-48924): Addressed uncontrolled recursion vulnerability in Apache Commons Lang when processing long inputs.
* Updated Pax Web to version 7.4.6 in preparation for Jakarta migration.
* Added root group permissions to the Docker /opt/openidm directory.
* Bumped OpenICF dependency to version 1.8.0.
* Fixed OpenAM and OpenDJ documentation links.
* Migrated deployment process from Legacy OSSRH to Central Portal.


Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenIDM/compare/6.2.5...6.3.0))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>

<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>