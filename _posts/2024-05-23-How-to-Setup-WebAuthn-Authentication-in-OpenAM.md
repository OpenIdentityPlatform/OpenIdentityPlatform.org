---
layout: home
landing-title: "How to Setup WebAuthn Authentication in OpenAM"
landing-title2: "How to Setup WebAuthn Authentication and Registration in OpenAM"
description: "How to Setup WebAuthn Authentication in OpenAM"
keywords: 'WebAuthn, passkeys, Authentication, Registration, Login, OpenAM, Access Management, Authentication, Authorization, Single Sign On,  Open Identity Platform'
share-buttons: true
---

# How to Setup WebAuthn Authentication in OpenAM

[Original article](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Setup-WebAuthn-Authentication-in-OpenAM)

## Introduction

[WebAuthn](https://en.wikipedia.org/wiki/WebAuthn) is a
[W3C](https://www.w3.org/) and [FIDO](https://fidoalliance.org/) standard
that describes Web public key authentication.
For authentication, a client can use Hardware USB, Bluetooth, or NFC tokens,
or mobile or laptop biometric authentication, such as fingerprint or FaceID.

In short, WebAuthn uses mutual authentication, utilizing an asymmetric encryption algorithm and exchange of credential messages encrypted  with public keys (passkeys). Therefore, WebAuthn is resistant to phishing.

More details about the standard can be found at [https://www.w3.org/TR/webauthn-3/](https://www.w3.org/TR/webauthn-3/)

### Browsers Support

WebAuthn is supported by most modern browsers, including Google Chrome, Mozilla Firefox (with partial support), Apple Safari, and Microsoft Edge, including their mobile versions. For up-to-date information about browsers and devices supporting WebAuthn, visit  [https://caniuse.com/?search=webauthn](https://caniuse.com/?search=webauthn).

### Devices Support

Passkeys created on iPhone, iPad, or Mac can be used on the same device or another iPhone, iPad, or Mac with the same Apple ID. The passkeys are synchronized automatically.

Passkeys created on Android devices can be used on an Android device with the same Google account. The passkeys are synchronized automatically

More details at the link [https://passkeys.dev/device-support/](https://passkeys.dev/device-support/)


## OpenAM Setup
Since WebAuthn in a browser only works over HTTPS or on the localhost domain, for demonstration purposes we will deploy OpenAM in a Docker container on localhost. 

Create a network in Docker for OpenAM

```bash
docker network create openam
```

Then run the OpenAM Docker container with the following command

```bash
docker run -p 8080:8080 --network openam --name openam openidentityplatform/openam
```

Once the OpenAM server is running, perform the initial configuration by running the following command and wait for the configuration to complete.

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
After successful configuration, you can proceed to further configuration. Let's configure the WebAuthn registration and authentication chains.


## WebAuthn Registration Setup

### Authentication Module Setup

Open the OpenAM administration console at [http://localhost:8080/openam/XUI/#login/](http://localhost:8080/openam/XUI/#login/)
In the login field enter the `amadmin` value, in the password field enter the value from the `ADMIN_PWD` parameter of the setup command, in this case, `passw0rd`.
Select the root realm and then goto Authentication → Modules in the left menu. Create a new authentication module `WebAuthn Registration`

![OpenAM Create WebAuthn Registration Authentication Module](/assets/img/webauthn/0-webauthn-registration-new-module.png)

The default module settings can be left unchanged.

![OpenAM  WebAuthn Registration Authentication Module Settings](/assets/img/webauthn/1-webauthn-registration-module.png)

### Authentication Chain Setup

Go to the admin console, select the root realm and select Authentication → Chains from the menu. Create a `webauthn-registration` authentication chain with the created `webauthn-registration` module.
![OpenAM  WebAuthn Registration Authentication Chain](/assets/img/webauthn/2-webauthn-registration-chain.png)

## WebAuthn Authentication Setup

### Authentication Module Setup

Open the OpenAM administration console. Select the root realm and then goto Authentication → Modules in the left menu. Create a new authentication module `WebAuthn Authentication`

![OpenAM Create WebAuthn Authentication Module](/assets/img/webauthn/3-webauthn-authentication-new-module.png)

The default module settings can be left unchanged.

![OpenAM WebAuthn Authentication Module Settings](/assets/img/webauthn/4-webauthn-authentication-module.png)


### Authentication Chain Setup
Go to the admin console, select the root realm and select Authentication → Chains from the menu. Create a `webauthn-authentication` authentication chain with the created `webauthn-authentication` module.

![OpenAM  WebAuthn Authentication Chain](/assets/img/webauthn/5-webauthn-authentication-chain.png)

## Test the Solution

Log out of the OpenAM admin console or open a browser in Incognito mode and log in at http://localhost:8080/openam/XUI/#login with the user credentials `demo`. In the login field enter `demo` in the password field enter `changeit`.

### Registration

For demonstration purposes, we will use the WebAuthn emulator built into the browser. How to enable it is described at [https://developer.chrome.com/docs/devtools/webauthn](https://developer.chrome.com/docs/devtools/webauthn).

Add a virtual authenticator with Supports resident keys and Supports user verification settings enabled.

![WebAuthn New Chrome Authenticator](/assets/img/webauthn/6-webauthn-chrome-new-authenticator.png)

Open the registration authentication chain at [http://localhost:8080/openam/XUI/#login&service=webauthn-registration](http://localhost:8080/openam/XUI/#login&service=webauthn-registration) and click the `Register` button. 

![WebAuthn New Chrome Authenticator](/assets/img/webauthn/7-webauthn-registration.png)

You will be immediately redirected back to the console with the `demo` account, and in the developer tools for the authenticator you will see the registered credentials for the demo user.

![WebAuthn Chrome Authenticator Credentials](/assets/img/webauthn/8-webauthn-authenticator-credentials.png)

### Authentication
In the Console under the user `demo` click on the user icon and select Logout
![OpenAM Logout](/assets/img/webauthn/9-openam-demo-logout.png)

Go to [http://localhost:8080/openam/XUI/#login&service=webauthn-authentication](http://localhost:8080/openam/XUI/#login&service=webauthn-authentication) and click the `Log In` button. An account selection window will pop up.

![Authenticator Account Selection](/assets/img/webauthn/10-account-selection.png)

Select the `demo` account and click Continue. You will be authenticated with the `demo` account .