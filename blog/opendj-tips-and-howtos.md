---
layout: home
title: "OpenDJ Tips and How-Tos"
landing-title2: "OpenDJ Tips and How-Tos"
description: Some useful commands one could use to manage OpenDJ
keywords: 'OpenDJ, Directory Service, how to, tips, replication, setup'
imageurl: 'opendj-logo.png'
---

[Original article](https://github.com/OpenIdentityPlatform/OpenDJ/wiki/How-To)

# Setup server
```bash
./setup -h localhost -p 1389 --ldapsPort 1636 --adminConnectorPort 4444 --enableStartTLS --generateSelfSignedCertificate --rootUserDN "cn=Directory Manager" --rootUserPassword password --baseDN dc=example,dc=com --addBaseEntry --cli --acceptLicense --no-prompt
```

# Clean and reinstall server
```bash
bin/stop-ds
rm -rf config/ db/
./setup -h localhost -p 1389 --ldapsPort 1636 --adminConnectorPort 4444 --enableStartTLS --generateSelfSignedCertificate --rootUserDN "cn=Directory Manager" --rootUserPassword password --baseDN dc=example,dc=com --addBaseEntry --cli --acceptLicense --no-prompt
```

# Check server status
```bash
bin/status --bindDN "cn=Directory Manager" --bindPassword password
```

# Initialize replication between two servers
```bash
bin/dsreplication enable --host1 localhost --port1 4444 --bindDN1 "cn=Directory Manager" --bindPassword1 password --replicationPort1 2389 --host2 localhost --port2 4445 --bindDN2 "cn=Directory Manager" --bindPassword2 password --replicationPort2 2390 --adminUID admin --adminPassword password --baseDN dc=example,dc=com -X -n
bin/dsreplication initialize --baseDN dc=example,dc=com --adminUID admin --adminPassword password --hostSource localhost --portSource 4444 --hostDestination localhost --portDestination 4445 -X -n
```

# Disable replication on server
```bash
bin/dsreplication disable --disableAll --port 4444 --hostname localhost --bindDN "cn=Directory Manager" --adminPassword password --trustAll --no-prompt
```
