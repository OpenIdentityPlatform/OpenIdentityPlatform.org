---
layout: home
landing-title: "OpenAM Quick Start Guide"
landing-title2: "OpenAM Quick Start Guide"
description: "How to quick start with OpenAM and Apache HTTP Server"
keywords: 'OpenAM, Access Management, Docker, Apache HTTP Server,Open Identity Platform'
share-buttons: true
---

# OpenAM Quick Start Guide

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/Quick-Start-Guide](https://github.com/OpenIdentityPlatform/OpenAM/wiki/Quick-Start-Guide)

## Preparations
### Install Docker
Install Docker for your platform, if you did not do this before, from
[https://docs.docker.com/install/#supported-platforms](https://docs.docker.com/install/#supported-platforms).

### Prepare Hosts File

At first you need to add your to your _hosts_ file aliases
_openam.example.org_ - for OpenAm and _example.org_ for Apache Http Server.
Your hosts file should contain following line:

```bash
127.0.0.1    openam.example.org example.org
```

## OpenAM Configuration

### Running OpenAM Image

Create Docker network for OpenAM
```bash
docker network create openam-quickstart
```

Run OpenAM image
```bash
docker run -h openam.example.org -p 8080:8080 --network openam-quickstart --name openam openidentityplatform/openam
```

### Basic OpenAM Setup
Open your browser, goto url
[http://openam.example.org:8080/openam](http://openam.example.org:8080/openam).
![OpenAM Configuration Start](/assets/img/openam-quickstart/openam-conf-start.png)

Click __Create Default Configuration__.

![OpenAM License Agreement](/assets/img/openam-quickstart/openam-conf-license.png)

Accept License Agreement

![OpenAM Set Passwords](/assets/img/openam-quickstart/openam-conf-passwords.png)

Set password for default admin user and policy agent

Press __Create Configuration__.
After configuration successfully created, press __Proceed to Login__ or open
[http://openam.example.org:8080/openam/console](http://openam.example.org:8080/openam/console) link in browser.


### Policy Configuration

![OpenAM Console Realm](/assets/img/openam-quickstart/openam-console-realm.png)

In administration console select realm, then go to __Authorization -> Policy Sets__, select __Default Policy Set__ and add new Policy

Set Policy Name as you wish, Resource Type set URL, and add new Resource _\*://example.org:*/\*_ and click __Create__ to save new policy.

![OpenAM Console New Policy](/assets/img/openam-quickstart/openam-console-newpolicy.png)

On new policy settings select Actions tab and add two actions __GET__ and __POST__

![OpenAM Policy Actions](/assets/img/openam-quickstart/openam-console-policy-actions.png)

Then select Subjects tab and set type to __Authenticated Users__

![OpenAM Policy Subjects](/assets/img/openam-quickstart/openam-console-policy-subjects.png)

Click __Save Changes__ to save your policy

### Agent Configuration

Then, in left menu, go to  __Applications -> Web Agents__ and create new Agent

![OpenAM Web Agents](/assets/img/openam-quickstart/openam-console-webagents.png)

Set name as you wish, for example `apache_agent`, set agent password.

![OpenAM Create Web Agent](/assets/img/openam-quickstart/openam-console-webagents-create.png)

Server URL set http://openam.example.org:8080/openam

Agent URL set http://example.org:80

Click __Create__ to save new Web Agent

Click __General__ tab to return to main menu.

### Cookie Domain Configuration

Navigate to __Configure -> Global Services -> Platform -> Cookie Domain__.

Set cookie domain to _.example.org_, save your settings.


## Apache HTTP Server Configuration
Create Dockerfile in your  _/home/user/openam-quickstart/apache/_ folder with following content

```dockerfile
FROM httpd:2.4.34

ENV PA_PASSWORD password

RUN apt-get update || true

RUN apt-get install -y wget unzip

RUN wget --show-progress --progress=bar:force:noscroll --quiet --output-document=/tmp/Apache_v24_Linux_64bit_4.1.1.zip https://github.com/OpenIdentityPlatform/OpenAM-Web-Agents/releases/download/4.1.1/Apache_v24_Linux_64bit_4.1.1.zip

RUN unzip /tmp/Apache_v24_Linux_64bit_4.1.1.zip -d /usr/

RUN rm /tmp/Apache_v24_Linux_64bit_4.1.1.zip

RUN echo $PA_PASSWORD > /tmp/pwd.txt

RUN cat /tmp/pwd.txt

RUN cat /etc/issue

RUN /usr/web_agents/apache24_agent/bin/agentadmin --s "/usr/local/apache2/conf/httpd.conf" "http://openam.example.org:8080/openam" "http://example.org:80" "/" "apache_agent" "/tmp/pwd.txt" --acceptLicence --changeOwner
```

Set ENV PA_PASSWORD as you previously set for your WebAgent in OpenAm


Build Apache Docker image

```bash
docker build --network=host -t apache_agent -f /home/user/openam-quickstart/apache/Dockerfile /home/user/openam-quickstart/apache/
```

And then run image
```bash
docker run -it --name apache_agent -p 80:80 -h example.org --shm-size 2G --network openam-quickstart apache_agent
```

Open in browser link [http://example.org](http://example.org), and you will be redirected to OpenAM Authentication. After authentication you should see default Apache HTTP Server page
![Apache Default Page](/assets/img/openam-quickstart/apache-default.png)
