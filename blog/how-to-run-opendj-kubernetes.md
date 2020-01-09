---
layout: home
landing-title: "How To Run OpenDJ in Kubernetes"
landing-title2: "How To Run OpenDJ in Kubernetes"
description: "This article explains how to run OpenDJ in Kubernetes"
keywords: ''
imageurl: 'opendj-og.png'
share-buttons: true
---
<h1>How To Run OpenDJ on Kubernetes</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenDJ/wiki/How-To-Run-OpenDJ-in-Kubernetes](https://github.com/OpenIdentityPlatform/OpenDJ/wiki/How-To-Run-OpenDJ-in-Kubernetes)

## Preface

This article describes how to deploy [OpenDJ](/opendj) on Kubernetes.
We will use OpenDJ Docker image from Docker Hub Registry
[https://hub.docker.com/r/openidentityplatform/opendj/](https://hub.docker.com/r/openidentityplatform/opendj/)

In this tutorial, we will use Minikube as a local Kubernetes cluster.
`kubectl` should also be installed

Start Minikube with at least 4 cores, and 8 GB of memory to avoid insufficient resources errors.

```
minikube start --cpus=4 --memory=8g
```

## Create OpenDJ Service

The following service will be used for DNS lookups between OpenAM Pods and clients.

Create `opendj-service.yaml` file with the following contents:

**`opendj-service.yaml`**:
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: opendj
  name: opendj
spec:
  clusterIP: None
  ports:
  - port: 1389
    name: ldap
  - port: 1636
    name: ldaps
  - port: 4444
    name: admin
  selector:
    app: opendj
```

Then create service in Kubernetes using `kubectl`:
```
kubectl apply -f opendj-service.yaml
```
Make sure the service has been created:

```
kubectl get svc opendj

NAME     TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                      AGE
opendj   ClusterIP   None         <none>        1389/TCP,1636/TCP,4444/TCP   39s
```

## Create OpenAM StatefulSet

Create `opendj-statefulset.yaml` file with the following contents:

**`opendj-statefulset.yaml`**:
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: opendj
  labels:
    app: opendj
spec:
  serviceName: opendj
  replicas: 1
  selector:
    matchLabels:
      app: opendj
  template:
    metadata:
      labels:
        app: opendj
    spec:
      containers:
      - name: opendj
        image: openidentityplatform/opendj
        imagePullPolicy: Always
        ports:
        - containerPort: 1389
          protocol: TCP
        - containerPort: 1636
          protocol: TCP
        - containerPort: 4444
          protocol: TCP
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        volumeMounts:
        - name: opendj-data
          mountPath: /opt/opendj/data
  volumeClaimTemplates:
  - metadata:
      name: opendj-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
```

Create OpenDJ StatefulSet in Kubernetes
```
kubectl apply -f opendj-statefulset.yaml
```

Check if StatefulSet is wokring
```
kubectl get statefulset opendj

NAME     READY   AGE
opendj   1/1     2m
```
Wait for pod is created

Get created Pods
```
kubectl get pods -l="app=opendj"
NAME       READY   STATUS    RESTARTS   AGE
opendj-0   1/1     Running   0          2m42s
```

## Check OpenDJ status

Lets check OpenDJ pod status
```
$ kubectl exec -it opendj-0 -- /opt/opendj/bin/status  --bindDN "cn=Directory Manager" --bindPassword password

          --- Server Status ---
Server Run Status:        Started
Open Connections:         1

          --- Server Details ---
Host Name:                opendj-0.opendj.default.svc.cluster.local
Administrative Users:     cn=Directory Manager
Installation Path:        /opt/opendj
Instance Path:            /opt/opendj/data
Version:                  OpenDJ Server 4.4.3
Java Version:             1.8.0_111
Administration Connector: Port 4444 (LDAPS)

          --- Connection Handlers ---
Address:Port : Protocol               : State
-------------:------------------------:---------
--           : LDIF                   : Disabled
0.0.0.0:161  : SNMP                   : Disabled
0.0.0.0:1389 : LDAP (allows StartTLS) : Enabled
0.0.0.0:1636 : LDAPS                  : Enabled
0.0.0.0:1689 : JMX                    : Disabled
0.0.0.0:8080 : HTTP                   : Disabled

          --- Data Sources ---
Base DN:     dc=example,dc=com
Backend ID:  userRoot
Entries:     1
Replication:
```
