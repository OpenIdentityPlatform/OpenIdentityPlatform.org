---
layout: home
landing-title: "What is Single Sign-On and How does it Work"
landing-title2: "What is Single Sign-On and How does it Work"
description: "This article gives a basic understanding about Single Sign-On technology"
keywords: ''
imageurl: 'openam-og.png'
share-buttons: true
---

<h1>What is Single Sign-On and How does it Work</h1>

## Table of Contents
- [What is Single Sign-On](#what-is-single-sign-on)
- [How does Single Sign On Work](#how-does-single-sign-on-work)

## What is Single Sign-On
Single Sign-On (SSO) is a technology that allows users to authenticate into various systems using single credentials.

For example, Acme Corp uses various information systems and each system has its user database and its login processes. So, when Acme Corp hires a new employee, they should create an account for each system. To use each system, an employee should enter his credentials into each system as well. If the employee getting fired or promoted to a new position, all user accounts for the employee should also be changed. With an increasing number of employees and a number of information systems in the organization, user account management becomes more difficult and expensive.

To simplify user account management, Acme Corp starts to use the SSO system. So, when an employee authenticates the operating system, he could use his operating system account to access all other information systems. If the employee got fired or promoted or just wants to change his password, only one user account should be modified. When Acme Corp stars using new software, they just set up it to use SSO for authentication and there’s no need to create user database in this software.


## How does Single Sign On Work

When an employee tries to login into an information system, SSO checks if he already logged in in SSO. If the employee is not logged in, SSO asks the employee for authentication. After authentication, SSO creates a session for the employee and redirects him to the desired system. If the employee is authenticated in SSO, SSO provides account information to the desired system, the employee tries to access.

![Single Sing On Flowchart](/assets/img/sso/sso-flowchart.png)
