---
layout: home
title: "SAML Authentication in Yandex Cloud via OpenAM"
landing-title2: "SAML Authentication in Yandex Cloud via OpenAM"
description: "How to setup federated authenticaion in Yandex Clound via OpenAM using SAML"
keywords: 'SAML, Yandex, Yandex Cloud, SSO, OpenAM'
imageurl: 'openam-og.png'
share-buttons: true
---
<h1>SAML Authentication in Yandex Cloud via OpenAM</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/SAML-Authentication-in-Yandex-Cloud-via-OpenAM](https://github.com/OpenIdentityPlatform/OpenAM/wiki/SAML-Authentication-in-Yandex-Cloud-via-OpenAM)

# Getting started

To configure SAML authentication, there are the following prerequisites:

1. Docker platform installed and running Docker Engine
2. Locally running OpenAM instance. To launch OpenAM, run the following command.

```bash
docker run -h openam.example.org -p 8080:8080 --name openam openidentityplatform/openam
```

Detailed description of the installation and initial configuration of OpenAM at [this link](https://github.com/OpenIdentityPlatform/OpenAM/wiki/Quick-Start-Guide) 

# Setting up Federation in OpenAM

## Create and Configure Identity Provider in OpenAM

1. Open the administration console
2. Goto desired realm
3. Select **Configure SAMLv2 Provider** in the Common Tasks section

![OpenAM Realm Common Tasks](/assets/img/saml-yandex-cloud/realm-common-tasks.png)

4. Then **Create Hosted Identity Provider**

![Configure SAML v2 Provider](/assets/img/saml-yandex-cloud/configure-saml-provider.png)

5. Select a Signing Key (for demonstration purposes we will use **test**), enter the Circle of Trust name, and then map user's attributes to OpenAM. For demonstration users will be mapped by email.

![Configure SAML Identity Provider](/assets/img/saml-yandex-cloud/configure-saml-identity-provider.png)

6. Press the Configure button.

## Setting up the User Mapping in OpenAM

1. Open the administration console
2. Goto desired realm
3. From the menu on the left, select the Applications section and navigate to SAML 2.0
4. In the Entity Providers list select `http://openam.example.org:8080/openam`
5. On the Assertion Content tab, under **NameID Format** in the **NameID Value Map** list, add the element `urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified=mail`
6. Press the Save button

## Creating OpenAM Users

1. Open the administration console
2. Goto desired realm
3. Create a new user and fill the Email Address attribute

# Creating and Setting up a Federation in Yandex Cloud Organization

## Create a Federation

1. Gotot [Yandex Cloud Organization](https://org.cloud.yandex.ru/).
2. On the left panel choose [Federations](https://org.cloud.yandex.ru/federations) .
3. Click the **Create Federation** button.
4. Give your federation a name. It must be unique within the folder.
5. You can also add a description, if required.
6. In the Cookie lifetime field, specify the time before the browser asks the user to re-authenticate.
7. In the **IdP Issuer** field, enter a link to the OpenAM: `http://openam.example.org:8080/openam`
8. In the Link to the **IdP login page** field, enter a link: `http://openam.example.org:8080/openam/SSORedirect/metaAlias/idp`    
11. Click the **Create federation** button.

## Add Certificates

While authenticating, the Cloud Organization service should be able to verify the IdP server certificate. To enable this, add the certificate to the federation:

1. Open the OpenAM link `http://openam.example.org:8080/openam/saml2/jsp/exportmetadata.jsp` and copy the `ds:X509Certificate` tag value
2. Save the certificate in a text file with a `.cer` extension in the following format:

```bash
----BEGIN CERTIFICATE-----
<value ds:X509Certificate>
----END CERTIFICATE-----
```

1. In the left panel, select [Federations](https://org.cloud.yandex.ru/federations).
2. Click the the federation for which you want to add the certificate.
3. At the bottom of the page, click **Adding a certificate**.
4. Enter the certificate name and description.
5. Click **Choose a file** and specify the path to the certificate file.
6. Click the **Add** button.

# Creating a Remote Service Provider в OpenAM

## Creating a Metadata file for OpenAM

1. Create a `metadata.xml` file with the following contents where federation_ID - is a federation identifier in [Yandex Cloud Organization](https://org.cloud.yandex.ru), [Federations](https://org.cloud.yandex.ru/federations) section

```xml
<?xml version="1.0" encoding="UTF-8"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://console.cloud.yandex.ru/federations/<federation_ID>">
    <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
        <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://console.cloud.yandex.ru/federations/<federation_ID>" index="1"/>
    </md:SPSSODescriptor>
</md:EntityDescriptor>
```

## Creating a Service Provider in OpenAM

1. Open the administration console
2. Goto desired realm
3. Choose **Configure SAMLv2 Provider** in the  Common Tasks section
4. Then click **Configure Remote Service Provider**

![SAML Remote Service Provider](/assets/img/saml-yandex-cloud/saml-remote-service-provider.png)

1. Load the `metadata.xml` file created in the previous step as metadata.
2. Select the existing Circle Of Trust, created on the **Create and Configure Identity Provider in OpenAM** stage
3. Нажмите Configure

# Adding Users to Yandex Cloud Organization

If the **Automatically create users** option is enabled, a federation will only add users logging in to a cloud for the first time. You can only add a federated user again manually after deleting them from a federation.

1. [Login to account](https://passport.yandex.ru/) that belongs to an organization administrator or owner.
2. Goto [Yandex Cloud Organization](https://org.cloud.yandex.ru/) service.
3. In the left panel, select [Users](https://org.cloud.yandex.ru/users).
4. In the top-right corner, click  **Add federated users**.
5. Select the identity federation to add users from.
6. Enter emails of the OpenAM users
7. Click the **Add** button. This will give the OpenAM users access to the organization.

# Testing Authentication

When you finish setting up SSO, test that everything works properly:

1. Open your browser in guest or private browsing mode.
2. Follow the URL to log in to the management console:
    
    `https://console.cloud.yandex.ru/federations/<federation_ID>`
    
3. Enter OpenAM user credentials and click Login.

On successful authentication, the IdP server will redirect you to URL `https://console.cloud.yandex.ru/federations/<federation_ID>`, which you have set in the `metadata.xml` file for the Service Provider in the OpenAM settings and then to the [management console](https://console.cloud.yandex.ru/) home page. In the top-right corner, you will be able to see you are logged in to the console as a federated user.
