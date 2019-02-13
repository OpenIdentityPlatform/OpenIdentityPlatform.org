---
layout: home
landing-title: "OpenAM 14.1.14 Released"
landing-title2: "OpenAM 14.1.14 Released"
description: Open Identity Communtiy just released OpenAM v14.1.14
keywords: 'OpenAM, Access Management, Authentication, Authorization, SSO, Single Sign On, Identity Provider, Open Identity Platform, Release, OAuth2, SAML, API Authentication'
---
# OpenAM 14.1.14 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/14.1.14)
## What's new
* After authentication via OAuth2 provider, such as Facebook or Google, OpenAM updates existing user attributes from the provider.
* For ESIA OAuth2 identity provider, getting **oid** from **JWT** to if it is missing in profile info
* Update embedded OpenDJ
* Disable forward servlet on SAML request
* While authenticating via API, it is possible to receive input messages as Page Properties Callback Info Text
* While authenticating via API, Name Callback prompts its default value
* Added **NameValueOutputCallback** for API authentication
* Fixed **IdentityNotFoundException** when search after delete
* Fix other issues ([more details](https://github.com/OpenIdentityPlatform/OpenAM/compare/29b1c4246f7fccd6b98f92d56c31a8ef7b4e6a3a...78f38dc49d0e7780aabdc38d1e3a097a3c246758))
