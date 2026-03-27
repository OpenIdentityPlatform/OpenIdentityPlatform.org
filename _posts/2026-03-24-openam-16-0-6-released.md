---
layout: home
landing-title: "OpenAM 16.0.6 Released"
landing-title2: "OpenAM 16.0.6 Released"
description: OpenAM 16.0.6 with critical security fixes including a pre-authentication RCE vulnerability patch, denial-of-service fixes, and a SameSite cookie attribute improvement
keywords: 'OpenAM, access management, SSO, release, 16.0.6, security update, CVE-2026-2391, CVE-2026-32141, CVE-2026-33228, CVE-2026-33439, RCE, deserialization, SameSite cookie'
imageurl: 'openam-og.png'
share-buttons: true
---
# OpenAM 16.0.6 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/16.0.6)

## What's new
* Addressed security vulnerabilities:
    * [CVE-2026-2391](https://nvd.nist.gov/vuln/detail/CVE-2026-2391) - `qs` library `arrayLimit` bypass in comma parsing allows denial of service
    * [CVE-2026-32141](https://nvd.nist.gov/vuln/detail/CVE-2026-32141) - `flatted` library vulnerable to unbounded recursion denial of service in `parse()`
    * [CVE-2026-33228](https://nvd.nist.gov/vuln/detail/CVE-2026-33228) - Prototype pollution via `parse()` in Node.js `flatted` library
    * [CVE-2026-33439](https://nvd.nist.gov/vuln/detail/CVE-2026-33439) - Pre-authentication remote code execution via `jato.clientSession` deserialization in OpenAM
* Fixed inability to set the `SameSite` cookie attribute in XUI
* Updated embedded OpenDJ dependency to version 5.0.4

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenAM/compare/16.0.5...16.0.6))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<br/>
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>
<br/>
<i id="IvanAndrukh"><i>3. <a href="https://github.com/IvanAndrukh" target="_blank">IvanAndrukh</a></i>
<br/>
<i id="iamnoooob"><i>4. <a href="https://github.com/iamnoooob" target="_blank">iamnoooob</a></i>
<br/>
<i id="hacktronai-research"><i>5. <a href="https://github.com/hacktronai-research" target="_blank">hacktronai-research</a></i>