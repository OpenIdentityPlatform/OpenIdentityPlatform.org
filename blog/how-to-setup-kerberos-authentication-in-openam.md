---
layout: home
title: "How to Setup Kerberos Authentication with OpenAM"
landing-title2: "How to Setup Kerberos Authentication with OpenAM"
description: "This article explains how to setup Kerberos authentication with OpenAM"
keywords: ''
imageurl: 'openam-og.png'
share-buttons: true
---
<h1>How to Setup Kerberos Authentication with OpenAM</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Setup-Kerberos-Authentication-with-OpenAM](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-setup-Kerberos-Authentication-with-OpenAM)

# Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Windows setup](#windows-setup)
- [OpenAM Configuration](#openam-configuration)
  * [Create a realm](#create-a-realm)
  * [Setup Authentication Module](#setup-authentication-module)
  * [Setup Authentication Chain](#setup-authentication-chain)
- [Test Solution](#test-solution)

# Introduction
There are several ways how enterprise users can authenticate in enterprise applications. If there are many enterprise applications users should authenticate into each application and enter login and password. Even applications use the same user account, it is painful to enter credentials every time. A solution is to use a single sign (SSO) technology. For Windows user it is Kerberos. With Kerberos, users could authenticate to web applications seamlessly using their Active Directory accounts.

# Prerequisites
You have Windows Server and users in the Active directory. Also, you have installed OpenAM.

# Windows setup
Create an account for Kerberos authentication in the Active Directory. When creating an account, set checkboxes “User cannot change password” и “Password never expires enabled” as shown in the picture below.

![Kerberos Account Settings](/assets/img/openam-kerberos/kerberos-account.png)

In user account properties in Account tab in Account Options enable checkbox “This account supports Kerberos AES-256 bit encryption”

On the domain controller create keytab file openamKerberos.keytab in a current directory. To do this, execute the following command in the Windows terminal:

```
ktpass -out openamKerberos.keytab -princ HTTP/openam.example.com@AD.EXAMPLE.COM -pass +rndPass -maxPass 256 -mapuser openamKerberos -crypto AES256-SHA1 -ptype KRB5_NT_PRINCIPAL
```

In this command in `-princ` parameter openam.example.com - is your OpenAM hostname and EXAMPLE.COM - your Active Directory domain name, should be uppercase.

Copy openamKerberos.keytab file to a directory, where OpenAM could read the file.

On your firewall open network access form OpenAM to TCP/UDP ad.example.com:88

Check keytab file on OpenAM machine:

```
$ klist -k -t openamKerberos.keytab
Keytab name: FILE:openamKerberos.keytab
KVNO Timestamp Principal
---- ------------------- ------------------------------------------------------
0 01.01.1970 03:00:00 HTTP/openam.example.com@AD.EXAMPLE.COM
```

# OpenAM Configuration
## Create a realm
Create, if you did not before, a separate realm for your active directory user, for example, `/staff`

Go to the realm and create an Active Directory User Datastore. If all settings are correct, Active Directory users should appear in the “Subjects” tab in `/staff` realm. More detailed info provided in the article https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-To-Setup-Active-Directory-Authenticaion-In-OpenAM

## Setup Authentication Module
In `/staff` realm go to the Authentication tab and create a new authentication module with Windows Desktop SSO type.

![SSO Kerberos New Authentication Module](/assets/img/openam-kerberos/sso-module-new.png)

Edit created `sso` authentication module settings.

Set service principal, as set in `ktpass` command. Keytab file name should be `openamKerberos.keytab` file location on the OpenAM server. Set Kerberos Realm,  Kerberos Server Name, and Trusted Kerberos realms according to your settings.

![SSO Serveros Authentication Module Settings](/assets/img/openam-kerberos/sso-module-settings.png)

## Setup Authentication Chain
Create an Authentication chain sso with the new module as shown on a picture below and save it.

![SSO Serveros Authentication Module Settings](/assets/img/openam-kerberos/sso-auth-chain.png)

# Test Solution
On a Windows machine, authenticate with your Active Directory account and go to `http://openam.example.com:8080/openam/XUI/#login/&realm=/staff&service=sso` for XUI or `http://openam.example.com:8080/openam/UI/Login?org=/staff&service=sso` for legacy UI.

You should be seamlessly authenticated with an Active Directory account without prompting credentials.
