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
# Introduction
There are several ways how enterprise users can authenticate in enterprise applications. If there are many enterprise applications users should authenticate into each application and enter login and password. Even if applications use the same user account, it is painful to enter credentials every time. A solution is to use a single sign (SSO) technology. For Windows users it is Kerberos. With Kerberos, users could authenticate to web applications seamlessly using their Active Directory accounts.

# Prerequisites
You have Windows Server and user accounts stored in the Active directory. You must also have OpenAM installed. Here is how to [quickly install OpenAM](https://github.com/OpenIdentityPlatform/OpenAM/wiki/TIP:-Quick-OpenAM-Docker-Configuration-From-a-Command-Line).

# Windows setup
Create an account for Kerberos authentication in the Active Directory. When creating an account, set checkboxes `User cannot change password` и `Password never expires enabled` as shown in the picture below.

![Kerberos Account Settings](/assets/img/openam-kerberos/kerberos-account.png)

In user account properties in the Account tab in Account Options enable the checkbox `This account supports Kerberos AES-256 bit encryption`.

On the domain controller create a keytab file openamKerberos.keytab in a current directory. To do this, execute the following command in the Windows terminal:

```PowerShell
ktpass -out openamKerberos.keytab -princ HTTP/openam.example.com@AD.EXAMPLE.COM -pass +rndPass -maxPass 256 -mapuser openamKerberos -crypto AES256-SHA1 -ptype KRB5_NT_PRINCIPAL
```

In this command in `-princ` parameter openam.example.com - is your OpenAM hostname and EXAMPLE.COM - your Active Directory domain name should be uppercase.

Copy openamKerberos.keytab file to a directory, where OpenAM can read the file.

On your firewall open network access from OpenAM to TCP/UDP ad.example.com:88

Check keytab file on OpenAM machine:

```bash
$ klist -k -t openamKerberos.keytab
Keytab name: FILE:openamKerberos.keytab
KVNO Timestamp Principal
---- ------------------- ------------------------------------------------------
0 01.01.1970 03:00:00 HTTP/openam.example.com@AD.EXAMPLE.COM
```

# OpenAM Configuration

## Setup Authentication Module
Go to the OpenAM administrator console at 
http://openam.example.org:8080/openam/XUI/#login/
In the login field enter the value `amadmin`, in the password field enter the value from the `ADMIN_PWD` parameter of the setup command, in this case, `passw0rd`.

Select the root realm and select Authentication → Modules from the menu. Create a new Active Directory authentication module.

Edit the created `sso` authentication module settings.

Set `Service Principal`, as in `ktpass` command. `Keytab File Name` should be `openamKerberos.keytab` file location on the OpenAM server. Set `Kerberos Realm`,  `Kerberos Server Name`, and `Trusted Kerberos realms` according to your environment.

![SSO Kerberos New Authentication Module](/assets/img/openam-kerberos/1-kerberos-module.png)

## Setup Authentication Chain
Go to the admin console, select the root realm, and select Authentication → Chains from the menu. Create an `sso` authentication chain with the recently created `sso` module.

![SSO Kerberos Authentication Chain Settings](/assets/img/openam-kerberos/2-kerberos-chain.png)

## Realm Configuration

Go to Authentication → Chains for realm and on the User Profile tab, set the `User Profile` setting to `Ignore`.

![OpenAM Realm User Profile Settings](/assets/img/openam-kerberos/3-openam-realm-auth-settings.png)

So, you can authenticate with Kerberos without setting up Active Directory as a User Data Store in OpenAM.

# Test Solution
On a Windows machine, authenticate with your Active Directory account and go to [http://openam.example.com:8080/openam/XUI/#login/&realm=/&service=sso](http://openam.example.com:8080/openam/XUI/#login/&realm=/&service=sso)

You should be seamlessly authenticated with an Active Directory account without prompting credentials.


