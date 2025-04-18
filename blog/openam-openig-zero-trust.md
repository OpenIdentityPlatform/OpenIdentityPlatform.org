---
layout: home
title: "OpenAM and OpenIG: Implementing Zero Trust Security Principles"
landing-title2: "OpenAM and OpenIG: Implementing Zero Trust Security Principles"
description: "In this article, we’ll explore how to implement Zero Trust principles using a combination of OpenAM and OpenIG."
keywords: 'openam, openig, zero trust'
share-buttons: true
---

## Introduction

Zero-Trust Security principles are based on the assumption that threats exist not only outside the perimeter but also within it. Therefore, every action, resource, and device requires access confirmation to ensure that only authorized accounts can perform the necessary operations.

In this article, we’ll explore how to implement these principles using a combination of open-source solutions: [OpenAM (Open Access Manager)](https://github.com/OpenIdentityPlatform/OpenAM) and [OpenIG (Open Identity Gateway)](https://github.com/OpenIdentityPlatform/OpenIG).

## A Brief Overview of Zero Trust Security

As the name suggests, Zero Trust Security is the principle of zero trust in any user activity. It does not matter whether interactions with services occur within the external or internal perimeter; security checks must be performed for every interaction.

- **Privilege Validation** — Authentication and authorization are verified using all available data, such as user identity, location, device parameters, etc.
- **Minimum Privilege Utilization** — Each action requires that users or devices be granted only the minimum necessary privileges for the shortest duration required.
- **Assumption of Breach** — The assumption is that an attacker is already present in the system. To minimize damage, parts of the infrastructure must be maximally isolated from each other and constantly monitored.

## OpenAM and Zero Trust Security

OpenAM can help secure the perimeter in the following ways:

- **Multi-Factor Authentication (MFA)** — Access to critical resources or operations requires additional confirmation. OpenAM supports authentication with one-time passwords (TOTP), biometric authentication, and hardware tokens (WebAuthn), as well as one-time passwords sent via SMS or email, and more.
- **Adaptive Authentication** — During authentication, OpenAM collects data and adjusts the process to ensure maximum security.
- **Centralization** — Authentication management is conducted from a single point. In the event of a threat, access can be revoked instantly. When authentication policies are updated, changes are implemented across the system from one location.
- **Monitoring and Auditing** — OpenAM’s monitoring and auditing capabilities allow real-time tracking of the authentication system’s status and detection of anomalous behavior.

## OpenIG and Zero Trust Security

OpenIG (Open Identity Gateway) is deployed in front of services, ensuring that users can access the services only after successful authentication and authorization through the gateway.

- **Authentication** — Users must provide a valid authentication token to access resources.
- **Authorization** — The token must contain attributes that permit access to the required resources, such as token expiration, roles, authentication levels, etc.
- **Request Routing** — Depending on access policies, requests are routed to specific resources. Suspicious activity can redirect attackers to a honeypot—a decoy resource.
- **Rate Limiting (Throttling)** — OpenIG can control the frequency of resource access requests, preventing attackers from launching DDoS attacks or downloading large volumes of data.
- **Protocol Support** — OpenIG protects HTTP REST and SOAP services, WebSocket connections, and can proxy requests between queue managers and REST services.

## Integration of OpenAM and OpenIG

OpenAM and OpenIG work well together and offer out-of-the-box integration features:

- OpenAM handles the authentication process.
- OpenAM monitors user behavior during authentication.
- OpenAM provides account attributes.
- OpenIG manages resource access policies and authorizes access based on authentication attributes.
- OpenIG monitors the behavior of authenticated and unauthenticated users.

## Continuous Development

Implementing Zero Trust Security practices is not a one-time task. Adaptation can begin gradually with small segments and expand across the enterprise. The flexibility of OpenAM and OpenIG allows organizations to adjust to evolving requirements and modify configurations “on the fly.