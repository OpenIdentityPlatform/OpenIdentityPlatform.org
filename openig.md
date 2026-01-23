---
layout: home
title: OpenIG - Open Indentity Gateway
description: 'OpenIG by Open Identity Platform: High-performance identity gateway & reverse proxy. Secure apps/APIs with SSO/SLO, standards federation (OAuth, OIDC, SAML), policy enforcement, no-code integration. High-performance, flexible access management solution.'
keywords: OpenIG, Open Identity Gateway, open source identity gateway, reverse proxy, OpenIG gateway, Open Identity Platform, SSO gateway, identity gateway open source, OAuth 2.0 gateway, OpenID Connect proxy, SAML 2.0 federation, API security gateway, policy enforcement point, credential replay, secure access proxy, Java reverse proxy, open source SSO, federation gateway, OpenIG download, zero trust access
reponame: OpenIG
product: openig
video: ForgeRock+OpenIG 
links: 
    - title: Donate
      url: https://opencollective.com/openidm/contribute

---
<div class="container text-center mb-4">
  <h1>
    <a target="_blank" href="https://github.com/OpenIdentityPlatform/OpenIG">
      <img src="/assets/img/openig-logo.png" width="40%" alt="{{ page.title }}"/>
    </a>
  </h1>
</div>

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

 {% include product-links.html %}

 {% include product-about.html %}

 {% include contributors.html %}

 {% include sponsors.html %}