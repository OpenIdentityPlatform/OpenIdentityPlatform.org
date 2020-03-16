---
layout: home
title: "How OpenAM Works Simple Explanation"
landing-title2: "How OpenAM Works Simple Explanation"
description: "This article explains how OpenAM and its ecosystem works in a very simple way"
keywords: ''
imageurl: 'openam-og.png'
share-buttons: true
---

<h1>How <a href="https://github.com/OpenIdentityPlatform/OpenAM">OpenAM</a> Works Simple Explanation</h1>

## Table of Contents
- [Introduction](#introduction)
- [OpenAM Ecosystem](#openam-ecosystem)
  * [Components](#components)
  * [Scheme](#scheme)
- [How Resource Protection Works](#how-resource-protection-works)
- [How User Authentication Works](#how-user-authentication-works)
- [Conclusion](#conclusion)

## Introduction
It’s not obvious to understand how to setup Access Management and (Single Sign On) SSO with OpenAM at glance. There’s an explanation of how OpenAM SSO and authentication works in the article below.

## OpenAM Ecosystem

There are several components in the Open Identity Platform in addition to OpenAM to setup Access Management system.
### Components
#### OpenAM
The core component of the authentication management system. It is responsible for the authentication process, user management, session, and access policy management.

#### Configuration DataStore
Stores OpenAM configuration data - general settings, realms, authentication modules and so on. For storage, its configuration data OpenAM uses OpenDJ - open source directory server, the part of Open Identity Platform.

#### Web Agent
It could be a web server plugin or a standalone web application. Web agent works as PEP (Policy Enforcement Point). Web server plugin should be installed on the server, which process requests to protected resources. Web Agent decides whether an authenticated user could access to a certain resource or not.

Open Identity Platform provides Web Agent as a standalone web application - OpenIG and some web server plugins - for Microsoft Internet Information Services, Apache Tomcat, and Apache HTTP Server.

#### User Data Store
Storage for the different kinds of identities, which OpenAM uses for authentication. By default, OpenAM uses OpenDJ as a user data store, but also could use Microsoft Active Directory, or any LDAP compatible server. OpenAM also supports any relational database via JDBC and Cassandra as a user data store.

#### Session Data Store
Persistent storage for session information. If OpenAM restarts or a request switch to another instance of OpenAM, then session information could be restored from the session data store.
### Scheme
Simple OpenAM scheme shown on the picture below.

![OpenAM Scheme](/assets/img/openam-simple/openam-scheme.png)

## How Resource Protection Works
User tries to access a protected resource, Web Agent asks OpenAM whether user request satisfies the security policy or not.

If the request satisfies policy OpenAM returns session to Web Agent. Web Agent enriches the user request with session data and forwards request to the protected resource and proxies protected server response back to the user.

If the user is not authenticated or the user session violates a policy, Web Agent redirects the user to authentication to the OpenAM server for authentication or additional authorization.

The process is shown on the image below:

![OpenAM Scheme](/assets/img/openam-simple/openam-protected-access.png)

## How User Authentication Works
While authentication OpenAM asks the user to provide his credentials. OpenAM checks if the user exists User Data Store and validates credentials.

If provided credentials are valid, OpenAM creates a new authenticated session in the Session Data Store and enriches the session with user data and authentication process details.

If credentials are invalid, OpenAM denies authentication.

After successful authentication, the user is redirected to the protected resource.
This process is shown in the diagram below.

![OpenAM Scheme](/assets/img/openam-simple/openam-authentication.png)

## Conclusion
Of course, this document does not fully cover all OpenAM functionality as Federation Authentication, adaptive authentication, how to organize high availability and many more other functionalities. Its purpose just is just to make a more familiar and basic understanding of how OpenAM works.
