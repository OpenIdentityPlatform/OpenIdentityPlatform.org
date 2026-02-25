---
layout: product
title: OpenICF - Open Identity Connector Framework
description: 'OpenICF by Open Identity Platform: Framework for identity connectors. Enables provisioning, synchronization, and lifecycle management across resources with LDAP, CSV, DB, SSH, Kerberos connectors; custom Groovy/PowerShell scripting.'
keywords: OpenICF, Open Identity Connector Framework, open source identity connectors, OpenICF connectors, identity provisioning framework, Open Identity Platform, LDAP connector, database connector, CSV connector, SSH connector, Groovy connector toolkit, scripted connectors, identity synchronization, resource integration, open source ICF, provisioning connectors, Kerberos connector, identity lifecycle connectors, OpenICF download, open source identity framework
reponame: OpenICF
contributors_project: OpenIDM

hero:
  logo: /assets/img/openicf-logo.png
  short_description: The Open Identity Connector Framework (OpenICF) project provides interoperability between identity, compliance, and risk management solutions. An OpenICF Connector enables provisioning software, such as OpenIDM, to manage the identities maintained by a specific identity provider. OpenICF provides a consistent layer between identity applications and target resources.

key_features:
  intro: Comprehensive connector framework for identity integration
  list:
    - name: Interoperability
      description: OpenICF connectors provide a consistent layer between identity applications and target resources and expose a set of operations for the complete lifecycle of an identity. The connectors provide a way to decouple applications from the target resources to which data is provisioned.
    - name: Provisioning and Identity Management
      description: OpenICF focuses on provisioning and identity management but also provides general-purpose capabilities, including authentication, creation, reading, updating, deletion, searching, scripting, and synchronization operations. Connector bundles rely on the OpenICF Framework, but applications remain completely separate from the connector bundles. This enables you to change and update connectors without changing your application or its dependencies.
    - name: Extensibility
      description: Many connectors have been built within the OpenICF framework, and are maintained and supported by the Open Identity Platform community. However, you can also develop your own OpenICF connector, to address a requirement that is not covered by one of the existing connectors. In addition, OpenICF provides two scripted connector toolkits, that enable you to write your own connectors based on Groovy or PowerShell scripts.

links:
  downloads:
    - url: https://github.com/OpenIdentityPlatform/OpenICF/releases
      title: OpenICF ZIP
    - url: https://hub.docker.com/r/openidentityplatform/openicf/
      title: OpenICF Docker
  connectors:
    - url: https://github.com/OpenIdentityPlatform/OpenICF/releases
      title: csvfile-connector
    - url: xhttps://github.com/OpenIdentityPlatform/OpenICF/releases
      title: xml-connector
    - url: https://github.com/OpenIdentityPlatform/OpenICF/releases
      title: databasetable-connector
    - url: https://github.com/OpenIdentityPlatform/OpenICF/releases
      title: ldap-connector
    - url: https://github.com/OpenIdentityPlatform/OpenICF/releases
      title: ssh-connector
    - url: https://github.com/OpenIdentityPlatform/OpenICF/releases
      title: groovy-connector
    - url: https://github.com/OpenIdentityPlatform/OpenICF/releases
      title: kerberos-connector
---

<section class="pb-16">
    <div class="max-w-7xl mx-auto px-6">
        <div class="content-section">
            <h2 class="text-3xl font-bold mb-6 text-center">Downloads</h2>
            <div class="grid md:grid-cols-3 gap-6">
                {% for link in page.links.downloads %}   
                <a href="{{link.url}}" class="text-gray-300 hover:text-primary transition-colors">
                    <span class="text-lg">→ </span>{{link.title}}
                </a>
                {% endfor %}                  
            </div>
        </div>
    </div>
</section>

<section class="pb-16">
    <div class="max-w-7xl mx-auto px-6">
        <div class="content-section">
            <h2 class="text-3xl font-bold mb-6 text-center">Connectors</h2>
            <div class="grid md:grid-cols-3 gap-6">
                 {% for link in page.links.connectors %}   
                <a href="{{link.url}}" class="text-gray-300 hover:text-primary transition-colors">
                    <span class="text-lg">→ </span>{{link.title}}
                </a>
                {% endfor %}            
            </div>
        </div>
    </div>
</section>

{% include contributors.html %}

{% include sponsors.html %}