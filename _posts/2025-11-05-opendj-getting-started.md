---
layout: home
landing-title: "Getting Started with OpenDJ"
landing-title2: "Getting Started with OpenDJ"
description: "Step-by-step guide with CLI commands for quick OpenDJ setup."
keywords: 'OpenDJ, OpenDJ tutorial, OpenDJ installation, LDAP server setup, OpenIdentityPlatform, generate LDIF data, import-ldif, ldapsearch, directory server, Java LDAP'
share-buttons: true
products: 
- opendj

---
# Getting Started with OpenDJ

In this article, we will download the latest OpenDJ version, generate and import test data, and perform a search operation.

## Prerequisites
* Java 8+ for OpenDJ 4.x.x
* Java 11+ for OpenDJ 5.x.x

## Installation

Download the latest release from GitHub with the following command:

```bash
export VERSION="$(curl -i -o - --silent https://api.github.com/repos/OpenIdentityPlatform/OpenDJ/releases/latest | grep -m1 "\"name\"" | cut -d\" -f4)" 
echo "last release: $VERSION"
curl -L https://github.com/OpenIdentityPlatform/OpenDJ/releases/download/$VERSION/opendj-$VERSION.zip --output opendj.zip
unzip opendj.zip
cd opendj
```

Perform a basic setup with the following command

```bash
./setup -h localhost -p 1389 --ldapsPort 1636 --adminConnectorPort 4444 --enableStartTLS --generateSelfSignedCertificate --rootUserDN "cn=Directory Manager" --rootUserPassword password --baseDN dc=example,dc=com --cli --acceptLicense --no-prompt
```

In the console output you will see something like this:
```
Configuring Directory Server ..... Done.
Configuring Certificates ..... Done.
Starting Directory Server ....... Done.

To see basic server configuration status and configuration, you can launch
/home/user/opendj/bin/status
```

Check the status of the OpenDJ:

```bash
./bin/status --bindDN "cn=Directory Manager" --bindPassword password
```

```
          --- Server Status ---
Server Run Status:        Started
Open Connections:         1

          --- Server Details ---
Host Name:                MacBook-Pro-Maxim.local
Administrative Users:     cn=Directory Manager
Installation Path:
/home/user/opendj
Version:                  OpenDJ Server 4.10.2
Java Version:             11.0.25
Administration Connector: Port 4444 (LDAPS)

          --- Connection Handlers ---
Address:Port : Protocol               : State
-------------:------------------------:---------
--           : LDIF                   : Disabled
0.0.0.0:161  : SNMP                   : Disabled
0.0.0.0:1389 : LDAP (allows StartTLS) : Enabled
0.0.0.0:1636 : LDAPS                  : Enabled
0.0.0.0:1689 : JMX                    : Disabled
0.0.0.0:8080 : HTTP                   : Disabled

          --- Data Sources ---
Base DN:     dc=example,dc=com
Backend ID:  userRoot
Entries:     0
```


## Importing Data

If you don’t have any existing data, you can simply generate it with the following command:

```bash
./bin/makeldif -o /tmp/test.ldif -c suffix=dc=example,dc=com ./config/MakeLDIF/example.template
```
```
Processed 1000 entries
Processed 2000 entries
Processed 3000 entries
Processed 4000 entries
Processed 5000 entries
Processed 6000 entries
Processed 7000 entries
Processed 8000 entries
Processed 9000 entries
Processed 10000 entries
LDIF processing complete. 10002 entries written
```

Import generated data:

```bash
./bin/import-ldif --ldifFile /tmp/test.ldif --backendID=userRoot -h localhost -p 4444 --bindDN "cn=Directory Manager" --bindPassword password --trustAll
```
```
...
Import task 20251105092509120 has been successfully completed
```

## Searching Data

Perform a search for a user with the command below:

```bash
 ./bin/ldapsearch --hostname localhost --port 1636 --bindDN "cn=Directory Manager" --bindPassword password --useSsl --trustAll --baseDN "dc=example,dc=com" --searchScope sub "(uid=user.1)"              
```
Example output:
```
dn: uid=user.1,ou=People,dc=example,dc=com
cn: Aaren Atp
description: This is the description for Aaren Atp.
employeeNumber: 1
givenName: Aaren
homePhone: +1 403 554 6522
initials: AWA
l: Dallas
mail: user.1@example.com
mobile: +1 903 040 3970
objectClass: inetOrgPerson
objectClass: organizationalPerson
objectClass: person
objectClass: top
pager: +1 745 770 1195
postalAddress: Aaren Atp$79294 Franklin Street$Dallas, CO  05437
postalCode: 05437
sn: Atp
st: CO
street: 79294 Franklin Street
telephoneNumber: +1 344 623 5820
uid: user.1
userPassword: {SSHA}jVX/9WQ3eSN2jsVspqA482KQpIN8nFccVZOH6w==
```