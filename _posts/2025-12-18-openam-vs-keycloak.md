---
layout: home
landing-title: "OpenAM vs. Keycloak: a Comparative Review"
landing-title2: "OpenAM vs. Keycloak: a Comparative Review"
description: A detailed comparative review of OpenAM (Open Identity Platform) and Keycloak, two leading open-source identity and access management (IAM) solutions.
keywords: 'OpenAM vs Keycloak, Keycloak vs OpenAM, OpenAM comparison, Keycloak comparison, open source IAM, identity access management open source, SSO solutions, single sign-on comparison, OAuth2 OIDC SAML, authentication modules, federation protocols, realms isolation, admin GUI customization, identity repositories, Kubernetes deployment IAM, Open Identity Platform, Red Hat Keycloak, IAM tools 2025, IAM tools 2026, best open source access management'
imageurl: 'openam-og.png'
share-buttons: true
---

# OpenAM vs. Keycloak: a Comparative Review

## General Information

---

|  | **OpenAM** | **Keycloak** |
| --- | --- | --- |
| Initial release | 2008 | 2014 |
| Maintainer | Open Identity Platform Community | Read Hat |
| Current version | 16.0.4 | 26.4.7 |
| Release and patches | Regular | Regular |
| Open Source | ✅ | ✅ |
| Лицензия | CDDL | Apache License 2.0 |

## Single Sign On (SSO) and Federation

|  | OpenAM | Keycloak |
| --- | --- | --- |
| Applications deplyment behind and auth gateway | ✅ with OpenIG out of the box, third-party vendor gateway | ✅ third-party vendor gateway |
| Policy Agent | ✅ | ⛔️ |
| OAuth 2.0/OIDC federation | ✅ | ✅ |
| SAMLv2 federation | ✅ | ✅ |

### Authentication

Supported authentication methods:

| **Модуль аутентификации** | **OpenAM** | **Keycloak** |
| --- | --- | --- |
| Login and password authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#data-store-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#_authentication-flows) |
| Microsoft Active Directory authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#active-directory-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#_user-storage-federation) |
|  Authentication for demo access | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#anonymous-module-ref) | ⛔️ |
| Adaptive authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#adaptive-risk--module-ref) | ⛔️ |
| Authentication in an LDAPv3-compatible directory | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#ldap-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#_user-storage-federation) |
| Persistent cookie authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#persistent-cookie-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#enabling-remember-me) |
| RDMS authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#jdbc-module-ref) | ✅ [doc](https://www.keycloak.org/server/db) |
| Self-registration | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#membership-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#con-user-registration_server_administration_guide) |
| HTTP Header enrichment authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#msisdn-module-ref) | ⛔️ |
| Windows NT authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#windows-nt-module-ref) | ⛔️ |
| OAuth 2.0/OIDC authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#oauth-2) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#con-oidc_server_administration_guide) |
| Kerberos authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#windows-desktop-sso-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#_kerberos) |
| OIDC id_token authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#openid-connect-id_token-bearer-module-ref) | ⛔️ |
| RADIUS authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#radius-module-ref) | ⛔️ |
| HOTP via SMS or email | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#hotp-module-ref) | ⛔️ |
| One time password with HOTP or TOTP authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#oath-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#one-time-password-otp-policies) |
| Custom Scripted authentication module | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#scripted-module-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#script-authenticator) |
| SAMLv2 authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#saml2-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#_saml) |
| ReCaptcha | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#recaptcha-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#proc-enabling-recaptcha_server_administration_guide) |
| WebAuthn | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#webauthn-registration-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#webauthn_server_administration_guide) |
| QR-code authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#qr-code-confirm-from-other-session-module-ref) | ⛔️ |
| NTLM authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#ntlm-module-ref) | ⛔️ |
| Docker HTTP Basic Authentication | ⛔️ | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#docker-authentication-flow) |
| HTTP Basic Authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#http-basic-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#docker-authentication-flow) |
| Recovery codes authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/admin-guide/chap-auth-services#authn-mfa-accessing-recovery-codes) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#_recovery-codes) |
| WebAuthn | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#webauthn-registration-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#webauthn_server_administration_guide) |
| X509 certificate authentication | ✅ [doc](https://doc.openidentityplatform.org/openam/reference/chap-auth-modules#certificate-module-ref) | ✅ [doc](https://www.keycloak.org/docs/latest/server_admin/index.html#_x509) |

## Isolation (realms)

Realm support for identities and authentication processes isolation

|  | **OpenAM** | **Keycloak** |
| --- | --- | --- |
| Realms support | ✅ | ✅ |
| Realm hierarchy | ✅ | ⛔️ |

## Interfaces

| **Intefrace** | OpenAM  | **Keycloak** |
| --- | --- | --- |
| Administrator GUI | ✅ | ✅ |
| Admin REST API | ✅ | ✅ |
| Admin UI customization | ⚠️ technically possible but requires significant effort | ✅ [doc](https://www.keycloak.org/ui-customization/creating-your-own-console) |
| Authentication GUI | ✅ | ✅ |
| Authentication GUI customization | ✅ [doc](https://doc.openidentityplatform.org/openam/install-guide/chap-custom-ui) | ✅ [doc](https://www.keycloak.org/guides#ui-customization) |
| Authentication REST API | ✅ [doc](https://doc.openidentityplatform.org/openam/dev-guide/chap-client-dev#sec-rest) | ⛔️ |

## Authentication sessions

|  | OpenAM | Keycloak |
| --- | --- | --- |
| Stateful | ✅  random symbol sequence | ✅ JWT |
| Stateless | ✅ JWT | ✅ JWT |
| Security Token Service | ✅  | ✅ |

## Identity Repositories

| Repository type | **OpenAM** | **Keycloak** |
| --- | --- | --- |
| LDAP (OpenDJ, OpenLDAP и т.д.) | ✅  | ✅  |
| Active Directory | ✅  | ✅  |
| Apache Cassandra | ✅  | ⛔️ |
| MariaDB Server | ✅  | ✅ |
| Microsoft SQL Server | ✅  | ✅ |
| MySQL | ✅  | ✅ |
| Oracle Database | ✅  | ✅ |
| PostgreSQL | ✅  | ✅ |

## Architecture and Deployment

|  | OpenAM | Keycloak |
| --- | --- | --- |
| Kubernetes support | ⚠️ StatefulSet using Docker container  | ✅ Kubernetes Operator |
| Has state | Stateful | Stateless |
| Replication between nodes | ✅  | ⛔️ |

## Useful Links

### OpenAM:

- [Official website](https://www.openidentityplatform.org/openam)
- [GitHub repository](https://github.com/OpenIdentityPlatform/OpenAM)
- [Documentation](https://doc.openidentityplatform.org/openam/)

### Keycloak:

- [Official website](https://www.keycloak.org/)
- [GitHub repository](https://github.com/keycloak/keycloak)
- [Documentation](https://www.keycloak.org/documentation)