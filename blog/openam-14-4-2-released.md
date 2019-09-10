---
layout: home
landing-title: "OpenAM 14.4.2 Released"
landing-title2: "OpenAM 14.4.2 Released"
description: Open Identity Platform Community just released OpenAM v14.4.1
keywords: 'OpenAM, Access Management, Authentication,  Radius, SSO, Single Sign On, Open Identity Platform, Release, OAuth2, Authentication, OIDC'
---
# OpenAM 14.4.2 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/14.4.2)
## What's new

* Prevented errors when getting group DN while using multiple Data Stores in Realm

* Ability to authenticate without initiating authentication process for any authentication chain, not only default

* Enable `openam-auth-radius` module to be extended and do additional parsing and validation of the radius response packet (namely Access-Accept packet).
The changes are introducing a new protected method 'readAttributesFromResponsePacket(Packet response)' that is called after successful authentication against the RADIUS server.
The method by default is a no-op.
In an extension class the developer can override the method and either read and store attributes or throw an AuthLoginException if login failure should result from additional parsing.

* Updated Apache Santuario XML for java to prevent CVE-2019-12400 security issue

* Implemented special filter for KBA(Knowledge based authentication) which ensures that
only users with an SSO Token which has Administrator-level access or the
owner of the resource are allowed to access the resources protected. <sup><a href="#openam-jp">[1]</a></sup>

* Use request locale for authentication error messages <sup><a href="#openam-jp">[1]</a></sup>

* Added OAuth2 endpoint validation to prevent user redirection to a phishing site <sup><a href="#openam-jp">[1]</a></sup>

* Prevented deleting authentication module instances of the same type. <sup><a href="#openam-jp">[1]</a></sup>

* Fixed error that user remains on 'Loading' page if using 'OAuth2.0/OIDC' auth module and authId token expires<sup><a href="#openam-jp">[1]</a></sup>

* Fixed error when JWKS endpoint returns extra null byte in modulus

* Fixed bad link for OAuth 2.0 in Realm > Applications menu

* Updated `How to Run After Build` chapter in README.md

* Enabled maven caching while build in Travis CI

* Fixed other issues ([more details](https://github.com/OpenIdentityPlatform/OpenAM/compare/99f1ea7129b4e91ba9caab0abcae9bb2f96813ca...8528a5936479c2c56155910d8de597c2f9369317))

## References

<i id="openam-jp">1. Thanks to <a href="https://github.com/openam-jp" target="_blank">https://github.com/openam-jp</a> community for these changes</i>
