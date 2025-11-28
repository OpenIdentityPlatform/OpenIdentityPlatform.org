---
layout: home
title: "Configuring authentication in OpenAM via Yandex Cloud using the SAML protocol"
landing-title2: "Configuring authentication in OpenAM via Yandex Cloud using the SAML protocol"
description: "Step-by-step guide to configure SAML 2.0 federation between Yandex Cloud (IdP) and OpenAM / Open Identity Platform (SP). Includes Docker deployment, certificate import, realm setup, and full working SSO test"
keywords: 'SAML Yandex Cloud, OpenAM SAML integration, Yandex Cloud Identity Provider, OpenAM as Service Provider, Open Identity Platform SAML, Yandex Cloud SSO, OpenAM federation setup, SAML 2.0 Yandex, OpenAM Docker deployment, Yandex Cloud IdP configuration, single sign-on Yandex OpenAM, OpenAM external IdP, Yandex Cloud SAML metadata, OpenAM hosted SP, SAML authentication tutorial, OpenAM auto-federation, Yandex Cloud user pool SAML, OpenIG SSO preparation, Open Identity Platform documentation'
imageurl: 'openam-og.png'
share-buttons: true
products: 
- openam
---

# Configuring authentication in OpenAM via Yandex Cloud using the SAML protocol


## Introduction

In this article, we will configure authentication in OpenAM using user accounts via Yandex Cloud. This will allow you to configure authentication in your corporate applications via OpenAM using Yandex Cloud as the Identity Provider (IdP) and OpenAM as the Service Provider (SP).

## Configuring Yandex Cloud

1. Go to the [Yandex Cloud Organization](https://org.cloud.yandex.ru/) service.
2. Open the **Identity Hub** tab.
3. In the left pane, select the [Applications](https://center.yandex.cloud/organization/apps) section.
4. Click the **Create Application** button
5. Select the SAML (Security Assertion Markup Language) application type
6. Enter the application name, for example, **openam-saml**
7. Click the **Create Application** button


![Yandex Cloud Create New App](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/yandex-cloud-idp-saml/0-yandex-cloud-new-app.pngg)

After creating the application, open its settings and click the **Download Certificate** button. We will need it for further configuration of OpenAM.

### Service Provider Configuration

1. Open the Yandex settings for the **openam-saml** application and configure the settings:
1. **SP Entity ID:** `http://localhost:8080/openam`
2. **ACS URL:** `http://localhost:8080/openam/Consumer/metaAlias/sp`
2. Save the changes.

![Yandex Cloud Application Settings](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/yandex-cloud-idp-saml/1-yandex-cloud-app-settings.png)

### Adding users

Add a user pool:

1. In the **Identity Hub** section, select **User Pools** from the menu on the left.
2. Click the **Create User Pool** button.
3. Enter the pool details and click **Create User Pool**.

![Yandex Clound New User Pool](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/yandex-cloud-idp-saml/2-yandex-cloud-new-user-pool.png)

Add a user to the pool

1. In the **Identity Hub** section of the left-hand menu, select **Users**
2. Click the **Add User** button
3. In the pop-up menu, select **Create New User**
4. Remember the password, as you will need it to log in to OpenAM
5. Enter the user details and click **Add User**

![Yandex Cloud New User](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/yandex-cloud-idp-saml/3-yandex-cloud-new-user.png)

## Configuring OpenAM

### Installing OpenAM

For simplicity, deploy OpenAM in a Docker container with the command

```bash
docker run -p 8080:8080 --name openam openidentityplatform/openam
```

And perform the initial setup

```bash
docker exec -w '/usr/openam/ssoconfiguratortools' openam bash -c \
'echo "ACCEPT_LICENSES=true
SERVER_URL=http://localhost:8080
DEPLOYMENT_URI=/$OPENAM_PATH
BASE_DIR=$OPENAM_DATA_DIR
locale=en_US
PLATFORM_LOCALE=en_US
AM_ENC_KEY=
ADMIN_PWD=passw0rd
AMLDAPUSERPASSWD=p@passw0rd
COOKIE_DOMAIN=localhost
ACCEPT_LICENSES=true
DATA_STORE=embedded
DIRECTORY_SSL=SIMPLE
DIRECTORY_SERVER=localhost
DIRECTORY_PORT=50389
DIRECTORY_ADMIN_PORT=4444
DIRECTORY_JMX_PORT=1689
ROOT_SUFFIX=dc=openam,dc=example,dc=org
DS_DIRMGRDN=cn=Directory Manager
DS_DIRMGRPASSWD=passw0rd" > conf.file && java -jar openam-configurator-tool*.jar --file conf.file'
```

Add the certificate you downloaded earlier for the Yandex Cloud application you created to the OpenAM keystore.

To do this, copy the certificate to the container.

```bash
docker cp openam-saml.cer openam:/usr/openam/config/openam
```

The password for the keystore is located in the file `/usr/openam/config/openam/.storepass`.

You can view it using the command

```bash
docker exec openam bash -c 'cat /usr/openam/config/openam/.storepass'
```

Import the certificate into the OpenAM keystore

```bash
docker exec -it -w '/usr/openam/config/openam' openam bash -c 'keytool -importcert \
        -alias "yandex-cloud-cert" \
        -keystore keystore.jceks \
        -storetype JCEKS \
        -file openam-saml.cer'
```

Enter the password and confirm that the certificate is trusted.

Restart the OpenAM container.

```bash
docker restart openam
```

### Realm Configuration

Log in to the administrator console at [http://localhost:8080/openam](http://localhost:8080/openam/). Use the login `amadmin` and password `passw0rd` respectively.

1. Open **Top Level Realm.** 
2. In the menu on the left, go to **Authentication → Settings**.
3. Go to the **User Profile** tab and set the **User Profile** setting to **Ignore**.
4. Click **Save Changes.**
    
    ![OpenAM Realm Settings](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/yandex-cloud-idp-saml/4-openam-realm-settings.png)
    

### Configuring the Service Provider

1. In the administrator console, select **Top Level Realm**
2. On the **Common Tasks** panel, click **Configure SAMLv2 Provider**
3. Next, click **Create Hosted Service Provider**
4. Enter any name for **Circle Of Trust**, for example, `openam-yandex`, and click **Configure.**

    ![OpenAM Create SAML Service Provider](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/yandex-cloud-idp-saml/5-openam-create-saml-sp.png)

5. OpenAM will prompt you to configure Remote Identity Provider. Click Yes.

    ![OpenAM Configure IDP Request](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/yandex-cloud-idp-saml/6-openam-configure-idp-request.png)

### Configuring the Identity Provider

1. Enter the metadata URL from the Yandex application settings and click Configure.

    ![OpenAM Configure Remote IDP](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/yandex-cloud-idp-saml/7-openam-remote-idp.png)

2. Reopen Top Level Realm
3. In the left pane, navigate to **Applications → SAML 2.0**
4. In the **Entity Providers** list, open **http://localhost:8080/openam**
5. On the **Assertion Content** tab, find the **Authentication Context** section
6. Set the **Default Authentication Context** setting to `Password`
7. In the **Authentication Context** table, select the values `Password` and `Password Protected Password` 
8. Click **Save**
9. Go to the **Assertion Processing** tab
10. In the **Attribute Mapper** section, set the **Attribute Map** setting to `emailaddress=mail`
11. In the **Auto Federation** section, select the Enabled checkbox and set Attribute to `emailaddress`.
12. Click **Save**.
13. Go to the **Services** tab.
14. In the **SP Service Attributes** section, in the **Assertion Consumer Service** table, select `HTTP-POST`.

    ![OpenAM Assertion Consumer Service](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/yandex-cloud-idp-saml/8-openam-assertion-consumer-service.png)

15. Click **Save**

## Verifying the solution

1. Exit the admin console, Yandex console, or open your browser in incognito mode.
2. Follow the authentication link: [http://localhost:8080/openam/spssoinit?metaAlias=/sp&idpEntityID=https%3A%2F%2Fauth.yandex.cloud%2Fsaml%2Fek0pduu9hrclvnque14v&RelayState=http%3A%2F%2Flocalhost%3A8080%2Fopenam](http://localhost:8080/openam/spssoinit?metaAlias=/sp&idpEntityID=https%3A%2F%2Fauth.yandex.cloud%2Fsaml%2Fek0pduu9hrclvnque14v&RelayState=http%3A%2F%2Flocalhost%3A8080%2Fopenam)
3. The Yandex Cloud authentication window will open.
4. In the email field, enter your user ID: `demo-saml@openam-saml.idp.yandexcloud.net`  and click →
5. In the password field, enter the corresponding password for your account
6. Click →

    ![Yandex Cloud Authentication](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/yandex-cloud-idp-saml/9-yandex-cloud-auth.png)

7. After successful authentication, you will be redirected to the OpenAM console with your Yandex Cloud credentials.

    ![OpenAM User Profile](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenAM/images/yandex-cloud-idp-saml/10-openam-user-profile.png)

## What's next

For production use, OpenAM must be deployed using a secure SSL connection, for example on a host and using an FQDN, such as https://openam.example.org/openam.

Next, you can use the OpenIG authorization gateway to set up single sign-on (SSO) for your applications.

For more details on configuring OpenAM and OpenIG, please refer to the documentation at [https://doc.openidentityplatform.org/openam](https://doc.openidentityplatform.org/openam) and [https://doc.openidentityplatform.org/openig](https://doc.openidentityplatform.org/openig).
