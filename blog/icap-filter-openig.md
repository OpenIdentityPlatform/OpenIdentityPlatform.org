---
layout: home
title: "ICAP Filter in OpenIG"
landing-title2: "How to setup ICAP Filter for DLP and Antivirus protection with OpenIG"
description: "How to setup ICAP Filter for DLP and Antivirus protection with OpenIG"
keywords: 'authentication, icap, dlp, antivirys'
share-buttons: true
---

# How to setup ICAP Filter for DLP and Antivirus protection with OpenIG

Original article: [https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-to-setup-ICAP-Filter-for-DLP-and-Antivirus-protection-with-OpenIG](https://github.com/OpenIdentityPlatform/OpenIG/wiki/How-to-setup-ICAP-Filter-for-DLP-and-Antivirus-protection-with-OpenIG)


- [Introduction](#introduction)
- [Setup Filter](#setup-filter)
- [Testing Solution](#testing-solution)

## Introduction
[Internet Content Adaptation Protocol (ICAP)](https://en.wikipedia.org/wiki/Internet_Content_Adaptation_Protocol){:target="_blank"}  - is a lightweight protocol that is generally used to implement virus scanning and content filtering.

Using ICAP filter in OpenIG allows checking whether the request payload contains malicious data.

## Setup Filter

Sample OpenIG ICAP filter configuration is shown in the code snippet below.

```json
{
	"type": "ConditionalFilter",
	"config": {
		"condition": "${not empty system['icap'] and (request.method == 'POST' or request.method == 'PUT')}",
		"delegate": {
			"type": "ICAP",
			"name": "icap-dlp",
			"config": {
				"server": "${system['icap']}",
				"service": "${empty system['icap.service'] ?  '' : system['icap.service']}",
				"rewrite": "${empty system['icap.rewrite'] ?  'true' : system['icap.rewrite']}",
				"connect_timeout": "${empty system['icap.connect_timeout'] ?  '5000' : system['icap.connect_timeout']}",
				"read_timeout": "${empty system['icap.read_timeout'] ?  '20000' : system['icap.read_timeout']}"
			}
		}
	}
}
```

There are serveral important system parameters:

|Parameter | Description | Default value |
|-|-|-|
| icap | ICAP connecton string, for example -Dicap=icap://localhost:1344 | none |
| icap.service | Service name for REQMOD command icap://localhost/srv_clamav ICAP/1.0 (Depends on DLP provider) | / |
| icap.rewrite | Deny sending content to the target service and return a response from the DLP service |	true |
| icap.connect_timeout	| Connection timeout to ICAP, ms | 5000 |
| icap.read_timeout | ICAP response timeout, ms | 20000 |

<br>

## Testing Solution

### Setup Test ICAP Server

For demo purposes we will use ICAP [Docker image](https://hub.docker.com/r/toolarium/toolarium-icap-calmav-docker){:target="_blank"}

Start ICAP service docker container

```
docker run --rm --name icap-server -p 1344:1344 toolarium/toolarium-icap-calmav-docker:0.0.1
```

Optional steps

Login into the container
```
docker exec -it icap-server /bin/bash
```

the configuration you will see under
```bash
more /etc/c-icap/c-icap.conf
```

view / tail access-log
```
tail -f /var/log/c-icap/access.log
```

view / tail server-log
```
tail -f /var/log/c-icap/server.log
```
test with c-icap client inside the container
```
c-icap-client -v -f entrypoint.sh -s "srv_clamav" -w 1024 -req http://request -d 5
```

stop service
```
docker stop icap-server
```

You can also view ICAP packages using `tcpdump` tool
```
sudo tcpdump -vvvs 10240 -l -A port 1344 or 8080 -i lo0
```

### Getting Test Malicious File
Malicious test file can be downloaded here: [https://www.eicar.org/?page_id=3950](https://www.eicar.org/?page_id=3950){:target="_blank"} 

### Deny Content Mode (-Dicap.rewrite=true)

In this mode, the call to the target service is blocked with a denial of access to the client

```
$ curl -v -T ~/Downloads/eicar.com.txt --output -  http://localhost:8081
*   Trying ::1:8081...
* Connected to localhost (::1) port 8081 (#0)
> PUT /eicar.com.txt HTTP/1.1
> Host: localhost:8081
> User-Agent: curl/7.72.0
> Accept: */*
> Content-Length: 68
> Expect: 100-continue
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 100 Continue
* We are completely uploaded and fine
* Mark bundle as not supporting multiuse


17:32:09.213 [http-bio-8081-exec-1] INFO  net.rfc3507.client.ICAPClient - 
### (SEND) ICAP REQUEST ###
REQMOD icap://localhost/srv_clamav ICAP/1.0
Host: localhost
User-Agent: Java-ICAP-Client/1.1
Allow: 204
Encapsulated: req-body=0

17:32:09.247 [http-bio-8081-exec-1] INFO  net.rfc3507.client.ICAPClient - 
### (RECEIVE) ICAP RESPONSE STATUS ###
ICAP/1.0 200 OK
17:32:09.247 [http-bio-8081-exec-1] INFO  net.rfc3507.client.ICAPClient - 
### (RECEIVE) HTTP RESPONSE HEADER ###
HTTP/1.0 403 Forbidden
Server: C-ICAP
Connection: close
Content-Type: text/html
Content-Language: en

< HTTP/1.1 403 Forbidden
< Connection: close
< Content-Language: en
< Server: C-ICAP
< Content-Type: text/html
< Content-Length: 428
< Date: Wed, 23 Mar 2022 14:32:09 GMT

<html>
 <head>
   <title>VIRUS FOUND</title>
</head>
<body>
<h1>VIRUS FOUND</h1>
You tried to upload/download a file that contains the virus: 
   <b> Win.Test.EICAR_HDB-1 </b>
<br>
The Http location is: 
<b>  - </b>
<p>
  For more information contact your system administrator
 <hr>
<p>
This message generated by C-ICAP service: <b> srv_clamav </b>
<br>Antivirus engine: <b> clamav-01032/26318 </b>
</p>
</body>
</html>
```


### Deny Content Notification Mode (-Dicap.rewrite=false)

In this mode, the call to the target service is not blocked, and the service receives information about the result of the analysis in the request headers.

```
x-icap-message: OK
x-icap-status: 200
x-infection-found: Type=0; Resolution=2; Threat=Win.Test.EICAR_HDB-1;
x-violations-found: 1
```

```
$curl -v -T ~/Downloads/eicar.com.txt --output -  http://localhost:8081
*   Trying ::1:8081...
* Connected to localhost (::1) port 8081 (#0)
> PUT /eicar.com.txt HTTP/1.1
> Host: localhost:8081
> User-Agent: curl/7.72.0
> Accept: */*
> Content-Length: 68
> Expect: 100-continue
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 100 Continue
* We are completely uploaded and fine
* Mark bundle as not supporting multiuse

17:35:23.662 [http-bio-8081-exec-1] INFO  net.rfc3507.client.ICAPClient - 
### (RECEIVE) ICAP RESPONSE STATUS ###
ICAP/1.0 200 OK
17:35:23.662 [http-bio-8081-exec-1] INFO  net.rfc3507.client.ICAPClient - 
### (RECEIVE) HTTP RESPONSE HEADER ###
HTTP/1.0 403 Forbidden
Server: C-ICAP
Connection: close
Content-Type: text/html
Content-Language: en
 
17:35:23.672 [http-bio-8081-exec-1] INFO  org.forgerock.openig.decoration.capture.CaptureDecorator.capture._router - 
--- (request) id:3590943c-e3c7-4516-8ddf-d806364949e3-1 --->
PUT http://localhost:8081/eicar.com.txt HTTP/1.1
accept: */*
connection: keep-alive
content-length: 68
encapsulated: res-hdr=0
encapsulated: res-body=108
expect: 100-continue
host: localhost:8081
istag: CI0001-ChRmxAEiaz4ONpbclhkR0wAA
server: C-ICAP/0.4.4
user-agent: curl/7.72.0
X-Forwarded-Port: 443
X-Forwarded-Proto: https
x-icap-message: OK
x-icap-status: 200
x-infection-found: Type=0; Resolution=2; Threat=Win.Test.EICAR_HDB-1;
x-violations-found: 1
 -
 Win.Test.EICAR_HDB-1
 0
 0
[entity]

< HTTP/1.1 404 Not Found
< Server: Apache-Coyote/1.1
< Content-Type: application/json
< Content-Length: 77
< Date: Wed, 23 Mar 2022 14:35:23 GMT
< 
* Connection #0 to host localhost left intact
{ "error": "Something gone wrong, please contact your system administrator."}
```

### ICAP Denial of Service in  -Dicap.rewrite=true Mode
In this mode, the call to the target service is not blocked with logging the cause of failure `ERROR org.openidentityplatform.openig.filter.ICAPFilter`

```
$ curl -v -T ~/Downloads/eicar.com.txt --output -  http://localhost:8081
*   Trying ::1:8081...
* Connected to localhost (::1) port 8081 (#0)
> PUT /eicar.com.txt HTTP/1.1
> Host: localhost:8081
> User-Agent: curl/7.72.0
> Accept: */*
> Content-Length: 68
> Expect: 100-continue
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 100 Continue
* We are completely uploaded and fine
* Mark bundle as not supporting multiuse

17:54:37.255 [http-bio-8081-exec-1] ERROR org.openidentityplatform.openig.filter.ICAPFilter - net.rfc3507.client.ICAPException: java.net.ConnectException: Connection refused (Connection refused)
< HTTP/1.1 404 Not Found
< Server: Apache-Coyote/1.1
< Content-Type: application/json
< Content-Length: 77
< Date: Wed, 23 Mar 2022 14:39:39 GMT
< 
* Connection #0 to host localhost left intact
{ "error": "Something gone wrong, please contact your system administrator."}
```


If you have any additional questions, [feel free to ask us](https://github.com/OpenIdentityPlatform/OpenIG/discussions){:target="_blank"}!