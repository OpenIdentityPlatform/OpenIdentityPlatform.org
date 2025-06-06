---
layout: home
title: "How to Run OpenDJ‐based Embedded LDAP in Spring Boot Application"
landing-title2: "How to Run OpenDJ‐based Embedded LDAP in Spring Boot Application"
description: "This article explains how to run an embedded OpenDJ instance as part of a Spring Boot application"
keywords: 'opendj, ldap, spring, spring boot, embedded ldap'
imageurl: 'opendj-og.png'
share-buttons: true
products: 
- opendj
---
<h1>How to Run OpenDJ‐based Embedded LDAP in Spring Boot Application</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenDJ/wiki/How-to-Run-OpenDJ%E2%80%90based-Embedded-LDAP-in-Spring-Boot-Application](https://github.com/OpenIdentityPlatform/OpenDJ/wiki/How-to-Run-OpenDJ%E2%80%90based-Embedded-LDAP-in-Spring-Boot-Application)

## Introduction

In the following article we will setup a Spring Boot application with embedded OpenDJ-based LDAP server. This may be needed for integration testing or for productive use. For example, it could be useful for authentication via LDAP.


## Create a Project
Create an empty Spring Boot project using the Spring Initializer site or manually. Add the `opendj-embedded` dependency to the `pom.xml` file of the Spring Boot application.

```xml
<dependency>
    <groupId>org.openidentityplatform.opendj</groupId>
    <artifactId>opendj-embedded</artifactId>
    <version>4.6.4</version>
</dependency>
```

Add Java 8 compatibility arguments to the project properties

```xml
<properties>
		...
    <jvm.compatibility.args>
        --add-exports java.base/sun.security.tools.keytool=ALL-UNNAMED
        --add-exports java.base/sun.security.x509=ALL-UNNAMED
    </jvm.compatibility.args>
</properties>
```

Then add these arguments to `spring-boot-maven-plugin`:

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <jvmArguments>${jvm.compatibility.args}</jvmArguments>
    </configuration>
</plugin>
```

Add bean Embedded OpenDJ to your Spring Boot application.

```java
@Bean
public EmbeddedOpenDJ embeddedOpenDJ() {
    EmbeddedOpenDJ embeddedOpenDJ = new EmbeddedOpenDJ();
    embeddedOpenDJ.run();
    return embeddedOpenDJ;
}
```

In principle, this is all you need to start the embedded OpenDJ. There are still some nuances left. Let's take a look at how to change the default OpenDJ configuration:

### Change the Default Configuration

Create a new configuration class inherited from the `org.openidentityplatform.opendj.embedded.Config` class and overload the required properties, such as baseDN and admin password:

```java
@Configuration
public class OpenDJConfiguration extends Config {

    @Override
    @Value("${opendj.basedn:dc=example,dc=openidentityplatform,dc=org}")
    public void setBaseDN(String baseDN) {
        super.setBaseDN(baseDN);
    }

    @Override
    @Value("${opendj.adminpwd:passw0rd}")
    public void setAdminPassword(String adminPassword) {
        super.setAdminPassword(adminPassword);
    }
}
```

Add the configuration to the bean `EmbeddedOpenDJ` initialization

```java
@Bean
public EmbeddedOpenDJ embeddedOpenDJ(OpenDJConfiguration configuration) throws IOException, EmbeddedDirectoryServerException {
    EmbeddedOpenDJ embeddedOpenDJ = new EmbeddedOpenDJ(configuration);
    embeddedOpenDJ.run();
    return embeddedOpenDJ;
}
```

### Data Import

For demonstration purposes, we import the initial ldif data from the string.

```java
@Bean
public EmbeddedOpenDJ embeddedOpenDJ(OpenDJConfiguration configuration) throws IOException, EmbeddedDirectoryServerException {
    EmbeddedOpenDJ embeddedOpenDJ = new EmbeddedOpenDJ(configuration);
    embeddedOpenDJ.run();
    String data = """
dn: dc=example,dc=openidentityplatform,dc=org
objectClass: top
objectClass: domain
dc: example

dn: ou=people,dc=example,dc=openidentityplatform,dc=org
objectclass: top
objectclass: organizationalUnit
ou: people

dn: uid=jdoe,ou=people,dc=example,dc=openidentityplatform,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: John Doe
sn: John
uid: jdoe
""";
    InputStream inputStream = new ByteArrayInputStream(data.getBytes(StandardCharsets.UTF_8));
    embeddedOpenDJ.importData(inputStream);
    return embeddedOpenDJ;
}
```

If necessary, you can import data from any `InputStream`, such as a file read stream.

## Testing

You can use the `spring-ldap-core` library to test the embedded LDAP functionality 

Add dependencies to the project to run the tests

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.springframework.ldap</groupId>
    <artifactId>spring-ldap-core</artifactId>
    <scope>test</scope>
</dependency>
```

Add compatibility options to the `maven-surefire-plugin`

```xml
<plugin>
    <artifactId>maven-surefire-plugin</artifactId>
    <configuration>
        <argLine>${jvm.compatibility.args}</argLine>
    </configuration>
</plugin>
```

A simple test that will run a Spring Boot application with built-in OpenDJ authenticate and look for an imported record

```java
@SpringBootTest
class OpenDJEmbeddedApplicationTest {
    @Test
    public void test() {
        LdapContextSource contextSource = new LdapContextSource();
        contextSource.setUrl("ldap://localhost:1389");
        contextSource.setBase("dc=example,dc=openidentityplatform,dc=org");
        contextSource.setUserDn("cn=Directory Manager");
        contextSource.setPassword("passw0rd");
        contextSource.setPooled(true);
        contextSource.afterPropertiesSet();

        LdapTemplate template = new LdapTemplate(contextSource);
        Object user = template.lookup("uid=jdoe,ou=people");
        assertNotNull(user);
    }
}
```