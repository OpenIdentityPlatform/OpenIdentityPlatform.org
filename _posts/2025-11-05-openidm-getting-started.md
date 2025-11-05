---
layout: home
title: "Getting Started With OpenIDM"
landing-title2: "Getting Started With OpenIDM"
description: "Learn OpenIDM basics: Install, start, and reconcile user data between HR & Engineering identity stores."
keywords: 'OpenIDM, OpenIDM tutorial, identity management, OpenIDM getting started, data reconciliation, OpenIDM workflow, OpenIDM installation, OpenIdentityPlatform, user synchronization, CSV connector, self-service UI, password management, BPMN workflows, scripted connectors'
imageurl: 'openidm-og.png'
share-buttons: true
products: 
- openidm
---

# Getting Started With OpenIDM

Whenever you need access to important information, administrators need to know who you are. They need to know your identity, which may be distributed in multiple accounts.
As a user, you might have several accounts even within your own company, for functions such as: 
* Email
* Human Resources
* Payroll
* Engineering, Support, Accounting, and other functions

Each of these accounts may be stored in different resources, such as Active Directory, [OpenDJ](https://github.com/OpenIdentityPlatform/OpenDJ), OpenLDAP, and more. Keeping track of user identities in each of these resources (also known as data stores) can get complex. OpenIDM simplifies the process, as it reconciles differences between resources.

With situational policies, OpenIDM can handle discrepancies such as a missing or updated address for a specific user. OpenIDM includes default but configurable policies to handle such conditions. In this way, OpenIDM ensures consistency and predictability in an otherwise chaotic resource environment.

OpenIDM can make it easier to track user identities across these resources. OpenIDM has a highly scalable, modular, readily deployable architecture that can help you manage workflows and user information.

## What Can You Do With OpenIDM?

With OpenIDM, you can simplify the management of identity, as it can help you synchronize data across multiple resources. Each organization can maintain control of accounts within their respective domains.

OpenIDM works equally well with user, group, and device identities.

You can also configure workflows to help users manage how they sign up for accounts, as part of how OpenIDM manages the life cycle of users and their accounts.

You can manage employee identities as they move from job to job. You will make their lives easier as OpenIDM can automatically register user accounts on different systems. Later, OpenIDM will increase productivity when it reconciles information from different accounts, saving users the hassle of entering the same information on different systems.

## What You Will See In This Document

In this guide, you will see how OpenIDM reconciles user data between two data stores. We will look at a department that is adding a third engineer, Jane Sanchez.
Your Human Resources department has updated their data store with Jane Sanchez's information. You want to use OpenIDM to update the internal Engineering data store. But first, you have to start OpenIDM.

## What You Need Before Starting OpenIDM

This section covers what you need to have on your system before running OpenIDM:

* [Operating System](https://github.com/OpenIdentityPlatform/OpenIDM/blob/7228619b0ef5d6e4b5a8c7c58af6d155eceebcf7/.github/workflows/build.yml#L14): 
  * 'ubuntu-latest' (or other Linux-like OS)
  * 'macos-latest'
  * 'windows-latest'
* [Java JRE](https://github.com/OpenIdentityPlatform/OpenIDM/blob/7228619b0ef5d6e4b5a8c7c58af6d155eceebcf7/.github/workflows/build.yml#L13): 
  * '8'
  * '11' 
  * '17'
  * '21'
* At least 250 MB of free disk space.
* At least 1 GB of free RAM.
* If your operating system includes a firewall, make sure that it allows traffic through (default) ports 8080 and 8443.

We provide this document, [[Getting Started]] with OpenIDM, for demonstration purposes only.

With this document, we want to make it as easy as possible to set up a demonstration of OpenIDM. To that end, we have written this document for installations on a unix-like operating system.

For a list of software that we support in production, see [OpenIDM on Docker](https://hub.docker.com/r/openidentityplatform/openidm).

### Java Environment

Please check java version before standalone install 

```
$ java -version
openjdk version "1.8.0_402"
OpenJDK Runtime Environment (Temurin)(build 1.8.0_402-b06)
OpenJDK 64-Bit Server VM (Temurin)(build 25.402-b06, mixed mode)
``` 

or use [OpenIDM on Docker](https://hub.docker.com/r/openidentityplatform/openidm) 

```
$ docker version
Client:
 Cloud integration: v1.0.35+desktop.13
 Version:           26.1.1
 API version:       1.45
 Go version:        go1.21.9
 Git commit:        4cf5afa
 Built:             Tue Apr 30 11:44:56 2024
 OS/Arch:           darwin/amd64
 Context:           desktop-linux

Server: Docker Desktop 4.30.0 (149282)
 Engine:
  Version:          26.1.1
  API version:      1.45 (minimum version 1.24)
  Go version:       go1.21.9
  Git commit:       ac2de55
  Built:            Tue Apr 30 11:48:28 2024
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.31
  GitCommit:        e377cd56a71523140ca6ae87e30244719194a521
 runc:
  Version:          1.1.12
  GitCommit:        v1.1.12-0-g51d5e94
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

## Downloading and Starting OpenIDM

[OpenIDM Standalone ZIP](https://github.com/OpenIdentityPlatform/OpenIDM/releases)

```
$ export VERSION=$(curl -i -o - --silent https://api.github.com/repos/OpenIdentityPlatform/OpenIDM/releases/latest | grep -m1 "\"name\"" | cut -d\" -f4); echo "Last version: $VERSION"
Last version: 6.0.1

$ curl -L https://github.com/OpenIdentityPlatform/OpenIDM/releases/download/$VERSION/openidm-$VERSION.zip --output openidm.zip
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100 92.1M  100 92.1M    0     0  9421k      0  0:00:10  0:00:10 --:--:-- 9926k

$ unzip openidm.zip 
Archive:  openidm.zip
   creating: openidm/
....

$ openidm/startup.sh -p samples/getting-started
Executing openidm/startup.sh...
Using OPENIDM_HOME:   /tmp/openidm
Using PROJECT_HOME:   /tmp/openidm/samples/getting-started
Using OPENIDM_OPTS:   -Dlogback.configurationFile=conf/logging-config.groovy
Using LOGGING_CONFIG: -Djava.util.logging.config.file=/tmp/openidm/samples/getting-started/conf/logging.properties
Using boot properties at /tmp/openidm/samples/getting-started/conf/boot/boot.properties
-> OpenIDM version "6.0.1" (revision: 284a4) 2024-05-23T09:18:27Z master
OpenIDM ready

```

[OpenIDM on Docker](https://hub.docker.com/r/openidentityplatform/openidm)

```
$ docker run -h idm-01.domain.com -p 8080:8080 -p 8443:8443 --name idm-01 openidentityplatform/openidm -p samples/getting-started
Unable to find image 'openidentityplatform/openidm:latest' locally
latest: Pulling from openidentityplatform/openidm
74ac377868f8: Already exists 
a182a611d05b: Already exists 
e58ce1bd2f23: Already exists 
e1b7fbdee987: Already exists 
4f4fb700ef54: Already exists 
26716adeef7f: Pull complete 
Digest: sha256:6a6df88ca40116de4bba7ddef126a214feee04e7161b0d6f39ff9c9f448cda94
Status: Downloaded newer image for openidentityplatform/openidm:latest
Executing /opt/openidm/startup.sh...
Using OPENIDM_HOME:   /opt/openidm
Using PROJECT_HOME:   /opt/openidm/samples/getting-started
Using OPENIDM_OPTS:   -server -XX:+UseContainerSupport -Dlogback.configurationFile=conf/logging-config.groovy
Using LOGGING_CONFIG: -Djava.util.logging.config.file=/opt/openidm/samples/getting-started/conf/logging.properties
Using boot properties at /opt/openidm/samples/getting-started/conf/boot/boot.properties
ShellTUI: No standard input...exiting.
OpenIDM version "6.0.1" (revision: 284a4) 2024-05-23T09:18:27Z master
OpenIDM ready
```

Once OpenIDM is ready, you can administer it from a web browser. To do so, navigate to http://localhost:8080/admin or https://localhost:8443/admin. If you have installed OpenIDM on a remote system, substitute that hostname or IP address for localhost.

The default username and password for the OpenIDM Administrator is **openidm-admin** and **openidm-admin** (**change this password**). When you log into OpenIDM at a URL with the **/admin** endpoint, you are logging into the OpenIDM Administrative User Interface, also known as the **Admin UI**.

All users, including **openidm-admin**, can change their password through the Self-Service UI, at http://localhost:8080/ or https://localhost:8443/. Once logged in, click **Profile** > **Password**.

## The Getting Started Data Files

In a production deployment, you are likely to see resources like Active Directory and OpenDJ. But the setup requirements for each are extensive, and beyond the scope of this document.

For simplicity, this guide uses two static files as data stores:
* [samples/getting-started/data/hr.csv](https://github.com/OpenIdentityPlatform/OpenIDM/blob/master/openidm-zip/src/main/resources/samples/getting-started/data/hr.csv) represents the Human Resources data store. It is in CSV format, commonly used to share data between spreadsheet applications.
* [samples/getting-started/data/engineering.csv](https://github.com/OpenIdentityPlatform/OpenIDM/blob/master/openidm-zip/src/main/resources/samples/getting-started/data/engineering.csv) represents the Engineering data store. It is in CSV format, a generic means for storing complex data that is commonly used to share data between spreadsheet applications.

You can find these files in the OpenIDM binary package that you downloaded earlier, in the following subdirectory: [samples/getting-started](https://github.com/OpenIdentityPlatform/OpenIDM/tree/master/openidm-zip/src/main/resources/samples/getting-started).

# Reconciling Identity Data

Now that you have installed OpenIDM with a [Getting Started configuration](#the-getting-started-data-files), you will learn how OpenIDM reconciles information between two data stores.

While the reconciliation demonstrated in this guide uses two simplified data files, you can set up the same operations at an enterprise level on a variety of resources.

Return to the situation described earlier, where you have **Jane Sanchez** joining the engineering department. The following illustration depicts what OpenIDM has to do to reconcile the differences.

![](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/OpenIDM-Reconciles.png "OpenIDM can reconcile differences between data stores")

## Using OpenIDM to Reconcile Differences

A central feature of OpenIDM is reconciliation. In other words, OpenIDM can compare the contents of two data stores, and make decisions on what to do, depending on the differences.

This scenario is based on two data files:

* [hr.csv](https://github.com/OpenIdentityPlatform/OpenIDM/blob/master/openidm-zip/src/main/resources/samples/getting-started/data/hr.csv), which represents the Human Resources data store
* [engineering.csv](https://github.com/OpenIdentityPlatform/OpenIDM/blob/master/openidm-zip/src/main/resources/samples/getting-started/data/engineering.csv), which represents the Engineering data store

OpenIDM will modify the Engineering data store by adding the newly hired **Jane Sanchez**. As suggested by the following illustration, it will also address detailed differences between Jane's Human Resources account and the Engineering data store.

![](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/Jane-Sanchez.png "OpenIDM can reconcile differences between data stores")

OpenIDM includes configuration files that map detailed information from the Human Resources data store to the Engineering data store. For example, the OpenIDM configuration maps the **firstName** entry in Human Resources to the **firstname** entry in Engineering.

**Note**
> Mapping between data stores may require additional configuration. You should find two provisioner.openicf- *.json files in the [samples/getting-started/conf](https://github.com/OpenIdentityPlatform/OpenIDM/blob/master/openidm-zip/src/main/resources/samples/getting-started/conf) subdirectory. The provisioner files configure connections to external resources, such as Active Directory, OpenDJ or even the engineering.csv and hr.csv files used in this guide. For more information, see **Connecting to External Resources** in the [[Integrator's Guide]].

In the **Admin UI**, you can see how OpenIDM reconciles the different categories for user **Jane Sanchez**. Log in to the **Admin UI** at https://localhost:8443/admin. The default username is **openidm-admin** and default password is **openidm-admin**.

Select **Configure** > **Mappings** > **HumanResources_Engineering** > **Properties**.

In the Sample Source text box, enter **Sanchez**. You should see a drop-down entry for **Jane Sanchez** that you can select. You should now see how OpenIDM would reconcile Jane Sanchez's entry in the Human Resources data store into the Engineering data store.

![](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/Reconciling-Differences-for-an-Account.png "Reconciling Differences for an Account")

Scroll back up the same page. Select **Reconcile Now**.

When you reconcile the two data stores, OpenIDM will make the change to the Engineering data store.
For those of you who prefer the command-line interface, you can see how the mapping works in the [samples/getting-started/conf/sync.json](https://github.com/OpenIdentityPlatform/OpenIDM/blob/master/openidm-zip/src/main/resources/samples/getting-started/conf/sync.json) file.

## Reconciling Identity Data After One Update

Now that you have used OpenIDM to reconcile two data stores, try something else. Assume the Engineering organization wants to overwrite all user telephone numbers in its employee data store with one central telephone number.

For this purpose, you can set up a default telephone number for the next reconciliation.

In the **HumanResources_Engineering** page, scroll down and select **telephoneNumber** > **Default Values**.

![](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/Set-A-New-Default-Telephone-Number.png "Set A New Default Telephone Number")

When you select Update, and Save Properties, OpenIDM changes the [samples/getting-started/conf/sync.json](https://github.com/OpenIdentityPlatform/OpenIDM/blob/master/openidm-zip/src/main/resources/samples/getting-started/conf/sync.json) configuration file. The next time OpenIDM reconciles from Human Resources to Engineering, it will include that default telephone number for all employees in the Engineering group.

# Where To Go From Here

OpenIDM can do much more than reconcile data between two different sources. In this chapter, you will read about the key features of OpenIDM, with links to additional information about each feature.

## Integrating Business Processes and Workflows

A business process begins with an objective and includes a well-defined sequence of tasks to meet that objective. In OpenIDM, you can configure many of these tasks as self-service workflows, such as self-registration, new user onboarding, and account certification.
With OpenIDM, you can automate many of these tasks as a workflow.

Once you configure the right workflows, a newly hired engineer can log into OpenIDM and request access to manufacturing information.

That request is sent to the appropriate manager for approval. Once approved, the OpenIDM provisions the new engineer with access to manufacturing.

OpenIDM supports workflow-driven provisioning activities, based on the embedded Activiti Process Engine, which complies with the Business Process Model and Notation 2.0 (BPMN 2.0) standard.

OpenIDM integrates additional workflows such as new user onboarding, orphan account detection, and password change reminders. For more information, see **Workflow Samples** in the [[Samples Guide]].

## Managing Passwords

You can manage passwords from the **Self-Service User Interface**, also known as the **Self-Service UI**. From the **Admin UI**, click on the icon in the upper-right corner. In the menu that appears, click Self-Service:

![](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/Access-the-Self-Service-User-Interface.png "Access the Self-Service User Interface")

You should now be in the Self-Service UI. Click **Profile** > **Password**. You can now change your password, subject to the policy limits shown.

![](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/Changing-Your-Password.png "Changing Your Password")

As you can see, OpenIDM supports a robust password policy. You can modify the rules shown, or add more rules such as the following:

* Elements that should not be a part of a password, such as a family name
* Password expiration dates
* Password histories, to prevent password reuse

For more information, see **Managing Passwords** in the [[Integrator's Guide]].

## Connecting to Remote Data Stores

You can use OpenIDM to connect to a substantial variety of user and device data stores, on premise and in the cloud. While OpenIDM can connect to some connectors dedicated to a few data stores, OpenIDM can also connect to many more data stores using a scripted connector framework.

OpenIDM includes support for connectors to the following external resources:
* Google Web Applications (see **Google Apps Connector** in the [Connectors Guide](https://github.com/OpenIdentityPlatform/OpenICF/wiki/Connectors-Guide)).
* Salesforce (see **Salesforce Connector** in the [Connectors Guide](https://github.com/OpenIdentityPlatform/OpenICF/wiki/Connectors-Guide)).
* Any LDAPv3-compliant directory, including OpenDJ and Active Directory (see **Generic LDAP Connector** in the [Connectors Guide](https://github.com/OpenIdentityPlatform/OpenICF/wiki/Connectors-Guide)).
* CSV Files (see **CSV File Connector** in the [Connectors Guide](https://github.com/OpenIdentityPlatform/OpenICF/wiki/Connectors-Guide)).
* Database Tables (see **Database Table Connector** in the [Connectors Guide](https://github.com/OpenIdentityPlatform/OpenICF/wiki/Connectors-Guide)).

If the resource that you need is not on the list, you should be able to use one of the OpenIDM scripted connector frameworks to connect to that resource:
* For connectors associated with Microsoft Windows, OpenIDM includes a **PowerShell Connector Toolkit** that you can use to provision a variety of Microsoft services, including but not limited to Active Directory, SQL Server, Microsoft Exchange, SharePoint, Azure Active Directory, and Office 365. For more information, see **PowerShell Connector Toolkit** in the [Connectors Guide](https://github.com/OpenIdentityPlatform/OpenICF/wiki/Connectors-Guide). OpenIDM includes a sa]mple PowerShell Connector Toolkit configuration, described in **Samples That Use the PowerShell Connector Toolkit to Create Scripted Connectors** in the [[Samples Guide]].
* For other external resources, OpenIDM includes a **Groovy Connector Toolkit** that allows you to run Groovy scripts to interact with any external resource. For more information, see **Groovy Connector Toolkit** in the [Connectors Guide](https://github.com/OpenIdentityPlatform/OpenICF/wiki/Connectors-Guide). **Samples That Use the Groovy Connector Toolkit to Create Scripted Connectors** in the [[Samples Guide]] includes samples of how you might implement the scripted Groovy connector.

## Reconciliation

OpenIDM supports reconciliation between two data stores, as a source and a target.

In identity management, reconciliation compares the contents of objects in different data stores, and makes decisions based on configurable policies.

For example, if you have an application that maintains its own user store, OpenIDM can ensure your canonical directory attributes are kept up to date by reconciling their values as they are changed.

For more information, see **Synchronizing Data Between Resources** in the [[Integrator's Guide]].

## Authentication Modules Available for OpenIDM

OpenIDM has access to several different authentication modules that can help you protect your systems. For more information, see **Supported Authentication and Session Modules** in the [[Integrator's Guide]].

## Finding Additional Use Cases

OpenIDM is a lightweight and highly customizable identity management product.

The OpenIDM documentation includes additional use cases. Most of them are known as Samples, and are described in **Overview of the OpenIDM Samples** in the [[Samples Guide]].

These samples include step-by-step instructions on how you can connect to different data stores, customize product behavior using JavaScript and Groovy, and administer OpenIDM with commons RESTful API commands.

## How OpenIDM Can Help Your Organization

Now that you have seen how OpenIDM can help you manage users, review the features that OpenIDM can bring to your organization:

* Web-Based Administrative User Interface

Configure OpenIDM with the Web-Based Administrative User Interface. You can configure many major components of OpenIDM without ever touching a text configuration file.

* Self-Service Functionality

User self-service features can streamline onboarding, account certification, new user registration, username recovery, and password reset. OpenIDM self-service features are built upon a BPMN 2.0- compliant workflow engine.

* Role-Based Provisioning

Create and manage users based on attributes such as organizational need, job function, and geographic location.

* Backend Flexibility

Choose the desired backend database for your deployment. OpenIDM supports MySQL, Microsoft SQL Server, Oracle Database, IBM DB2, and PostgreSQL. For the supported versions of each database, see Chapter 2, "Before You Install OpenIDM Software" in the Release Notes.

* Password Management

Set up fine-grained control of passwords to ensure consistent password policies across all applications and data stores. Supports separate passwords per external resource.

* Logging, Auditing, and Reporting

OpenIDM logs all activity, internally and within connected systems. With such logs, you can track information for access, activity, authentication, configuration, reconciliation, and synchronization.

* Access to External Resources

OpenIDM can access a generic scripted connector that allows you to set up communications with many external data stores.
