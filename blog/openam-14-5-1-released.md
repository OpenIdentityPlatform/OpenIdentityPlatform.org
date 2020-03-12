---
layout: home
landing-title: "OpenAM 14.5.1 Released"
landing-title2: "OpenAM 14.5.1 Released"
description: Open Identity Platform Community just released OpenAM v14.5.1
keywords: 'OpenAM, Access Management, Authentication,  Radius, SSO, Single Sign On, Open Identity Platform, Release, OAuth2, Authentication, OIDC'
imageurl: 'openam-logo.png'
---
# OpenAM 14.5.1 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/14.5.1)
## What's new

### Improvements

* Added XUI support to reCaptcha authentication Module
* Added Servlet 4+ support
* Added columns to sessions table in admin console
* Additional logging while using Windows SSO authentication module
* Removed network STS call for token verification
* Decreased maximum frequency with which the access time in the repository will be updated.
* Use the device code grant type as defined in RFC8628 <sup><a href="#lscorcia">[2]</a></sup>
* Advertise the device flow authorization endpoint in OIDC metadata <sup><a href="#lscorcia">[2]</a></sup>
* Add a validator to verify the count of lowercase letters in password fields <sup><a href="#lscorcia">[2]</a></sup>
* Allow running in Docker with a volume for configuration <sup><a href="#MartijnVdS">[4]</a></sup>
* Add logging gz compression and change default suffix to `-MM.dd.yy-kk.mm.gz`
* Add "status" claim in JWT token
* Significant performance improvements

### Fixes

* Fixed ForgeRock AM/OpenAM Security Advisory 201801-03 <sup><a href="#openam-jp">[1]</a></sup>
* Fixed [CVE-2019-17495](https://github.com/advisories/GHSA-c427-hjc3-wrfw) vulnerability
* OAuth consent page ignores Accept-Language <sup><a href="#openam-jp">[1]</a></sup>
* If the state parameter is passed to the logout handler, it should be returned to the RP <sup><a href="#lscorcia">[2]</a></sup>
* When nonce is not returned in the id_token when using stateless tokens and request_type=code <sup><a href="#lscorcia">[2]</a></sup>
* The OIDC device flow RFC says the parameter should be called verification_uri <sup><a href="#lscorcia">[2]</a></sup>
* OIDC Device Flow does not work when implicit consent is allowed <sup><a href="#lscorcia">[2]</a></sup>
* Fixed user search by realm
* SAML2 module only works when it's the first item in chain <sup><a href="#lscorcia">[2]</a></sup>
* Fix create-realm via cli <sup><a href="#ryancogswell">[3]</a></sup>
* Correctly retrieve username from the ssoToken  <sup><a href="#lscorcia">[2]</a></sup>

[All changes](https://github.com/OpenIdentityPlatform/OpenAM/compare/8528a5936479c2c56155910d8de597c2f9369317...944c26c6cdcafd96ac903b3a0bc9e2c7980888d7)

## Thanks for the contibutions

<i id="openam-jp"><i>1. <a href="https://github.com/openam-jp" target="_blank">https://github.com/openam-jp</a></i>

<i id="lscorcia"><i>2. <a href="https://github.com/lscorcia" target="_blank">Luca Leonardo Scorcia</a></i>

<i id="ryancogswell"><i>3. <a href="https://github.com/ryancogswell" target="_blank">Ryan Cogswell</a></i>

<i id="MartijnVdS"><i>4. <a href="https://github.com/MartijnVdS" target="_blank">Martijn van de Streek</a></i>
