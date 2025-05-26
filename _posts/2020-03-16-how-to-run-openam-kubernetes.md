---
layout: home
title: "How To Run OpenAM in Kubernetes"
landing-title2: "How To Run OpenAM in Kubernetes"
description: "This article explains how to run OpenAM in Kubernetes"
keywords: ''
imageurl: 'openam-og.png'
share-buttons: true
products: 
- openam
---
<h1>How To Run OpenAM on Kubernetes</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-To-Run-OpenAM-in-Kubernetes](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-To-Run-OpenAM-in-Kubernetes)

## Preface

This article describes how to deploy [OpenAM](/openam) with embedded [OpenDJ](/opendj) on Kubernetes.
We will use OpenAM Docker image from Docker Hub Registry
[https://hub.docker.com/r/openidentityplatform/openam/](https://hub.docker.com/r/openidentityplatform/openam/)

In this tutorial, we will use Minikube as a local Kubernetes cluster.
`kubectl` should also be installed

Start Minikube with at least 4 cores, and 8 GB of memory to avoid insufficient resources errors.

```
minikube start --cpus=4 --memory=8g
```

## Create OpenAM Service

The following service will be used for DNS lookups between OpenAM Pods and clients.

Create `openam-service.yaml` file with the following contents:

**`openam-service.yaml`**:
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: openam
  name: openam
spec:
  clusterIP: None
  ports:
  - port: 8080
  selector:
    app: openam
```

Then create service in Kubernetes using `kubectl`:
```
kubectl apply -f openam-service.yaml
```
Make sure the service has been created:

```
kubectl get svc openam

NAME             TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
openam-service   ClusterIP   None         <none>        8080/TCP   7s
```

## Create OpenAM StatefulSet

Create `openam-statefulset.yaml` file with the following contents:

**`openam-statefulset.yaml`**:
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: openam
  labels:
    app: openam
spec:
  serviceName: openam
  replicas: 1
  selector:
    matchLabels:
      app: openam
  template:
    metadata:
      labels:
        app: openam
    spec:
      containers:
      - name: openam
        image: openidentityplatform/openam
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
          protocol: TCP
        - containerPort: 4444
          protocol: TCP
        - containerPort: 50389
          protocol: TCP
        livenessProbe:
          failureThreshold: 3
          httpGet:
            path: /openam/isAlive.jsp
            port: 8080
            scheme: HTTP
          initialDelaySeconds: 120
          periodSeconds: 10
          successThreshold: 1
          timeoutSeconds: 3
        readinessProbe:
          failureThreshold: 3
          httpGet:
            path: /openam/isAlive.jsp
            port: 8080
            scheme: HTTP
          initialDelaySeconds: 120
          periodSeconds: 10
          successThreshold: 1
          timeoutSeconds: 3
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        volumeMounts:
        - name: openam-data
          mountPath: /usr/openam/config
  volumeClaimTemplates:
  - metadata:
      name: openam-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 5Gi
```

Create OpenAM StatefulSet in Kubernetes
```
kubectl apply -f openam-statefulset.yaml
```

Check if StatefulSet is wokring
```
kubectl get statefulset openam

NAME     READY   AGE
openam   1/1     5m
```
Wait for pod is created

Get created Pods
```
kubectl get pods -l="app=openam"
NAME       READY   STATUS    RESTARTS   AGE
openam-0   1/1     Running   0          5m
```

## OpenAM Setup and Configuration

Lets check OpenAM pod status
```
$ kubectl exec -it openam-0 -- curl -v  http://localhost:8080/openam/isAlive.jsp
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> GET /openam/isAlive.jsp HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.52.1
> Accept: */*
>
< HTTP/1.1 302
< Location: http://localhost:8080/openam/config/options.htm
< Content-Length: 0
< Date: Mon, 16 Dec 2019 07:23:26 GMT
<
* Curl_http_done: called premature == 0
* Connection #0 to host localhost left intact
```

isAlive response redirects to the configuration page, that means OpenAM is not configured.
Let's  configure the instance.

In `/etc/hosts` file add the following entry:
```
127.0.0.1   openam-0.openam.default.svc.cluster.local
```
Then forward OpenAM port from the service
```
kubectl port-forward svc/openam 8080
```

Open [http://openam-0.openam.default.svc.cluster.local:8080/openam/](http://openam-0.openam.default.svc.cluster.local:8080/openam/) url in your browser.

You will be redirected to the configuration screen
![OpenAM Configuration Start](/assets/img/openam-quickstart/openam-conf-start.png)

Click __Create Default Configuration__.

![OpenAM License Agreement](/assets/img/openam-quickstart/openam-conf-license.png)

Accept License Agreement

![OpenAM Set Passwords](/assets/img/openam-quickstart/openam-conf-passwords.png)

Set password for default admin user and policy agent

Press __Create Configuration__.
After configuration successfully created, press __Proceed to Login__ or open [http://openam-0.openam.default.svc.cluster.local:8080/openam/console](http://openam-0.openam.default.svc.cluster.local:8080/openam) link in browser.

## Add External Access via Ingress

### Preparation

For example you need OpenAM address be [http://openam.acme.org/openam](http://openam.acme.org/openam)

Goto OpenAM console, __Deployment__ -> __Sites__ and create new site, for example,
http://openam.acme.org:80/openam

![OpenAM Add Site](/assets/img/openam-kubernetes/openam-add-site.png)

Then goto  OpenAM console, __Configure__ -> __Global Services__ -> __Platform__
and add Cookie domain as shown on the picture below

![OpenAM Add Cookie Domain](/assets/img/openam-kubernetes/openam-add-cookie-domain.png)

### Setup ingress

To make OpenAM accessible form external network we will use Ingress

If you use Minikube, enable ingress using the following command
```
minikube addons enable ingress
```
Create `openam-ingerss.yaml` file

**`openam-ingress.yaml`**:
```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: openam-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /openam
spec:
  rules:
  - http:
      paths:
        - path: /openam
          backend:
            serviceName: openam
            servicePort: 8080
```

And create Ingress for OpenAM service in Kubernetes

```
kubectl apply -f openam-ingress.yaml
```
### Test Access

Get your minikube IP
```
echo $(minikube ip)
192.168.64.15
```

And add the following entry to your `/etc/hosts` file
```
192.168.64.15   openam.acme.org
```

Then open [http://openam.acme.org/openam](http://openam.acme.org/openam) url in your browser, and you should see authentication screen
