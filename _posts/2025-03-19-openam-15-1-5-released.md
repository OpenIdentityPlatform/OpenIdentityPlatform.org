---
layout: home
landing-title: "OpenAM 15.1.5 Released"
landing-title2: "OpenAM 15.1.5 Released"
description: Open Identity Platform Community just released OpenAM v15.1.5
keywords: 'OpenAM, Access Management, Authentication, SSO, Single Sign On, Open Identity Platform, Release, Documentation'
imageurl: 'openam-og.png'
canonical: https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/15.1.5
---
# OpenAM 15.1.5 Released

[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/15.1.5)

## What's New
 
* [CVE-2025-27497](https://github.com/advisories/GHSA-93qr-h8pr-4593): Fixed Denial of Service (DoS) issue caused by alias loop in OpenDJ.  
* [CVE-2025-26791](https://github.com/advisories/GHSA-vhxf-7vqr-mrjg): Updated `dompurify` and `swagger-ui` in `/openam-ui/openam-ui-api`.  
* Improved fail-fast behavior when updating the OpenDJ schema during OpenAM setup.  
* Added `RemoteIpValve` to the `server.xml` file in the Docker image.  
* Resolved crash issue with embedded DJ setup.  
* Fixed OAuth2 error occurring when the `Connection: close` header is used.  


[All changes](https://github.com/OpenIdentityPlatform/OpenAM/compare/15.1.4...15.1.5)

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>

<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>

<i id="YinHangCode"><i>3. <a href="https://github.com/YinHangCode" target="_blank">Mr.Yin</a></i>

<i id="AndressRod"><i>4. <a href="https://github.com/AndressRod" target="_blank">AndressRod</a></i>

