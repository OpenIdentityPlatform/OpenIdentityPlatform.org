---
layout: home
landing-title: "OpenAM 16.1.1 Released"
landing-title2: "OpenAM 16.1.1 Released"
description: OpenAM 16.1.1 with critical security fixes including pre-authentication RCE, session hijacking, LDAP injection, OAuth bypass vulnerabilities, and new features like MCP server and UI JS SDK
keywords: 'OpenAM, access management, SSO, release, 16.1.1, security update, CVE-2026-41573, CVE-2026-44202, CVE-2026-45049, CVE-2026-45051, CVE-2026-47424, RCE, XSS, LDAP injection, session hijacking, OAuth bypass'
imageurl: 'openam-og.png'
share-buttons: true
---
# OpenAM 16.1.1 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/16.1.1)

## What's new

### Security vulnerabilities - OpenAM
* Addressed critical OpenAM security vulnerabilities:
    * [CVE-2026-41573](https://github.com/advisories/GHSA-2vg8-q4c2-5cw3) - LDAP Injection via `_queryId` Parameter
    * [CVE-2026-44202](https://github.com/advisories/GHSA-c556-q2mh-477v) - Authenticated Server-Side Request Forgery (SSRF) via `/sessionservice`
    * [CVE-2026-44203](https://github.com/advisories/GHSA-fq9h-c788-fx73) - Pre-authentication Reflected XSS in OAuth2/OIDC
    * [CVE-2026-44793](https://github.com/advisories/GHSA-fhrq-3gmx-p879) - Pre-authentication Reflected XSS in SAML2 Cluster Cookie-Hash-Redirect Path
    * [CVE-2026-45049](https://github.com/advisories/GHSA-r9pv-5rpp-vm8g) - Session Hijacking via CDSSO
    * [CVE-2026-45048](https://github.com/advisories/GHSA-vvhj-w2jq-263q) - Arbitrary Session Hijacking via Session Service RPC
    * [CVE-2026-45051](https://github.com/advisories/GHSA-6c99-87fr-6q7r) - Conditional RCE via Java Deserialization in WebAuthn
    * [CVE-2026-45052](https://github.com/advisories/GHSA-p462-xxwx-pqf4) - Anonymous Authentication via Liberty SOAP
    * [CVE-2026-45794](https://nvd.nist.gov/vuln/detail/CVE-2026-45794) - Unsafe Java Deserialization via Push Notification
    * [CVE-2026-46498](https://nvd.nist.gov/vuln/detail/CVE-2026-46498) - Arbitrary OAuth Token Minting via Push Registration
    * [CVE-2026-46560](https://nvd.nist.gov/vuln/detail/CVE-2026-46560) - Authentication Bypass via RADIUS Spoofing
    * [CVE-2026-46619](https://nvd.nist.gov/vuln/detail/CVE-2026-46619) - Authentication Bypass via MSISDN LDAP Injection
    * [CVE-2026-46623](https://nvd.nist.gov/vuln/detail/CVE-2026-46623) - Account Takeover via OAuth2 Unverified Password Change
    * [CVE-2026-47424](https://nvd.nist.gov/vuln/detail/CVE-2026-47424) - Authenticated RCE via Groovy Sandbox Escape
    * [CVE-2026-47426](https://nvd.nist.gov/vuln/detail/CVE-2026-47426) - OAuth Client Impersonation via JWKS Resolver Cache
    * [CVE-2026-48717](https://nvd.nist.gov/vuln/detail/CVE-2026-48717) - OAuth Authorization Bypass via PKCE Challenge
    * [CVE-2026-53660](https://nvd.nist.gov/vuln/detail/CVE-2026-53660) - Insecure SSO Cookie Initialization

### Security vulnerabilities - dependencies
* Addressed third-party dependency vulnerabilities:
    * [CVE-2026-33870](https://nvd.nist.gov/vuln/detail/CVE-2026-33870) - Netty: HTTP Request Smuggling via Chunked Extension Quoted-String Parsing
    * [CVE-2025-67030](https://nvd.nist.gov/vuln/detail/CVE-2025-67030) - Plexus-Utils Directory Traversal vulnerability
    * [CVE-2026-4800](https://github.com/advisories/GHSA-r5fr-rjxr-66jc), [CVE-2026-2950](https://github.com/advisories/GHSA-f23m-r3pf-42rh) - lodash Code Injection and Prototype Pollution
    * [CVE-2026-27315](https://github.com/advisories/GHSA-fh34-c629-p8xj), [CVE-2026-32588](https://github.com/advisories/GHSA-qffm-gf3j-6mvg) - Apache Cassandra Information Leak and DoS
    * [CVE-2025-64718](https://github.com/advisories/GHSA-mh29-5h37-fv8m) - js-yaml prototype pollution in merge
    * [CVE-2026-21884](https://github.com/advisories/GHSA-8v8x-cx79-35w7), [CVE-2026-22029](https://github.com/advisories/GHSA-2w69-qvjg-hvjx), [CVE-2026-22030](https://github.com/advisories/GHSA-h5cw-625j-3rxh) - React Router SSR XSS and CSRF vulnerabilities
    * [CVE-2026-27606](https://github.com/advisories/GHSA-mw96-cpmx-2vgc) - Rollup Arbitrary File Write via Path Traversal
    * [CVE-2026-33228](https://github.com/advisories/GHSA-rf6f-7fwh-wjgh), [CVE-2026-32141](https://github.com/advisories/GHSA-25h7-pfq9-p65f) - flatted Prototype Pollution and DoS
    * [CVE-2026-39364](https://github.com/advisories/GHSA-v2wj-q39q-566r), [CVE-2026-39365](https://github.com/advisories/GHSA-4w7w-66w2-5vf9), [CVE-2026-39363](https://github.com/advisories/GHSA-p9ff-h696-f583), [CVE-2025-62522](https://github.com/advisories/GHSA-93m4-6634-74q7) - Vite multiple vulnerabilities
    * [CVE-2025-13465](https://github.com/advisories/GHSA-xxjr-mmjv-4gpg) - Lodash/odash Prototype Pollution
    * [CVE-2026-29063](https://github.com/advisories/GHSA-wf6x-7x77-mvgw) - Immutable Prototype Pollution
    * [CVE-2026-33671](https://github.com/advisories/GHSA-c2c7-rcm5-vvqj), [CVE-2026-33672](https://github.com/advisories/GHSA-3v7f-55p6-f55p) - Picomatch ReDoS and Method Injection
    * [CVE-2026-26996](https://github.com/advisories/GHSA-3ppc-4f35-3m26), [CVE-2026-27903](https://github.com/advisories/GHSA-7r86-cg39-jmmj), [CVE-2026-27904](https://github.com/advisories/GHSA-23c5-xmqv-rm74) - minimatch ReDoS
    * [CVE-2025-12383](https://github.com/advisories/GHSA-7p63-w6x9-6gr7) - SSL/TLS race condition causing certificate bypass
    * [CVE-2025-8916](https://github.com/advisories/GHSA-4cx2-fc23-5wg6) - PKIXCertPathReviewer DoS
    * [CVE-2025-7962](https://github.com/advisories/GHSA-9342-92gg-6v29) - Jakarta Mail SMTP Injection
    * [CVE-2026-41305](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) - PostCSS XSS
    * [CVE-2026-42577](https://github.com/advisories/GHSA-rwm7-x88c-3g2p) - Netty epoll DoS
    * [CVE-2026-44728](https://github.com/advisories/GHSA-fv7c-fp4j-7gwp) - @babel/plugin-transform-modules-systemjs arbitrary code
    * [CVE-2026-6321](https://github.com/advisories/GHSA-q3j6-qgpj-74h6), [CVE-2026-6322](https://github.com/advisories/GHSA-v39h-62p7-jpjc) - fast-uri percent-encoded dot segments
    * [CVE-2026-43869](https://nvd.nist.gov/vuln/detail/CVE-2026-43869) - Apache Thrift Certificate Validation
    * [CVE-2026-8723](https://github.com/advisories/GHSA-q8mj-m7cp-5q26) - qs remotely triggerable DoS
    * [CVE-2026-44705](https://github.com/advisories/GHSA-ph9p-34f9-6g65) - tmp Path Traversal
    * [CVE-2026-47429](https://github.com/advisories/GHSA-5xrq-8626-4rwp) - Vitest UI arbitrary file read
    * [CVE-2026-53550](https://github.com/advisories/GHSA-h67p-54hq-rp68) - JS-YAML DoS in merge key handling
    * [CVE-2026-53663](https://github.com/advisories/GHSA-84g9-w2xq-vcv6) - React Router CSRF
    * [CVE-2026-48988](https://github.com/advisories/GHSA-6v5v-wf23-fmfq), [CVE-2026-2327](https://github.com/advisories/GHSA-38c4-r59v-3vqw) - markdown-it ReDoS
    * [CVE-2026-49356](https://github.com/advisories/GHSA-4x5r-pxfx-6jf8) - @babel/core Arbitrary File Read
    * [CVE-2025-66453](https://github.com/advisories/GHSA-3w8q-xq97-5j7x) - Rhino: replaced servicemix bundle with org.mozilla:rhino:1.7.15.1

### Features
* Support HttpOnly session cookie in XUI
* Include `acr` and `amr` claims in stateless JWT access tokens
* Add OAuth2 Access Token Modification Script (`OAUTH2_ACCESS_TOKEN_MODIFICATION`)
* Create base entry on external configuration store during setup
* OpenAM MCP server
* OpenAM UI JS SDK
* Fixed SLO sending stale transient NameID when SP re-authenticates within same IdP session
* Updated embedded OpenDJ dependency to version 5.1.1
* Bumped Apache CXF to 4.0.11
* Upgraded PowerMock 1.7.4 → 2.0.9

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenAM/compare/16.0.6...16.1.1))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<br/>
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>
<br/>
<i id="gujjuboy10x00"><i>3. <a href="https://github.com/gujjuboy10x00" target="_blank">Vishal Panchani</a></i>
<br/>
<i id="wodzen"><i>4. <a href="https://github.com/wodzen" target="_blank">wodzen</a></i>
<br/>
<i id="nn0nkey"><i>5. <a href="https://github.com/nn0nkey" target="_blank">nn0nkey</a></i></i>
