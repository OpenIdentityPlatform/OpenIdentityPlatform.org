---
layout: home
landing-title: "Using Microsoft Authenticator with OpenAM"
landing-title2: "Using Microsoft Authenticator with OpenAM"
description: Step-by-step guide to implementing two-factor authentication (2FA) in OpenAM using Microsoft Authenticator and TOTP.
keywords: 'OpenAM, two-factor authentication, 2FA, TOTP, Microsoft Authenticator, access control, OpenAM configuration, authentication module, OATH, multi-factor authentication, secure login, identity management, Open Identity Platform, device registration, authentication chain'
imageurl: 'openam-og.png'
share-buttons: true

---
# Using Microsoft Authenticator with OpenAM

This article is intended for technical specialists or security system architects who want to implement two-factor authentication (2FA) in an access control system to enhance the security of user accounts.

Adding a second factor makes it significantly more difficult for attackers to compromise accounts.

## Stack Used

**OpenAM** is an open-source access management system. It is designed for centralized management of authentication, authorization, and user accounts.

**Microsoft Authenticator** is a mobile application designed to be used as an additional authentication factor. It supports push notifications, one-time passwords (TOTP), and biometric authentication.

In this article, we will deploy OpenAM, configure modules and authentication chains for use with Microsoft Authenticator, and show you how to add a second factor authentication for a user.

We will use authentication with one-time passwords generated using the TOTP (time-based one-time password) protocol. Such passwords do not need to be sent to the client device via SMS or PUSH notifications. These passwords are generated using a specific cryptographic algorithm directly on the device.

## Installing OpenAM

If you do not have OpenAM installed yet, you can deploy a Docker container as described in the [OpenAM wiki article](https://github.com/OpenIdentityPlatform/OpenAM/wiki/TIP%3A-Quick-OpenAM-Docker-Configuration-From-a-Command-Line)

## Configuring OpenAM

We will configure the module and authentication chain.

The authentication module in OpenAM is responsible for a specific authentication method. This can be authentication with a username and password, via the Kerberos protocol, or using biometrics.
Modules can be organized into chains. This allows you to build chains of modules to authenticate users in multiple stages or using different methods. For example, if seamless authentication via the Kerberos protocol fails, you can ask the user for their login and password.

### **Configuring the TOTP Authentication Module**

Open the administrator console at [http://openam.example.org:8080/openam/console](http://openam.example.org:8080/openam/console)

In the login field, enter `amadmin`. In the password field, enter the administrator password specified during installation.

Open the root realm, select Authentication → Modules in the left menu, and click the `Add Module` button. In the form that appears, enter the module name, for example `totp`, and the module type - `Authenticator (OATH)`. Click the `Create` button.

![OpenAM new TOTP module](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/ms-authenticator/0-openam-new-totp-module.png)

Set the `OATH Algorithm to Use` setting to `TOTP`, enter any non-empty value in the `Name of the Issuer` field, for example `OpenAM`, and click `Save Changes`.

![OpenAM TOTP module settings](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/ms-authenticator/1-openam-totp-module-settings.png)

### **Configuring the Device Registration Chain**

The registration chain is required so that authenticated users can add a second authentication factor using Microsoft Authenticator.

In the administrator console, in the realm settings in the left menu, select Authentication → Chains and click the `Add Chain` button in the list that opens.

Enter the chain name `totp-register` and click the `Create` button.

In the chain settings, click the `Add a Module` button and add the created `totp` authentication module as shown in the figure. Click the `OK` button and then `Save Changes`.

![OpenAM TOTP registration chain](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/ms-authenticator/2-openam-totp-registration-chain.png)

### **Configuring the Authentication Chain**

In this chain, we will configure authentication so that after authenticating with a username and password, the user is required to enter a one-time password from the Microsoft Authenticator mobile app.

In the administrator console, in the realm settings in the left menu, select Authentication → Chains and click the `Add Chain` button in the list that opens.

Enter the chain name `totp-login` and click the `Create` button. First, add the `DataStore` login and password authentication module. Then add the `totp` one-time code authentication module.

Click `Save Changes`.

![OpenAM TOTP authentication chain](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/ms-authenticator/3-openam-totp-authentication-chain.png)

## Setting up Microsoft Authenticator.

Download the [Microsoft Authenticator](https://www.microsoft.com/en/security/mobile-authenticator-app) app from the appropriate app store for your device.

### Registering a Device

Sign in to the console with a test user account. To do this, eiter sign out of the administrator console or open your browser in incognito mode. Go to the URL [http://openam.example.org:8080/openam/XUI/#login/](http://openam.example.org:8080/openam/XUI/#login/) and log in to OpenAM with the `demo` account. The default password is `changeit`. 

After successful authentication, open the device registration chain link in your browser. [http://openam.example.org:8080/openam/XUI/#login&service=totp-register](http://openam.example.org:8080/openam/XUI/#login&service=totp-register).

![OpenAM register a device](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/ms-authenticator/4-openam-register-device.png)

Open the Microsoft Authenticator app and tap `Add account` button.

![Microsoft Authenticator Add account](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/ms-authenticator/5-ms-authenticator-add-account.png)

Select `Other account`

![Microsoft Authenticator Other account](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/ms-authenticator/6-ms-authenticator-other-account.png)

You will be prompted to scan a QR code. Scan the QR code displayed in the OpenAM browser window. After scanning, the OpenAM account will be added to the Microsoft Authenticator app. 

![Microsoft Authenticator Account List](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/ms-authenticator/7-ms-authenticator-account-list.png)

Locate the newly added account. A one-time password will be displayed.

![Microsoft Authenticator One-Time Password](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/ms-authenticator/8-ms-authenticator-otp.png)

In your browser, click the `Login Using Verification Code` button.

Enter the one-time password from the mobile app and click the `Submit` button.
