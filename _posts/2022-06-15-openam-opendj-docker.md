---
layout: home
title: "How to Start OpenAM and OpenDJ in Separate Docker Contaners"
landing-title2: "How to Start OpenAM and OpenDJ in Separate Docker Contanerss"
description: "In this article we will prepare and create OpenAM and OpenDJ instances in separate Docker containers"
keywords: 'openam, opendj, docker, docker-compose'
share-buttons: true
products: 
- openam
- opendj
---

# How to Start OpenAM and OpenDJ in Separate Docker Contaners

[Original article](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Start-OpenAM-and-OpenDJ-in-Separate-Docker-Contaners)

## Requeirements

To reproduce steps in the following article, Docker and Docker Compose should be installed.

The sample configuration used in the following article could be found [here](https://github.com/maximthomas/openidentityplatform-docker)

## OpenAM Perparation

Create `docker-compose.yml` file and add OpenAM service:

```yml
version: '3.9'

services:
  openam:
    image: openidentityplatform/openam:latest
    ports:
      - "8080:8080"
    hostname: openam.example.com
    volumes:
      - ./persistence/openam:/usr/openam/config
```
Add OpenAM FQDN to your `hosts` file on your machine, for example

```
127.0.0.1   auth.example.com
```


In the `persistence/openam` folder OpenAM will store its configuration data

# OpenDJ Preparation

Add OpenDJ service to `docker-compose.yml` file:

```yml
  opendj:
    image: openidentityplatform/opendj:latest
    hostname: opendj.example.com
    ports:
      - "1389:1389"
      - "1636:1636"
      - "4444:4444"
    volumes:
      - ./opendj/bootstrap/data/:/opt/opendj/bootstrap/data #initial data
      - ./opendj/bootstrap/schema/:/opt/opendj/bootstrap/schema #schema
      - ./persistence/opendj:/opt/opendj/data #opendj data
    environment:
      - BASE_DN=dc=openam,dc=openidentityplatform,dc=org #should be yours base DN
```

`opendj/boststrap` directory should exist on the host machine and contain two subfolders: `data` - for initial data и `schema` - schema files.

The files could be found [here](https://github.com/maximthomas/openidentityplatform-docker/tree/master/opendj/bootstrap)

If base DN id different from `dc=openam,dc=openidentityplatform,dc=org` it should be changed in `opendj/boststrap/data/samlple.ldif` file as well

## Start and Configuration

### Start Services

Start OpenAM and OpenDJ with the following command:

```bash
docker-compose up
```

You shoudl see the following lines in the logs:
```
openidentityplatform-docker-openam-1  | 15-Jun-2022 10:09:46.063 INFO [main] org.apache.coyote.AbstractProtocol.start Starting ProtocolHandler ["http-nio-8080"]
openidentityplatform-docker-openam-1  | 15-Jun-2022 10:09:46.133 INFO [main] org.apache.catalina.startup.Catalina.start Server startup in [36437] milliseconds
openidentityplatform-docker-opendj-1  | OpenDJ is started
```

### OpenAM Configuration

After OpenAM and OpenDJ are started, open OpenAM URL in the browser, for example [http://auth.example.com:8080/openam](http://auth.example.com:8080/openam)

OpenAM configuration window should appear:
![OpenAM Configuration Start](/assets/img/openam-opendj-docker/openam-conf-start.png)

Select Custom Configuration and press Create New Configuration. Read and accept the license agreement.

Enter and confirm amAdmin password, then press the Next button.

![OpenAM Configuration 1 General](/assets/img/openam-opendj-docker/openam-conf1-general.png)

Leave server settings unchanged and press the Next button.

![OpenAM Configuration 2 Server Settings](/assets/img/openam-opendj-docker/openam-conf2-server-settings.png)

On the Configuration Data Store Settings step set the following settings:

* **Configuration Data Store** radiobutton to **OpenDJ**, 
* Set **Host Name** to **opendj**, as OpenDJ Docker internal hostname
* Set **Port** to 1389 as specified for OpenDJ Docker container
* Set OpenDJ password as specified for OpenDJ Docker container as well (`password` by default).

If you changed base DN for OpenDJ, set the required Root Suffix as well.

Then press the Next button.

![OpenAM Configuration 3 Data Store Settings](/assets/img/openam-opendj-docker/openam-conf3-datastore.png)

On the User datastore settings set OpenDJ password as it has been set in the previous step and press the Next button.

![OpenAM Configuration 5 User Data Store Settings](/assets/img/openam-opendj-docker/openam-conf4-userdatastore.png)

If this instance is behind a load balancer, set the site configuration settings. If it's not, just press the Next button.

On the Step 6: Default Policy Agent User, enter and confirm default policy agent password and press the Next button.

Review configuration summary and press the Create Configuration button.

![OpenAM Configuration Summary](/assets/img/openam-opendj-docker/openam-conf-summary.png)

If everything is ok, proceed to login page.

If you have any additional questions, [feel free to ask us](https://github.com/OpenIdentityPlatform/OpenAM/discussions)!