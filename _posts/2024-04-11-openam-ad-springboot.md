---
layout: home
title: "How to Setup Active Directory Authentication in a Spring Boot Application"
landing-title2: "How to Setup Active Directory Authentication in a Spring Boot Application"
description: "How to configure OpenAM to authenticate in a Spring Boot Application via Active Directory"
keywords: 'Active Directory, Spring Boot, Spring Security, SSO, OpenAM'
imageurl: 'openam-og.png'
share-buttons: true
products: 
- openam

---
<h1>How to Setup Active Directory Authentication in a Spring Boot Application</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Setup-Active-Directory-Authentication-in-a-Spring-Boot-Application](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Setup-Active-Directory-Authentication-in-a-Spring-Boot-Application)
# Introduction

Almost every organization uses [Active Directory](https://ru.wikipedia.org/wiki/Active_Directory) to manage employee accounts. And using existing accounts to access corporate applications is a recommendend practice. In this article, we will configure authentication in the [demo Spring Boot application](https://github.com/OpenIdentityPlatform/spring-security-openam-example) via an Active Directory server in [OpenAM](https://github.com/OpenIdentityPlatform/OpenAM).


## OpenAM Configuration

## Install OpenAM

Let OpenAM hostname is `openam.example.org`, and the Spring Boot application hostname is `app.example.org`.

If you already have OpenAM installed, you can skip this step. The easiest way to deploy OpenAM is in a Docker container. Before starting, add the hostname and IP address to the `hosts` file, for example `127.0.0.0.1 app.example.org openam.example.org` .  

On Windows systems, the `hosts` file is located at `C:Windows/System32/drivers/etc/hosts` , on Linux and Mac it is located at `/etc/hosts` .

Create a network in Docker for OpenAM

```bash
docker network create openam
```

Next, start the Docker container OpenAM Execute the following command:

```bash
docker run -h openam.example.org -p 8080:8080 --network openam --name openam openidentityplatform/openam
```

Once the server is up and running, run the initial OpenAM configuration. Run the following command:

```bash
docker exec -w '/usr/openam/ssoconfiguratortools' openam bash -c \
'echo "ACCEPT_LICENSES=true
SERVER_URL=http://openam.example.org:8080
DEPLOYMENT_URI=/$OPENAM_PATH
BASE_DIR=$OPENAM_DATA_DIR
locale=en_US
PLATFORM_LOCALE=en_US
AM_ENC_KEY=
ADMIN_PWD=passw0rd
AMLDAPUSERPASSWD=p@passw0rd
COOKIE_DOMAIN=example.org
ACCEPT_LICENSES=true
DATA_STORE=embedded
DIRECTORY_SSL=SIMPLE
DIRECTORY_SERVER=openam.example.org
DIRECTORY_PORT=50389
DIRECTORY_ADMIN_PORT=4444
DIRECTORY_JMX_PORT=1689
ROOT_SUFFIX=dc=openam,dc=example,dc=org
DS_DIRMGRDN=cn=Directory Manager
DS_DIRMGRPASSWD=passw0rd" > conf.file && java -jar openam-configurator-tool*.jar --file conf.file'
```

After successful configuration you can proceed to further steps. 

Note the `COOKIE_DOMAIN` parameter - the authentication session cookie must be set to a common top-level domain for OpenAM and the application.


## Authentication Module Configuration

Go to the OpenAM administrator console at 

http://openam.example.org:8080/openam/XUI/#login/

In the login field enter the value `amadmin`, in the password field enter the value from the `ADMIN_PWD` parameter of the setup command, in this case `passw0rd`.

Select the root realm and select Authentication → Modules from the menu. Create a new Active Directory authentication module.

![OpenAM new Active Directory Module](/assets/img/openam-ad-springboot/0-openam-new-ad-module.png)

Set the module settings according to the table

| Setting | Description |
| --- | --- |
| Primary Active Directory Server | AD host and port number, for example: ad.example.org:389 |
| Users Domain | | Active Directory domain for user authentication, for example, example.org. You need to fill this property so that users do not enter a name like user@example.org | to authenticate.
| Bind User DN | Leave blank. If empty, binding authentication is used and you do not need to specify Bind user password, User Search Filter, and DN to Start User Search. | Bind user password.

You can leave other settings unchanged.

## Authentication Chain Configuration

Go to the admin console, select the root realm and select Authentication → Chains from the menu. Create an `activeDirectory` authentication chain with the recently created `activeDirectory` module.

![OpenAM Active Directory Authentication Chain](/assets/img/openam-ad-springboot/1-openam-ad-auth-chain.png)

## Configure realm

Go to Authentication → Chains for realm and on the User Profile tab, set the `User Profile` setting to `Ignore`.

![OpenAM Realm User Profile Settings](/assets/img/openam-ad-springboot/2-openam-realm-auth-settings.png)

So, you can authenticate to Active Directory without setting up Active Directory as a User Data Store in OpenAM.

# Spring Boot Application Setup

The recommended way is to integrate through Spring Security.

The application uses a filter that can be attached to a Spring REST or a Web Controller.

The filter receives a Cookie with the authentication session ID set by OpenAM on successful authentication from the HttpServletRequest. Then the filter calls the OpenAM API to retrieve the user from the session. If the cookie does not exist or the session retrieved from the cookie is not valid, the user is redirected to authentication.

An example filter is in the listing below:

```java
@Component
public class OpenAmAuthFilter implements Filter {

    final static String OPENAM_URI = "http://openam.example.org:8080/openam";

    final static String OPENAM_COOKIE_NAME = "iPlanetDirectoryPro";

    final static String REDIRECT_URI_TEMPLATE = OPENAM_URI.concat("/XUI#login/&service=activeDirectory&goto=");

    private final String OPENAM_USER_INFO_URI = OPENAM_URI.concat("/json/users?_action=idFromSession");

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        //reading OpenAM session cookie
        Optional<Cookie> openamCookie = Optional.empty();
        if(request.getCookies() != null) {
            openamCookie = Arrays.stream(request.getCookies())
                    .filter(c -> c.getName().equals(OPENAM_COOKIE_NAME)).findFirst();
        }
        String redirectUri = request.getRequestURL().toString();
        if(openamCookie.isEmpty()) {
            response.sendRedirect(REDIRECT_URI_TEMPLATE  + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8));
        } else {
            //retrieve userID from by session cookie value from OpenAM
            String userId = getUserIdFromSession(openamCookie.get().getValue());
            if (userId == null) {
                response.sendRedirect(REDIRECT_URI_TEMPLATE + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8));
                return;
            }
            request.setAttribute("openam.userId", userId);
            filterChain.doFilter(servletRequest, servletResponse);
        }
    }

    private String getUserIdFromSession(String sessionId) {
        RestTemplate restTemplate = new RestTemplate();
        ParameterizedTypeReference<Map<String, String>> responseType = new ParameterizedTypeReference<>() {};
        HttpHeaders headers = new HttpHeaders();
        headers.add(OPENAM_COOKIE_NAME, sessionId);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        ResponseEntity<Map<String, String>> response
                = restTemplate.exchange(OPENAM_USER_INFO_URI, HttpMethod.POST, entity, responseType);
        Map<String, String> body = response.getBody();
        if (body == null) {
            return null;
        }
        return body.get("id");
    }
}
```

# Test Solution

Let's run a demo Spring Boot application in a Docker container

```bash
docker run -h app.example.org -p 8081:8081 --network openam --name spring-security-openam-example openidentityplatform/spring-security-openam-example
```

Exit the console and open the demo application link in your browser. http://app.example.org:8081/ Click the `OpenAM Cookie` link.

![Example Spring Boot Application](/assets/img/openam-ad-springboot/3-example-spring-boot-application.png)

The filter will not find a valid session and will redirect to OpenAM authentication. Enter the user's credentials from Active Directory. 

![OpenAM Authentication](/assets/img/openam-ad-springboot/4-openam-authentication.png)

After successful authentication, the user will be redirected back to the application. The `openam.userId` attribute of the HttpServletRequest object will be set to the user ID from Active Directory. 

![Seccuessful Authentication](/assets/img/openam-ad-springboot/5-successful-auth.png)

**Further reading**

- [OpenAM and Spring Boot 3 Integration via OIDC OAuth2 Protocol](https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Spring-Boot-3-Integration-via-OIDC-OAuth2-Protocol)
- [OpenAM and Spring Boot 3 Integration via SAMLv2 Protocol](https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Spring-Boot-3-Integration-via-SAMLv2-Protocol)
- [OpenAM and Spring Boot 3 Integration via OpenAM Cookie](https://github.com/OpenIdentityPlatform/OpenAM/wiki/OpenAM-and-Spring-Boot-3-Integration-via-OpenAM-Cookie)
- [How to Add Authorization and Protect Your Application With OpenAM and OpenIG Stack](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Add-Authorization-and-Protect-Your-Application-With-OpenAM-and-OpenIG-Stack)
