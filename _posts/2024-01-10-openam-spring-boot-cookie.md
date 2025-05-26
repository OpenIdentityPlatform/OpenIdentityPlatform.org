---
layout: home
title: "OpenAM and Spring Boot 3 Integration via OpenAM Cookie"
landing-title2: "OpenAM and Spring Boot 3 Integration via OpenAM Cookie"
description: "How to setup authenticaion in Spring Boot Application via OpenAM"
keywords: 'Spring Boot, Spring Security, SSO, OpenAM'
imageurl: 'openam-og.png'
share-buttons: true
products: 
- openam

---
<h1>OpenAM and Spring Boot 3 Integration via OpenAM Cookie</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Spring-Boot-3-Integration-via-OpenAM-Cookie](https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Spring-Boot-3-Integration-via-OpenAM-Cookie)

# Introduction

In the following article, we will set up OpenAM as an Identity Provider for a Spring Boot Application. In the [previous article,](https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Spring-Boot-3-Integration-via-SAMLv2-Protocol) we set up a Spring Boot application authentication via OpenAM with SAMLv2 protocol. In the following article, we will set up authentication via OpenAM cookie.

# Prerequisites

OpenAM and Spring Boot applications should share same domain. In the following example, OpenAM host is `openam.example.org` and Spring Boot application host is `app.example.org`.

To test the example on the local machine, add the following lines to your hosts file:

```makefile
127.0.0.1 openam.example.org app.example.org
```

# OpenAM Configuration

Open OpenAM administration console. In the top menu go to Configure → Global Services → Platform. Set Cookie Domains as the common domain for the both applications: `example.org`

![OpenAM Cookie Domain](/assets/img/openam-spring-boot-cookie/openam-cookie-domain.png)

# Spring Application Configuration

Create a new Spring Boot application and add the following Maven repositories and add the following dependencies:

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
```

Add the following settings to the `application.yml` file

```yaml
server:
  port: 8081
```

Create a controller and two endpoints: `index` and `protected-openam`. The `index` endpoint will be accessible for anyone and `protected-openam` endpoint will be accessible for OpenAM authenticated users.

```java
@Controller
public class SampleController {

    @GetMapping
    public String index() {
        return "index";
    }

    @GetMapping("/protected-openam")
    public String cookieProtected(Model model,  @AuthenticationPrincipal String principal) {
        model.addAttribute("userName", principal);
        model.addAttribute("method", "OpenAM Cookie");
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
    <li><a href="/protected-openam">OpenAM Cookie</a></li>
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

Create Spring Security configuration class:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    @Bean
    public SecurityFilterChain securityOpenAmFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher("/protected-openam", OpenAmAuthenticationFilter.OPENAM_AUTH_URI)
                .addFilterAt(new OpenAmAuthenticationFilter(), RememberMeAuthenticationFilter.class)
                .authorizeHttpRequests((authorize) ->
                        authorize.anyRequest().fullyAuthenticated())
                .exceptionHandling(e ->
                        e.authenticationEntryPoint((request, response, authException) ->
                                response.sendRedirect(OpenAmAuthenticationFilter.OPENAM_AUTH_URI)));
        return http.build();
    }
}
```

Create OpenAM authentication filter:

```java
public class OpenAmAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    private final String openAmUrl = "http://openam.example.org:8080/openam";
    private final String openAuthUrl = openAmUrl.concat("/XUI/#login");

    private final String openAmUserInfoUrl = openAmUrl.concat("/json/users?_action=idFromSession");
    private final String openAmCookieName = "iPlanetDirectoryPro";

    private final String redirectUrl = "http://app.example.org:8081/protected-openam";

    public static final String OPENAM_AUTH_URI = "/openam-auth";

    public OpenAmAuthenticationFilter() {
        super(OPENAM_AUTH_URI, new OpenAmAuthenticationManager());
        setSecurityContextRepository(new HttpSessionSecurityContextRepository());
    }

    private final AuthenticationDetailsSource<HttpServletRequest, ?> authenticationDetailsSource = new WebAuthenticationDetailsSource();
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException, IOException {
        Optional<Cookie> openamCookie = Arrays.stream(request.getCookies())
                .filter(c -> c.getName().equals(openAmCookieName)).findFirst();
        if(openamCookie.isEmpty()) {
           response.sendRedirect(openAuthUrl + "&goto=" + URLEncoder.encode(redirectUrl, StandardCharsets.UTF_8));
           return null;
        } else {
            String userId = getUserIdFromSession(openamCookie.get().getValue());
            if (userId == null) {
                throw new BadCredentialsException("invalid session!");
            }
            OpenAmAuthenticationToken token = new OpenAmAuthenticationToken(userId);
            token.setDetails(authenticationDetailsSource.buildDetails(request));
            return this.getAuthenticationManager().authenticate(token);
        }
    }

    protected String getUserIdFromSession(String sessionId) {
        RestTemplate restTemplate = new RestTemplate();
        ParameterizedTypeReference<Map<String, String>> responseType =
                new ParameterizedTypeReference<>() {};
        HttpHeaders headers = new HttpHeaders();
        headers.add(openAmCookieName, sessionId);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        ResponseEntity<Map<String, String>> response = restTemplate.exchange(openAmUserInfoUrl, HttpMethod.POST, entity, responseType);
        Map<String, String> body = response.getBody();
        if (body == null) {
            return null;
        }
        return body.get("id");
    }
}
```

Create OpenAM authentication manager

```java
public class OpenAmAuthenticationManager implements AuthenticationManager {
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if(authentication instanceof OpenAmAuthenticationToken) {
            authentication.setAuthenticated(true);
            return authentication;
        }
        authentication.setAuthenticated(false);
        return authentication;
    }
}
```

and OpenAM authentication token class:

```java
public class OpenAmAuthenticationToken extends AbstractAuthenticationToken {
    private final String username;

    public OpenAmAuthenticationToken(String username) {
        super(Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")));
        this.username = username;
    }

    @Override
    public Object getCredentials() {
        return "";
    }

    @Override
    public Object getPrincipal() {
        return username;
    }
}
```

# Test Solution

Create the `demo` user for the top level realm for testing purposes. Open OpenAM console, open the top level realm. In the left menu click the `Subjects` element. In the list of subject click the `New` button.

![OpenAM Create User](/assets/img/openam-spring-boot-cookie/openam-create-user.png)

Fill the attributes and press the `OK`  button.

Logout form OpenAM.

Run the Spring application an open its URL in a browser: [http://app.example.org:8081](http://test.example.org:8081). 

![Test App Index](/assets/img/openam-spring-boot-cookie/test-app-index.png)

Click the OpenAM Cookie link. You will be redirected to the OpenAM authentication page.

![OpenAM Authentication](/assets/img/openam-spring-boot-cookie/openam-authentication.png)

Enter desired credentials and press the Log In button. After successful authentication you will be redirected to the Spring Boot application page as an authenticated user.

![Test App Authenticated](/assets/img/openam-spring-boot-cookie/test-app-authenticated.png)

PS. Thanks to [https://www.tune-it.ru/web/adpashnin/blog/-/blogs/spring-security-i-openam](https://www.tune-it.ru/web/adpashnin/blog/-/blogs/spring-security-i-openam) for the idea for this manual.