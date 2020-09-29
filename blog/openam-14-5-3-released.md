---
layout: home
landing-title: "OpenAM 14.5.3 Released"
landing-title2: "OpenAM 14.5.3 Released"
description: Open Identity Platform Community just released OpenAM v14.5.3
keywords: 'OpenAM, Access Management, Authentication,  Radius, SSO, Single Sign On, Open Identity Platform, Release, OAuth2, Authentication, OIDC, QR, reCaptcha'
imageurl: 'openam-og.png'
---
# OpenAM 14.5.3 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/14.5.3)
## What's new

### Improvements

* QR code authentication module
* Restore the Persistent Cookie module functionality by returning to the exception-based flow control
* Style the ReCaptcha component in the main .less file
* Define a new server property to tell HttpClient classes to use the system proxy
* ADD STS `auth:token:encrypt` for restore SID from JWT
* Save query string parameters in Self Service verification emails
* Add validator for minimum special character count for XUI
* Improve OAuth2 RFC compatibility

### Fixes

* Disable kill and restore session when ForceAuth us Enabled
* If an old session is null do not upgrade the session and create a new one


[All changes](https://github.com/OpenIdentityPlatform/OpenAM/compare/944c26c6cdcafd96ac903b3a0bc9e2c7980888d7...76a8030021c498b487d7d9f7644350fd7bdb74b7)

## Thanks for the contributions

<i id="lscorcia"><i>1. <a href="https://github.com/lscorcia" target="_blank">Luca Leonardo Scorcia</a></i>
<i id="pmolchanov2002"><i>2. <a href="https://github.com/pmolchanov2002" target="_blank">Pavel Molchanov</a></i>
