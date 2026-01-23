---
layout: home
title: OpenICF - Open Identity Connector Framework
description: 'OpenICF by Open Identity Platform: Framework for identity connectors. Enables provisioning, synchronization, and lifecycle management across resources with LDAP, CSV, DB, SSH, Kerberos connectors; custom Groovy/PowerShell scripting.'
keywords: OpenICF, Open Identity Connector Framework, open source identity connectors, OpenICF connectors, identity provisioning framework, Open Identity Platform, LDAP connector, database connector, CSV connector, SSH connector, Groovy connector toolkit, scripted connectors, identity synchronization, resource integration, open source ICF, provisioning connectors, Kerberos connector, identity lifecycle connectors, OpenICF download, open source identity framework
reponame: OpenICF
contributors_project: OpenIDM
---
<div class="container text-center mb-4">
  <h1>
    <a target="_blank" href="https://github.com/OpenIdentityPlatform/OpenICF">
      <img src="/assets/img/openicf-logo.png" width="40%" alt="{{ page.title }}"/>
    </a>
  </h1>
</div>

The Open Identity Connector Framework (OpenICF) project provides interoperability between identity, compliance, and risk management solutions. An OpenICF Connector enables provisioning software, such as [OpenIDM](https://github.com/OpenIdentityPlatform/OpenIDM), to manage the identities maintained by a specific identity provider.

OpenICF connectors provide a consistent layer between identity applications and target resources and expose a set of operations for the complete lifecycle of an identity. The connectors provide a way to decouple applications from the target resources to which data is provisioned.

OpenICF focuses on provisioning and identity management but also provides general-purpose capabilities, including authentication, creation, reading, updating, deletion, searching, scripting, and synchronization operations. Connector bundles rely on the OpenICF Framework, but applications remain completely separate from the connector bundles. This enables you to change and update connectors without changing your application or its dependencies.

Many connectors have been built within the OpenICF framework, and are maintained and supported by the Open Identity Platform community. However, you can also develop your own OpenICF connector, to address a requirement that is not covered by one of the existing connectors. In addition, OpenICF provides two scripted connector toolkits, that enable you to write your own connectors based on Groovy or PowerShell scripts.

Starting from version 1.5, the OpenICF framework can use OpenIDM, Sun Identity Manager, and Oracle Waveset connectors (version 1.1), as well as ConnID connectors up to version 1.4.

## License
This project is licensed under the [Common Development and Distribution License (CDDL)](https://github.com/OpenIdentityPlatform/OpenICF/blob/master/LICENSE.md). 

## Downloads 
* [OpenICF ZIP](https://github.com/OpenIdentityPlatform/OpenICF/releases)
* [OpenICF Docker](https://hub.docker.com/r/openidentityplatform/openicf/)

### OpenICF Java connectors:
* [csvfile-connector](https://github.com/OpenIdentityPlatform/OpenICF/releases) 
* [xml-connector](https://github.com/OpenIdentityPlatform/OpenICF/releases) 
* [databasetable-connector](https://github.com/OpenIdentityPlatform/OpenICF/releases) 
* [ldap-connector](https://github.com/OpenIdentityPlatform/OpenICF/releases) 
* [ssh-connector](https://github.com/OpenIdentityPlatform/OpenICF/releases) 
* [groovy-connector](https://github.com/OpenIdentityPlatform/OpenICF/releases) 
* [kerberos-connector](https://github.com/OpenIdentityPlatform/OpenICF/releases) 

 {% include contributors.html %}

 {% include sponsors.html %}