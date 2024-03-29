---
layout: home
landing-title: "How to Setup WebAuthn Authentication in OpenAM"
landing-title2: "How to Setup WebAuthn Authentication and Registration in OpenAM"
description: "How to Setup WebAuthn Authentication in OpenAM"
keywords: 'WebAuthn, Authentication, Registration, Login, OpenAM, Access Management, Authentication, Authorization, Single Sign On,  Open Identity Platform'
share-buttons: true
---

# How to Setup WebAuthn Authentication in OpenAM

[Original article](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Setup-WebAuthn-Authentication-in-OpenAM)

## Table of Contents

- [Introduction](#introduction)
  * [Notes](#notes)
- [Setting up Authentication modules](#setting-up-authentication-modules)
  * [Setup WebAuthn Registration Module](#setup-webauthn-registration-module)
  * [Setup WebAutn Registration Authentication Chain](#setup-webautn-registration-authentication-chain)
  * [Testing WebAutn Registration Authentication Chain](#testing-webautn-registration-authentication-chain)
- [Setup WebAuth Authentication Module](#setup-webauth-authentication-module)
  * [Setup WebAutn Authentication Chain](#setup-webautn-authentication-chain)
  * [Testing WebAutn Authentication Chain](#testing-webautn-authentication-chain)

## Introduction

[WebAuthn](https://en.wikipedia.org/wiki/WebAuthn) is
[W3C](https://www.w3.org/) and [FIDO](https://fidoalliance.org/) standart
that describes Web public key authentication.
For authentication client can use Hardware USB, Bluetooth or NFC tokens,
or mobile biometric authentication, such as fingerprint or FaceID.
WebAuthn is much harder to compromise comparing, for example, password authentication,
because 3d party software will never gain access to the private key.

WebAuthn browser support:
* Google Chrome.
* Mozilla Firefox.
* Microsoft Edge.
* Apple Safari.
* Opera.

More info about WebAutn browser support:
[https://caniuse.com/#search=webauthn](https://caniuse.com/#search=webauthn)

The latest W3C WebAuthn Standart:
[https://w3c.github.io/webauthn/](https://w3c.github.io/webauthn/)

### Notes

**WebAuthn works only for localhost hostname or for SSL connection**

For local development and testing you can use U2F emulators:
* For Linux: U2F emulator written in Rust [https://github.com/danstiner/rust-u2f](https://github.com/danstiner/rust-u2f)
* For Mac: U2F Emulator by GitHub [https://github.com/github/SoftU2F](https://github.com/danstiner/rust-u2f)


## Setting up Authentication modules

For example there is a **/clients** realm in OpenAM that need to be protected with WebAuthn authentication.

### Setup WebAuthn Registration Module

In OpenAM console, navigate to **/clients** realm and create new WebAuthn Registration Authentication module:
![OpenAM Create WebAuthn Registration Authentication Module](/assets/img/webauthn/webauthn-registration-new.png){:class="col-md-6 d-block"}

Setup required settings:

![OpenAM  WebAuthn Registration Authentication Module Settings](/assets/img/webauthn/webauthn-registration-settings.png){:class="col-md-6 d-block"}

| Setting | Description |
|--------|-------------|
|**Attestation Type**| [Attestation Conveyance Preference](https://w3c.github.io/webauthn/#attestation-conveyance). Indicates, wether attestation required by server or not. Possible values are: {::nomarkdown}<ul><li><b>direct</b> - attestation, generated by authenticator required by server</li><li><b>idirect</b> - allows client to decide wether attestation is required</li><li><b>none</b> - server does not care about attestation</li></ul>{:/}
|**Authenticator Type**|[Authenticator Attachment Enumeration](https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-authenticatorselection) - specifies authenticator type. Wether it could be platform specific, such as TouchID, or removable, such as USB Token. Possible values are: {::nomarkdown}<ul><li><b>cross-platform</b> - removable authenticator</li><li><b>platform</b> - platform specific authenticator</li><li><b>unspecified</b> - any authenticator type </li></ul>{:/} |
|**Auth Level**| Modlue Authentication Level|
|**Timeout**| WebAuthn registratation timeout in milliseconds|
|**User attribute to store Public Keys**| User indetity attribiute to store authentication data|

### Setup WebAutn Registration Authentication Chain

Create new authentication chain **webauthn-regustration**
![OpenAM  WebAuthn Registration Authentication Chain](/assets/img/webauthn/webauthn-registration-authchain.png){:class="col-md-6 d-block"}

### Testing WebAutn Registration Authentication Chain

Try to login using registration authentication chain and register public key for the user account. Open in browser url https://[host]:[port]/openam/UI/Login?org=/clients&service=webauthn-registration
 (change host and port to yours).

![OpenAM  WebAuthn Registration User Name](/assets/img/webauthn/webauthn-registration-username.png){:class="col-md-6 d-block"}

Enter User Name and then click Log In button

![OpenAM  WebAuthn Registration USB Key](/assets/img/webauthn/webauthn-registration-key.png){:class="col-md-6 d-block"}

Insert USB Token if you have not done it before. Registration successful.

## Setup WebAuth Authentication Module

In OpenAM console, navigate to **/clients** realm and create new WebAuthn Authentication module:

![OpenAM Create WebAuthn Registration Authentication Module](/assets/img/webauthn/webauthn-authentication-new.png){:class="col-md-6 d-block"}

Setup required settings:

![OpenAM  WebAuthn Authentication Module Settings](/assets/img/webauthn/webauthn-authentication-settings.png){:class="col-md-6 d-block"}

| Setting | Description |
|--------|-------------|
|**Auth Level**| Modlue Authentication Level|
|**Timeout**| WebAuthn authentication timeout in milliseconds|
|**User attribute to retrieve Public Keys**| User indetity attribiute to retrieve authentication data|

### Setup WebAutn Authentication Chain
Create new authentication chain **webauthn-authentication**
![OpenAM  WebAuthn Authentication Chain](/assets/img/webauthn/webauthn-authentication-authchain.png){:class="col-md-6 d-block"}

### Testing WebAutn Authentication Chain

Try to login using  authentication chain and login using registered public key for the user account. Open in browser url https://[host]:[port]/openam/UI/Login?org=/clients&service=webauthn-authentication, (change host and port to yours).

![OpenAM  WebAuthn Authentication User Name](/assets/img/webauthn/webauthn-authentication-username.png){:class="col-md-6 d-block"}

Enter User Name and then click Log In button

![OpenAM  WebAuthn Authentication USB Key](/assets/img/webauthn/webauthn-registration-key.png){:class="col-md-6 d-block"}

Insert USB Token if you have not done it before. Authentication successful.
