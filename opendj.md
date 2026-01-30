---
layout: home
title: OpenDJ - Open Directory Server
description: 'OpenDJ by Open Identity Platform: LDAPv3 directory server. Scalable, secure identity storage with easy deployment for enterprise IAM.'
keywords: OpenDJ, OpenDJ directory server, open source LDAP, LDAPv3 server, Java LDAP server, open source directory service, identity management, Open Identity Platform, OpenDJ, high performance LDAP, scalable directory server, secure identity store, LDAP directory, open source IAM, multi-master replication, OpenDJ download
reponame: OpenDJ
product: opendj
links: 
    - title: Donate
      url: https://opencollective.com/opendj/contribute
    - title: Wikipedia
      url: https://en.wikipedia.org/wiki/OpenDJ
key_features:
    - name: High Performance
      description: Lots of features are important, but performance is almost always near the top of the list. It needs to be extremely fast, outperforming all other servers wherever possible.
    - name: Vertical Scalability
      description: OpenDJ is capable of handling billions of entries in a single instance on appropriately-sized hardware. It can make effective use of multi-CPU, multi-core machines with hundreds of gigabytes of memory.
    - name: Horizontal Scalability
      description: OpenDJ supports Multi-Master replication to support horizontal scalability to provide fast read and write access to large amounts of data.
    - name: Maintainability
      description: OpenDJ is easy to support and maintain. The administration is almost intuitive and provides various powerful tools to manage and monitor OpenDJ instances. 
    - name: Replication
      description: OpenDJ supports data synchronization between instances, including not only total data synchronization but also partial synchronization (with fractional, filtered, and subtree capabilities)
---
<section class="hero pt-24">
    <div class="hero-bg"></div>
    <div class="hero-content max-w-7xl mx-auto px-6 py-12">
        <div class="text-center max-w-4xl mx-auto">
            <img src="/assets/img/opendj-logo.png" alt="{{ page.title }}" class="h-24 mx-auto mb-6">
            <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
                {{ page.title }}
            </h1>
            <p class="text-xl text-gray-300 leading-relaxed mb-8">
              OpenDJ is an LDAPv3 compliant directory service, which has been developed for the Java platform, providing a high performance, highly available, and secure store for the identities managed by your organization. Its easy installation process, combined with the power of the Java platform makes OpenDJ the simplest, fastest directory to deploy and manage.
            </p>
        </div>
    </div>
</section>

<section class="py-24 bg-gradient-to-b from-transparent to-slate-900/30">
    <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-4">Key Features</h2>
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