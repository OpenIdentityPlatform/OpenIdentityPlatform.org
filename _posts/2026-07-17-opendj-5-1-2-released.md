---
layout: home
landing-title: "OpenDJ 5.1.2 Released"
landing-title2: "OpenDJ 5.1.2 Released"
description: OpenDJ 5.1.2 addresses multiple security vulnerabilities including LDAP filter stack exhaustion, JMX deserialization, VLV memory exhaustion and DSMLv2 gateway SSRF, plus ACI, replication and alias dereferencing fixes
keywords: 'OpenDJ, LDAP, directory server, release 5.1.2, security update, CVE-2026-62366, CVE-2026-62373, CVE-2026-62375, DSMLv2, SASL PLAIN, ACI, replication, alias dereferencing'
imageurl: 'opendj-og.png'
share-buttons: true
---
# OpenDJ 5.1.2 Released
[Download](https://github.com/OpenIdentityPlatform/OpenDJ/releases/tag/5.1.2)

## What's new

### Security vulnerabilities
* Addressed OpenDJ security vulnerabilities:
    * [CVE-2026-62366](https://github.com/advisories/GHSA-rv4q-c6mr-wxp7) - Unauthenticated stack exhaustion when decoding an LDAP search filter (DoS)
    * [CVE-2026-62373](https://github.com/advisories/GHSA-qj63-3vrg-vcfx) - JMX MBean-argument deserialization without a serial filter
    * [CVE-2026-62375](https://github.com/advisories/GHSA-q4wx-wj4j-4657) - Unbounded VLV offset array allocation leading to memory-exhaustion DoS
    * [GHSA-68r5-9hpg-7qw9](https://github.com/advisories/GHSA-68r5-9hpg-7qw9) - Unauthenticated SSRF, local file read and unbounded-read DoS in the DSMLv2 gateway
    * [GHSA-p279-2cqp-84jg](https://github.com/advisories/GHSA-p279-2cqp-84jg) - SASL PLAIN authzid bypassing the proxy ACI scope check
* Addressed third-party dependency vulnerabilities:
    * [CVE-2026-9828](https://nvd.nist.gov/vuln/detail/CVE-2026-9828) - QOS.CH logback-core deserialization of untrusted data
    * [CVE-2026-10532](https://nvd.nist.gov/vuln/detail/CVE-2026-10532) - Logback object injection through `HardenedObjectInputStream` modules

### Access control (ACI) fixes
* Fixed `StackOverflowError` while parsing long ACI with repetitive targets
* Fixed `StringIndexOutOfBoundsException` on a blank bind rule in ACI
* Fixed `NullPointerException` decoding an ACI bind rule with a missing `and`/`or` operand
* Fixed ACI grouped bind rule wrongly rejected when a value contains parentheses

### Replication fixes
* Fixed `OutOfMemoryError` during replication initialize with the JDBC backend
* Rejected TCP self-connects in replication connect paths
* Fixed import/export context leak on failed `initializeRemote` validation
* Fixed replication catch-up re-sending updates with the original assured flag
* Prevented rolling back a concurrently adopted generation ID on an aborted handshake

### Directory server fixes
* Fixed `cn=changelog` search failing when aliases are dereferenced
* Fixed dereferencing an alias that points into another backend
* Fixed alias dereferencing dropping entries and accumulating DNs
* Fixed global `idle-time-limit` having no effect on client connections
* Fixed race in `TraditionalWorkQueue.isIdle()`
* Fixed `finalizeWorkQueue` never cancelling queued operations
* Restored partial import semantics for include/exclude branches
* Fixed `ArrayIndexOutOfBoundsException` on truncated percent-encoding in LDAP URLs
* Rejected malformed bracketed IPv6 hosts in `HostPort`
* Fixed embedded server `rebuildIndex` failing with Connect Error
* Fixed embedded server setup failing with "Time service not started"
* Log JMX RMI connector startup failure at error level

### Packaging and distribution
* Fixed Windows scripts for install paths with spaces and parentheses
* Fixed duplicate SNMP connection handler entries in the packaged `config.ldif`
* Fixed duplicate `opendj-server-legacy` classes in the distribution `lib/`
* Declared the deb/rpm runtime dependencies (`java`, `which`, `chkconfig`)
* Modernized the OpenDJ Docker images and broadened their multi-architecture build matrix
* Documented Windows MSI install, upgrade and uninstall
* Added missing tools references to the documentation
* Bumped `org.openidentityplatform.commons` to 3.1.2

### Quality and CI
* Revived, fixed and enabled a large number of previously disabled test suites (ACI, SNMP, quicksetup, replication stress and slow-group tests)
* Added an OpenDJ vs OpenLDAP LDAP benchmark GitHub Action and PDB vs JE benchmarks
* Added CI smoke tests for the `addrate`/`authrate`/`modrate`/`searchrate` tools and the Windows MSI install
* Added CodeQL code scanning and enabled Javadoc doclint

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenDJ/compare/5.1.1...5.1.2))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<br/>
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>
<br/>
<i id="Pig-Tail"><i>3. <a href="https://github.com/Pig-Tail" target="_blank">Thepigtails</a></i>
<br/>
<i id="myandrews"><i>4. <a href="https://github.com/myandrews" target="_blank">myandrews</a></i>
<br/>
<i id="tonghuaroot"><i>5. <a href="https://github.com/tonghuaroot" target="_blank">tonghuaroot</a></i>
<br/>
<i id="wodzen"><i>6. <a href="https://github.com/wodzen" target="_blank">wodzen</a></i>
<br/>
<i id="manus-use"><i>7. <a href="https://github.com/manus-use" target="_blank">Jace</a></i>
<br/>
<i id="hypnguyen1209"><i>8. <a href="https://github.com/hypnguyen1209" target="_blank">Nguyen Van Hiep</a></i>
<br/>
<i id="ldap4life"><i>9. <a href="https://github.com/ldap4life" target="_blank">ldap4life</a></i></i>
