---
layout: home
title: "How to Customise OpenAM"
landing-title2: "How to Customise OpenAM"
description: "This article explains how create custom OpenAM project and run it in the local environment"
keywords: 'OpenAM, Customisation'
imageurl: 'openam-og.png'
share-buttons: true
products: 
- openam

---
<h1>How to Customise OpenAM</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Customise-OpenAM](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Customise-OpenAM)

- [Introduction](#introduction)
- [Create Maven Project](#create-maven-project)
- [Run and Debug War File Locally](#run-and-debug-war-file-locally)
- [Customisation Example](#customisation-example)
- [Conclusion](#conclusion)

## Introduction

OpenAM is a reliable and mature product itself out of the box, have rich functionality and a good extension potential. But there is always a question - how to develop and debug the extensions? In the following article we will create a maven project and do simple OpenAM customisation.

## Create Maven Project

Create a maven project with the following `pom.xml` file:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.openidentityplatform.openam</groupId>
        <artifactId>openam</artifactId>
        <version>14.7.1</version>
    </parent>
    <repositories>
        <repository>
            <id>ossrh-releases</id>
            <name>Sonatype OSS</name>
            <url>https://oss.sonatype.org/content/repositories/releases/</url>
        </repository>
    </repositories>
    <artifactId>openam-extended</artifactId>
    <packaging>war</packaging>
		<build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <configuration>
                    <failOnMissingWebXml>false</failOnMissingWebXml>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

The parent project will be `org.openidentityplatform.openam:openam` so in the following project we can use proper OpenAM dependencies in our project.

Project packaging should be war, as we build a web application that extends OpenAM server application.

To override OpenAM server add `org.openidentityplatform.openam:openam-server` dependency  to the build section and overlay to `maven-war-plugin`

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.openidentityplatform.openam</groupId>
        <artifactId>openam</artifactId>
        <version>14.7.1</version>
    </parent>
    <repositories>
        <repository>
            <id>ossrh-releases</id>
            <name>Sonatype OSS</name>
            <url>https://oss.sonatype.org/content/repositories/releases/</url>
        </repository>
    </repositories>
    <artifactId>openam-extended</artifactId>
    <packaging>war</packaging>
    <dependencies>
        <dependency>
            <groupId>org.openidentityplatform.openam</groupId>
            <artifactId>openam-server</artifactId>
            <type>war</type>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <configuration>
                    <failOnMissingWebXml>false</failOnMissingWebXml>
                    <overlays>
                        <overlay>
                            <groupId>org.openidentityplatform.openam</groupId>
                            <artifactId>openam-server</artifactId>
                        </overlay>
                    </overlays>
                 </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

Run `mvn package` command and after a successful build, you can see `openam-extended-14.7.1.war` file. This file you can use this instead of the default OpenAM server war file.

## Run and Debug War File Locally

Add to the maven pom to the plugins section `cargo-maven2-plugin`:

```xml
...
<plugin>
    <groupId>org.codehaus.cargo</groupId>
    <artifactId>cargo-maven2-plugin</artifactId>
    <configuration>
        <container>
            <containerId>tomcat9x</containerId>
            <type>embedded</type>
            <systemProperties>
				<!--configuration directory path-->
                <com.iplanet.services.configpath>${basedir}/config</com.iplanet.services.configpath>
                <com.sun.identity.configuration.directory>${basedir}/config</com.sun.identity.configuration.directory>
            </systemProperties>
        </container>
        <configuration>
            <properties>
				<!--openam port-->
                <cargo.servlet.port>8080</cargo.servlet.port>
                <cargo.rmi.port>8206</cargo.rmi.port>
                <cargo.jvmargs> ${java.surefire.options} -Xms4g -Xmx4g</cargo.jvmargs>
            </properties>
        </configuration>
        <deployables>
            <deployable>
                <type>war</type>
                <properties>
                    <context>openam</context>
                </properties>
                <pingURL>http://localhost:8080/openam</pingURL>
            </deployable>
        </deployables>
    </configuration>
</plugin>
...
```

Add desired OpenAM FQDN to your hosts file like this:

```
127.0.0.1    openam.example.com 
```

To repackage and run war file execute the following command: `mvn package cargo:run`

You should see in the console something like this

```
[INFO] [beddedLocalContainer] Tomcat 9.x Embedded started on port [8080]
[INFO] Press Ctrl-C to stop the container...
```

Open OpenAM console in the browser with the following link [http://openam.example.com:8080/openam](http://openam.example.com:8080/openam) and OpenAM will prompt you to configure a new instance. How to configure a new OpenAM instance is described in [Quick Start Guide](https://github.com/OpenIdentityPlatform/OpenAM/wiki/Quick-Start-Guide). After OpenAM configuration you will be able to use OpenAM locally within your development environment.

OpenAM configuration and log files will be stored in your project in `/config` directory

# Customisation Example

After configuring OpenAM, let’s do something simple to demonstrate customisation. We will modify the default OpenAM login page. We will add Acme corp logo instead of standard OpenAM logo. 

The header template is in `XUI/templates/common/LoginHeaderTemplate.html` file. Create `src/main/webapp/XUI/templates/common/LoginHeaderTemplate.html` file in the project root folder. Then add the following contents:

```html
<h1>ACME corp.</h1>
```

Start OpenAM and navigate to the login page.
We can see that OpenAM uses the custom header. You can deploy the custom war file on your production web server

## Conclusion

This article has only shown a simple setup in order to demonstrate the overall approach. In future articles we will show a more complex setup, such as developing a custom authentication module.