---
layout: home
landing-title: "OpenDJ: Supercharged LDAP Data Storage and Performance"
landing-title2: "OpenDJ: Supercharged LDAP Data Storage and Performance"
description: OpenDJ now supports Apache Cassandra and ScyllaDB as a backend with all performance, resillience and scalability benefits
keywords: 'OpenDJ, Directory Service, Directory Services, LDAP, Open Identity Platform, Apache Cassandra, Scylla'
imageurl: 'opendj-og.png'
share-buttons: true
products: 
- opendj
---

# OpenDJ: Supercharged LDAP Data Storage and Performance

# Introduction

LDAP-compliant directory services are a widely adopted industry standard and a convenient storage solution for identity data. They are commonly utilized in various applications, such as Enterprise Identity Management, IoT Device Management, and Machine and Equipment Management in Industry 4.0. However, a significant drawback becomes evident when the number of records exceeds 5,000,000, leading to noticeable performance degradation in LDAP-compliant services.

A well-known challenge in LDAP is the absence of data sharding in both reading and writing operations between nodes.

With the release of OpenDJ 4.6.1, an innovative backend integration has been introduced, enabling the utilization of Apache Cassandra or ScyllaDB. Leveraging this column-wide database backend provides several key advantages:

1. **Enormous Data Storage Capacity:** OpenDJ can now store a vast amount of data.
2. **Lightning-Fast Performance:** Users can achieve exceptional performance.
3. **Robustness in Node Failures:** Failure of nodes does not result denial of service according to the replication level.
4. **Replication and Scalability Benefits:**
    1. **Efficient Write Operation Synchronization:** Write operations are processed on nodes with only the required replication level.
    2. **Balanced Read Load:** The read load from a single node is not limited by the performance of a single node; it is distributed according to the replication level.

# Setting Up an OpenDJ Instance

Let's delve into configuring OpenDJ with Apache Cassandra. Ensure that you have Docker installed on your machine.

1. Create a Docker network to make OpenDJ and Apache Cassandra communicate between each other.

```bash
docker network create -d bridge opendj-cassandra
```

1. **Run Apache Cassandra in a Docker image** and map the Apache Cassandra port for accessibility from the host:

```bash
docker run --rm -it -p 9042:9042 --network=opendj-cassandra --name cassandra cassandra
```

For demonstration purposes, there will be no volume mounted, and the Apache Cassandra container will be immediately removed after stopping.

Set Apache Cassandra connection setting in OpenDJ environment variable `OPENDJ_JAVA_ARGS`

1. **Set Apache Cassandra connection settings** in the OpenDJ environment variable **`OPENDJ_JAVA_ARGS`**:

```bash
export OPENDJ_JAVA_ARGS="-server -Ddatastax-java-driver.basic.contact-points.0=cassandra:9042 -Ddatastax-java-driver.basic.load-balancing-policy.local-datacenter=datacenter1"
```

1. Set backend type Cassandra for new OpenDJ instance and create sample data via the following environment variable:

```bash
export OPENDJ_ADD_BASE_ENTRY="--backendType cas --sampleData 5000"
```

Note the value of the **`--backendType`** parameter: it is set to **`cas`**, indicating that OpenDJ should use Apache Cassandra or ScyllaDB as its data storage.

This command sets up the OpenDJ instance and creates 5000 sample data entries

1. Run OpenDJ Docker image

```bash
docker run -p 1389:1389 -p 1636:1636 -p 4444:4444 --network=opendj-cassandra \
    --env OPENDJ_JAVA_ARGS=$OPENDJ_JAVA_ARGS --env ADD_BASE_ENTRY=$OPENDJ_ADD_BASE_ENTRY \
    --name opendj openidentityplatform/opendj:latest
```

If everything works fine you should see the following text in the terminal

```bash
Server Run Status:        Started
OpenDJ is started
```

# **Testing**

Connect to the OpenDJ instance using client software, for example, **[Apache Directory Studio](https://directory.apache.org/studio/)**.

1. **In the studio, create a new connection** and configure the connection settings used during setup:
    - **User name:** **`cn=Directory Manager`**
    - **Password:** **`password`**
    - **Host:** **`localhost`**
    - **Port:** **`1389`**
2. **Once connected to OpenDJ**, you can view all the newly created records.