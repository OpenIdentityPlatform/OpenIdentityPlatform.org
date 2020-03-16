---
layout: home
title: "How To Run OpenIG in Kubernetes"
landing-title2: "How To Run OpenIG in Kubernetes"
description: "This article explains how to run OpenIG in Kubernetes"
keywords: ''
imageurl: 'openig-og.png'
share-buttons: true
---
<h1>How To Run OpenIG on Kubernetes</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-To-Run-OpenIG-in-Kubernetes](https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-To-Run-OpenIG-in-Kubernetes)

## Preface

This article describes how to deploy [OpenIG](/openig) on Kubernetes.
We will use OpenIG Docker image from Docker Hub Registry
[https://hub.docker.com/r/openidentityplatform/openig/](https://hub.docker.com/r/openidentityplatform/openig/)

In this tutorial, we will use Minikube as a local Kubernetes cluster.
`kubectl` should also be installed

Start Minikube with at least 4 cores, and 8 GB of memory to avoid insufficient resources errors.

```
minikube start --cpus=4 --memory=8g
```


## Create OpenIG Service

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

## Create OpenIG ConfigMaps

### Create Main ConfigMap

Create `config` folder and create config files there `admin.json` and `config.json` with the following contents

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

Create ConfigMap for this files:

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

### Create ConfigMaps for OpenIG Routes

Create `routes` directory in `config` folder and add two route files: `10-api.json` - main route and `99-default.json` - default route.

**`10-api.json`**:
```json
{
  "name": "${matches(request.uri.path, '^/')}",
  "condition": "${matches(request.uri.path, '^/')}",
  "monitor": true,
  "timer": true,
  "handler": {
    "type": "Chain",
    "config": {
      "filters": [
        {
          "type": "SwitchFilter",
          "config": {
            "onRequest": [
              {
                "condition": "${request.method != 'POST' and request.method != 'GET'}",
                "handler": {
                  "type": "StaticResponseHandler",
                  "config": {
                    "status": 405,
                    "reason": "Method not allowed",
                    "headers": {
                      "Content-Type": [
                        "application/json"
                      ]
                    },
                    "entity": "{ \"error\": \"Method not allowed\"}"
                  }
                }
              }
            ]
          }
        }
      ],

      "handler": "EndpointHandler"
    }
  },
  "heap": [
    {
      "name": "EndpointHandler",
      "type": "DispatchHandler",
      "config": {
        "bindings": [
          {
            "handler": "ClientHandler",
            "capture": "all",
            "baseURI": "https://xkcd.com"
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

# Create OpenIG Deployment

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

Call target service:
```
curl -v -X GET -H 'Host: xkcd.com' -H 'Accept: application/json' 'http://localhost:8080/info.0.json'
Note: Unnecessary use of -X or --request, GET is already inferred.
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 8080 (#0)
> GET /info.0.json HTTP/1.1
> Host: xkcd.com
> User-Agent: curl/7.54.0
> Accept: application/json
>
< HTTP/1.1 200 OK
< Accept-Ranges: bytes
< Age: 134
< Cache-Control: max-age=300
< Date: Tue, 14 Jan 2020 07:58:31 GMT
< ETag: "5e1ce20d-157"
< Expires: Mon, 13 Jan 2020 21:38:45 GMT
< Last-Modified: Mon, 13 Jan 2020 21:33:01 GMT
< Server: nginx
< Vary: Accept-Encoding
< Via: 1.1 varnish
< X-Cache: HIT
< X-Cache-Hits: 7
< X-Served-By: cache-ams21025-AMS
< X-Timer: S1578988712.741555,VS0,VE0
< Content-Type: application/json
< Content-Length: 343
<
* Connection #0 to host localhost left intact
{"month": "1", "num": 2254, "link": "", "year": "2020", "news": "", "safe_title": "JPEG2000", "transcript": "", "alt": "I was actually a little relieved when I learned that JPEG2000 was used in the DCI digital cinema standard. I was feeling so bad for it!", "img": "https://imgs.xkcd.com/comics/jpeg2000.png", "title": "JPEG2000", "day": "13"}
```

## Expose OpenIG Service via Ingress

You can also expose OpenIG via Ingress

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
192.168.64.15
```

Make request to exposed OpenIG:

```
$ curl -X GET -H 'Host: xkcd.com' -H 'Accept: application/json' 'http://192.168.64.15/info.0.json'
{"month": "1", "num": 2254, "link": "", "year": "2020", "news": "", "safe_title": "JPEG2000", "transcript": "", "alt": "I was actually a little relieved when I learned that JPEG2000 was used in the DCI digital cinema standard. I was feeling so bad for it!", "img": "https://imgs.xkcd.com/comics/jpeg2000.png", "title": "JPEG2000", "day": "13"}
```
