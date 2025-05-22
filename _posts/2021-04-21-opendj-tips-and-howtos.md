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

# List all indexes
```bash
bin/backendstat show-index-status --backendID userRoot --baseDN dc=example,dc=com
```

# Rebuild Degraded Indexes ONLINE
```bash
bin/rebuild-index --hostname localhost --port 4444 --bindDN "cn=Directory Manager" --bindPassword password --baseDN dc=example,dc=com --rebuildDegraded --trustAll
```

# List the available protocols and cipher suites, read the supportedTLSProtocols and supportedTLSCiphers 
```bash
bin/ldapsearch --hostname localhost --port 1636 --useSSL --trustAll --baseDN "" --searchScope base "(objectclass=*)" supportedTLSCiphers supportedTLSProtocols
```

# Allow only TLSv1.2 ssl-protocol
```bash
#LDAPS / LDAP / HTTP Connection Handlers
bin/dsconfig --hostname localhost --port 4444 --bindDN "cn=Directory Manager" --bindPassword password set-connection-handler-prop --handler-name "LDAPS Connection Handler" --add ssl-protocol:TLSv1.2 --trustAll --no-prompt
#Administration Connector
bin/dsconfig --hostname localhost --port 4444 --bindDN "cn=Directory Manager" --bindPassword password set-administration-connector-prop --add ssl-protocol:TLSv1.2 --trustAll --no-prompt
#Crypto Manager
bin/dsconfig --hostname localhost --port 4444 --bindDN "cn=Directory Manager" --bindPassword password set-crypto-manager-prop --add ssl-protocol:TLSv1.2 --trustAll --no-prompt
```

# Use Self Signed Certificate 
Create the store with the following command. You'll be asked to enter a password for the .pfx file.
```bash
openssl pkcs12 -export -out opendj.pfx -inkey private.key -in server.crt -certfile cachain.crt
```
Then when you run the container just set this environment variable with the pfx path and the password.
```bash
OPENDJ_SSL_OPTIONS="--usePkcs12keyStore /data/opendj.pfx --keyStorePassword PASSWORD"
```