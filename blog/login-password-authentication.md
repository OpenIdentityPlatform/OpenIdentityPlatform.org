---
layout: home
landing-title: "Login and Password Authenticaion"
landing-title2: "Login and Password Authenticaion"
description: "Login and password authentication, implementation, tips and hints, advantages and disadvantages"
keywords: 'Login, password, authentication, basics'
imageurl: ''
---

- [Login and Password Authentication](#login-and-password-authentication)
- [Introduction](#introduction)
- [Implementation](#implementation)
  * [Password Hashing](#password-hashing)
  * [Database Authentication](#database-authentication)
  * [Implementation Tips](#implementation-tips)
- [Pros and Cons](#pros-and-cons)
- [Conclusion](#conclusion)

# Login and Password Authentication

# Introduction

The following article is intended for newbies, who want to develop authentication for their services. In the article, we will look at the most common authentication method - login and password authentication, its implementation, advantages, and disadvantages.

**Authentication** is an identity verification process. For software, authentication is used for verifying the identities of users or client applications. The most common way to authenticate users is login and password authentication.

User login could be public but the password should be only in the user's memory (and not on a piece of paper under the keyboard or taped to the monitor!) and used for verification than login belongs to the only user who knows the password.

# Implementation

User identity data usually stored in a user database. And the only authentication system should have access to the database to minimize the risk of credentials leak.

Login in user database stored in plaintext to quick search for the user account. Password should be stored as its hash and never in plaintext. During authentication, the hash of the password entered by the user is calculated, compared with the value stored in the database and, if the values match, authentication is successful.

## Password Hashing

To store a password in a database relatively secure, not the password itself is stored in the database, but password hash. The hash is calculated by the formula: `password_hash = hash(password)`. To slow-down dictionary password attack, it is necessary to add so-called **salt** to password. **Salt** - is a random value, stored within the password hash. And password hash is calculated with function from password itself and hash `password_hash = hash(password, salt)`. More information about salt in Wikipedia:  [Salt_(cryptography)](https://en.wikipedia.org/wiki/Salt_(cryptography)).

## Database Authentication

Some databases support internal authentication. In this case, the database itself is responsible for login and password authentication. Authentication service sends authentication request with login and password to the database, and the database returns authentication result: whether it is successful or not. For example, such an approach uses Microsoft Active Directory.

## Implementation Tips

- If authentication was failed, do not tell users whether login exists or not
- Implement user account lock policy to prevent possible password brute force
- Use strong hashing function for example `[bcrypt](https://en.wikipedia.org/wiki/Bcrypt)`, `[scrypt](https://en.wikipedia.org/wiki/Scrypt)`  or `[PBKDF2](https://en.wikipedia.org/wiki/PBKDF2)`to prevent hash passwords reverse engineering in case user credentials database was stolen
- Use salt when hashing a password

# Pros and Cons

Pros:

- relatively simple implementation

Cons:

- the need for users to remember a password for each service.
- the need to implement additional service to recover/change password
- the security policy of some organizations requires periodic password changes, which impairs user experience
- the password could be stolen using fishing or social engineering

# Conclusion

Login and password authentication is the most common way to authenticate users, but it is also one of the most insecure, so it is recommended to use authentication without a password (login through social networks, biometrics, use of hardware security keys), or strengthen security by using the second authentication factor.
