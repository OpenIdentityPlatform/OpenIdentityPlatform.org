---
layout: home
title: "Single Sign-On with OpenAM and OpenIG: Practical Implementation Examples"
landing-title2: "Single Sign-On with OpenAM and OpenIG: Practical Implementation Examples"
description: "This article gives a basic understanding about Single Sign-On technology"
keywords: 'Single Sign-On, SSO, seamless authentication, enterprise authentication, client services authentication,SSO implementation, Kerberos protocol, authorization gateway, centralized access management, user experience, authentication security, corporate applications, digital services security'
share-buttons: true
products: 
- openam
- openig
---

<h1>Single Sign-On with OpenAM and OpenIG: Practical Implementation Examples</h1>

## Introduction

Single Sign-On or SSO is a technology that allows users to access different applications with the same credentiasl using a single authentication service.

This approach improves not only user experience but also security, as credential management, access policies, authentication processes and monitoring are centralized.

In this article, we will review the main approaches to SSO implementation using the examples of open source solutions [OpenAM](http://github.com/OpenIdentityPlatform/OpenAM) and [OpenIG](https://github.com/OpenIdentityPlatform/OpenIG).

## Multiple Services on a Single Domain

Consider a company with customer or partner services on the same domain. For example, a bank and a marketplace on the `example.org` domain.

The SSO architecture is shown in the diagram below:

![OpenAM and OpenIG SSO Diagram](/assets/img/sso/sso-web.png)

In the diagram, OpenAM acts as the authentication service, OpenIG acts as the authorization gateway.

The authentication process using SSO for a user:

- The user attempts to access the banking application.
- The OpenIG gateway recognises that the user is not yet authenticated, so redirects them to the OpenAM authentication server.
- OpenAM authenticates the user:
    - The user enters their credentials into OpenAM. These can be a username and password, SMS login, or biometric data (e.g., fingerprint).
    - OpenAM creates a user session and sets the session ID in a cookie in the top-level domain, in this case, `example.org`.
    - After successful authentication, OpenAM redirects the user back to the banking application.
- OpenIG retrieves the user's session ID from the cookie. Using this identifier OpenIG retrieves the user's session data from OpenAM, verifies that it is valid and grants access to the banking application.
- Now the user tries to access the marketplace.
- OpenIG again retrieves the user's session ID from the cookie. Since the marketplace and the banking application are on the same top-level domain, OpenIG has access to that domain's cookie.
- If the session is still valid, OpenIG provides access to the Marketplace without requesting credentials

## Using Enterprise SSO with Kerberos

Let's consider an enterprise whose employees working in a Windows Server domain. Windows built-in authentication using the [Kerberos](https://en.wikipedia.org/wiki/Kerberos_(protocol)) protocol that is used to access enterprise services.

The system architecture is as follows:

![OpenAM and OpenIG Kerberos SSO Diagram](/assets/img/sso/sso-kerberos.png)

The process is similar to the example above. The difference is that OpenAM contacts the Kerberos Key Distribution Center (KDC) to authenticate users.

The authentication process from a technical point of view:

- The user is pre-authenticated in the domain
- The user attempts to access an enterprise application located behind the OpenIG gateway.
- OpenIG sees that the user is not authenticated and redirects them to OpenAM for authentication.
- OpenAM requests a Kerberos token from the browser.
- OpenAM authenticates the token with the Kerberos Key Distribution Center (KDC) and retrieves the user's account information.
- Once authenticated, OpenAM creates an authenticated session for the user, sets the session ID in a cookie to the `internal` domain, and redirects the user to the desired application.
- OpenIG retrieves the session ID from the cookie, authenticates the session, and passes the user's request to the application.

From a technical point of view, the process looks quite complex, but for the user it is as simple as possible: he simply opens the desired application in the browser and immediately gets access without any additional actions.

## Federated SSO

In above examples, all services were located on the same domain. So how do you solve the problem when the services are on different domains? For instance, a supermarket chain has partnered with a grocery delivery company and wants to use their customers accounts to make deliveries.

Federated SSO is the right solution for this case.

It is a technology that allows services on different domains to use a trusted authentication service. 

This approach is implemented using the federated protocols [SAML](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language), [OAuth2](https://en.wikipedia.org/wiki/OAuth), or [OpenID Connect](https://en.wikipedia.org/wiki/OpenID#OpenID_Connect_(OIDC)). Despite the differences in implementation, these protocols accomplish one task, which is to use a trusted Identity Provider for authentication.

The federation consists of two entities, the Identity Provider (IdP) and the Service Provider (SP). The IdP and SP are aware of each other and trust each other. 

The architecture of the federate is as follows:

![Federated SSO Diagram](/assets/img/sso/sso-federation.png)

OpenAM acts as an Identity Provider and the application acts as a Service Provider.

OpenAM can act as either a Service Provider or an Identity Provider. However, it is generally used as an Identity Provider.

Authentication when using federated SSO generally looks like this, regardless of the protocol used:

- The user attempts to authenticate with the SP.
- The SP redirects the user to the IdP for authentication.
- The IdP authenticates the user.
- On successful authentication, the IdP redirects the user back to the SP.
    - When redirected to the SP, the IdP transmits authenticated session data or a random identifier to retrieve the session data.
- Based on the received data, the Service Provider creates an authentication session and, if necessary, creates a local account.
- After successful authentication, the user starts working with the Service Provider.

## Conclusion

In this article we covered only the most basic ways of Single Sign-On implementation. In practice, they can be combined. For example, Kerberos authentication can be used in OpenAM for federated access to an external application via the SAML protocol. 

Single Sign-On technology provides a convenient and secure way to control access to different services, whether they are sites on the same domain, corporate applications or services on different domains. Using solutions such as OpenAM and OpenIG, you can flexibly configure authentication and authorization processes, adapting them to specific business objectives. Implementing SSO not only simplifies user interaction with systems, but also increases security through centralized management.
