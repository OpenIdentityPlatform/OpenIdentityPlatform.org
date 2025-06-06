---
layout: home
title: "Using Large Language Models (LLMs) in Access Management"
landing-title2: "Using Large Language Models (LLMs) in Access Management"
description: "This article gives a basic understanding about Single Sign-On technology"
keywords: 'Single Sign-On, SSO, AI, LLM, access management, large launguage models, authentication, authorization, monitoring, audit'
share-buttons: true

---

## Introduction

The hype around neural networks, especially large language models (LLMs), has not yet subsided.

As was the case with the blockchain hype, many techno-enthusiasts are adopt a “solution in search of a problem” approach. That is, they are seeking to apply neural networks to every problem in a row.

There are two reasons for this:

- To increase the chances of attracting investment by simply adding the AI suffix to the name of their project.
- Experimenting with new technologies is always exciting.

[Access Management](https://en.wikipedia.org/wiki/Access_management) is no exception. The growing number and diversity of attacks require us to explore new approaches to access management to improve its effectiveness and resistance to attacks.

This article will explore how LLM can be applied to access management to improve its effectiveness and whether it is worthwhile.

While preparing this article, I could not find practical examples of using an LLMs in Access Management in more or less well-known companies. Perhaps this is because large models are a relatively new technology and their implementation is associated with certain risks. Or, measurable results have not yet been achieved and therefore they are not in the public domain.  Therefore, the article is rather analytical.


## Initial Data

Let’s first define the challenges faced by access control systems, then we'll highlight the main properties of LLMs, and perhaps find an overlap.

Spoiler: there is an overlap, otherwise this article wouldn't exist.

**Key Access Management Tasks**:

- Authentication and authorization
- Monitoring
- Auditing

**LLM Properties**:

- Ability to analyze large amounts of data and a high level of expertise
- High consumption of computing resources
- Risk of generating incorrect answers (“hallucinations”)

## Applying LLM to Access Management tasks

### Authentication and authorization

The access management system must determine who is logged in (authentication) and whether to grant access to a particular resource (authorization). To increase security, the authentication system may request an additional factor, such as biometrics or a one-time password.

Let's understand whether it is possible to apply LLM to authentication and authorization.

- **Ability to analyze large amounts of data** - applicable with limitations. In the authorization and authentication process, the amount of data collected is relatively small. For example, it could be the user's own data if authentication is successful, the time since the last successful authentication, the time since the last unsuccessful authentication, whether the user is using a VPN, etc. There are, about 100 attributes at most. LLM can process orders of magnitude more attributes, so, in this case, its use is redundant.
- **High consumption of computing resources** - is not applicable. In large organizations, the number of requests to the authentication and authorization system is in the thousands per hour. If LLM is used, the consumption of computational resources will increase many times over. Using an LLM would significantly increase computational resource consumption, potentially overwhelming the system and causing the entire access control system to fail.
- **Hallucinations** - If, however, the company has adopted the above-mentioned, allocated computing resources to the LLM, and connected it to the authentication process, there is always a risk of receiving an incorrect response from the LLM. Thus, an authorized user may be denied access, and an attacker, on the contrary, may be able to gain access.

**Conclusion**: standard role-based or attribute-based access authorization techniques (RBAC or ABAC) are more transparent to later auditing. Determining why the neural network made a specific authorization decision is nearly impossible due to the large number of intermediate computations involved. Similarly, in authentication: the algorithm for calculating the criterion for a second-factor user request or, conversely, seamless authentication (when a user is immediately let into the system without requesting credentials) should be transparent for auditing. This can be achieved directly by using authentication attributes (e.g., new user device) or by using the aggregate of attributes to be analyzed by simpler machine learning algorithms - e.g., linear algorithms or decision trees.

### Monitoring

When monitoring an access control system, like any other system, it is critical to detect anomalies. For example, the occurrence of a large number of log errors, frequent generation and sending of one-time passwords, or an abnormally high number of requests to the user or customer data storage system.

- **Ability to analyze large amounts of data** - applicable. Large amounts of data are continuously generated in the monitoring process. LLMs can analyze them to detect anomalous events.
- **High consumption of computing resources** - applicable with limitations. LLMs can not analyze events in real-time, so anomaly detection will be done rather post facto.
- **Hallucinations** - incorrect answers are possible during analysis, so potentially all anomalous events should be analyzed by a security engineer. There is also a risk of missing anomalous events.

**Conclusion:** Analyzing access control system events for anomalies using large models is possible, but not in real-time. The optimal solution is to use a combination of methods. Real-time events can be analyzed by simple machine learning algorithms, and suspicious events sent to the LLM and security specialist for further analysis.


### Audit

An access control system should be audited periodically. The purpose of auditing is to identify potentially problematic areas in the authentication configuration, access policies, and even the audit itself. For example, the audit process may identify policies that are not being used by users or policies with excessive access. Another auditing task is to analyze the access control system for compliance with regulatory standards.

- **The ability to analyze large amounts of data** is applicable. An LLM can act as a security expert and audit the configuration of the access control system, identify possible problem areas, and propose solutions to fix them. This can make the work of security analysts much easier.
- **High consumption of computing resources** - the impact is not significant as auditing is relatively infrequent and the response time from the LLM is not significant.
- **Hallucinations** - the audit result necessarily passes through security analysts, which reduces the risks of incorrect configuration.

**Conclusion**: LLMs are pretty well suited for periodic audit tasks as they can easily analyze large amounts of data, and identify patterns, compliance levels, and problem areas more efficiently than a human. Audits can be performed faster and with much greater frequency.

To reduce the risk of errors, the audit result should be verified by a specialist.

Additionally, to reduce errors, you can implement model pre-training and use [Retrieval-Augmented Generation](https://en.wikipedia.org/wiki/Retrieval-augmented_generation) to retrieve information from, for example, current safety standards.

## Conclusion

Machine learning algorithms, including LLMs, can improve the security of access control systems but require a sensible approach. It is better to use lightweight algorithms for authentication and monitoring and apply LLMs for auditing and analytics. In the future, as optimized models evolve, their use will become more affordable. What do you think?

- Can LLMs become the standard in cybersecurity? Or is their use still too expensive and risky?
- Do you use AI in access control systems? Which tools have proven most effective?
- Which cybersecurity tasks, in your opinion, are better left to LLMs, and which to traditional methods?
- Share your experiences, ideas, or questions in the comments. Let's explore together how to make access control safer and more effective with AI.