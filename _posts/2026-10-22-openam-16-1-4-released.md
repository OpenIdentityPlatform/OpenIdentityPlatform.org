---
layout: home
landing-title: "OpenAM 16.1.4 Released"
landing-title2: "OpenAM 16.1.4 Released"
description: OpenAM 16.1.4 addresses 18 OpenAM security vulnerabilities including session token disclosure, unsigned SAML v2.0 assertions, administrator account creation through self-registration, built-in accounts with known passwords and open redirects, fixes Windows Desktop SSO and CTS persistent search, and updates vulnerable third-party dependencies
keywords: 'OpenAM, access management, SSO, release, 16.1.4, security update, GHSA-5c3q-hp86-xjr8, GHSA-3j2f-qhrc-rjfj, GHSA-jv8f-m88g-h6mm, GHSA-545c-rm35-2jj2, GHSA-x7wr-5gxg-v833, GHSA-hvfc-4v4r-8p9w, SAML, WS-Federation, open redirect, SSRF, PKCE, OAuth 2.0 device flow, Windows Desktop SSO, Kerberos, CTS'
imageurl: 'openam-og.png'
share-buttons: true
---
# OpenAM 16.1.4 Released
[Download](https://github.com/OpenIdentityPlatform/OpenAM/releases/tag/16.1.4)

## What's new

### Security vulnerabilities - OpenAM
* Addressed OpenAM security vulnerabilities:
    * [GHSA-5c3q-hp86-xjr8](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-5c3q-hp86-xjr8) - Unauthenticated disclosure of live session tokens via the notification WebSocket, enabling session hijacking and administrative compromise
    * [GHSA-3j2f-qhrc-rjfj](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-3j2f-qhrc-rjfj) - SAML v2.0 service provider accepts unsigned assertions on some bindings, allowing unauthenticated account takeover
    * [GHSA-jv8f-m88g-h6mm](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-jv8f-m88g-h6mm) - Self-registration does not enforce the allowed attribute list, allowing an anonymous user to create an administrator account
    * [GHSA-545c-rm35-2jj2](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-545c-rm35-2jj2) - Cross-site request forgery in the OAuth 2.0 device flow lets a client obtain tokens for a logged-in user when consent is skipped
    * [GHSA-x7wr-5gxg-v833](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-x7wr-5gxg-v833) - Unauthenticated denial of service through unbounded deserialisation on remote SDK and console endpoints
    * [GHSA-hvfc-4v4r-8p9w](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-hvfc-4v4r-8p9w) - Built-in accounts with publicly known passwords (demo user, anonymous, WS-Security agents) allow unauthenticated login
    * [GHSA-g5vw-v384-gw9v](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-g5vw-v384-gw9v) - SSRF, credential leak and CRL store tampering via the CRL distribution point of a presented certificate
    * [GHSA-mgwg-24cx-c8w3](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-mgwg-24cx-c8w3) - Open redirect from WS-Federation and SAML v2.0 pages that do not check the destination against the allowed list
    * [GHSA-fhqm-62hv-4phw](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-fhqm-62hv-4phw) - Open redirect via SAML v2.0 RelayState when no RelayState URL list is configured (the default)
    * [GHSA-2gwf-vxp5-f9v2](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-2gwf-vxp5-f9v2) - Open redirect and cross-site scripting via the `goto` and `gotoOnFail` parameters
    * [GHSA-6gg2-2v5m-454x](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-6gg2-2v5m-454x) - Insufficient validation of responses on the internal server-to-server SOAP channel
    * [GHSA-h93p-35jm-rj83](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-h93p-35jm-rj83) - PKCE is not enforced in the OAuth 2.0 device authorization flow
    * [GHSA-rw43-r238-4c7j](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-rw43-r238-4c7j) - Open redirect after SAML 1.x single sign-on through loose trusted-partner matching
    * [GHSA-v6hq-3cfh-5gr6](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-v6hq-3cfh-5gr6) - Stored cross-site scripting through the user display name on the OAuth 2.0 / OpenID Connect consent page
    * [GHSA-j56q-q3r3-hg7f](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-j56q-q3r3-hg7f) - SAML 1.x signature verification does not bind the signer to the issuer, allowing one trusted partner to impersonate another
    * [GHSA-7q42-6xr7-9rmw](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-7q42-6xr7-9rmw) - Server-side request forgery through UMA scope description URLs in pending-request notifications
    * [GHSA-rmw3-j353-w9f7](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-rmw3-j353-w9f7) - Server-side request forgery through metadata URLs in the federation configuration wizards
    * [GHSA-pw99-8h4m-p3gm](https://github.com/OpenIdentityPlatform/OpenAM/security/advisories/GHSA-pw99-8h4m-p3gm) - Incomplete encoding of attribute values in the SAML 1.x service provider form POST

### Upgrade notes
Several fixes change behaviour that existing deployments may rely on. Review these notes and the linked advisories before upgrading.

* Redirect destinations are now checked against allow-lists. While a list is empty, `goto` and `gotoOnFail`, the SAML v2.0 RelayState, the WS-Federation `wreply`, the SAML 1.x `TARGET` and the Liberty ID-FF destinations are limited to the OpenAM deployment itself. List the destinations on other hosts, including the applications policy agents send users back to, in Valid goto URL Resources of each realm, in the RelayState URL list or the wreply list of the hosted entity, or in the new Relay State URL List of a hosted ID-FF provider. The XUI now honours Valid goto URL Resources too, so check a list that is already populated. As a stopgap during the upgrade, the advanced server properties `org.openidentityplatform.openam.auth.goto.allowAnyUrlWithoutWhitelist` (Valid goto URL Resources) and `org.openidentityplatform.openam.federation.allowAnyUrlWithoutWhitelist` (RelayState and wreply lists) set to `true` let an empty list accept any destination again
* The upgrade deactivates the `demo`, `wsc`, `wsp`, `SecurityTokenService` and `agentAuth` identities that are still active and still have their default password, and `anonymous` no longer authenticates with a password. The upgrade report lists every identity that was switched off. A deployment that uses WS-Security, the Security Token Service or the agent authenticator with the shipped credentials must give the identity a password of its own and activate it again. See [Upgrading & Authentication Defaults](https://doc.openidentityplatform.org/openam/upgrade-guide/chap-about-upgrades#upgrade-authentication-defaults)
* New installations ship with account lockout enabled, a 30-minute lockout duration and module based authentication disabled. Upgraded realms keep their settings
* `ssoadm` now authenticates administrators against the administrator authentication chain of the top level realm instead of the `DataStore` module, so a chain that asks for more than a user name and a password refuses `ssoadm`
* A SAML v2.0 service provider refuses unsigned assertions on every binding with `assertionNotSigned`. Two OpenAM servers, or an OpenAM identity provider and a Fedlet, federated over HTTP-Artifact with the default settings are affected: set `WantAssertionsSigned="true"` in the service provider metadata, the identity provider's copy included, before upgrading
* Every trusted SAML 1.x asserting party needs its signing certificate in the OpenAM keystore and its alias in the trusted partner configuration. Signed messages from a partner without a configured alias are rejected, and no setting restores the previous behaviour, so configure the aliases before upgrading
* Self-registration refuses a request that carries an attribute not listed in Valid Creation Attributes. Add the extra profile fields your registration form sends to the list, and keep `mail` in it
* Customised copies of the device flow user code page must carry the CSRF token, and a link or QR code with the user code filled in now opens an empty form. Device flow clients that send a PKCE challenge must send the verifier when polling for tokens
* The HTTP Parameters for CRL Update are sent only to the hosts listed in the new advanced server property `org.openidentityplatform.openam.crl.dp.param-hosts`. A host-less LDAP distribution point such as `ldap:///CN=...`, which Active Directory Certificate Services issues by default, is refused: keep such CRLs in the LDAP CRL store and clear **Update CA CRLs from CRLDistributionPoint**
* UMA scope descriptions and federation wizard metadata on internal addresses are no longer fetched. Paste the metadata into the wizard, or set `org.openidentityplatform.uma.scope-description.allow-any-address` or `org.openidentityplatform.federation.workflow.allow-any-address` to `true` to lift the address check
* Sorted collections are no longer on the default `openam.deserialisation.classes.whitelist`. A customisation that uses them can add them back
* A customised `web.xml` must take over the `<dispatcher>` elements 16.1.4 adds to the `AuthNFilter`, `AuthZFilter`, `JAXRPCRequestFilter` and `NotificationsWebSocketFilter` mappings. Notification clients can subscribe only to `/agent/` topics
* SMTPS now checks that the mail server certificate names the server host. A mismatch fails with `Can't verify identity of server` and stops password reset, lockout notification, the Email Service and email one-time passwords. The new advanced server property `org.openidentityplatform.openam.smtp.checkServerIdentity` set to `false` turns the check off
* Adding a server to an existing site fails when the certificate of the existing server does not name the host of its URL

### Security hardening
* The security filters now run on every dispatch type: forwards, includes, asynchronous and error dispatches, not only direct requests
* All serialized data that OpenAM reads is checked against size and structure limits, configurable through `openam.deserialisation.limits`
* CRL downloads are limited to `http`, `https`, `ldap` and `ldaps`, checked at every redirect hop and bounded in time and size, and a CRL is stored only after its issuer, signature and freshness are verified. Set `org.openidentityplatform.openam.crl.dp.strict` to `true` to refuse private and site-local addresses as well
* WindowsDesktopSSO fails instead of being ignored when the token check rejects a token, so a REQUIRED or REQUISITE module stops the chain
* Expired device codes are rejected at the token and verification endpoints
* The `HttpOnly` cookie flag is applied again to every cookie OpenAM creates when it is configured, and the login and CDC servlets delete cookies with their path and domain
* Stack traces and exception messages are kept out of HTTP responses
* A logged value can no longer forge a debug log record
* The .NET Fedlet reads SAML parameters only from their binding, and its sample application no longer enables directory browsing
* Setup no longer trusts a certificate issued for another host when it sends the administrator password to an existing server
* Temporary files are created readable by their owner only
* The Docker image applies Ubuntu security updates at build time

### Security vulnerabilities - dependencies
* Addressed third-party dependency vulnerabilities:
    * [CVE-2026-84939](https://github.com/advisories/GHSA-27j2-h3m2-8237) - Apache FreeMarker template loading path traversal
    * [CVE-2026-75140](https://github.com/advisories/GHSA-65r4-943x-97jj) - jsoup `XmlTreeBuilder` memory exhaustion through deeply nested namespace declarations
    * [CVE-2026-106449](https://github.com/advisories/GHSA-343h-94h5-c4wr), [CVE-2026-106450](https://github.com/advisories/GHSA-gm45-99xc-r7wv), [CVE-2026-106451](https://github.com/advisories/GHSA-mcr4-qmvw-px4g), [CVE-2026-106452](https://github.com/advisories/GHSA-4v53-57pg-c464), [CVE-2026-106453](https://github.com/advisories/GHSA-6cx8-rjf8-pr8g) - lz4-java decompression DoS and native library hijack via a shared temporary directory
    * [CVE-2026-102276](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p), [CVE-2026-102277](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), [CVE-2026-102278](https://github.com/advisories/GHSA-qhr7-859c-m2p7) - brace-expansion stack exhaustion and quadratic-time DoS in brace parsing
    * [GHSA-253c-mchw-3w2r](https://github.com/advisories/GHSA-253c-mchw-3w2r), [CVE-2026-111759](https://github.com/advisories/GHSA-r7fv-28h4-cvq7), [CVE-2026-111758](https://github.com/advisories/GHSA-gfr2-rv44-r23c), [CVE-2026-111766](https://github.com/advisories/GHSA-vfgh-jcmw-g37q) - markdown-it quadratic-time DoS in linkify, smartquotes, multi-line reference definitions and inline HTML
    * [CVE-2026-93749](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) - source-map-js event-loop DoS via indexed source-map section offsets
    * [CVE-2026-111755](https://github.com/advisories/GHSA-8r9p-f939-6h3c), [CVE-2026-111756](https://github.com/advisories/GHSA-q3jh-wrc6-jgq8) - follow-redirects forwards credential headers on cross-origin redirects
    * [CVE-2026-112942](https://github.com/advisories/GHSA-587h-7wmj-h5pm), [CVE-2026-112943](https://github.com/advisories/GHSA-698v-4r3x-3vcv), [CVE-2026-112944](https://github.com/advisories/GHSA-r825-w8mm-5pxw), [CVE-2026-112945](https://github.com/advisories/GHSA-9jrq-w75r-8gcw), [CVE-2026-112946](https://github.com/advisories/GHSA-rq7h-c2jc-7f22) - Vite dev server command injection via the bundled launch-editor and `server.fs` bypass
    * Bumped the test-only `tomcat-embed-core` dependency to 10.1.59 to clear 16 Apache Tomcat CVEs reported by vulnerability scanners; it is not shipped with OpenAM
* Updated the embedded OpenDJ to [5.2.0](/blog/2026-10-21-opendj-5-2-0-released), which addresses its own security vulnerabilities

### Fixes
* WindowsDesktopSSO (Kerberos/SPNEGO):
    * `/json/authenticate` completes from a `Negotiate` header in one request, so Kerberos SSO completes through the XUI
    * A retry on expired service credentials now succeeds, and the renewed service login is cached
* The CTS, configuration store and identity repository persistent searches restart after a lost connection, so cross-server session invalidation and CTS notifications no longer stop until OpenAM is restarted
* OpenID Connect tokens issued through the OAuth 2.0 device code flow can carry the `acr`, `amr` and `nonce` claims
* The IdP discovery cookie stays within RFC 6265, so `/saml2writer` no longer fails with a leading-dot cookie domain or a list of several identity providers
* `LDAPUtils.dnRule` accepts an unescaped `=` and a non-leading `#` in attribute values, so entity IDs such as `https://accounts.google.com/o/saml2?idpid=...` or URLs with a fragment can be stored
* A debug configuration without a prefix or suffix line, or with trailing spaces, no longer breaks debug logging or silently disables rotation
* Documented the debug log rotation requirements
* Replaced legacy ForgeRock links in the guides with Antora cross-references, and fixed typos, unresolved placeholders and dead links

### Quality and CI
* Enabled the CodeQL security-and-quality suite and fixed medium-severity CodeQL code scanning alerts
* Added Trivy vulnerability scanning of the Docker image, Dependabot for GitHub Actions and SHA-pinned actions with least-privilege token permissions
* Added WindowsDesktopSSO tests with a real KDC: a Playwright end-to-end test and a Kerby module test, without Windows or Active Directory
* Stabilized the UI unit tests and made the server tests independent of class order
* The CI build covers Java 27

Full changeset ([more details](https://github.com/OpenIdentityPlatform/OpenAM/compare/16.1.3...16.1.4))

## Thanks for the contributions

<i id="vharseko"><i>1. <a href="https://github.com/vharseko" target="_blank">Valery Kharseko</a></i>
<br/>
<i id="maximthomas"><i>2. <a href="https://github.com/maximthomas" target="_blank">Maxim Thomas</a></i>
<br/>
<i id="tsujiguchitky"><i>3. <a href="https://github.com/tsujiguchitky" target="_blank">Tsujiguchi Takaya</a></i>
<br/>
<i id="FireBurn"><i>4. <a href="https://github.com/FireBurn" target="_blank">Mike Lothian</a></i>
<br/>
<i id="leanworld7-netizen"><i>5. <a href="https://github.com/leanworld7-netizen" target="_blank">leanworld7-netizen</a></i>
<br/>
<i id="DauHoangTai"><i>6. <a href="https://github.com/DauHoangTai" target="_blank">taidh</a></i>
<br/>
<i id="rockmelodies"><i>7. <a href="https://github.com/rockmelodies" target="_blank">rockymelody</a></i>
<br/>
<i id="santhreal"><i>8. <a href="https://github.com/santhreal" target="_blank">Santh</a></i>
<br/>
<i id="jamesbishup"><i>9. <a href="https://github.com/jamesbishup" target="_blank">Bishop</a></i>
<br/>
<i id="manus-pi"><i>10. <a href="https://github.com/manus-pi" target="_blank">Daniel Coles</a></i>
<br/>
<i id="qurb4n01"><i>11. <a href="https://github.com/qurb4n01" target="_blank">Gurban Bannayev</a></i>
<br/>
<i id="isazajuancarlos"><i>12. <a href="https://github.com/isazajuancarlos" target="_blank">Juan Carlos Isaza</a></i>
<br/>
<i id="manus-use"><i>13. <a href="https://github.com/manus-use" target="_blank">Jace</a></i>
<br/>
<i id="dairoca90"><i>14. <a href="https://github.com/dairoca90" target="_blank">dairoca90</a></i>
<br/>
<i id="nicholascowan"><i>15. <a href="https://github.com/nicholascowan" target="_blank">nicholascowan</a></i></i>
