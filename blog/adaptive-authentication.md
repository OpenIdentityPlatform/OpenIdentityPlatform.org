---
layout: home
title: "Adaptive Authentication"
landing-title2: "Adaptive Authentication: How to Improve Security Without Annoying Users"
description: "In the following article we cover basic approach to adaptive authentication"
keywords: 'authentication'
share-buttons: true
---

# Adaptive Authentication: How to Improve Security Without Annoying Users.

- [Introduction](#introduction)
- [How Adaptive Authentication Works](#how-adaptive-authentication-works)
- [Adaptive Authentication Factors](#adaptive-authentication-factors)
- [Adaptive Authentication Policy Setup](#adaptive-authentication-policy-setup)
  * [Manual Configuration](#manual-configuration)
  * [Automatic Policy Configuration Using Machine Learning](#automatic-policy-configuration-using-machine-learning)


## Introduction

Your applications will be attacked sooner or later. Especially if they have become popular and your users don't particularly care about information security.

In my 10 years of developing authentication systems, I've seen a constant battle between security requirements and a positive user experience. The easier it is for a user to log into a service, the less annoyed they are. On the other hand, the more complex the authentication process, the easier it is for an attacker to break into the system. Is there a compromise possible here?

In my opinion, yes. An adaptive authentication system can recognize a potential attacker and make the authentication process much complex on the fly to prevent hacking.

## How Adaptive Authentication Works

If the user used the application before, logged in from the same IP address and used the same device or browser, and used the same device or browser, you can log in the user without asking for credentials.

If the user is trying to login using an unknown device or browser, or user's IP address in another country since the moment of the previous login, the user probably is an attacker.

Attackers come in several types - bots or real people, who use social engineering for attacks. For each type of attacker. For each type of attacker, you have to react differently.

If an attacker is a bot, you must use a method that only humans can pass - captcha. The most common types of captchas are images of text or certain objects. To authenticate, the user must enter the text from the image, or mark certain objects.

An alternative authentication option is one-time-password (OTP) authentication. The random code is sent to the user via SMS, email, or push notification in a mobile application. In that case, an attacker will not be able to access the application, unless he has access to the user's phone or email. This method is more expensive than captcha but can protect against both bots or real people.

If there is a high probability of hacking, authentication should be disabled for IP address or user account.

To figure out if a user is an attacker, during the authentication process you must collect certain data that can be used to detect attack risk level. This data is called authentication factors.

So what factors can be collected during the authentication process?

## Adaptive Authentication Factors

**IP address.** Using an IP address you can determine several factors:

**If the IP address belongs to a cloud provider.** Hackers use cloud servers to deploy attackers bots or use a cloud server as a VPN server.

**If the IP address is an exit node or anonymous network.** Hackers can use anonymous internet, for example, TOR, for attacks to hide their real location. 

**User geographical location.** If the location of current authentication is uncommon for most of your users it could be a hacker attack.

**User speed.** If the user tries to authenticate from one country and five minutes later from another country, this is likely an attack. A real person can't cover such distance so fast.

**The number of unsuccessful authentication attempts for a certain  time.** If there are more than 10 unsuccessful authentication attempts in a minute, it is suspected that there is a password brute force attempt.

**The number of unsuccessful authentication attempts per time for an IP address.** If there are more than 100 unsuccessful authentication attempts per minute, there is a suspicion of an attack attempt.

**Unknown or known device or browser.** After successful authentication, the service sets a special tag (cookie) for a device or browser. The tag is transmitted at the next login attempts and allows to determine whether the device is known or not.

**A time from the start of the authentication process to entering your username and password.** A human will not be able to enter credentials and press the "Login" button in a fraction of a second

**A time since the last successful authentication.** If the user has not logged in for several months, it may be worth requesting additional data from the user.

## Adaptive Authentication Policy Setup

Adaptive authentication policies could be determined by security requirements and configured manually. The second option is to use machine learning methods.

### Manual Configuration

You determine by yourself which factors are the most potentially dangerous. For example, it is critical to you that when using a new device or browser, the user must additionally confirm his or her identity. When using a known device, you can log the user in without authentication.

Advantages

- Transparency - you determine which security policy is acceptable to you and configure it accordingly
- Easy maintenance
- Low consumption of computing resources

Disadvantages

- To setup policy experience in the subject area is required

### Automatic Policy Configuration Using Machine Learning

I intentionally do not use the hype terms "artificial intelligence" or "neural networks" because classification methods or decision trees are sufficient for adaptive authentication. Besides, the result of training neural networks cannot be interpreted. So, you will not be able to determine which authentication factors are most important in attack detection.

Advantages

- Machine learning algorithms can identify factors or combinations of authentication factors that are not obvious to the expert
- The possibility of continuous learning while accumulating authentication data and automatic algorithm adjustment when the logic of the authentication services changes

Disadvantages

- Requires qualified personnel to set up
- Cold start problem - the system cannot work until enough data has been collected for machine learning
- Using multiple models simultaneously increases the consumption of computing resources in the process, especially while training the models.