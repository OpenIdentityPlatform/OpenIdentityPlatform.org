---
layout: home
title: "Passwordless Authentication Methods, their Pros, and Cons"
landing-title2: "Passwordless Authentication Methods, their Pros, and Cons"
description: "In the following article we cover basic passwordless authentication method, their use cases, cons and pros"
keywords: 'passwordless, 2FA, kerberos'
share-buttons: true
---

- [Intro](#intro)
- [Passwordless Authenticaion Methods](#passwordless-authenticaion-methods)
  * [One-time Authentication Link Sent to the E-mail](#one-time-authentication-link-sent-to-the-e-mail)
  * [One-time password via SMS or Push](#one-time-password-via-sms-or-push)
  * [HMAC and Time-based one-time password](#hmac-and-time-based-one-time-password)
  * [Persistent Cookie](#persistent-cookie)
  * [Using third-party Identity Provides (via Social Networks)](#using-third-party-identity-provides--via-social-networks-)
  * [USB Token Device](#usb-token-device)
  * [Mobile Phone Biometrics](#mobile-phone-biometrics)
- [Conclusion](#conclusion)

# Intro
Nowadays, people use more and more different online services in everyday life, and each service requires authentication. So, for each service, you need to remember your username and password. And, even the login for each service can be the same (for example, the email), then the password must be unique for each service. It is much better to have a complex password, i.e: have a length of 8 characters and more, contain uppercase and lowercase letters, numbers, and special characters.

Of course, it is impossible to remember the complex password for each service, so users either use simple passwords or use the same password for each service. Some users even write their own passwords on a piece of paper and put it under the keyboard (sic!). Of course, it compromises user accounts.

Passwordless authentication could solve this problem. In the following article, I will try to consider main passwordless authentication methods, as well as their advantages and disadvantages.

There are the following passwordless authentication methods:

* One-time link sent to the e-mail
* One-time password sent by SMS or Push-notification
* HOTP and TOTP (HMAC and Time-based one-time password)
* Persistent Cookie
* Third-party Identity provider (for example, log in via Facebook or via Google)
* USB token device
* Mobile application with biometric authentication.

# Passwordless Authenticaion Methods

## One-time Authentication Link Sent to the E-mail

During authentication, the user enters his email, the service generates a one-time link and sends it to the specified email. Then the user must open the mail application, receive an email from the service, and follow the link.

Pros:
* Low cost - sending e-mail is almost free

Cons:
* The need for the user to open an additional email client application
* If the attacker has access to the user's e-mail, then authentication can be compromised.
* There is a risk of receiving an email with a phishing link to enter a malicious resource

## One-time password via SMS or Push
The most widely used passwordless authentication method. During authentication, the user enters his phone number, then he receives an SMS or pushes notification with a one-time confirmation code, which has a limited validity period. The user enters the received one-time code in the service and authenticates.

Pros:
* Relative reliability - to fake a SIM card or steal a phone seems to be a rather non-trivial task for an attacker. In addition, the mobile phone can determine the location of the attacker.

Cons:
* Users must manually enter the code from an SMS, every time they authenticate, which can be annoying.
* For receiving a push notification users should install a mobile application.

## HMAC and Time-based one-time password
HMAC-based one-time password (HOTP) is generating a one-time password algorithm based on authentication attempts and a shared secret between user server and client. A time-based one-time password - is an improvement of HOTP and generates passwords based on system time. These algorithms generate passwords on both a server and a client each time user authenticates the system.

Pros:
* You can use third-party trusted software to implement this algorithm (for example Google authenticator)

Cons:
* For TOTP there is a need to synchronize time between server and client
* The shared secret can be stolen and attackers can generate their own TOTP values to authenticate

## Persistent Cookie

One of the simplest and widely used way to authenticate without a password. After authentication, a special cookie is set in the user's browser, which is then used to authenticate the user.

Pros:
* Further authentications do not require entering any data from the user

Cons:
* Works on a single device (browser)
* If an attacker steals an users cookie, he could gain access to the user's account
* The cookie should expire. When the cookie expires, the user should authenticate again.

## Using third-party Identity Provides (via Social Networks)
During authentication, the user is prompted to authenticate using an existing account of a third-party Identity Provider (Google, Facebook, LinkedIn)

Pros:
* Very easy to use, if the user has already authenticated to the identity provider.

Cons:
* If the user lost his Identity Provider account, access to the service can also be lost.
* Users may not have profiles in the Identity Providers list supported by the service.

## USB Token Device
Users can be authenticated using a USB token device. There is a cryptographic key, that uniquely identifies the device holder.

Pros:
* High security - it is almost not possible to forge the token

Cons:
* The user need to carry an extra device
* Sometimes, there is a need to install special software to authenticate
* The token device can be lost or stolen

## Mobile Phone Biometrics
While authenticating, the user receives notifications on his mobile phone application, asking for confirmation via fingerprint, face recognition, and so on.

Pros:
* High security, because mobile phone manufacturers are focusing on mobile phone security and protecting them from unauthorized access.
* Almost everyone has a mobile phone

Cons:
* User need to install and setup additional application on his phone

# Conclusion
All of the methods above have advantages and disadvantages. But for better user experience, is the usage of a combination of several methods. For example, to provide the ability to authenticate using OAuth or OpenID and a saved cookie. Also, a promising and secure approach is authentication using mobile phone biometrics, such as fingerprint or face recognition authentication.
