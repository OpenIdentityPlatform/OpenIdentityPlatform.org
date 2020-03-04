---
layout: home
landing-title: "Stateful vs Stateless Authentication"
landing-title2: "Stateful vs Stateless Authentication"
description: "Stateful vs Stateless Authentication Comparsion"
keywords: ''
share-buttons: true
---
<h1>Stateful vs Stateless Authentication</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/Stateful-vs-Stateless-Authentication](https://github.com/OpenIdentityPlatform/OpenAM/wiki/Stateful-vs-Stateless-Authentication)

## Preface
Authentication is a process exists in almost every application to Identify application client whether it is a user or other application. While authentication client sends credentials to the application. The application ensures that credentials are correct, generates authentication token and sends it back to the client. To access the application as an identified client, the client uses the received authentication token.

Authentication token could be Stateless and Stateful.

## Stateful Authentication
After successful authentication, the application generates a random token to send back to the client then creates a client authenticated session in memory or an internal database. When a client tries to access the application with a given token, the application tries to retrieve session data from session storage, checks if session valid and then decides whether the client has access to the desired resource or not.

## Stateless Authentication
After successful authentication, the application generates token with all necessary data, signs it with a public key and sends it back to a client. There is a standard for token generation, it is JWT (JSON Web Token). The process described in OpenID Connect (OIDC) specification. When a client tries to access the application with a token, the application verifies token sign with a private key, check if the token is expired, retrieves all session data from the token and makes a decision if a client has access to the desired resource.

| |Stateful|Stateless|
|-|-|-|
|Session information could be stolen|&#9989; It is impossible to steal session information from the session identifier because it is just an identifier associated with the session|&#9940;Session identifier contains all authentication information and it is possible to steal sensitive information, it is not encrypted.|
|Resource consuming|&#9940;When retrieving session information, service always gets access to session storage which causes additional resource consumption.|&#9989;The session identifier contains all session information.|
|Easy to implement|&#9940;When session information stored in an external database, there is a need to implement session database persistence|&#9989;Session identifier contains all session information, there is no need to implement additional functionality|
|Easy to scale|&#9940;While adding new instances, there is a need to implement additional scale to session storage as well|Adding new service instances does not require additional effort|
|Possibility to compromise session data.|&#9989;Only the authentication system able to retrieve session information from an authentication token, so there are no more vulnerabilities.|&#9940;To decrypt session information from a token, all parts of the system should share the same key. And, if at least one system is compromised, all parts of the system are under the threat.|
|Authentication token size|&#9989;An authentication token is just an identifier, so session data does not affect its size.|&#9940;If an authentication session contains a large amount of data, the authentication token also becomes large, which can cause additional load on a network.|
|Restrict access among different parts of an application|&#9989;It is possible to configure the system so different parts of the system will only have access to the data necessary for their work|&#9940;All parts of the system have access to all session data|
|Possibility to revoke session|&#9989;It is possible to revoke a session at any time|&#9940;Since the session token contains an expiration date, it is impossible to revoke the authentication session|
|Possibility to modify session data|&#9989;It is possible to modify any session data in session data storage.|&#9940;Since the session token contains all session data, it is not possible to modify it|
|SSO implementation|&#9989;The integration of different parts of the system is possible without modification of the source code, session information can come through the authentication system gateway.|&#9940;Changes must be made to each part of the system to retrieve data from an authentication token|

## Conclusion
Both approaches make sense, both have their advantages and disadvantages. Stateless authentication easier to implement and scale, but stateful authentication is more secure and easier to manage.
