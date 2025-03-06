---
layout: home
landing-title: "OpenDJ: Using a Relational Database as an LDAP Backend"
landing-title2: "OpenDJ: Using a Relational Database as an LDAP Backend"
description: In the following article we will setup PostgtreSQL as an OpenDJ backend
keywords: 'OpenDJ, JDBC, PostgreSQL, RDMS, Open Identity Platform, LDAP'
imageurl: 'opendj-og.png'
share-buttons: true
---

[Original article](https://github.com/OpenIdentityPlatform/OpenDJ/wiki/Using-a-Relational-Database-as-an-LDAP-Backend)

# Preparation

First, you must have Java at least 1.8 installed and Docker installed. Run the PostgreSQL Docker image with the following command:

```
docker run -it -d -p 5432:5432 -e POSTGRES_DB=database_name -e POSTGRES_PASSWORD=password --name postgres postgres
```

Download the latest OpenDJ version from the GitHub using the following commands:
```
export VERSION="$(curl -i -o - --silent https://api.github.com/repos/OpenIdentityPlatform/OpenDJ/releases/latest | grep -m1 "\"name\"" | cut -d\" -f4)" 
echo "last release: $VERSION"
curl -L https://github.com/OpenIdentityPlatform/OpenDJ/releases/download/$VERSION/opendj-$VERSION.zip --output opendj.zip

```

Or manually from your browser [https://github.com/OpenIdentityPlatform/OpenDJ/releases](https://github.com/OpenIdentityPlatform/OpenDJ/releases).

Unzip the distribution

```
unzip opendj.zip

```

Run the OpenDJ setup command

```
./opendj/setup -h localhost -p 1389 --ldapsPort 1636 --adminConnectorPort 4444 --enableStartTLS --generateSelfSignedCertificate --rootUserDN "cn=Directory Manager" --rootUserPassword password --cli --acceptLicense --no-prompt

Configuring Directory Server ..... Done.
Configuring Certificates ..... Done.
Starting Directory Server ....... Done.

To see basic server configuration status and configuration, you can launch
/home/user/opendj-postgres/opendj/bin/status
```

Pay attention to the parameters `rootUserDN` and `rootUserPassword`. Here are the parameters for connecting to OpenDJ with administrative rights.

Check the OpenDJ status

```
./opendj/bin/status --bindDN "cn=Directory Manager" --bindPassword password

          --- Server Status ---
Server Run Status:        Started
Open Connections:         1

          --- Server Details ---
Host Name:                MacBook-Pro-Maxim.local
Administrative Users:     cn=Directory Manager
Installation Path:
/home/user/opendj-postgres/opendj
Version:                  OpenDJ Server 4.9.0
Java Version:             21.0.2
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
-No LDAP Databases Found-
```

As you can see from the output of the command, the LDAP database has not yet been created.

# Настройка OpenDJ

Create OpenDJ backend using PostgreSQL database

```
./opendj/bin/dsconfig create-backend -h localhost -p 4444 --bindDN "cn=Directory Manager" --bindPassword password --backend-name=userRoot --type jdbc --set base-dn:dc=example,dc=com --set 'db-directory:jdbc:postgresql://localhost:5432/database_name?user=postgres&password=password' --set enabled:true --no-prompt --trustAll
```


Note the arguments `--type`, which must be set to `jdbc` to use a relational database, and `--set` `'db-directory:jdbc:...'`, a string for connecting to a JDBC-compliant data source.

> The DBMS can be almost any database for which there is a JDBC-compatible driver. For example, you can use MySQL, MS SQL Server, and so on. To use a JDBC-compatible database, you need to download the appropriate driver and copy it to the `./opendj/lib` directory and modify the connection string to the JDBC source in the `--set` argument. Example connection string for MySQL: `db-directory:jdbc:mysql://mysqlhost:3306/database_name?user=mysql&password=password`. For more details, refer to the the documentation for the corresponding driver


You can read more about the parameters of the `dsconfig create-backend` command at the following link

[https://doc.openidentityplatform.org/opendj/reference/dsconfig-subcommands-ref#dsconfig-create-backend](https://doc.openidentityplatform.org/opendj/reference/dsconfig-subcommands-ref#dsconfig-create-backend).

# Test the Solution

For demonstration purposes, create and load test data in OpenDJ

Create ldif file with test data from the template:

```
./opendj/bin/makeldif -o /tmp/test.ldif -c suffix=dc=example,dc=com ./opendj/config/MakeLDIF/example.template                                                                   
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

Load ldif file into OpenDJ

```
./opendj/bin/ldapmodify --hostname localhost --port 1636 --bindDN "cn=Directory Manager" --bindPassword password --useSsl --trustAll -f /tmp/test.ldif -a
Processing ADD request for dc=example,dc=com
ADD operation successful for DN dc=example,dc=com
Processing ADD request for ou=People,dc=example,dc=com
ADD operation successful for DN ou=People,dc=example,dc=com
Processing ADD request for uid=user.0,ou=People,dc=example,dc=com
ADD operation successful for DN uid=user.0,ou=People,dc=example,dc=com
Processing ADD request for uid=user.1,ou=People,dc=example,dc=com
ADD operation successful for DN uid=user.1,ou=People,dc=example,dc=com
Processing ADD request for uid=user.2,ou=People,dc=example,dc=com
ADD operation successful for DN uid=user.2,ou=People,dc=example,dc=com
....
Processing ADD request for uid=user.9998,ou=People,dc=example,dc=com
ADD operation successful for DN uid=user.9998,ou=People,dc=example,dc=com
Processing ADD request for uid=user.9999,ou=People,dc=example,dc=com
ADD operation successful for DN uid=user.9999,ou=People,dc=example,dc=com
```

Check the loaded data in OpenDJ:

```
./opendj/bin/ldapsearch  --hostname localhost --port 1389 --bindDN "cn=Directory Manager" --bindPassword password --baseDN "ou=People,dc=example,dc=com" -s one -a always -z 3 "(objectClass=*)" "hasSubordinates" "objectClass"
dn: uid=user.0,ou=People,dc=example,dc=com
hasSubordinates: false
objectClass: inetOrgPerson
objectClass: organizationalPerson
objectClass: person
objectClass: top

dn: uid=user.1,ou=People,dc=example,dc=com
hasSubordinates: false
objectClass: inetOrgPerson
objectClass: organizationalPerson
objectClass: person
objectClass: top

dn: uid=user.10,ou=People,dc=example,dc=com
hasSubordinates: false
objectClass: inetOrgPerson
objectClass: organizationalPerson
objectClass: person
objectClass: top

...
```