---
layout: home
title: "OpenAM QR Authentication"
landing-title2: "How QR authentication works and how to setup it in OpenAM"
description: "How QR authentication works and how to setup it in OpenAM"
keywords: 'authentication, qr'
share-buttons: true
products: 
- openam

---

# OpenAM QR Authentication Module

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-QR-Authentication-Module](https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-QR-Authentication-Module)

  - [Introduction](#introduction)
  - [Process Description](#process-description)
  - [OpenAM Configuration](#openam-configuration)
  - [Mobile Application Configuration](#mobile-application-configuration)
  - [Testing Solution](#testing-solution)

## Introduction

The most popular authentication method is also the most inconvenient. It is login and password authentication. A user must remember his login and password for each service, could forget the password, a password could be compromised, etc. The following article describes, how to login into the application in the browser on another device, if the user is already authenticated in a mobile application. The article contains step by step guide on how to set up the process in OpenAM.

## Process Description

- The user has a valid authentication session in the mobile application.
- The user opens the OpenAM authentication page.
- OpenAM generates a random code with a limited lifetime and displays it to the user as a QR code.
- User scan the QR with the mobile application
- Mobile application sends the code to OpenAM within authenticated session identifier
- Meanwhile, the browser periodically polls OpenAM to see if the code is received along with the authentication session
- If the code was received, authentication is successful and an authentication session is created.

## OpenAM Configuration

At first, we will set up OpenAM, create an authentication module instance and an authentication chain with the instance.

### Create QR Authentication Module Instance

Go to the desired realm, then on the left side of the Authentication → Modules menu. The list of modules opens. Press the Add Module button. Enter the name of the module qr and choose QR code confirm from other session module type.

![New QR module Instance](/assets/img/openam-qr/new-qr-module.png)

Press the Create button.

![New QR module Settings](/assets/img/openam-qr/qr-module-settings.png)

Set desired QR code lifetime and authentication level and press the Save Changes button.

### Create Authentication Chain

Go to **Authentication → Chains**. And create a new **qr** authentication chain. Add the created **qr** module to the chain.

![QR authentication chain Settings](/assets/img/openam-qr/qr-auth-chain.png)

## Mobile Application Configuration

Let's install and configure the mobile application. The following mobile application is only for demonstration and is not intended for production usage. But you can use application source code to build your application or modify application source code for your tasks. The application was developed with [Flutter](https://flutter.dev/)

Mobile application source code: [https://github.com/OpenIdentityPlatform/openam_demo_authenticator](https://github.com/OpenIdentityPlatform/openam_demo_authenticator)

Run the mobile application:

```bash
flutter run
```

### Mobile Application Setup

Press the Settings icon in the upper-right corner of the application and go to the settings menu. Enter OpenAM URL, realm, OpenAM username and password. Press the Back button in the upper-left corner. Settings data will be stored in the device's secure storage. 

![QR mobile application settings](/assets/img/openam-qr/qr-mobile-settings.png)

## Testing Solution

If you were logged in, log out from OpenAM. Open OpenAM URL with QR authentication chain. For example, [http://openam.example.org:8080/openam/XUI/#login/&realm=/&service=qr](http://openam.example.org:8080/openam/XUI/#login/&realm=/&service=qr) Replace [http://openam.example.org:8080/openam](http://openam.example.org:8080/openam) with your OpenAM URL. You will see a QR code that you need to scan. As well as the same code in the form of text as shown in the image below

![OpenAM QR code page](/assets/img/openam-qr/qr-code-page.png)

Open the mobile application, press the Login button. The application will authenticate in OpenAM in the specified realm with specified credentials. If authentication succeeds, you'll see the user name and first symbols of the OpenAM authentication token

![QR mobile mobile authentication successful](/assets/img/openam-qr/qr-mobile-successful.png)

Then press the "Scan QR to authenticate" button, scan the QR code and you will a message about successful authentication. Meanwhile, the browser will authenticate the scanned QR code.
If it is not possible to scan a QR code, you can enter the code manually in the "Enter a code from QR" field and press Authenticate. If you entered the code correctly, you will also be authenticated.