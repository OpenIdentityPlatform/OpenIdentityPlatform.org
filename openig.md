---
layout: home
title: OpenIG - Open Indentity Gateway
description: OpenIG - Open Source reserve proxy server with
keywords: OpenIG, Indentity Gateway, reverse proxy, session management, credential replay, Open Identity Platform
---
<h1><a href="https://github.com/OpenIdentityPlatform/OpenIG">OpenIG</a></h1>

The Open Identity Gateway (OpenIG) is a high-performance reverse proxy server with specialized session management and credential replay functionality.

OpenIG is an independent policy enforcement point that reduces the proliferation of passwords and ensures consistent, secure access across multiple web apps and APIs. OpenIG can leverage any standards-compliant identity provider to integrate into your current architecture. Single sign-on and sign-off improves the user experience and will vastly improve adoption rates and consumption of services provided.
* Extend SSO to any Application
* Federate Enabling Applications
* Implement Standards Based Policy Enforcement

### How it Works
OpenIG is essentially a Java-based reverse proxy which runs as a web application. All HTTP traffic to each protected application is routed through OpenIG, enabling close inspection, transformation and filtering of each request. You can create new filters and handlers to modify the HTTP requests on their way through OpenIG, providing the ability to recognize login pages, submit login forms, transform or filter content, and even function as a Federation endpoint for the application. All these features are possible without making any changes to the application's deployment container or the application itself.

OpenIG works together with [OpenAM](/openam) to integrate Web applications without the need to
modify the target application or the container that it runs in.

* Support for identity standards ([OAuth 2.0](https://tools.ietf.org/html/rfc6749), [OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html), [SAML 2.0](http://saml.xml.org/saml-specifications))
* Application and API gateway concept
* Prepackaged SAML 2.0-based federation
* Password capture and replay
* Works with any identity provider, including OpenAM
* Single Sign-On and Single Log-Out

Useful links:
* [Latest Release](https://github.com/OpenIdentityPlatform/OpenIG/releases)
* [Fork OpenIG](https://github.com/OpenIdentityPlatform/OpenIG)
* [Run OpenIG as Docker Image](https://hub.docker.com/r/openidentityplatform/openig/)
* [Documentation](https://github.com/OpenIdentityPlatform/OpenIG/wiki/)
