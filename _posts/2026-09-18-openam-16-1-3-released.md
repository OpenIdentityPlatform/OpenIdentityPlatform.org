---
layout: home
landing-title: "OpenAM 16.1.3 Released"
landing-title2: "OpenAM 16.1.3 Released"
description: OpenAM 16.1.3 addresses 13 OpenAM security vulnerabilities including unauthenticated class instantiation, Liberty ID-FF federation-management access, SSRF and OAuth2/OpenID Connect flaws, adds security hardening and updates vulnerable third-party dependencies
keywords: 'OpenAM, access management, SSO, release, 16.1.3, security update, GHSA-qcqm-7432-wg7r, GHSA-wxmx-q96f-w4gw, GHSA-6jpj-522x-53vv, GHSA-xq25-2x9w-94w9, GHSA-g7cv-hh35-cc7c, SSRF, XSS, PKCE, OAuth2, OpenID Connect, Liberty ID-FF'
imageurl: 'openam-og.png'
share-buttons: true
---
# OpenAM 16.1.3 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/16.1.3)

## What's new

### Security vulnerabilities - OpenAM
* Addressed OpenAM security vulnerabilities:
    * [GHSA-qcqm-7432-wg7r](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-qcqm-7432-wg7r) - Unauthenticated federation-management operations via Liberty ID-FF endpoints
    * [GHSA-wxmx-q96f-w4gw](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-wxmx-q96f-w4gw) - Unauthenticated arbitrary class instantiation via the legacy JAX-RPC remote SDK interface
    * [GHSA-6jpj-522x-53vv](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-6jpj-522x-53vv) - Arbitrary class loading and instantiation via the entitlement applications REST endpoint
    * [GHSA-573r-mwh6-jw8j](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-573r-mwh6-jw8j) - Arbitrary class loading and instantiation via policy import (incomplete fix for CVE-2026-63468)
    * [GHSA-xq25-2x9w-94w9](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-xq25-2x9w-94w9) - Incomplete SSRF protection for server-fetched URLs (bypass of the CVE-2026-63467 and CVE-2026-63484 fixes)
    * [GHSA-g7cv-hh35-cc7c](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-g7cv-hh35-cc7c) - SSRF and unbounded server-side fetch via the OpenID Connect client `jwks_uri`
    * [GHSA-5p2f-7vcr-6vfh](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-5p2f-7vcr-6vfh) - PKCE enforcement does not cover OAuth 2.0 hybrid flows (residual of CVE-2026-48717)
    * [GHSA-6f8c-crwq-jqm3](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-6f8c-crwq-jqm3) - End-session endpoint accepts an unverified `id_token_hint`, enabling redirects to any client's registered post-logout URI
    * [GHSA-3m32-w9x3-vvq8](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-3m32-w9x3-vvq8) - Reflected XSS on the OAuth2 authorization error page
    * [GHSA-hmwh-9r8r-44gw](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-hmwh-9r8r-44gw) - Delegated session-destroy privilege is not scoped to the realm of the session being destroyed
    * [GHSA-x8cj-3hqv-cgwh](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-x8cj-3hqv-cgwh) - Session query REST endpoint lets a realm administrator list the sessions of every realm
    * [GHSA-mw38-8gr7-c4x2](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-mw38-8gr7-c4x2) - Anonymous forgot-password and self-registration REST actions send attacker-worded email from the server's own address
    * [GHSA-v796-mg6j-9c5m](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-v796-mg6j-9c5m) - Unencoded values in the SAML auto-submit page of the load-balancer cookie bounce (not reachable in released versions)

### Security hardening
* Hardened `AuthXMLRequest.setPrincipal` against arbitrary class instantiation (same pattern as CVE-2026-62379)
* Client assertions are verified by their own signing algorithm; `id_token_signed_response_alg` now has a default value
* Validated ID-FF forward targets, FilesRepo identity names and the SAML1 POST target
* Session ids, access tokens and password attributes are no longer written to logs
* Escaped reflected request parameters in the sample servlets
* `SetupUtils` passes `chmod` arguments to `Runtime.exec` as an array

### Security vulnerabilities - dependencies
* Addressed third-party dependency vulnerabilities:
    * [CVE-2026-71497](https://github.com/advisories/GHSA-pmhh-3w7g-xqp8) - jsoup Cleaner may expose markup with custom raw-text elements
    * [CVE-2026-43871](https://github.com/advisories/GHSA-8wv5-x4w7-5gww) - Apache Thrift infinite loop in the Java bindings
    * [CVE-2026-59949](https://github.com/advisories/GHSA-xx22-p4ch-683r) - lz4-java native XXHash implementations can crash the JVM on invalid byte array ranges
    * [CVE-2026-13149](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp), [CVE-2026-33750](https://github.com/advisories/GHSA-f886-m6hf-6m8v), [CVE-2026-45149](https://github.com/advisories/GHSA-jxxr-4gwj-5jf2), [CVE-2026-14257](https://github.com/advisories/GHSA-mh99-v99m-4gvg), [CVE-2026-69152](https://github.com/advisories/GHSA-rgw5-rvv9-x895) - brace-expansion DoS via unbounded expansion
    * [CVE-2026-59869](https://github.com/advisories/GHSA-52cp-r559-cp3m), [CVE-2026-84375](https://github.com/advisories/GHSA-2883-xcg3-v3hh), [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) - js-yaml quadratic CPU consumption in merge key and `!!omap` handling
    * [CVE-2026-13676](https://github.com/advisories/GHSA-4c8g-83qw-93j6), [CVE-2026-16221](https://github.com/advisories/GHSA-v2hh-gcrm-f6hx), [CVE-2026-18446](https://github.com/advisories/GHSA-7p8r-x3mc-p8w7), [CVE-2026-75899](https://github.com/advisories/GHSA-fph4-wmhf-6fwf), [CVE-2026-75931](https://github.com/advisories/GHSA-5jgf-p345-68v8), [CVE-2026-75975](https://github.com/advisories/GHSA-f65p-4m7j-42xc), [CVE-2026-76172](https://github.com/advisories/GHSA-jqff-g426-hqxp), [CVE-2026-84292](https://github.com/fastify/fast-uri/security/advisories/GHSA-qw65-cvwx-89v3), [CVE-2026-84394](https://github.com/fastify/fast-uri/security/advisories/GHSA-58mr-gqgx-xq4g) - fast-uri host confusion and SSRF
    * [CVE-2026-53666](https://github.com/advisories/GHSA-337j-9hxr-rhxg), [CVE-2026-53669](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6), [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2) - React Router constructor injection, open redirect and RSC mode CSRF bypass
    * [CVE-2026-69185](https://github.com/advisories/GHSA-2m8v-j782-fhvr), [CVE-2026-33151](https://github.com/advisories/GHSA-677m-j7p3-52f9) - Socket.IO memory exhaustion via binary attachments
    * [CVE-2026-59879](https://github.com/advisories/GHSA-v56q-mh7h-f735) - Immutable.js `List` 32-bit trie overflow DoS
    * [CVE-2026-59887](https://github.com/advisories/GHSA-v245-v573-v5vm) - linkify-it quadratic-complexity DoS via the `mailto:` validator
    * [CVE-2026-73646](https://github.com/advisories/GHSA-r28c-9q8g-f849) - PostCSS path traversal in source map auto-loading
    * [CVE-2026-73088](https://github.com/advisories/GHSA-73wf-gq98-2v4g), [CVE-2026-73089](https://github.com/advisories/GHSA-c83g-rgw3-j3cx) - Browserslist prototype write via untrusted custom stats and unbounded cache growth
    * [CVE-2026-84373](https://github.com/advisories/GHSA-82fw-gwwq-j7x9) - Vitest arbitrary file read via `@vitest/mocker` redirect mocks
    * [GHSA-p498-v437-472g](https://github.com/advisories/GHSA-p498-v437-472g) - humanfs recursive copy follows symlinks outside the source tree

### Fixes
* OAuth2 consent accepts the resource owner's session id as the CSRF value
* Added an upgrade step that syncs missing `ScriptingService` sub-configurations
* Click fork no longer calls the `javax.servlet`-bound upstream `ClickUtils`
* Fixed the `precompile-jsps` profile for the Jakarta EE 9 webapp
* Fixed contradicting documentation on XUI and HttpOnly session cookies

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenAM/compare/16.1.2...16.1.3))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<br/>
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>
<br/>
<i id="tsujiguchitky"><i>3. <a href="https://github.com/tsujiguchitky" target="_blank">tsujiguchitky</a></i>
<br/>
<i id="manus-use"><i>4. <a href="https://github.com/manus-use" target="_blank">Jace</a></i>
<br/>
<i id="santhreal"><i>5. <a href="https://github.com/santhreal" target="_blank">Santh</a></i>
<br/>
<i id="arpitjain099"><i>6. <a href="https://github.com/arpitjain099" target="_blank">Arpit Jain</a></i>
<br/>
<i id="Buggs777"><i>7. <a href="https://github.com/Buggs777" target="_blank">Buggs777</a></i>
<br/>
<i id="rockmelodies"><i>8. <a href="https://github.com/rockmelodies" target="_blank">rockymelody</a></i>
<br/>
<i id="alex-sc"><i>9. <a href="https://github.com/alex-sc" target="_blank">Alex P</a></i>
<br/>
<i id="tonghuaroot"><i>10. <a href="https://github.com/tonghuaroot" target="_blank">tonghuaroot</a></i>
<br/>
<i id="BarakSrour"><i>11. <a href="https://github.com/BarakSrour" target="_blank">BarakSrour</a></i>
<br/>
<i id="jamesbishup"><i>12. <a href="https://github.com/jamesbishup" target="_blank">Bishop</a></i>
<br/>
<i id="ayhambashtawi2-lang"><i>13. <a href="https://github.com/ayhambashtawi2-lang" target="_blank">Ayham</a></i></i>
