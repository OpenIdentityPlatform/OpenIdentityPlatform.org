---
layout: home
title: "How to Setup 2FA with Google Authenticator in OpenAM"
landing-title2: "How to Setup 2FA with Google Authenticator in OpenAM"
description: "How to setup Google Authenticator as two-factor authentication (2FA) in OpenAM"
keywords: 'google authenticator, authentication, OTP, HOTP, 2FA'
imageurl: 'openam-og.png'
share-buttons: true
products: 
- openam
---
<h1>How to Setup 2FA with Google Authenticator in OpenAM</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Setup-2FA-with-Google-Authenticator-in-OpenAM](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Setup-2FA-with-Google-Authenticator-in-OpenAM)


- [Introduction](#introduction)
- [OpenAM Setup](#openam-setup)
  * [Setup Authentication Module](#setup-authentication-module)
  * [Setup Authentication Chain](#setup-authentication-chain)
  * [Setup User Accounts](#setup-user-accounts)
- [Test Solution](#test-solution)

# Introduction
Google Authenticator is one of the most commonly used applications for two-factor authentication (2FA). It runs both on Android and iOS devices.  In the following article, we will describe how to set up 2FA in OpenAM with Google Authenticator.

# OpenAM Setup
## Setup Authentication Module
For example, we have realm `staff` where we want to set up 2FA with Google Authenticator. Login into admin console as `amadmin` user, go to realm `staff`, and create new `OATH` module `google-authenticator` with the following settings:

![New Google Authenticator Module](/assets/img/google-authenticator/new-google-authenticator-module.png)

![Google Authenticator Module Settings](/assets/img/google-authenticator/google-authenticator-module-settings.png)

There are some important settings:
* **One Time Password Length**: Should be 6 as in Google Authenticator by default
* **Secret Key Attribute Name**: User attribute in where a secret key is stored.
* **OATH Algorithm to Use**: For Google Authenticator should be [TOTP](https://tools.ietf.org/html/rfc6238)
* **Last Login Time Attribute**: User attribute, where users last login time in UNIX format is stored.

* **Maximum Allowed Clock Drift**: Should be greater than TOTP time steps, so in the following example it is 3.

## Setup Authentication Chain
By default, there is `ldapService` authentication chain, which uses only `DataStore` authentication module. Add `google-authenticator` module in the chain.

![Authentication Chain](/assets/img/google-authenticator/authentication-chain.png)

## Setup User Accounts
The next part would be a little bit tricky. To authenticate in Google Authenticator we need to set up user accounts first. Then generate for each user account shared secret. As an example, we will take `test` account and for this account shared secret will be `s3cr3tw0rd`.

Encode into Base16. You can or use online service [https://simplycalc.com/base16-encode.php](https://simplycalc.com/base16-encode.php) either use the following Java function:

```java
private String toBase16(String str) {
  return String.format("%x", new BigInteger(1, str.getBytes(Charset.defaultCharset())));
}
```
Base16 encoded value is `73336372337477307264`.

Open User account properties in Apache Directory Studio (or any other LDAP client application) and add `sunIdentityServerPPEncryptKey` value `73336372337477307264` as shown on the picture below.

![Apache DS User Properties](/assets/img/google-authenticator/apache-ds-user-properties.png)

Then generate a QR code to register the user in the Google Authenticator application. QR for Google Authenticator is URI in the following format `otpauth://totp/<account id>@<issuer>?secret=<base32 encoded secret>&issuer=<Issuer Name>`

Encode secret as Base32. You can use or online service [https://simplycalc.com/base32-encode.php](https://simplycalc.com/base32-encode.php), ether following Java function:

```java
import org.apache.commons.codec.binary.Base32;

private String toBase32(String str) {
	return new Base32().encodeAsString(str.getBytes());
}
```
Base32 encoded value is `OMZWG4RTOR3TA4TE`

The final URI will be:
`otpauth://totp/test@openam.openidentityplatform.org?secret=OMZWG4RTOR3TA4TE&issuer=Open+Identity+Platform`

Let's use the online service [https://www.the-qrcode-generator.com](https://www.the-qrcode-generator.com) to generate a QR code image:

![Google Authenticator QR Code](/assets/img/google-authenticator/qr-code.png)

Scan QR in Google Authenticator application. A new account will be added.

# Test Solution
Let’s sign in into realm `staff` с with `test` account:
![Auth Staff Login Password](/assets/img/google-authenticator/auth-staff-login-password.png)
You will be prompted for OTP from Google Authenticator.

![Auth Staff OTP 2FA](/assets/img/google-authenticator/login-staff-otp.png)

Enter the code from Google Authenticator, and you will be successfully authenticated.
