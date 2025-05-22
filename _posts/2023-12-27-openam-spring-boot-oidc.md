---
layout: home
title: "OpenAM and Spring Boot 3 Integration via OIDC OAuth2 Protocol"
landing-title2: "OpenAM and Spring Boot 3 Integration via OIDC OAuth2 Protocol"
description: "How to setup federated authenticaion in Spring Boot Application via OpenAM using OIDC OAuth2 Protocol"
keywords: 'OAuth2, OIDC, Spring, Spring Boot, Spring Security, SSO, OpenAM'
imageurl: 'openam-og.png'
share-buttons: true
---
<h1>OpenAM and Spring Boot 3 Integration via OIDC OAuth2 Protocol</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Spring-Boot-3-Integration-via-OIDC-OAuth2-Protocol](https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Spring-Boot-3-Integration-via-OIDC-OAuth2-Protocol)

# Introduction

There are several ways to integrate Spring application with OpenAM. In the following tutorial, we will integrate Spring Application with OpenAM using the OIDC/OAuth2 protocol.

# OpenAM Configuration

If you have not installed OpenAM yet, you could run OpenAM as a [Docker image](https://hub.docker.com/r/openidentityplatform/openam/). Let’s assume the OpenAM instance URL is `http://openam.example.org:8080/openam`

Go to the target realm and in the Common Tasks section. Open OpenAM console in a browser and create OAuth2 Provider. Press the `Configure OAuth Provider` button, and then the `Configure OpenID Connect` button.

![Realm Common Tasks](/assets/img/openam-spring-boot-oauth/realm-common-tasks.png)

![Realm Setup OIDC](/assets/img/openam-spring-boot-oauth/realm-oidc.png)

Ajust the required setting and press the Create button.

![OIDC configuration](/assets/img/openam-spring-boot-oauth/configure-oidc.png)

Go back to the realm and select in the realm’s dashboard Applications → OAuth 2.0 in the right menu.

![Realm OAuth2 Applications](/assets/img/openam-spring-boot-oauth/realm-applications-oauth.png)

Create a new Agent, set name (client id) and password (client secret) and press the Next button. Go to the new created agent and set the following settings

- Add `http://localhost:8081/login/oauth2/code/openam` to **Redirection URIs** values (is will be our Spring Security application code endpoint)
- Add `profile` and `openid` values to **Scope(s)**
- Set **ID Token Signing Algorithm**  setting to RS256.

# Spring Boot Application

Create a new Spring Boot application and add the following Maven dependencies.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!--security dependencies-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

Create a controller and two endpoints: `index` and `protected-oauth`. The `index` endpoint will be accessible for anyone and `protected-oauth` endpoint will be accessible for authenticated with OpenAM users via OIDC protocol.

```java
@Controller
public class SampleController {

    @GetMapping
    public String index() {
        return "index";
    }

    @GetMapping("/oauth")
    public String oauthProtected(HttpServletRequest request, Model model) {
        Principal token = request.getUserPrincipal();
        model.addAttribute("userName", token.getName());
        model.addAttribute("method", "OAuth2/OIDC");
        return "protected";
    }
}
```

Create the following templates for controllers:

`index.html`

```html
<!DOCTYPE html>
<html>
<body>
<h1>OpenAM Spring Security Integration</h1>
<h2>Test Authentication</h2>
<ul>
    <li><a href="/protected-oauth">OAuth2/OIDC</a></li>
</ul>
</body>
</html>
```

`protected.html`

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<body>
<h1>Protected resource</h1>
<a href="/">Back</a></li>
<p><span th:text="${userName}"/> user authenticated with <span th:text="${method}"/></p>
</body>
</html>
```

Create Spring Security configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    @Bean
    public SecurityFilterChain securityWebFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests((authorize) -> authorize.requestMatchers("/", "/oauth2/**")
                        .permitAll()
                        .requestMatchers("/protected-oauth").authenticated())
                .oauth2Login(Customizer.withDefaults()).oauth2Client(Customizer.withDefaults()
                );
        return http.build();
    }
}
```

Add the following settings to the `application.yml` file:

```yaml
server:
  port: 8081
spring:
  security:
    oauth2:
      client:
        registration:
          openam:
            authorization-grant-type: authorization_code
            client-id: test_client
            client-secret: changeme
            scope:
              - openid
              - profile
        provider:
          openam:
            authorization-uri: http://openam.example.org:8080/openam/oauth2/authorize
            token-uri: http://openam.example.org:8080/openam/oauth2/access_token
            user-name-attribute: sub
            issuer-uri: http://openam.example.org:8080/openam/oauth2
```

# Test the Solution

Logout form OpenAM if you are logged in.

Run the Spring application an open its URL in a browser: http://localhost:8081

![Spring Boot App Index](/assets/img/openam-spring-boot-oauth/test-app.png)

Click on the OAuth2/OIDC navigation link, and you will be redirected to the OpenAM authentication page.

![OpenAM Authentication](/assets/img/openam-spring-boot-oauth/openam-auth.png)

Enter the user’s login and password and then press the LOG IN button.

![OpenAM Consent](/assets/img/openam-spring-boot-oauth/openam-consent.png)

After pressing the Allow button, you will be redirected to the Spring Security Application as an authenticated user.

![Spring Boot App Authenticated](/assets/img/openam-spring-boot-oauth/test-app-authenticated.png)
