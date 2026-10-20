---
layout: home
title: "Migrating from PingAM 7.5 to OpenAM: A Planning Guide"
landing-title: "From PingAM 7.5 to OpenAM: A Migration Plan"
landing-title2: "From PingAM 7.5 to OpenAM: A Migration Plan"
description: "A component-by-component look at moving from PingAM 7.5 to OpenAM: what carries over directly, what has to be redesigned and how to estimate the effort."
keywords: 'PingAM migration, PingAM to OpenAM migration, migrate from PingAM, PingAM 7.5, PingAM 8 upgrade, PingAM alternative, open source PingAM alternative, ForgeRock AM migration, ForgeRock AM alternative, authentication chains, authentication trees, OpenAM authentication modules, Amster export, ssoadm'
imageurl: 'openam-og.png'
share-buttons: true
products:
- openam
faq:
  - q: "Can I import a PingAM configuration into OpenAM?"
    a: "Not directly. PingAM 7.5 exports its configuration as JSON through Amster or file-based configuration, while OpenAM is configured through ssoadm, the console and the REST API. There is no supported import path between them, so the configuration is re-created rather than copied. An Amster export is still worth making. It is the most complete machine-readable description of what your deployment contains, and we use it as the inventory in the first step."
  - q: "Does OpenAM support authentication trees?"
    a: "No. OpenAM implements authentication as modules combined into chains, and it ships with more than thirty authentication modules. PingAM 7.5 still supports modules and chains alongside trees, so if you have stayed on chains, the concepts map one to one, although you still have to re-create the configuration by hand rather than import it. OpenAM has no runtime for flows built as trees, so they have to be rebuilt as chains: branching moves into a scripted module or into separate chains, and node scripts are rewritten."
  - q: "Can OpenAM use my existing identity store?"
    a: "Yes. OpenAM connects to an existing LDAP directory, Active Directory or PingDS (formerly ForgeRock DS) as its identity repository, so user data usually stays where it is. If you also need to move off PingDS, user data moves to OpenDJ through a standard LDIF export and import. What survives that move depends on four things: password storage schemes, because users cannot bind if the schemes do not match; the PingDS schema and operational attributes; confidential or encrypted attributes; and the replication topology, which is rebuilt rather than migrated."
  - q: "How long does a migration from PingAM to OpenAM take?"
    a: "It depends above all on how authentication is built. For deployments that have stayed on chains and modules, with an external identity store and standard OAuth 2.0 or SAML integrations, the migration is mostly mechanical work. Deployments that have moved heavily to trees or include many custom Java authentication nodes need their authentication rebuilt and should be planned as a project, not as a version upgrade. On top of this baseline estimate, the number of realms, policy agents and federation partners affects the timeline."
  - q: "Is Open Identity Platform affiliated with Ping Identity?"
    a: "No. Open Identity Platform is an independent community project; it is neither affiliated with nor endorsed by Ping Identity. PingAM is a trademark of Ping Identity."
---

# Migrating from PingAM 7.5 to OpenAM: A Planning Guide

This article is for architects and technical leads who run PingAM 7.5 and are considering a move to OpenAM, an open-source access management system that the Open Identity Platform community develops under the CDDL license.

It is not a step-by-step guide but an architecture- and planning-level overview of the migration that helps you estimate how much work it takes and what that work consists of.

## What This Article Covers

This article covers the following:

* The main reasons to migrate off PingAM.
* A brief description of OpenAM.
* The main factor that drives the scope of work: whether authentication is built on chains and modules or on trees and nodes.
* A component-by-component mapping of PingAM 7.5 to OpenAM (identity store, configuration store, realms, policies, federation services and so on), with an effort estimate for each item.
* What does not carry over (trees and nodes, active sessions and tokens, secrets) and which decisions about keys and endpoint addresses you need to make before the work starts.
* Additional factors that affect the effort: custom code, realms, policy agents, federation partners.
* The migration steps, from taking inventory of the PingAM deployment to decommissioning it.

Step-by-step guides to individual parts of the migration will follow in later posts; they are listed at the end of this article.

## Why Move Off PingAM

The main reasons to migrate are rarely technical:

**Licensing.** PingAM is available only by subscription: you can use it free of charge only for development and testing, and production use requires a paid license. [Ping's licensing guide](https://docs.pingidentity.com/licensing-guide/advanced-identity-software.html) meters self-managed software, PingAM included, by stored identities: every user, device or other object in the store counts, even one that has long been inactive. So the license size grows with the store, not with the actual load. This hits hardest in deployments with many rarely used accounts, such as citizen-facing government services.

**Upgrading to PingAM 8 is a migration too.** ForgeRock deprecated authentication chains and modules back in AM 7.0, and Ping [removed them in PingAM 8.0](https://docs.pingidentity.com/pingam/release-notes/changes-8.0.html). If your authentication flows are built on chains, upgrading to PingAM 8 means rebuilding them as trees, that is, redesigning authentication. In OpenAM, the same chains carry over mechanically; more on that below. You cannot put the decision off for long: according to [Ping's EOL tracker](https://support.pingidentity.com/s/article/Ping-Identity-EOL-Tracker), updates and standard support for PingAM 7.5 end in April 2027.

**Control over the code.** A binary distribution and a support contract cover most needs. You can extend PingAM with custom nodes, plugins and scripts, but [Ping's subscription agreement](https://www.pingidentity.com/en/legal/subscription-agreement.html) forbids modifying or decompiling the product itself. If a bug or a limitation sits in the core, all you can do is wait for the vendor to fix it. OpenAM is released under the CDDL and its code is on GitHub, so you can modify it yourself and develop it together with the community, and when you write custom extensions, you can work from the source code of the core.

## What Is OpenAM

Open Identity Platform OpenAM and PingAM grew out of the same product, ForgeRock OpenAM, and share the same original codebase. The last shared public source code under the CDDL was released in 2016; the Open Identity Platform community has continued development and support on GitHub under the same license. ForgeRock developed its fork as ForgeRock AM; in 2023, Thoma Bravo acquired ForgeRock and combined it with Ping Identity, and a year later AM became PingAM.

After the split, the products went in different directions. PingAM gained authentication trees and nodes. The configuration tooling diverged too: Amster and file-based configuration in PingAM, `ssoadm` and the REST API in OpenAM. OpenAM stayed with authentication modules and chains and kept developing them: it ships with [thirty-two documented authentication module types](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules). The OAuth 2.0, OpenID Connect and SAML 2.0 federation services and the authorization policy engine are still the same at their core in both products, but PingAM has added extensions to them that OpenAM lacks, such as CIBA, PAR, token exchange and transactional authorization. They are grouped in a separate row of the table below.

You can download the distributions and read the documentation on building OpenAM yourself on the [OpenAM](/openam) page. If AM is not the only product in your infrastructure, a separate page of the Open Identity Platform website [maps the rest of the ecosystem to ForgeRock products](https://www.openidentityplatform.org/forgerock-alternative): OpenDJ, OpenIDM, OpenIG and OpenICF.

## What Drives the Scope of Work

First, find out how your authentication flows are configured. PingAM 7.5 supports both models: modules assembled into chains, and trees built from nodes.

**If you still use authentication chains**, the flows carry over one to one. A module stays a module, a chain stays a chain, and the `REQUIRED`, `REQUISITE`, `SUFFICIENT` and `OPTIONAL` criteria behave identically. The module sets do not match completely: check every module type you use against the [OpenAM module reference](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules). You will still have to transfer the configuration by hand, but in this case you are only transferring settings mechanically, not redesigning authentication flows.

**If you use authentication trees**, the flows have to be redesigned. A tree is a graph: each node ends with one of several outcomes, and the graph decides what runs next. A chain is a list that runs in order. The branching that a tree expresses through its structure has to move somewhere else: into a scripted module or into separate chains. Scripts do not carry over either: a node script works with `nodeState` and sets a named outcome through the `outcome` variable or the `action` object, while an OpenAM scripted module works with `authState` and sets it to `SUCCESS` or `FAILED`.

## Mapping PingAM Features to OpenAM

The table below breaks PingAM features down by component. The second column shows whether OpenAM has an equivalent: ✅ means it does, ⛔️ means it does not. An equivalent does not by itself mean a mechanical transfer; the effort column shows what kind of work is involved. It gives a relative level of effort: **Low** is a mechanical transfer, **Medium** is a transfer plus another round of coordination or testing, and **High** is redesign and reimplementation.

| PingAM 7.5 | OpenAM | How it carries over | Effort |
| --- | --- | --- | --- |
| Authentication modules and chains | ✅ [docs](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules) | Re-created by hand. Modules that exist in both products behave the same, and so do criteria and module order. The module sets do not match completely, so check each type against the reference. | Low |
| Authentication trees and nodes | ⛔️ | Rebuilt as chains. Branching moves into a scripted module or into separate chains selected per request. | High |
| Custom Java authentication nodes | ⛔️ | Rewritten for the [OpenAM authentication SPI](https://doc.openidentityplatform.org/openam/dev-guide/chap-customizing#sec-auth-spi). | High |
| Scripted authentication module scripts | ✅ [docs](https://doc.openidentityplatform.org/openam/admin-guide/chap-manage-scripts) | The `authState`, `sharedState`, `httpClient` and `idRepository` bindings are the same, but the scripts still have to be revised and retested. Add the `org.forgerock.http.protocol.*` and `org.forgerock.util.promise.*` packages to the class whitelist of the `AUTHENTICATION_SERVER_SIDE` context, or HTTP calls through `httpClient.send()` will not work. OpenAM uses Groovy 2.4, so Groovy 3 syntax has to be rewritten, and OpenAM has no `systemEnv` or `scriptName` bindings. | Medium |
| Scripted Decision node scripts | ⛔️ | Rewritten. There is no equivalent for `nodeState` or named outcomes. | High |
| Identity store (PingDS, AD, other LDAP) | ✅ [docs](https://doc.openidentityplatform.org/openam/reference/chap-user-data-stores) | Point an OpenAM data store at the store you already run. For PingDS, choose the OpenDJ type, which the PingAM 7.5 documentation also recommends. With the Generic LDAPv3 type, OpenAM silently stops reading and writing attributes that are not on its default list: account lockout counters, OATH and Push profiles, SAML persistent NameIDs. For LDAPS, OpenAM defaults to the outdated TLSv1; change it to TLSv1.2. No data has to be moved, but OpenAM will write to the same accounts: two-factor authentication device profiles and, if lockout is enabled, the lockout attributes. This matters for rollback (see "Two-factor authentication devices"). | Low |
| Configuration store | ✅ | There is no automated import. The OpenAM installer creates the store, in an embedded or an external OpenDJ. Its contents (realms, policies, clients) are covered in the rows below. Servers and sites are configured separately, and so is replication for an external store. | Low |
| Realms | ✅ [docs](https://doc.openidentityplatform.org/openam/admin-guide/chap-realms) | `ssoadm create-realm`, then the services of each realm. | Low |
| Policies and policy sets | ✅ [docs](https://doc.openidentityplatform.org/openam/admin-guide/chap-authz-policy) | Re-created. The model is the same: policy sets, subjects, conditions, resource types. OpenAM has no Transaction condition (see the extensions row below). | Medium |
| OAuth 2.0 and OIDC services and clients | ✅ [OAuth 2.0](https://doc.openidentityplatform.org/openam/admin-guide/chap-oauth2), [OIDC](https://doc.openidentityplatform.org/openam/admin-guide/chap-openid-connect) | Registered again. This applies to the standard flows — authorization code (including with PKCE), implicit and OpenID Connect hybrid flows, resource owner password, client credentials, refresh token, device flow, JWT bearer and SAML 2.0 bearer — and to the `client_secret_basic`, `client_secret_post` and `private_key_jwt` client authentication methods. Scope validation and evaluation scripts are rewritten as a Java `ScopeValidator` plugin. | Medium |
| OAuth 2.0, OIDC and policy extensions | ⛔️ | OpenAM has no CIBA, PAR, JAR or JARM, token exchange (RFC 8693), mTLS client authentication or certificate-bound tokens (RFC 8705), OIDC Back-Channel Logout, macaroons, remote consent service, Transaction condition in policies, or scope decisions through the policy engine. Applications and policies that depend on them have to be rebuilt around the supported flows and conditions. On top of that, transactional authorization in PingAM relies on trees. | High |
| SAML 2.0 entities and circles of trust | ✅ [docs](https://doc.openidentityplatform.org/openam/admin-guide/chap-federation) | Metadata is imported again, and attribute mapping is configured again. If entity IDs, endpoint URLs or signing certificates change, partners will need your new metadata. | Medium |
| Web agents and Java agents | ✅ [docs](https://doc.openidentityplatform.org/openam/admin-guide/chap-agents) | Ping agents do not work with OpenAM. Re-create the agent profiles in OpenAM, and when you cut over a group of applications, replace the Ping agents with OpenAM web policy agents or Java EE policy agents, or with OpenIG. | Medium |
| Secret stores | ⛔️ | OpenAM has no secret store layer: each secret label resolves to an alias in the [keystore](https://doc.openidentityplatform.org/openam/admin-guide/chap-certs-keystores). Nor is there rotation through secret mappings, where one secret label maps to several aliases: you change a key by replacing it in the keystore. If possible, import the existing key pairs. | Medium |
| Sessions in CTS | ✅ [docs](https://doc.openidentityplatform.org/openam/install-guide/chap-cts) | Not transferred. After the move to OpenAM, users authenticate again. | Low |
| Custom identity repositories and plugins | ✅ [docs](https://doc.openidentityplatform.org/openam/dev-guide/chap-customizing#sec-identity-repo-spi) | Have to be adapted to the OpenAM API and rebuilt: the SPIs are the same, but package names and signatures may have changed. | High |
| End-user pages | ✅ [docs](https://doc.openidentityplatform.org/openam/install-guide/chap-custom-ui) | The UI has to be developed again. | Medium |

## What Does Not Carry Over

Five rows of the table are marked ⛔️. Trees, custom nodes and node scripts have no equivalent in OpenAM and have to be redesigned and rewritten. The OAuth 2.0, OIDC and policy extensions without an equivalent will require changes to applications, and replacing keys in the keystore takes the place of rotation through secret stores. But even where an equivalent exists, not everything carries over: active tokens, encrypted values and some two-factor authentication device registrations are lost in the move, and keys and addresses stay the same only if you decide in advance to keep them.

**Active tokens.** The CTS row is rated Low because there is nothing to rebuild: users simply have to authenticate again. But CTS holds more than sessions. It also holds OAuth 2.0 refresh tokens. After the migration, every refresh token issued so far stops working. For a browser application, this means the same login page that a lost session would have shown anyway. Mobile apps will also ask users to sign in again, although a refresh token usually spares them that for weeks or months. This can put extra load on support, and the team that will handle support requests should hear about it in advance.

**Encrypted values.** A standard Amster export contains no passwords at all. Encrypted passwords appear only if you set a transport key beforehand, and they can be decrypted only by importing them back into AM. Either way, the export gives you a list of the secrets you need, not the secrets themselves: data store connection passwords, agent passwords, OAuth 2.0 client secrets, email credentials. Every password or secret has to be retrieved from wherever it originally came from, or reset, and resetting a client secret means finding the owner of that client and coordinating the reset with them.

**Two-factor authentication devices.** PingAM stores registered devices in the user profile: OATH devices in the `oathDeviceProfiles` attribute, Push devices in `pushDeviceProfiles`, WebAuthn devices in `webauthnDeviceProfiles`. The Authenticator (OATH) and Authenticator (Push) modules in OpenAM read the same attributes by default, so an OpenAM instance connected to the same store sees these devices, provided its data store is configured with the OpenDJ type rather than Generic LDAPv3. The separate, older OATH module will not do here: it takes the secret from an attribute of its own, which is not set by default, and does not read `oathDeviceProfiles`. Even OATH and Push devices do not move over intact, though. PingAM stores recovery codes as a one-way hash (Ping's documentation calls this one-way encryption), while OpenAM compares the entered code directly against the stored value, so the old codes will not work and users will have to be issued new ones. If device profile encryption is enabled in PingAM (it is disabled by default), choose the same encryption scheme in OpenAM and import the same key pair. A Push device is also tied to the server: the address the app sends approvals to came from the QR code at registration, and its notifications come through the push notification service configured in PingAM. If the address changes or OpenAM cannot use the same service, Push devices will have to be registered again. WebAuthn devices will have to be registered again in any case: OpenAM stores their keys in a different attribute and in its own format. And warn support: device re-registration will bring another wave of support requests.

OpenAM does not just read OATH profiles; it writes to them too. On every login through Authenticator (OATH), it updates `oathDeviceProfiles` with the HOTP counter, or with the TOTP login time and clock drift, and on every write, at login and at registration alike, it leaves a single profile in the attribute. The Push profile does not change on a regular login: OpenAM overwrites it only when a recovery code is used. The OATH profile fields described in the PingAM 7.5 documentation match what OpenAM writes, but OpenAM parses the profile strictly: if a real profile turns out to contain a field OpenAM does not know, login through Authenticator (OATH) fails for that user. So before parallel running, export a sample of real profiles together with the values of the `oath2faEnabled` attribute (more on it below) and test both directions on a test replica: a device registered in PingAM works in OpenAM, and after a login through OpenAM, it works in PingAM again.

Until the final cutover, register devices only in PingAM. OpenAM's default settings get in the way of this: the Two Factor Authentication Mandatory setting (`forgerockTwoFactorAuthMandatory`) in the Core Authentication service is off, and Authenticator (OATH) runs in optional mode. In this mode, the module checks the `oath2faEnabled` attribute first and only then whether a device exists. If the attribute is empty or set to 0, the user gets a choice between "Register device" and "Skip this step", even if they have a device from PingAM. Skipping writes `oath2faEnabled=1` to the account, and from then on OpenAM lets this user in without a second factor. Registering replaces the PingAM profile with a new one, and the old device stops working. And skipping the step on the code entry screen right after registration deletes the profile altogether.

So in realms where PingAM requires a second factor, enable Two Factor Authentication Mandatory in OpenAM: a user with a device then goes straight to code entry. A user without a device is still offered registration in this mode, and you cannot exclude them from the chain: the chain is selected by the realm or the application, and all users of a cut-over application group go through the same one. There are two ways out. You can put a scripted module with the `REQUISITE` criterion in front of Authenticator (OATH) that denies login when `oathDeviceProfiles` is empty, so that such a user registers a device in PingAM first. Or you can cut a group over only after all of its users with two-factor authentication have registered devices in PingAM. In realms where the second factor is optional, the same choice will appear to users who have a device but whose `oath2faEnabled` is empty or set to 0; the sample will show how many of them there are.

**Keys and addresses.** Two decisions are worth making before the work starts. The first is whether the existing key pairs can be exported from the PingAM keystore and imported into OpenAM. The second is whether to keep the existing SAML entity IDs and endpoint URLs.

Entity IDs affect more than metadata. SAML persistent NameIDs are stored in the user entry together with the entity IDs of the identity provider and the partner. With the old entity ID, OpenAM will find the NameIDs that PingAM stored and keep issuing them, provided the data store is configured with the OpenDJ type. With a new entity ID, it will issue new NameIDs, and a partner that links accounts by persistent NameID will see unfamiliar users: depending on its settings, it will create new accounts for them or deny them login.

The old addresses mean the old hostname, context path and realm names: they are part of both the SAML endpoint URLs and the OpenID Connect issuer, and SAML adds the metaAlias to them. OpenAM is deployed under `/openam` by default, while the PingAM path is chosen at installation: in Ping's documentation it is the same `/openam`, and in ForgeOps it is `/am`. Deploy the OpenAM WAR under the same path as PingAM. The issuer, discovery, JWKS and the main OAuth 2.0 and OpenID Connect endpoints will then match PingAM 7.5. The exception is the dynamic client registration endpoint: `/register` in PingAM and `/connect/register` in OpenAM. Rewriting the path on the load balancer is unreliable: the Base URL Source service, through which OpenAM substitutes the external address, does not apply to SAML metadata, so the metadata keeps OpenAM's own path.

If you keep the keys, identifiers and addresses, partners and client owners will hardly have to change anything, but you will have to switch them over by changing DNS or load balancer rules: all at once, or realm by realm if each realm has its own DNS name or the load balancer can tell requests for different realms apart. If the load balancer tells realms apart, check that its rules cover all of a realm's addresses, including the login page, where the realm is usually passed as a query parameter rather than as part of the path. If the keys, identifiers or addresses change, every partner will need your new metadata and every client will need new endpoints, but they will be able to move one at a time.

## Additional Factors That Affect Migration Complexity

The baseline estimate comes from the two previous sections: chains mean a mechanical transfer, trees mean redesign. The following factors then adjust the estimate:

**Realms.** Most of the transfer is done separately for each realm. The keystore, configuration store and CTS are shared by the whole server, and custom Java code is compiled once and then plugged into each realm; everything else is entered again in each realm. Keep in mind that setting up each subsequent realm will go noticeably faster than the first. Count how many realms you have and how many of them differ significantly from one another.

**Custom Java code.** Authentication nodes have to be rewritten. Identity repository implementations, post-authentication plugins and custom policy conditions have to be adapted and rebuilt: these SPIs exist in OpenAM too, but package names and signatures may have changed. Either way, each such component means a build, testing and review, and this is the only category where the work does not get faster with repetition.

**Policy agents.** Count them by the teams that own the servers, not by the number of agents. Eight agents owned by one team mean one round of coordination and one work package; eight agents owned by eight teams mean eight rounds of coordination.

**Federation partners.** What matters is how many partners have to do anything at all. That depends not on the size of your federation but on the decisions about keys, secrets and endpoints described in the previous section.

Add these factors to the baseline estimate, and most deployments fall into one of three complexity categories. As with the effort column, this describes the nature of the project, not the number of weeks.

### Complexity Categories

**Green.** Modules and chains, an external identity store on LDAP or Active Directory, standard OAuth 2.0 and SAML 2.0, no custom extensions. Client owners pick up new secrets, and partners pick up new metadata if you change addresses or keys. Nothing has to be redesigned. Plan it like a platform upgrade: a test environment, parallel running, a cutover window.

**Yellow.** Mostly chains, plus trees that run from start to finish without branching, or a small number of custom nodes. A tree that never branches is a chain with its nodes laid out in a row. The transfer is mechanical, except for custom nodes and Scripted Decision nodes: their replacements have to be designed, and the design work should start right away, even though the realms themselves move after the Green ones.

**Red.** Branching trees, custom authentication nodes with business logic, PingOne Protect nodes inside flows, or integration with PingIDM and/or PingGateway. Such realms have to be redesigned in any case, not transferred.

A single deployment can contain all three complexity categories. Split the migration by realm: a realm that has stayed on chains can be migrated right away, while a realm with trees is still in progress.

## The Migration Process

1. **Take inventory.** Run `export-config` in Amster and save the result. You do not need to import it, but it is the most complete machine-readable description of the deployment you will ever have, minus the secrets. The second part of the inventory has to be collected by hand: which teams own the servers with policy agents and which agents each of them runs; who at each federation partner can reload metadata; who is allowed to change a client secret; what the custom JAR files added to the WAR implement. This information affects the timeline too.

2. **Sort your existing realms.** Assign each realm to the Green, Yellow or Red category, then start with the simplest Green one. Use it to set up the platform: the servlet container or Docker container, the data store connection, the keystore, the batch files (more on them in step 4), the deployment pipeline. On a realm with nothing unusual in it, the problems that come up turn out to be platform problems rather than configuration errors. Every realm after that is just a configuration transfer. Move the Yellow and Red realms last, so that platform problems do not affect them. Start their design right away, though, in parallel with moving the Green realms, so that it is ready by the time their transfer begins.

3. **Stand up OpenAM alongside PingAM.** While you test the migration, connect OpenAM to a test replica of the identity store. Next, look at the session cookie. Both products ship with the default name `iPlanetDirectoryPro`, and if the two deployments end up in a shared cookie domain, the browser will send the same cookie to both: each server will reject a session ID it did not issue and overwrite it. To avoid the conflict, rename the session cookie in OpenAM.

   The cookie name is set by the `com.iplanet.am.cookie.name` property in the default server settings. Set the same name in the OpenAM agent profiles when you create them in step 4: for web policy agents, the property is `com.sun.identity.agents.config.cookie.name`, and for Java EE policy agents, it is `com.iplanet.am.cookie.name`. Change it in your custom REST API integrations as well: OpenAM looks for the session token in a header with the same name as the cookie. For the same reason, rename `amlbcookie`, the cookie the load balancer uses to pin a user to a server. Both products write the server ID into it, so the OpenAM load balancer, given a value set by PingAM, will send the user to the wrong server. Its name is set by the `com.iplanet.am.lbcookie.name` property, and the new name has to go into the load balancer rules.

4. **Re-create the configuration.** Start with the settings shared by all servers (keystore, configuration store, CTS, every custom JAR file shipped in the WAR), then go realm by realm. Record the settings transfer as batch files for the `ssoadm do-batch` command, starting with the first realm, even if clicking through the console seems faster. Each line of such a file is a separate `ssoadm` subcommand with its own options, and the administrator credentials are passed once, to `do-batch` itself, in the `--adminid` and `--password-file` options. This way you automate an OpenAM setup that you will run more than once: test environments, standing up production and so on. Once a realm's configuration has been verified on the test replica, deploy it with the same batch files to the production OpenAM connected to the production identity store, the same one PingAM is connected to.

5. **Run both systems in parallel.** By this point, OpenAM is connected to the production identity store it shares with PingAM, so accounts exist on both platforms at once. Sessions do not: a browser signed in to PingAM is anonymous to OpenAM, and vice versa. That is why parallel running works at the application level, and what actually moves is a group of applications that expect single sign-on with one another. Two applications that share a session move together, or both break. Define the membership of these groups before the first cutover.

6. **Cut over one group at a time.** A cutover means redirecting applications, not switching platforms: you install an OpenAM agent, give an OAuth 2.0 client new endpoints, send a federation partner new metadata. PingAM stays up the whole time, and that is what makes rollback cheap: you return the application to a system that never stopped. But only rolling back routing and configuration is cheap, not data: whatever OpenAM has written to the shared store (two-factor authentication device profiles, account lockout counters) stays there after a rollback, so check profile compatibility in both directions in advance (see "Two-factor authentication devices"). Take the group with the fewest users and an owner who will not mind possible disruptions first, and work out the process there before touching anything critical. This is what a cutover looks like when the addresses change. If you have kept the old entity IDs and URLs, a whole realm or the entire deployment moves at once: applications and partners are switched over by changing DNS or load balancer rules, the Ping agents are replaced with OpenAM agents in the same window, and a rollback means reverting the DNS or rule change and putting the Ping agents back.

7. **Decommission PingAM.** PingAM is shut down once the last group has moved and has run on OpenAM long enough that it will no longer need a rollback. Keep the Amster export and the batch files in version control even after the servers are gone. Sooner or later someone will ask why an attribute was mapped the way it was, and by then the export will be the only place where the answer still exists.

   The repository must not contain secrets, though. If the export was made with a transport key, it contains encrypted passwords, the fields with the `-encrypted` suffix, and any AM instance with the same key can decrypt them. Commit the standard export instead, where the passwords are replaced with `null`. And if the `sms.transport.key` transport key is still in the PingAM keystore, delete it: Ping's documentation requires doing so right after the export. Check the batch files too: a data store or agent password passed in the `--attributevalues` option is written in them in plain text. Move such values into files for the `--datafile` option and store those files separately, together with your other secrets.

## Conclusion

In short, OpenAM has an equivalent for most of what PingAM 7.5 can do, and the exceptions (trees and nodes, some OAuth 2.0, OIDC and policy extensions, secret stores) are listed in the table. There is no ready-made tool for importing the configuration, and the scope of work depends on how authentication is built. A realm on chains is a mechanical transfer. A realm on branching trees is a redesign of authentication flows, and it belongs in the schedule as a separate piece of work, not as a task inside the migration.

The [OpenAM documentation](https://doc.openidentityplatform.org/openam/) is the reference for the second column of the mapping table. Read the [module reference](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules) first, with your list of modules in hand, because that is where the surprises are.

This blog already has worked examples for several of the building blocks. [Two-factor authentication with Google Authenticator](/blog/2025-09-12-using-google-authenticator-with-openam) and [WebAuthn](/blog/2024-05-23-How-to-Setup-WebAuthn-Authentication-in-OpenAM) show how chains are assembled from modules, and [OAuth 2.0 and federation](/blog/2024-03-25-openam-oauth-federation) covers the client side.

If you want a second opinion on which category your deployment falls into, contact one of the [independent commercial support vendors](/support#vendors): they offer migration consulting and can also carry out the migration. Community help in [GitHub Discussions](https://github.com/orgs/OpenIdentityPlatform/discussions) remains free.

## What's Next in This Series

Three follow-ups are planned, step-by-step guides with specific commands rather than planning guides:

1. Moving the identity store from PingDS to OpenDJ: LDIF export and import, the schema and operational attributes, password storage schemes, and rebuilding replication.
2. Rebuilding a PingAM authentication tree as an OpenAM chain: a worked example, including where the branching goes.
3. Rewriting a custom authentication node as an OpenAM authentication module: the SPI, the state model, and how much of the node's logic survives the move.

Links will appear here as the posts are published.

## Frequently Asked Questions

{% for item in page.faq %}
### {{ item.q }}

{{ item.a }}
{% endfor %}
