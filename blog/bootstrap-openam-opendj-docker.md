---
layout: home
title: "TIP: Bootstrap OpenAM and OpenDJ Docker Containers"
landing-title2: "TIP: Bootstrap OpenAM and OpenDJ Docker Containers"
description: "How to configure and run OpenAM with OpenDJ in Docker containers"
keywords: ''
imageurl: 'openam-og.png'
share-buttons: true
---

# TIP: Bootstrap OpenAM and OpenDJ Docker Containers

Create `docker-compose.yml` file with OpenAM and OpenDJ services with the following contents:

```yaml
services:
  opendj:
    image: openidentityplatform/opendj:latest
    container_name: opendj
    environment:
      - BASE_DN=dc=example,dc=com
      - LDAP_PORT=1389
      - ROOT_PASSWORD=admin_password
      - REPLICATION_PORT=8989
    ports:
      - "1389:1389"
      - "1636:1636"
      - "4444:4444"
    volumes:
      - opendj-data:/opt/opendj/data
    restart: always

  openam:
    image: openidentityplatform/openam:latest
    container_name: openam
    depends_on:
      - opendj
    ports:
      - "8080:8080"
    volumes:
      - openam-data:/usr/openam/config
      - ./openam-config.properties:/usr/openam/openam-config.properties:ro
      - ./openam-init.sh:/usr/local/tomcat/bin/openam-init.sh:ro
    command: |
      bash /usr/local/tomcat/bin/openam-init.sh 
    restart: always

volumes:
  opendj-data:
  openam-data:

```

Create `openam-config.properties` file with the following contents:

```properties
# General Settings
SERVER_URL=http://localhost:8080
DEPLOYMENT_URI=/openam
BASE_DIR=/usr/openam/config
locale=en_US
PLATFORM_LOCALE=en_US
AM_ENC_KEY=
ADMIN_PWD=amadmin_password
AMLDAPUSERPASSWD=admin_password
COOKIE_DOMAIN=localhost
ACCEPT_LICENSES=true

# Data Store (OpenDJ)
DATA_STORE=dirServer
DIRECTORY_SSL=SIMPLE
DIRECTORY_SERVER=opendj
DIRECTORY_PORT=1389
DIRECTORY_ADMIN_PORT=4444
DIRECTORY_JMX_PORT=1636
ROOT_SUFFIX=dc=example,dc=com
DS_DIRMGRDN=cn=Directory Manager
DS_DIRMGRPASSWD=admin_password

# User Store (OpenDJ)
USERSTORE_TYPE=LDAPv3ForOpenDS
USERSTORE_SSL=SIMPLE
USERSTORE_HOST=opendj
USERSTORE_PORT=1389
USERSTORE_SUFFIX=dc=example,dc=com
USERSTORE_MGRDN=cn=Directory Manager
USERSTORE_PASSWD=admin_password
```

Create `openam-init.sh` file. This script waits for OpenDJ, then for OpenAM to start, and if OpenAM is not configured runs `openam-configurator-tool` with `openam-config.properties` file.

```bash
#!/bin/bash

until cat < /dev/null > /dev/tcp/opendj/1389; do 
    echo "Waiting for OpenDJ..."
    sleep 5
done

/usr/local/tomcat/bin/catalina.sh run &
SERVER_PID=$!

# Wait for OpenAM to respond to isAlive.jsp
until curl -f -s -o /dev/null http://localhost:8080/openam/isAlive.jsp; do
    echo "Waiting for OpenAM to fully initialize..."
    sleep 5
done

if [[ -f /usr/openam/config/boot.json ]]; then
    echo "OpenAM has already been configured."
else
    echo "Setting up OpenAM..."
    java -jar /usr/openam/ssoconfiguratortools/openam-configurator-tool*.jar --file /usr/openam/openam-config.properties
fi

wait $SERVER_PID
```

Run the `docker compose up` command. OpenAM and OpenDJ will be configured according to the `openam-config.properties` file

Test OpenAM with the following command:

```bash
curl \
 --request POST \
 --header "Content-Type: application/json" \
 --header "X-OpenAM-Username: amadmin" \
 --header "X-OpenAM-Password: amadmin_password" \

http://localhost:8080/openam/json/authenticate 
{
   "realm" : "/",
   "successUrl" : "/openam/console",
   "tokenId" : "AQIC5wM2LY4SfcxC_WOLjtSC7DdP5nIkhXU2DPuIWjHNlSE.*AAJTSQACMDEAAlNLABIxMjY1NTY0NTA4NDU3ODQyNTAAAlMxAAA.*"
}
```

Thanks to [@Lewiscowles1986](https://github.com/Lewiscowles1986). See [#817](https://github.com/OpenIdentityPlatform/OpenAM/discussions/817#discussioncomment-11440465)
