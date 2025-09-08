---
layout: home
landing-title: "OpenDJ 4.10.2 Released"
landing-title2: "OpenDJ 4.10.2 Released"
description: Open Identity Platform Community released OpenDJ v4.10.2. Security fixes, performance enhancements, UI improvements, and updated documentation.
keywords: 'OpenDJ, Directory Service, LDAP, Open Identity Platform, release, performance, security, update'
imageurl: 'opendj-og.png'
share-buttons: true

---
# OpenDJ 4.10.2 Released
[Download](https://github.com/OpenIdentityPlatform/OpenDJ/releases/tag/4.10.2)

## What's New
* [CVE‑2025‑9092](https://nvd.nist.gov/vuln/detail/CVE‑2025‑9092), [CVE‑2025‑9340](https://nvd.nist.gov/vuln/detail/CVE‑2025‑9340), [CVE‑2025‑9341](https://nvd.nist.gov/vuln/detail/CVE‑2025‑9341) Fixed **Uncontrolled Resource Consumption** vulnerabilities.
* Improved `GroupManager` write-lock performance to enhance concurrency and throughput.
* Fixed the `OnDiskMergeImporter::PhaseOneWriteableTransaction` to properly handle updates when `put` operations involve referral attributes.
* Introduced a `requires-admin-action` flag, prompting component restart when `max-request-size` is changed—ensuring configuration consistency.
* Bumped `commons.version` to **2.4.1** to align dependencies with latest stability standards :contentReference[oaicite:7]{index=7}.

Full changeset: [compare 4.10.1…4.10.2] (https://github.com/OpenIdentityPlatform/OpenDJ/compare/4.10.1...4.10.2)

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i></i>  
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i></i>
