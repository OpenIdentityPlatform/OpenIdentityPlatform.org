---
layout: home
title: "How To Setup Active Directory Authenticaion In OpenAM"
landing-title2: "How To Setup Active Directory Authenticaion In OpenAM"
description: "How to use Active Directory as a user data source and use for authentication"
keywords: ''
imageurl: 'openam-og.png'
share-buttons: true
---
<h1>How To Setup Active Directory Authenticaion In OpenAM</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-To-Setup-Active-Directory-Authenticaion-In-OpenAM](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-To-Setup-Active-Directory-Authenticaion-In-OpenAM)

## Preface

If your organization uses Microsoft Active Directory for user storage, it is a good practice to use Active Directory user accounts to authenticate in all your enterprise applications. OpenAM supports Microsoft Active Directory 

But setting up Microsoft Active Directory as a user data store could be tricky. In this article, we'll help you to set up user data store in OpenAM

## Setup Active Directory User Data Store

Enterprise users should be in a separate realm. 

---

**NOTE**

*Of course, you can use an existing realm or even use different data stores in a single realm in OpenAM. But in this manual, we will create a separate realm and a sigle data store for employees*

---

So login in OpenAM console as amadmin and create realm `/staff`. Delete default user Data Store in `/staff` realm.

Then create Active Directory data store with type Active Directory.

There are the most important settings in a table below:

| Setting | Value|
|-|-|
|**Ldap Server**| AD host and port, for example: ad.example.com:389 |
|**LDAP Bind DN** | Bund DN or user name for AD, for example `EXAMPLE\Administrator` |
|**LDAP Bind Password** | Bind DN password|
|**LDAP Organization DN** | DN where users are located DC=ad,DC=example,DC=com|
|**LDAP Connection Pool Maximum Size** | 128|
|**Attribute Name Mapping** | uid=sAMAccountName <br> userPassword=unicodePwd|
|**LDAPv3 Plug-in Supported Types and Operations** | user=read <br> group=read <br> realm=read |
|**LDAP Users Search Attribute:** | sAMAccountName |
|**LDAP Users Search Filter** | (objectclass=person)|
|**DN Cache** | Enabled |


## Test Data Store and Authentication

If you set all settings correctly, you should see user account form your active directory, in Subjects tab in the realm.

Then test authentication:
Open OpenAM URL in your browser, for example

For XUI:

[http://openam.example.org:8080/openam/XUI/?org=/staff#login/](http://openam.example.org:8080/openam/XUI/?org=/staff#login/)

For legacy UI:

[http://openam.example.org:8080/openam/UI/Login?org=/staff](http://openam.example.org:8080/openam/UI/Login?org=/staff)

Enter your Active Directory credentials, and you should be successfully authenticated

