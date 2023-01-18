---
layout: home
landing-title: "OpenAM 14.7.0 Released"
landing-title2: "OpenAM 14.7.0 Released"
description: Open Identity Platform Community just released OpenAM v14.7.0
keywords: 'OpenAM, Access Management, Authentication, SSO, Single Sign On, Open Identity Platform, Release, JDK'
imageurl: 'openam-og.png'
---
# OpenAM 14.7.0 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/14.7.0)
## What's new
* Added JDK 11, 17, 19 support 
* Switch Docker image to JRE 17 LTS
* Added additional user search attributes to admin console
* Added session url notification after token restoration from persistent storage
* LDAP pool: shuffle by priority (round robbin)
* Cassandra User Datastore: added created and updated attributes
* Cassandra User Datastore: added OR filter
* Modify user membership via REST API 
* Cassandra User Datastore: date fields to unix timestamp

### Significant Issues
* Cassandra User Datastore: disable double hash userPassword
* OAuth2: use username instead uid
* Updated vulnerable libraries
* Mask user password hash in audit messages
* Fixed blocking calls in Kerberos module (WindowsDesktopSSO)


[All changes](https://github.com/OpenIdentityPlatform/OpenAM/compare/14.6.6...14.7.0)
## Thanks for the contributions
<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">vharseko</a></i>

<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>

<i id="diegogmanzanares"><i>3. <a href="https://github.com/diegogmanzanares" target="_blank">diegogmanzanares</a></i>


