---
layout: home
landing-title: "OpenDJ 4.4.7 Released"
landing-title2: "OpenDJ 4.4.7 Released"
description: Open Identity Community just released OpenDJ v4.4.7
keywords: 'OpenDJ, Directory Service, Directory Services, LDAP, Open Identity Platform, Docker'
imageurl: 'opendj-og.png'
share-buttons: true
---
# OpenDJ 4.4.7 Released
[Download](https://github.com/OpenIdentityPlatform/OpenDJ/releases/tag/4.4.7)
## What's new

### Improvements
* Create volume mount point for data in Dockerfile
* Use openjdk:8 as a base image for Java updates
* Update the LDAPConnectionHandler2 to log connections, similarly to
LDAPConnectionHandler.

### Bug Fixes
* Fixed OPENDJ-3445 When the LDAP port is not accessible, ds-cfg-symmetric-key values are not being replicated correctly
* Fixed import-ldif and rebuild-index fails with java.lang.OutOfMemoryError wth OpenJDK11 if JVM has max heap <= 2GB
* Fixed illegal reflective access warning for OnDiskMergeImporter in Java9+
* Fix replication setup in Docker image
* Fix blacklist misbehaving servers
* Fixed other issues ([more details](https://github.com/OpenIdentityPlatform/OpenDJ/compare/93e2ea029d18a6ca81d837c43228f274d4f0ce61...bd1ac346024438eec15db1f9d35e57ff36ed1b49))

## Thanks for the contibutions

<i id="pvarga88"><i>1. <a href="https://github.com/pvarga88" target="_blank">pvarga88</a></i>

<i id="MartijnVdS"><i>2. <a href="https://github.com/MartijnVdS" target="_blank">Martijn van de Streek</a></i>

<i id="seanking"><i>3. <a href="https://github.com/seanking" target="_blank">Sean King</a></i>

<i id="Gui13"><i>4. <a href="https://github.com/Gui13" target="_blank">Guillaume</a></i>

<i id="Marsonge"><i>5. <a href="https://github.com/Marsonge" target="_blank">Tim "Docteur" Caillot</a></i>

<i id="spetix"><i>6. <a href="https://github.com/spetix" target="_blank">Christian</a></i>

<i id="ShigekiYoshioka"><i>7. <a href="https://github.com/ShigekiYoshioka" target="_blank">Shigeki Yoshioka</a></i>

<i id="jpn-e"><i>8. <a href="https://github.com/jpn-e" target="_blank">Jan-Peter Nilsson</a></i>



