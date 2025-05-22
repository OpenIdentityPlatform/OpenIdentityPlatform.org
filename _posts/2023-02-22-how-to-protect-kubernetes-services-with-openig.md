---
layout: home
title: "How To Protect Kubernetes Services With OpenIG"
landing-title2: "How To Protect Kubernetes Services With OpenIG"
description: "This article explains how to protect services deployed on Kubernetes with OpenIG"
keywords: ''
imageurl: 'openig-og.png'
share-buttons: true
---
<h1>How To Protect Kubernetes Services With OpenIG</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-To-Protect-Kubernetes-Services-With-OpenIG](https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-To-Protect-Kubernetes-Services-With-OpenIG)

- [Preface](#preface)
- [Deploy Sample Service For Test](#deploy-sample-service-for-test)
- [Deploy OpenIG](#deploy-openig)
- [Check if OpenIG works](#check-if-openig-works)
- [Expose OpenIG via Ingress and Test](#expose-openig-via-ingress-and-test)


## Preface

If you have services, deployed on Kubernetes, some of them are required to be exposed to the Internet for public usage. But in that case, these services could be attacked. And of course, it is very expensive and hard to implement a protection mechanism for each service. Instead, it is a good practice to use an API gateway to protect all exposed services.

API Gateway is responsible for authentication and authorization, throttling, validate request and response bodies and headers and so on.

In the following article, we'll deploy simple REST service on Kubernetes and then protect it and expose using [OpenIG](/openig)

We will use Minikube as a local Kubernetes cluster.
`kubectl` should also be installed

Start Minikube with at least 4 cores, and 8 GB of memory to avoid insufficient resources errors.

```
minikube start --cpus=4 --memory=8g
```

## Deploy Sample Service For Test

I've created the service and uploaded it on the [docker hub](https://hub.docker.com/repository/docker/maximthomas/sample-service).
Sources for this service are on the [github](https://github.com/maximthomas/openig-protect-ws/tree/master/sample-service)

Let's create Service and Deployment yaml files for the services

**`sample-service-service.yaml`**:
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: sample-service
  name: sample-service
spec:
  clusterIP: None
  ports:
  - port: 8080
  selector:
    app: sample-service
```

**`sample-service-deployment.yaml`**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-service-deployment
spec:
  selector:
    matchLabels:
      app: sample-service
  replicas: 1
  template:
    metadata:
      labels:
        app: sample-service
    spec:
      containers:
      - name: sample-service
        image: maximthomas/sample-service
        ports:
        - containerPort: 8080
```

Create Deployment for `sample-service` in the Kubernetes cluster
```
$ kubectl apply -f sample-service-deployment.yaml
deployment.apps/sample-service-deployment created
```
Make sure the Deployment has been created
```
$ kubectl get pod | grep sample-service-deployment
sample-service-deployment-776f49b48c-rr94q   1/1     Running   0          3m14s
```
Create Service for `sample-service` in the Kubernetes cluster

```
$ kubectl apply -f openig/sample-service/sample-service-service.yaml
service/sample-service created
```
Make sure the Service has been created
```
$ kubectl get svc sample-service
NAME             TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
sample-service   ClusterIP   None         <none>        8080/TCP   30s
```

Make sure if it works. We'll forward `sample-service` port to the local machine and try to call `sample-service` using `curl` command.
```
$ kubectl port-forward service/sample-service 8080
```

```
$ curl -v http://localhost:8080
* Rebuilt URL to: http://localhost:8080/
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 8080 (#0)
> GET / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 200
< Content-Type: application/json;charset=UTF-8
< Transfer-Encoding: chunked
< Date: Thu, 06 Feb 2020 08:42:58 GMT
<
* Connection #0 to host localhost left intact
{"hello":"world"}
```

```
$ curl -v http://localhost:8080/secure
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 8080 (#0)
> GET /secure HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 200
< Content-Type: application/json;charset=UTF-8
< Transfer-Encoding: chunked
< Date: Thu, 06 Feb 2020 08:43:31 GMT
<
* Connection #0 to host localhost left intact
{"hello":null}
```

## Deploy OpenIG

### Create OpenIG Service

The following service will be used for DNS lookups between OpenAM Pods and clients.

Create `openig-service.yaml` file with the following contents:

**`openig-service.yaml`**:
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: openig
  name: openig
spec:
  clusterIP: None
  ports:
  - port: 8080
  selector:
    app: openig
```

Then create service in Kubernetes using `kubectl`:
```
kubectl apply -f openig-service.yaml
```
Make sure the service has been created:

```
kubectl get svc openig

NAME             TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
openig-service   ClusterIP   None         <none>        8080/TCP   7s
```

### Create OpenIG ConfigMaps

#### Create Main ConfigMap

Another step is to create OpenIG configuration files
Create `config` folder and create config files there `admin.json` and `config.json` with the following contents:

**`admin.json`**:
```json
{
  "prefix" : "openig",
  "mode": "PRODUCTION"
}
```

**`config.json`**:
```json
{
  "heap": [
  ],
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [

      ],
      "handler": {
        "type": "Router",
        "name": "_router",
        "capture": "all"
      }
    }
  }
}
```

Create ConfigMap for these files:

```
kubectl create configmap openig-config --from-file=./config/
```

Then make sure ConfigMap has been created
```
kubectl describe configmaps openig-config
```

```
Name:         openig-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
admin.json:
----
{
  "prefix" : "openig",
  "mode": "PRODUCTION"
}
config.json:
----
{
  "heap": [
  ],
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [

      ],
      "handler": {
        "type": "Router",
        "name": "_router",
        "capture": "all"
      }
    }
  }
}
Events:  <none>
```

#### Create ConfigMaps for OpenIG Routes

Create `routes` directory in the `config` folder and add two route files: `10-api.json` - main route and `99-default.json` - default route.

**`10-api.json`**:
```json
{
   "name":"${matches(request.uri.path, '^/')}",
   "condition":"${matches(request.uri.path, '^/')}",
   "monitor":true,
   "timer":true,
   "handler":{
      "type":"Chain",
      "config":{
         "filters":[
            {
               "type":"SwitchFilter",
               "config":{
                  "onRequest":[
                     {
                        "condition":"${request.method != 'POST' and request.method != 'GET'}",
                        "handler":{
                           "type":"StaticResponseHandler",
                           "config":{
                              "status":405,
                              "reason":"Method not allowed",
                              "headers":{
                                 "Content-Type":[
                                    "application/json"
                                 ]
                              },
                              "entity":"{ \"error\": \"Method not allowed\"}"
                           }
                        }
                     },
                     {
                        "condition":"${request.method == 'POST' and request.headers['Content-Type'][0].split(';')[0] != 'application/json'}",
                        "handler":{
                           "type":"StaticResponseHandler",
                           "config":{
                              "status":415,
                              "reason":"Unsupported Media Type",
                              "headers":{
                                 "Content-Type":[
                                    "application/json"
                                 ]
                              },
                              "entity":"{ \"error\": \"Unsupported Media Type\"}"
                           }
                        }
                     }
                  ],
                  "onResponse":[
                     {
                        "condition":"${response.headers['Content-Type'][0].split(';')[0] != request.headers['Accept'][0].split(';')[0] }",
                        "handler":{
                           "type":"StaticResponseHandler",
                           "config":{
                              "status":406,
                              "reason":"Not Acceptable",
                              "headers":{
                                 "Content-Type":[
                                    "application/json"
                                 ]
                              },
                              "entity":"{ \"error\": \"Not Acceptable\"}"
                           }
                        }
                     }
                  ]
               }
            },
            {
               "type":"HeaderFilter",
               "comment":"Add security headers to response",
               "config":{
                  "messageType":"response",
                  "add":{
                     "X-Frame-Options":[
                        "deny"
                     ],
                     "X-Content-Type-Options":[
                        "nosniff"
                     ]
                  }
               }
            }
         ],
         "handler": "EndpointHandler"
      }
   },
   "heap":[
      {
         "name":"EndpointHandler",
         "type":"DispatchHandler",
         "config":{
            "bindings":[
               {
                  "handler":"ClientHandler",
                  "capture":"all",
                  "baseURI":"http://sample-service:8080/"
               }
            ]
         }
      }
   ]
}
```

**`99-default.json`**:
```json
{
  "name": "99-default",
  "handler": {
    "type": "StaticResponseHandler",
    "config": {
      "status": 404,
      "reason": "Not Found",
      "headers": {
        "Content-Type": [ "application/json" ]
      },
      "entity": "{ \"error\": \"Something went wrong, please contact your system administrator.\"}"
    }
  },
  "audit": "/404"
}
```
Create routes ConfigMap
```
kubectl create configmap openig-config-routes --from-file=./config/routes
```

Make sure ConfigMap has been created:
```
kubectl describe configmaps openig-config-routes
```

### Create OpenIG Deployment

Create OpenIG deployment file

**`openig-deployment.yaml`**:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: openig-deployment
spec:
  selector:
    matchLabels:
      app: openig
  replicas: 1
  template:
    metadata:
      labels:
        app: openig
    spec:
      containers:
      - name: openig
        image: openidentityplatform/openig
        ports:
        - containerPort: 8080
        env:
        - name: CATALINA_OPTS
          value: -Dopenig.base=/usr/local/openig-config
        volumeMounts:
        - mountPath: /usr/local/openig-config/config
          readOnly: true
          name: config-volume
        - mountPath: /usr/local/openig-config/config/routes
          readOnly: true
          name: config-routes-volume
      volumes:
      - name: config-volume
        configMap:
          name: openig-config
      - name: config-routes-volume
        configMap:
          name: openig-config-routes

```

```
kubectl apply -f openig-deployment.yaml
```

## Check if OpenIG works
Forward OpenIG service port to the local machine
```
kubectl port-forward service/openig 8080
```

```
$ curl -v http://localhost:8080/secure
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 8080 (#0)
> GET /secure HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 406 Not Acceptable
< Server: Apache-Coyote/1.1
< Content-Type: application/json
< Content-Length: 28
< Date: Thu, 06 Feb 2020 09:09:09 GMT
<
* Connection #0 to host localhost left intact
{ "error": "Not Acceptable"}

$ curl -v -H 'Accept: application/json' http://localhost:8080/
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 8080 (#0)
> GET / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.54.0
> Accept: application/json
>
< HTTP/1.1 200 OK
< Server: Apache-Coyote/1.1
< Date: Thu, 06 Feb 2020 09:11:26 GMT
< X-Content-Type-Options: nosniff
< X-Frame-Options: deny
< Content-Type: application/json;charset=UTF-8
< Transfer-Encoding: chunked
<
* Connection #0 to host localhost left intact
{"hello":"world"}
```
As we can see, OpenIG denies requests without appropriate `Accept` header and returns `406` status.


## Expose OpenIG via Ingress and Test

Create `openig-ingress.yaml` file:

**`openig-ingress.yaml`**:

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: openig-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
        - path: /
          backend:
            serviceName: openig
            servicePort: 8080
```

Create Ingress for OpenIG
```
kubectl apply -f openig-ingress.yaml
```

### Test Access

Get your minikube IP
```
echo $(minikube ip)
192.168.64.16
```

Make request to exposed OpenIG:
```
$ curl -v -H 'Accept: application/json' http://192.168.64.16/
*   Trying 192.168.64.16...
* TCP_NODELAY set
* Connected to 192.168.64.16 (192.168.64.16) port 80 (#0)
> GET / HTTP/1.1
> Host: 192.168.64.16
> User-Agent: curl/7.54.0
> Accept: application/json
>
< HTTP/1.1 200 OK
< Server: openresty/1.15.8.2
< Date: Thu, 06 Feb 2020 09:13:00 GMT
< Content-Type: application/json;charset=UTF-8
< Transfer-Encoding: chunked
< Connection: keep-alive
< Vary: Accept-Encoding
< X-Content-Type-Options: nosniff
< X-Frame-Options: deny
<
* Connection #0 to host 192.168.64.16 left intact
{"hello":"world"}
```

```
$ curl -v http://192.168.64.16/
*   Trying 192.168.64.16...
* TCP_NODELAY set
* Connected to 192.168.64.16 (192.168.64.16) port 80 (#0)
> GET / HTTP/1.1
> Host: 192.168.64.16
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 406 Not Acceptable
< Server: openresty/1.15.8.2
< Date: Thu, 06 Feb 2020 09:13:12 GMT
< Content-Type: application/json
< Content-Length: 28
< Connection: keep-alive
<
* Connection #0 to host 192.168.64.16 left intact
{ "error": "Not Acceptable"}
```
