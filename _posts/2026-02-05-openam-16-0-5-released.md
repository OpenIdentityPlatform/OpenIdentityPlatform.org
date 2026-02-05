---
layout: home
landing-title: "OpenAM 16.0.5 Released"
landing-title2: "OpenAM 16.0.5 Released"
description: OpenAM 16.0.5 with critical security updates and dependency improvements
keywords: 'OpenAM, access management, SSO, release, 16.0.5, security update, CVE-2025-67735, CVE-2025-15284, CVE-2025-13465'
imageurl: 'openam-og.png'
share-buttons: true
---
# OpenAM 16.0.5 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/16.0.5)

## What's new
* Set explicit xmlsec dependency for openam-federation-library
* Updated JSTL to Jakarta 2.0.0 version
* Updated OpenDJ to 5.0.3
* Addressed critical security vulnerabilities:
  * [CVE-2025-67735](https://nvd.nist.gov/vuln/detail/CVE-2025-67735) - Netty CRLF Injection vulnerability in io.netty.handler.codec.http.HttpRequestEncoder
  * [CVE-2025-15284](https://nvd.nist.gov/vuln/detail/CVE-2025-15284) - qs's arrayLimit bypass in bracket notation that allows DoS via memory exhaustion
  * [CVE-2025-13465](https://nvd.nist.gov/vuln/detail/CVE-2025-13465) - Lodash Prototype Pollution vulnerability in `_.unset` and `_.omit` functions (versions 4.0.0 through 4.17.22)


Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenAM/compare/16.0.4...16.0.5))

## Thanks for the contributions
<i id="FireBurn"><i>1. <a href="https://github.com/FireBurn" target="_blank">Mike Lothian</a></i>

<i id="igieon"><i>2. <a href="https://github.com/igieon" target="_blank">David Ignjić</a></i>

<i id="vharseko"><i>3. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>

<i id="maximthomas"><i>4. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>