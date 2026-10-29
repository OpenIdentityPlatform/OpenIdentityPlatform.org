---
layout: home
landing-title: "OpenDJ 5.2.0 Released"
landing-title2: "OpenDJ 5.2.0 Released"
description: OpenDJ 5.2.0 addresses security vulnerabilities in the DSMLv2 gateway, OAuth2 file token authorization, the LDAP listener and the sort and VLV controls, removes lock contention on the bind path, and brings many replication, JDBC backend, Docker, Linux and Windows packaging improvements
keywords: 'OpenDJ, LDAP, directory server, release 5.2.0, security update, CVE-2026-102648, GHSA-jr68-5c58-j463, GHSA-c5gp-3768-jc59, GHSA-7778-jm7p-68g5, GHSA-6f6q-q9gw-4jr4, DSMLv2, VLV, replication, JDBC backend, Docker, systemd, Windows MSI, FIPS'
imageurl: 'opendj-og.png'
share-buttons: true
---
# OpenDJ 5.2.0 Released
[Download](https://github.com/OpenIdentityPlatform/OpenDJ/releases/tag/5.2.0)

## What's new

### Security vulnerabilities
* Addressed OpenDJ security vulnerabilities:
    * [CVE-2026-102648](https://github.com/OpenIdentityPlatform/OpenDJ/security/advisories/GHSA-97x5-8pm7-xfp7) - DSMLv2 gateway: incomplete internal-address check allows SSRF when `anyURI` dereferencing is enabled
    * [GHSA-jr68-5c58-j463](https://github.com/OpenIdentityPlatform/OpenDJ/security/advisories/GHSA-jr68-5c58-j463) - DSMLv2 gateway changes the XML data binding of other applications in the same JVM
    * [GHSA-c5gp-3768-jc59](https://github.com/OpenIdentityPlatform/OpenDJ/security/advisories/GHSA-c5gp-3768-jc59) - OAuth2 file token authorization lets an unauthenticated client select files outside the token directory
    * [GHSA-7778-jm7p-68g5](https://github.com/OpenIdentityPlatform/OpenDJ/security/advisories/GHSA-7778-jm7p-68g5) - LDAP listener lets unauthenticated clients hold connections until the server stops accepting new ones
    * [GHSA-6f6q-q9gw-4jr4](https://github.com/OpenIdentityPlatform/OpenDJ/security/advisories/GHSA-6f6q-q9gw-4jr4) - Sort and VLV controls let authenticated users learn password hashes and other attributes hidden by access control
* Addressed third-party dependency vulnerabilities:
    * [CVE-2026-54291](https://github.com/advisories/GHSA-j92g-9f8w-j867) - PostgreSQL JDBC Driver silent channel-binding authentication downgrade via unsupported certificate algorithms
    * [CVE-2026-84939](https://github.com/advisories/GHSA-27j2-h3m2-8237) - Apache FreeMarker template loading path traversal (not reachable in OpenDJ)
    * Bumped `mssql-jdbc` to 13.4.0 to clear a [CVE-2025-59250](https://github.com/advisories/GHSA-m494-w24q-6f7w) false positive reported by vulnerability scanners

### Upgrade notes
* New LDAP connection handler properties `first-request-time-limit` (default 60 seconds) and `max-client-connections-per-address` (default 1024). New installations ship with `max-allowed-client-connections: 4096` and `idle-time-limit: 600 seconds`. Upgraded servers keep their existing values, including `0` (disabled), so review both global properties after the upgrade
* To honour access control, a sorted search over a configured VLV index now reads every entry of that index. A client subject to access control whose search reads more entries than its lookthrough limit (5000 by default) or more than 100000 gets `adminLimitExceeded`. Raise `ds-rlim-lookthrough-limit` for accounts that browse larger indexes
* Debian and RPM packages now run the server as the dedicated `opendj` system user under a native systemd unit, with SysV init as a fallback. The upgrade moves root-owned installations to that user
* The Windows MSI is now an x64 package. It upgrades a 5.1.x installation in place, stops a running OpenDJ service first and refuses the upgrade while the server is still running

### Security hardening
* Capped the request body size, the `batchRequest` count per SOAP body and the operations per `batchRequest` in the DSML gateway
* Each `batchRequest` of a SOAP body now gets its own `batchResponse`, and the DSML gateway no longer fails with a `NullPointerException` on `abandonRequest` or a missing `Content-Type`
* The server-wide connection limit no longer rejects connections to the administration connector
* The HTTP connection handler and the JMX RMI connector now listen only on the configured `listen-address`
* An HTTPS configuration without a key the handler can present is refused
* `entryUUID` values and SHA-2 crypt password salts are generated with `SecureRandom`
* `setup` no longer falls back to RSA PKCS#1 v1.5 for the crypto manager key wrapping transformation
* Archive entry paths are validated on extraction (Zip Slip), and temporary files are created with the NIO temporary file APIs
* Fixed ReDoS and regex injection CodeQL alerts in `LDIFChangeRecordReader` and `TargAttrFilters`
* The Docker image keeps the root password out of the log and off the command line, hands it to the bootstrap tools in a file, and probes container health without binding as the root user

### New features and improvements
* Added the `RSASVE/KDF-SHA256/AESKWP` key wrapping transformation for Java runtimes without RSA-OAEP, such as a `SunPKCS11` FIPS provider (opt-in)
* The PKCS5S2 password storage scheme now works on a FIPS-restricted JCE
* A file-based key store or trust store is loaded again when the file changes, so a renewed certificate is used without a restart
* New `setup` options provision the `ads-truststore` from an existing key store, so replication can use certificates signed by your own CA
* New `replay-give-up-delay` replication domain property sets how long a replica retries a change its backend could not apply
* New optional `db-txn-retry-time-limit` property: a rolled-back PDB transaction is replayed until its conflict clears
* Each LDAP connection handler now gets a transport of its own, so `use-tcp-keep-alive`, `use-tcp-no-delay`, `buffer-size` and `num-request-handlers` take effect
* A new LDAP connection handler now defaults to `LDAPConnectionHandler2`, which SASL EXTERNAL, SASL with confidentiality or integrity, and the `authmethod="SSL"` bind rule need
* A running backend applies what it can of a configuration change and asks for a restart for the rest
* A change to `plugin-type` on an enabled plugin is applied without disabling and enabling the plugin again
* Added an upgrade task for the RFC 5805 transaction extended operation handlers, which instances upgraded from versions before 4.10.0 lacked
* The upgrade removes the stale `opendj-server-legacy` jar

### Performance
* Removed global lock contention on the bind path in `AuthenticatedUsers`, the digest password storage schemes and `getDefaultPasswordPolicy`, and reduced per-bind allocations
* Replaced the per-operation backend read lock with a scalable shared-access gate
* Made `AciList` reads lock-free with true copy-on-write
* Removed the per-attribute read lock from the `CompressedSchema` decode path and the global write lock on every delete in `GroupManager`
* `LDAPStatistics` counters use `LongAdder`
* Replication processing is skipped when no replication domain is configured
* Disabled the duplicate JSON access logger in the default configuration
* JDBC backend cursors reposition within the fetched rows, and fetch batches grow adaptively

### Replication fixes
* Changes made under the Relax Rules control are now replicated like any other change
* A replication server sends a directory server only the updates it has send-window credit for
* Changes made while a recovery runs are all published before the recovery ends
* A changelog cursor keeps the record it read in advance when the head log file is rotated
* Made `ServerState` saves consistent: a change the replay could not apply is kept out of it, and a domain going down waits for the changes being applied
* Session restarts of a replication domain now run in one place, under the session lock and generation, without racing a total update
* Fixed `ReplicaOfflineMsg` handling: it is reported as sent or forwarded only when it really was, and only to peers that can decode it
* Total updates: a session that stops before the `DoneMsg` is reported as a failed import, and a remotely requested export that cannot start notifies the requester
* A replication server is recognised by the address it names, not by the one its session came from
* Fail fast when the replication server cannot bind its listen port or read its changelog
* Replication connections that used to be dropped silently are now reported, and a failed handshake logs a warning
* A change being retried is reported once per interval instead of once per delivery
* Documented CA-signed replication certificates and the replication repair control

### JDBC backend fixes
* Fixed SQL Server `MERGE` upsert primary key violations and deadlocks, and retried transaction conflicts
* Table names of a backend's trees now come from a catalog in the database
* Bounded the connection pool: connect timeout, read timeout, pool size and per-connection expiry
* Bounded the wait of DDL statements and write transactions for locks held by another session
* Offline tools get a read-only transaction instead of being refused
* Optimizer statistics are refreshed after an import

### Storage and index fixes
* JE transactions ended by a lock conflict are replayed instead of being given up at once
* An explicit `db-cache-size` is checked against the memory quota, and a cache size change asks for a restart
* Each backend now has its own compressed schema trees, and a compressed schema token is persisted before it is handed out
* Adding an index drops what a previous index left behind instead of adopting it
* The confidentiality setting of a backend index is applied to the running backend
* Import and rebuild under an `index-entry-limit` of 0 (no limit) no longer leave every index key undefined, which made searches through the index unindexed
* Fixed Cassandra backend cursor repositioning, which skipped or missed existing keys
* Fixed the Persistit backend replaying a rolled-back read

### Directory server fixes
* Persistent search notifications are no longer dropped through search-phase deduplication
* A modification deletes every `objectClass` value it asks for, and the `objectClass` attribute is reset when the object classes of an entry change
* The Referential Integrity plugin checks every managed attribute of an add and every modification of a modify, and `check-references-filter-criteria` accepts filters that contain a colon
* DN strings are parsed in full, and administrator-typed DNs stay intact in `dsconfig` batch lines, `tools.properties` and the SDK `LDAPUrl`
* rest2ldap bind templates and HTTP Basic credentials work as documented
* The `-J`/`--control` option keeps colons inside the control value
* A connection handler keeps listening when a change to it is rejected
* Restore, import and task fixes: a restore that cannot lock its backend stops, and task listeners are told when an import or restore ends on every path
* The default class of the `governing-structure-rule` virtual attribute is corrected
* Fixed an infinite loop when choosing the errors-encountered LDIF file name
* `winlauncher.exe` no longer reports a stop as successful without stopping the server, and the Windows service never stays in `STOP_PENDING`
* Fixed the JSON access logger retention scan

### Packaging and distribution
* Modernized the Debian and RPM packages: systemd unit, dedicated `opendj` user, `CAP_NET_BIND_SERVICE` for ports 389 and 636, Java overrides in `/etc/default/opendj` or `/etc/sysconfig/opendj`
* Modernized the Windows MSI: WiX v5, x64, in-place upgrade from 5.1.x
* Docker image:
    * Starts under an arbitrary uid in group 0, as on OpenShift
    * Joins replication in the background on every start, with peers from `REPLICATION_PEERS` and a server role from `REPLICATION_ROLE`
    * Stops cleanly on `SIGTERM`
    * Copies the secret volume on every start
    * Reports healthy only once the bootstrap has succeeded
    * Applies Ubuntu security updates at build time
* Described running, upgrading and removing the Docker image in the Installation Guide
* Replaced the DocBook leftovers of the generated reference with AsciiDoc and fixed the `backendstat show-index-status` columns
* Bumped dependencies: `org.openidentityplatform.commons` 3.2.2, logback 1.5.38, Bouncy Castle FIPS (`bc-fips` 2.1.3, `bctls-fips` 2.1.24, `bcpkix-fips` 2.1.12), PostgreSQL JDBC 42.7.12, `mssql-jdbc` 13.4.0, FreeMarker 2.3.35

### Quality and CI
* Fixed CodeQL code scanning alerts of every severity in the Java code and the Windows build tools
* Added Trivy vulnerability scanning of the Docker images, Dependabot and SHA-pinned GitHub Actions with least-privilege permissions
* Added a replication convergence under load test and an upgrade test from a released Docker image
* Stabilized many flaky replication, JDBC and LDAP listener tests
* The CI build covers Java 27

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenDJ/compare/5.1.2...5.2.0))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<br/>
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>
<br/>
<i id="tonghuaroot"><i>3. <a href="https://github.com/tonghuaroot" target="_blank">tonghuaroot</a></i>
<br/>
<i id="leanworld7-netizen"><i>4. <a href="https://github.com/leanworld7-netizen" target="_blank">leanworld7-netizen</a></i>
<br/>
<i id="manus-pi"><i>5. <a href="https://github.com/manus-pi" target="_blank">Daniel Coles</a></i>
<br/>
<i id="Kr1shna4garwal"><i>6. <a href="https://github.com/Kr1shna4garwal" target="_blank">Krishna Agarwal</a></i>
<br/>
<i id="daveaitel-openai"><i>7. <a href="https://github.com/daveaitel-openai" target="_blank">daveaitel-openai</a></i>
<br/>
<i id="prthakre"><i>8. <a href="https://github.com/prthakre" target="_blank">Prashant</a></i></i>
