---
layout: home
landing-title: "OpenAM 14.6.5 Released"
landing-title2: "OpenAM 14.6.5 Released"
description: Open Identity Platform Community just released OpenAM v14.6.5
keywords: 'OpenAM, Access Management, Authentication, SSO, Single Sign On, Open Identity Platform, SAML, Release, Authentication, Apache Cassandra'
imageurl: 'openam-og.png'
---
# OpenAM 14.6.5 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/14.6.5)
## What's new

### Improvements

* Updated Apache Cassandra Embedded version
* Reduced Docker layer sizes 
* Add test data option for Apache Cassandra to load sample data load
* Allowed to handle multiple LDAP servers in openam-auth-msisdn
* Allow for clock skew when verifying time validity in assertion condition
* Allow get/create/update field repo with update-prefix in Apache Cassandra user data store
* Added conversion LDIF data to CASSANDRA CQL for user data store
* Added embedded PasswordAuthenticator and CassandraAuthorizer
* Possible to build with Java 8, 11, 15, 16, 17, 18
* CTS: added cache for persistence level


### Significant Issues

* Fixed issues in the Docker images
* Fix LDAP connection leak during policy update. 
* Apache ActiveMQ client switched to Java 11 only for release 5.17


* Vulnerable libraries updated
* Security fixes




[All changes](https://github.com/OpenIdentityPlatform/OpenAM/compare/14.6.4...14.6.5)

## Thanks for the contributions
<i id="ajlugt"><i>1. <a href="https://github.com/ajlugt" target="_blank">ajlugt</a></i>

<i id="lscorcia"><i>2. <a href="https://github.com/lscorcia" target="_blank">Luca Leonardo Scorcia</a></i>

<i id="rrialq"><i>3. <a href="https://github.com/rrialq" target="_blank">Ramón Rial</a></i>

<i id="artb1sh"><i>4. <a href="https://github.com/artb1sh" target="_blank">Viktor Skachkov</a></i>

<i id="maximthomas"><i>5. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>

<i id="vharseko"><i>6. <a href="https://github.com/vharseko" target="_blank">vharseko</a></i>

and

<i id="dependabot"><i>0. <a href="https://github.com/dependabot" target="_blank">dependabot</a></i> :)
