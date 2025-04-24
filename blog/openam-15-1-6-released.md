---
layout: home
landing-title: "OpenAM 15.1.6 Released"
landing-title2: "OpenAM 15.1.6 Released"
description: Open Identity Platform Community just released OpenAM v15.1.6. Stability improvements, authentication enhancements, and Docker optimizations.
keywords: 'OpenAM, Access Management, Authentication, SSO, Single Sign On, Open Identity Platform, Release, Documentation'
imageurl: 'openam-og.png'
canonical: https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/15.1.6
---
# OpenAM 15.1.6 Released

[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/15.1.6)

## What's New
 
* Fixed OAuth2 error when using `Connection: close` header.  
* Improved fail-fast behavior when updating OpenDJ schema during OpenAM setup.  
* Added `RemoteIpValve` to the `server.xml` file in the Docker image.  
* Resolved crash issue with embedded DJ setup.  
* Fixed denial-of-service vulnerability using alias loop.  
* Updated dependencies for better compatibility.  

[All changes](https://github.com/OpenIdentityPlatform/OpenAM/compare/15.1.5...15.1.6)

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>

<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>