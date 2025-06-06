---
layout: home
landing-title: "How to Use Apache Cassandra as User DataStore in OpenAM"
landing-title2: "How to Use High Perfomant and Availability DataStore Apache Cassandra as User DataStore in OpenAM"
description: "How to Use Apache Cassandra as User DataStore in OpenAM"
keywords: 'Apache Cassandra, Cassandra, high perfomance, high availability, OpenAM, Access Management, Authentication, Authorization, DataStore, Single Sign On,  Open Identity Platform'
share-buttons: true
products: 
- openam
---

# How to Use Apache Cassandra as User DataStore in OpenAM

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Use-Apache-Cassandra-as-User-DataStore-in-OpenAM](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Use-Apache-Cassandra-as-User-DataStore-in-OpenAM)

## Table of Contents

- [Introduction](#introduction)
- [Prepare Apache Cassandra to use as User DataStore](#prepare-apache-cassandra-to-use-as-user-datastore)
- [OpenAM Setup](#openam-setup)
  * [Server settings](#server-settings)
  * [Plugin configuration](#plugin-configuration)
  * [User Configuration](#user-configuration)
  * [Group Configuration](#group-configuration)

## Introduction
One of the performance bottlenecks of authentication is User DataStore. This becomes noticeable when the total number of user accounts exceeds `4 000 000`.

To maintain acceptable perfomance, the most obvious solution is to scale User DataStore horisontally or vertically. But with increasing amount of data, DataStore scaling does not affect performance.

With authentication system increasing load on the authentication system, the most obvious solution is to scale horizontally or vertically the number of user repository nodes.

Another alternative solution is to use storage specifically designed for working with large amounts of data. On of such storages is [Apache Cassandra](https://cassandra.apache.org/). It has proved itself as high-availability and high-performance datastore.

## Prepare Apache Cassandra to use as User DataStore

At first you need to create a role in Apache Cassandra, which will have access to OpenAM user accounts.
For example:
```sql
CREATE ROLE openam WITH LOGIN = true AND PASSWORD = 'openam';
```

Next you need to create the corresponding Keyspaces and tables, for each OpenAM realm. For example, for realm `b2c/users` script will be like this.

```sql
CREATE KEYSPACE b2c_users WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}   AND durable_writes = true;

CREATE TABLE b2c_users.rowindexdata (
    id int,
    value text,
    key text,
    time timestamp,
    PRIMARY KEY (id, value, key)
) WITH CLUSTERING ORDER BY (value ASC, key ASC)
    AND bloom_filter_fp_chance = 0.01
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = '99.0PERCENTILE';

CREATE TABLE b2c_users.realm (
    uid text PRIMARY KEY,
    cospriority set<text>,
    "iplanet-am-session-add-session-listener-on-all-sessions" set<text>,
    "iplanet-am-session-destroy-sessions" set<text>,
    "iplanet-am-session-get-valid-sessions" set<text>,
    "iplanet-am-session-max-caching-time" set<text>,
    "iplanet-am-session-max-idle-time" set<text>,
    "iplanet-am-session-max-session-time" set<text>,
    "iplanet-am-session-quota-limit" set<text>,
    "iplanet-am-session-service-status" set<text>,
    "iplanet-am-user-account-life" set<text>,
    "iplanet-am-user-admin-start-dn" set<text>,
    "iplanet-am-user-alias-list" set<text>,
    "iplanet-am-user-auth-config" set<text>,
    "iplanet-am-user-auth-modules" set<text>,
    "iplanet-am-user-failure-url" set<text>,
    "iplanet-am-user-federation-info" set<text>,
    "iplanet-am-user-federation-info-key" set<text>,
    "iplanet-am-user-login-status" set<text>,
    "iplanet-am-user-password-reset-force-reset" set<text>,
    "iplanet-am-user-password-reset-options" set<text>,
    "iplanet-am-user-password-reset-question-answer" set<text>,
    "iplanet-am-user-success-url" set<text>,
    "objectClass" set<text>,
    "serviceName" set<text>,
    "sunIdentityServerDiscoEntries" set<text>
) WITH bloom_filter_fp_chance = 0.01
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = '99.0PERCENTILE';
CREATE INDEX servicename ON b2c_users.realm ("serviceName");
CREATE INDEX objectclass2 ON b2c_users.realm ("objectClass");

CREATE TABLE b2c_users.user (
    uid text PRIMARY KEY,
    ad set<text>,
    "adminRole" set<text>,
    "assignedDashboard" set<text>,
    "authorityRevocationList" set<text>,
    balance set<text>,
    birthday set<text>,
    bonus set<text>,
    businesscategory set<text>,
    "caCertificate" set<text>,
    cn set<text>,
    "comstar-b2c-login" set<text>,
    "comstar-b2c-password" set<text>,
    customer set<text>,
    destinationindicator set<text>,
    "devicePrintProfiles" set<text>,
    displayname set<text>,
    "distinguishedName" set<text>,
    dn set<text>,
    "employeeNumber" set<text>,
    employeetype set<text>,
    envelope set<text>,
    generateid set<text>,
    "givenName" set<text>,
    h2o set<text>,
    imsi set<text>,
    "inetUserHttpURL" set<text>,
    "inetUserStatus" set<text>,
    "iplanet-am-auth-config" set<text>,
    "iplanet-am-session-add-session-listener-on-all-sessions" set<text>,
    "iplanet-am-session-destroy-sessions" set<text>,
    "iplanet-am-session-get-valid-sessions" set<text>,
    "iplanet-am-session-max-caching-time" set<text>,
    "iplanet-am-session-max-idle-time" set<text>,
    "iplanet-am-session-max-session-time" set<text>,
    "iplanet-am-session-quota-limit" set<text>,
    "iplanet-am-session-service-status" set<text>,
    "iplanet-am-user-account-life" set<text>,
    "iplanet-am-user-admin-start-dn" set<text>,
    "iplanet-am-user-alias-list" set<text>,
    "iplanet-am-user-auth-config" set<text>,
    "iplanet-am-user-auth-modules" set<text>,
    "iplanet-am-user-failure-url" set<text>,
    "iplanet-am-user-federation-info" set<text>,
    "iplanet-am-user-federation-info-key" set<text>,
    "iplanet-am-user-login-status" set<text>,
    "iplanet-am-user-password-reset-force-reset" set<text>,
    "iplanet-am-user-password-reset-options" set<text>,
    "iplanet-am-user-password-reset-question-answer" set<text>,
    "iplanet-am-user-success-url" set<text>,
    mail set<text>,
    manager set<text>,
    "memberOf" set<text>,
    "modifyTimestamp" set<text>,
    o set<text>,
    "objectClass" set<text>,
    orderid set<text>,
    ou set<text>,
    personalaccountnumber set<text>,
    po set<text>,
    "postalAddress" set<text>,
    "preferredLocale" set<text>,
    preferredlanguage set<text>,
    preferredtimezone set<text>,
    service set<text>,
    services set<text>,
    sn set<text>,
    "sun-fm-saml2-nameid-info" set<text>,
    "sun-fm-saml2-nameid-infokey" set<text>,
    "sunAMAuthInvalidAttemptsData" set<text>,
    "sunIdentityMSISDNNumber" set<text>,
    "sunIdentityServerDiscoEntries" set<text>,
    "sunIdentityServerPPAddressCard" set<text>,
    "sunIdentityServerPPCommonNameAltCN" set<text>,
    "sunIdentityServerPPCommonNameCN" set<text>,
    "sunIdentityServerPPCommonNameFN" set<text>,
    "sunIdentityServerPPCommonNameMN" set<text>,
    "sunIdentityServerPPCommonNamePT" set<text>,
    "sunIdentityServerPPCommonNameSN" set<text>,
    "sunIdentityServerPPDemographicsAge" set<text>,
    "sunIdentityServerPPDemographicsBirthDay" set<text>,
    "sunIdentityServerPPDemographicsDisplayLanguage" set<text>,
    "sunIdentityServerPPDemographicsLanguage" set<text>,
    "sunIdentityServerPPDemographicsTimeZone" set<text>,
    "sunIdentityServerPPEmergencyContact" set<text>,
    "sunIdentityServerPPEmploymentIdentityAltO" set<text>,
    "sunIdentityServerPPEmploymentIdentityJobTitle" set<text>,
    "sunIdentityServerPPEmploymentIdentityOrg" set<text>,
    "sunIdentityServerPPEncryPTKey" set<text>,
    "sunIdentityServerPPFacadeGreetSound" set<text>,
    "sunIdentityServerPPFacadeMugShot" set<text>,
    "sunIdentityServerPPFacadeNamePronounced" set<text>,
    "sunIdentityServerPPFacadeWebSite" set<text>,
    "sunIdentityServerPPFacadegreetmesound" set<text>,
    "sunIdentityServerPPInformalName" set<text>,
    "sunIdentityServerPPLegalIdentityAltIdType" set<text>,
    "sunIdentityServerPPLegalIdentityAltIdValue" set<text>,
    "sunIdentityServerPPLegalIdentityDOB" set<text>,
    "sunIdentityServerPPLegalIdentityGender" set<text>,
    "sunIdentityServerPPLegalIdentityLegalName" set<text>,
    "sunIdentityServerPPLegalIdentityMaritalStatus" set<text>,
    "sunIdentityServerPPLegalIdentityVATIdType" set<text>,
    "sunIdentityServerPPLegalIdentityVATIdValue" set<text>,
    "sunIdentityServerPPMsgContact" set<text>,
    "sunIdentityServerPPSignKey" set<text>,
    tariff set<text>,
    tariffid set<text>,
    tdid set<text>,
    tdn set<text>,
    "telephoneNumber" set<text>,
    terminal set<text>,
    "time-balance-actual" set<text>,
    "time-change-password" set<text>,
    "userCertificate" set<text>,
    "userPassword" set<text>,
    "confirmUseOAuth" set<text>,
    "oauth-token-access" set<text>,
    "oauth-token-refresh" set<text>,
    "session-success" set<text>,
    "session-failed" set<text>
) WITH bloom_filter_fp_chance = 0.01
     AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 5184000
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = '99.0PERCENTILE';
CREATE INDEX telephonenumber ON b2c_users.user ("telephoneNumber");
CREATE INDEX service2terminal ON b2c_users.user (terminal);
CREATE INDEX cn ON b2c_users.user (cn);
CREATE INDEX iplanet_am_user_federation_info_key ON b2c_users.user ("iplanet-am-user-federation-info-key");
CREATE INDEX objectclass ON b2c_users.user ("objectClass");
CREATE INDEX envelope ON b2c_users.user (envelope);
CREATE INDEX generateid ON b2c_users.user (generateid);
CREATE INDEX comstar_b2c_login ON b2c_users.user ("comstar-b2c-login");
CREATE INDEX iplanet_am_user_alias_list ON b2c_users.user ("iplanet-am-user-alias-list");
CREATE INDEX sunidentitymsisdnnumber ON b2c_users.user ("sunIdentityMSISDNNumber");
CREATE INDEX sun_fm_saml2_nameid_infokey ON b2c_users.user ("sun-fm-saml2-nameid-infokey");
CREATE INDEX memberof ON b2c_users.user ("memberOf");
CREATE INDEX givenName ON b2c_users.user ("givenName");
CREATE INDEX personalaccountnumber ON b2c_users.user (personalaccountnumber);
CREATE INDEX manager ON b2c_users.user ("manager");

CREATE TABLE b2c_users.rowindexschema (
    id int PRIMARY KEY,
    name text
) WITH bloom_filter_fp_chance = 0.01
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = '99.0PERCENTILE';

GRANT SELECT ON b2c_users.realm TO openam;
GRANT MODIFY ON b2c_users.realm TO openam;

GRANT SELECT ON b2c_users.user TO openam;
GRANT MODIFY ON b2c_users.user TO openam;
```
This script creates keyspace `b2c_users`, tables and grants `openam` role accees to this tables.

To make sure, that Apache Cassandra `openam` role have access to this tables run following command in cqlsh console:
```
cassandra@cqlsh> LIST ALL;

 role   | username | resource                | permission
--------+----------+-------------------------+------------
 openam |   openam | <table b2c_users.realm> |     SELECT
 openam |   openam | <table b2c_users.realm> |     MODIFY
 openam |   openam |  <table b2c_users.user> |     SELECT
 openam |   openam |  <table b2c_users.user> |     MODIFY
```

## OpenAM Setup

Open OpenAM administration console, goto `Realms` select target realm, then goto `DataStores` and create new DataStore.

![OpenAM Create Cassandra DataStore](/assets/img/cassandra/create-datastore.png)

Then setup following settins:

### Server settings

|Setting|Value|
|-------|---------------------------------------------------|
|Servers|Cassandra node names, for example `cassandra-1`|
|User name|Cassandra role, that have access to cassandra tables, for example `openam`|
|Password| Cassandra role password, for example `openam`|
|Password (confirm)| `openam`|
|Keyspace| Cassandra keyspace for this realm `b2c_users`|

### Plugin configuration

|Setting|Value|
|-------|---------------------------------------------------|
|Database Repository Plugin Class Name| `org.openidentityplatform.openam.cassandra.Repo` |
|Tables|`group=group`<br>`user=user`<br>`realm=realm`|
|Operations| `realm=read,create,edit,delete,service`<br>` group=read,create,edit,delete`<br> `user=read,create,edit,delete,service`|

### User Configuration

|Setting|Value|
|-------|---------------------------------------------------|
|TTL|`realm:attr1=86400`<br>` user:attr2=86400` <br> `group:attr3=86400`|
|Attribute Name of User Status|inetuserstatus|
|User Status Active Value|Active|

### Group Configuration
|Setting|Value|
|-------|---------------------------------------------------|
|Attribute Name for Group Membership|memberOf|

Then click `Save` button

You can check datastore. Goto `Subjects -> Users` and create new user account. For example:

![OpenAM Create Cassandra User Account](/assets/img/cassandra/create-user.png)

Click `Save` and make sure, this record exists in Cassandra:

```
cassandra@cqlsh:b2c_users> SELECT uid, cn, sn FROM b2c_users.user ;

 uid  | cn           | sn
------+--------------+---------
 john | {'John Doe'} | {'Doe'}

(1 rows)
```
