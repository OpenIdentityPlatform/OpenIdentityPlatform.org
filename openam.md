---
layout: home
title: OpenAM - Open Access Manager
description: 'OpenAM by Open Identity Platform: SSO, authentication, OAuth 2.0, OpenID Connect, SAML federation. Enterprise-grade, highly available identity solution.'
keywords: OpenAM, Open Identity Platform, open source access management, single sign-on, SSO, identity provider, SAML, OAuth 2.0, OpenID Connect, OIDC, authentication, authorization, federation, identity management, IAM, access management, multi-factor authentication, adaptive authentication, high availability, clusterization, open source IAM, enterprise SSO, identity federation, web services security
reponame: OpenAM
product: openam
links: 
    - title: Donate
      url: https://opencollective.com/openam/contribute
    - title: Wikipedia
      url: https://en.wikipedia.org/wiki/OpenAM

key_features:
    - name: Authentication
      description: OpenAM ships with more than 20 authentication modules, which you can use to customize your authentication process. Also, you can customize sequence of authentication modules, to provide multi-factor or adaptive authentication.
    - name: Authorization
      description: OpenAM can also manage authorization, so you can restrict access to desired resources according to different authorization policies. 
    - name: Identity Provider
      description: OpenAM can act as an Identity Provider, using SAML, OAuth 2.0 or OpenID Connect 1. So, your clients can develop their own applications or websites and authenticate via OpenAM like they authenticate via Facebook or Google. 
    - name: Single Sign On
      description: After single authentication, user gets access to all resources protected by OpenAM. So, there is no need to authenticate at other services. 
    - name: High Performance and Clusterization
      description: To enable high availability for large-scale and mission-critical deployments, OpenAM provides both system failover and session failover. These two key features help to ensure that no single point of failure exists in the deployment. 
    - name: Extensibility
      description: OpenAM allows to extend just any functionality, from authentication modules to user data source. Besides, it supports UI customization to create separate end-user pages with personal branding. 
    - name: Developer SDK
      description: OpenAM ships with Java SDK, which allows to interact with authorization API, authentication API, manage accounts and so on… 
    - name: Security
      description: As OpenAM is open source, it allows community and clients test it for possible vulnerabilities, and do PEN tests. 
---

<section class="hero pt-24">
    <div class="hero-bg"></div>
    <div class="hero-content max-w-7xl mx-auto px-6 py-12">
        <div class="text-center max-w-4xl mx-auto">
            <img src="/assets/img/openam-logo.png" alt="{{ page.title }}" class="h-24 mx-auto mb-6">
            <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
                {{ page.title }}
            </h1>
            <p class="text-xl text-gray-300 leading-relaxed mb-8">
                If you have multiple sites and applications in your company, probably you need to provide seamless authentication to all of them. So when user logged in at one of your sites once, he does not need to enter his credentials on other sites.
            </p>
        </div>
    </div>
</section>

<section class="py-24 bg-gradient-to-b from-transparent to-slate-900/30">
    <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-4">Key Features</h2>
            <p class="text-xl text-gray-400">OpenAM can help you solve all authentication and authorization issues</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {% for feature in page.key_features %}
              <div class="feature-card">
                <h3 class="text-xl font-bold mb-3">{{feature.name}}</h3>
                <p class="text-gray-400">{{feature.description}}</p>
              </div>
            {% endfor %}            
        </div>
    </div>
</section>


 {% include product-links.html %}

 {% include product-about.html %}

 {% include contributors.html %}

 {% include sponsors.html %}

