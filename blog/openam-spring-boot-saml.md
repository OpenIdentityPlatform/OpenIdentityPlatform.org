---
layout: home
title: "OpenAM and Spring Boot 3 Integration via SAMLv2 Protocol"
landing-title2: "OpenAM and Spring Boot 3 Integration via SAMLv2 Protocol"
description: "How to setup federated authenticaion in Spring Boot Application via OpenAM using SAMLv2"
keywords: 'SAML, SAMLv2 Spring, Spring Boot, Spring Security, SSO, OpenAM'
imageurl: 'openam-og.png'
share-buttons: true
---
<h1>OpenAM and Spring Boot 3 Integration via SAMLv2 Protocol</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Spring-Boot-3-Integration-via-SAMLv2-Protocol](https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Spring-Boot-3-Integration-via-SAMLv2-Protocol)

# Introduction

In the following article, we will set up OpenAM as an Identity Provider for a Spring Boot Application. In the [previous article,](https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Spring-Boot-3-Integration-via-OIDC-OAuth2-Protocol) we set up a Spring Boot application authentication via OpenAM with OAuth2/OIDC protocol. In the following article, we will set up authentication via OpenAM as an Identity Provider and Spring Boot application as a service provider using [SAMLv2](https://en.wikipedia.org/wiki/SAML_2.0) protocol.

# OpenAM Configuration

## Create Hosted Identity Provider

If you have not installed OpenAM yet, you could run OpenAM as a [Docker image](https://hub.docker.com/r/openidentityplatform/openam/). Let’s assume the OpenAM instance URL is `http://openam.example.org:8080/openam`

Go to the target realm and in the Common Tasks section. Open OpenAM console in a browser and press the Configure SAMLv2 Provider button.

![Realm Common Tasks](/assets/img/openam-spring-boot-saml/realm-common-tasks.png)

Then press the Create Hosted Identity Provider button.

![Realm Create Hosted Identity Provider](/assets/img/openam-spring-boot-saml/realm-create-hosted-idp.png)

Select a Signing Key (for demonstration purposes we will use **test**), enter the Circle of Trust name, and then map user's attributes to OpenAM. For demonstration the OpenAM users will be mapped by email.

![Hosted Identity Provider Configuration](/assets/img/openam-spring-boot-saml/hosted-idp-conf.png)

Press the Configure button.

## **Setup User Mapping in OpenAM**

Open the administration console, goto desired realm, from the menu on the left. Select the  applications section and navigate to SAML 2.0. In the Entity Providers list select `http://openam.example.org:8080/openam`  On the Assertion Content tab, under **NameID Format** in the **NameID Value Map** list, add the element `urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified=mail` Press the Save button.

## Create OpenAM Users

Open the administration console, goto desired realm, create a new user and fill the Email Address attribute

# Spring Application Configuration

Create a new Spring Boot application and add the following Maven repositories and dependencies:

```xml
<repositories>
    <repository>
        <id>releases</id>
        <url>https://repo.maven.apache.org/maven2</url>
    </repository>
    <repository>
        <id>shibboleth</id>
        <url>https://build.shibboleth.net/nexus/content/repositories/releases/</url>
    </repository>
</repositories>
....
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
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-saml2-service-provider</artifactId>
</dependency>
```

Generate certificate and key files with the OpenSSL tool.

```bash
openssl req -newkey rsa:2048 -nodes -keyout rp-private.key -x509 -days 365 -out rp-certificate.crt
```

Put the generated files into `src/main/resources/credentials` directory.

Add the following settings to the `application.yml` file

```yaml
server:
  port: 8081
spring:
  security:
    saml2:
      relyingparty:
        registration:
          openam:
            signing:
              credentials:
              - private-key-location: classpath:credentials/rp-private.key
                certificate-location: classpath:credentials/rp-certificate.crt
            singlelogout:
              binding: POST
              url: "{baseUrl}/logout/saml2/slo"
            assertingparty:
              metadata-uri: http://openam.example.org:8080/openam/saml2/jsp/exportmetadata.jsp
```

Create a controller and two endpoints: `index` and `protected-saml`. The `index` endpoint will be accessible for anyone and `protected-saml` endpoint will be accessible for authenticated with OpenAM users via SAMLv2 protocol.

```java
@Controller
public class SampleController {

    @GetMapping
    public String index() {
        return "index";
    }

    @GetMapping("/protected-saml")
    public String samlProtected(Model model, @AuthenticationPrincipal Saml2AuthenticatedPrincipal principal) {
        String emailAddress = principal.getFirstAttribute("email");
        model.addAttribute("userName", emailAddress);
        model.addAttribute("method", "SAMLv2");
        return "protected";
    }
}
```

Create the following templates for controllers:

`index.html`

```html
<!DOCTYPE html><html>
<body>
<h1>OpenAM Spring Security Integration</h1>
<h2>Test Authentication</h2>
<ul>
    <li><a href="/protected-saml">SAMLv2</li>
</ul>
</body>
</html>
```

`protected.html`

```html
<!DOCTYPE html><html xmlns:th="http://www.thymeleaf.org">
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
    public SecurityFilterChain securitySamlFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests((authorize) -> authorize.requestMatchers("/")
                        .permitAll()
                        .requestMatchers("/protected-saml").authenticated())
                .saml2Metadata(Customizer.withDefaults())
                .saml2Login(Customizer.withDefaults())
                .saml2Logout(Customizer.withDefaults());
        return http.build();
    }
}
```

# Setup Service Provider in OpenAM

Run the Spring Boot Project to import the SAML metadata file of the Spring Boot project.

Open the OpenAM administration console, goto desired realm, click **Configure SAMLv2 Provider** in the Common Tasks section, then click **Configure Remote Service Provider.**

Set the metadata URL: `http://localhost:8081/saml2/service-provider-metadata/openam` and select the existing circle of trust created in the Create Hosted Identity Provider Step.

![Remote Service Provider Config](/assets/img/openam-spring-boot-saml/remote-sp-conf.png)

# Test the Solution

Logout form OpenAM if you are logged in.

Run the Spring application an open its URL in a browser: [http://localhost:8081](http://localhost:8081/)

![Test App Index](/assets/img/openam-spring-boot-saml/test-app.png)

Enter the user’s login and password and then press the LOG IN button.

![OpenAM Authentication](/assets/img/openam-spring-boot-saml/openam-authentication.png)

After pressing the Log In button, you will be redirected to the Spring Security Application as an authenticated user.

![Test App Authenticated](/assets/img/openam-spring-boot-saml/test-app-authenticated.png)
