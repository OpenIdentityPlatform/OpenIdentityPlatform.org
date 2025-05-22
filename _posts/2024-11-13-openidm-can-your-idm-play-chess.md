---
layout: home
title: "OpenIDM: Can your IDM play chess?"
landing-title2: "OpenIDM:C an your IDM play chess?"
description: "In this article, we will configure OpenIDM workflow to play chess between users."
keywords: 'OpenIDM, Identity Management, workflowm chess'
imageurl: 'openidm-og.png'
share-buttons: true
---

<h1>OpenIDM: Can your IDM play chess?</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenIDM/wiki/Can-your-IDM-play-chess](https://github.com/OpenIdentityPlatform/OpenIDM/wiki/Can-your-IDM-play-chess%3F)

## Introduction

[OpenIDM](http://github.com/OpenIdentityPlatform/OpenIDM) manages the lifecycle of identities in an organization. Automates onboarding, provisioning, privilege management, and offboarding processes. Can synchronize account changes across multiple enterprise systems. 

In OpenIDM it is possible to configure workflows in the [BPMN2](https://en.wikipedia.org/wiki/BPMN) notation, as well as to create an arbitrary user interfaces with the needs of the organization.

But it would be boring to customize some typical workflow, moreover, OpenIDM capabilities allow you to do it as flexibly as possible. In this article we will consider the workflow of playing chess as an example.

## Starting OpenIDM

### From the Binary Package

Execute the following commands:

Get the latest version of OpenIDM

```bash
$ export VERSION=$(curl -i -o - --silent https://api.github.com/repos/OpenIdentityPlatform/OpenIDM/releases/latest | grep -m1 "\"name\"" | cut -d\" -f4); echo "Last version: $VERSION"
Last version: 6.2.3
```

Download the OpenIDM binary package

```bash
$ curl -L https://github.com/OpenIdentityPlatform/OpenIDM/releases/download/$VERSION/openidm-$VERSION.zip --output openidm.zip
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100 92.1M  100 92.1M    0     0  9421k      0  0:00:10  0:00:10 --:--:-- 9926k
```

Unzip the OpenIDM binary package


```bash
$ unzip openidm.zip 
Archive:  openidm.zip
   creating: openidm/
....
```

Run OpenIDM

```bash
$ openidm/startup.sh -p samples/workflow
Executing openidm/startup.sh...
Using OPENIDM_HOME:   /tmp/openidm
Using PROJECT_HOME:   /tmp/openidm/samples/getting-started
Using OPENIDM_OPTS:   -Dlogback.configurationFile=conf/logging-config.groovy
Using LOGGING_CONFIG: -Djava.util.logging.config.file=/tmp/openidm/samples/getting-started/conf/logging.properties
Using boot properties at /tmp/openidm/samples/getting-started/conf/boot/boot.properties
-> OpenIDM version "6.2.3" (revision: 284a4) 2024-11-11T09:18:27Z master
OpenIDM ready
```

### From the Docker Images

```bash
$ docker run -h idm-01.domain.com -p 8080:8080 -p 8443:8443 --name idm-01 openidentityplatform/openidm -p samples/workflow
Unable to find image 'openidentityplatform/openidm:latest' locally
latest: Pulling from openidentityplatform/openidm
74ac377868f8: Already exists 
a182a611d05b: Already exists 
e58ce1bd2f23: Already exists 
e1b7fbdee987: Already exists 
4f4fb700ef54: Already exists 
26716adeef7f: Pull complete 
Digest: sha256:6a6df88ca40116de4bba7ddef126a214feee04e7161b0d6f39ff9c9f448cda94
Status: Downloaded newer image for openidentityplatform/openidm:latest
Executing /opt/openidm/startup.sh...
Using OPENIDM_HOME:   /opt/openidm
Using PROJECT_HOME:   /opt/openidm/samples/getting-started
Using OPENIDM_OPTS:   -server -XX:+UseContainerSupport -Dlogback.configurationFile=conf/logging-config.groovy
Using LOGGING_CONFIG: -Djava.util.logging.config.file=/opt/openidm/samples/getting-started/conf/logging.properties
Using boot properties at /opt/openidm/samples/getting-started/conf/boot/boot.properties
ShellTUI: No standard input...exiting.
OpenIDM version "6.2.3" (revision: 284a4) 2024-11-11T09:18:27Z master
OpenIDM ready
```

## Initial OpenIDM Setup

Open the OpenIDM Administrator Console at [http://localhost:8080/admin](http://localhost:8080/admin). Enter the administrator login and password. The default login is `openidm-admin`, password is `openidm-admin`.

In the Adminstrator Console go to Manage → Processes. Then go to the Definitions tab. And make sure the `Start a Game of Chess!` process is in the processes list.

![OpenIDM Workflow Processes](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/openidm-chess/0-workflow-processes.png)

You can see what the workflow looks like by clicking on it.

![OpenIDM Workflow Chess Process](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/openidm-chess/1-chess-process.png)

Now let's create a user for the administrator to play chess with.

In the Adminstrator Console in the main menu go to Manage → User. Create an account. Let it be an account with the login `jdoe`, for example.

![New User](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/openidm-chess/2-new-user.png)

Click the Password tab and enter the password for the new user. Click the `Save` button.

![New User Password](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/openidm-chess/3-new-user-password.png)

## Playing Chess

Login to the OpenIDM console with the `openidm-admin` account at [http://localhost:8080](http://localhost:8080/). On the Dashboard screen, under Processes, there will be an item `Start a Game of Chess!`. Click on the `Details` link A chess board will appear. Click the `Start` button. A new game will be created. You can assign the game to yourself and play with yourself or wait for one of the other users to accept your invitation to play.

![New Chess Game](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/openidm-chess/4-new-chess-game.png)

Open another browser or a new window in incognito mode and log in with the `jdoe` account.

On the Dashboard page, you will see an invitation to play. Assign the game to yourself, take the first turn, and press the `Complete` button. 

![Chess John Doe Turn](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/openidm-chess/5-chess-jdoe-turn.png)

The task will disappear from the list. Now go to the window with the authenticated user `openidm-admin` and refresh the task list.  You will be prompted to make a return move. Make the move and click the `Complete` button. Now go again to the window with the user `jdoe`. A new task will appear for the user, prompting you to make your move. In this way, OpenIDM users can play chess among themselves.

![image.png](https://raw.githubusercontent.com/wiki/OpenIdentityPlatform/OpenIDM/images/openidm-chess/6-chess-admin-turn.png)

## Some Technical Details

Now let's understand how it works. Workflow in BPMN format is stored in the `samples/workflow/workflow` directory in the `chess.bar` archive You can view it using the command

```bash
$ unzip -p samples/workflow/workflow/chess.bar chess.bpmn20.xml | less
```

The user interface, the chessboard, is also stored in the same archive.

```bash
unzip -p samples/workflow/workflow/chess.bar chessboard.xhtml | less
```

You can create your workflow and user interface by analogy. Afterward, create a bar archive with the command

```bash
$ jar cvf chess.bar your-bpmn.xml your-ui.xhtml
```

And place it in the OpenIDM `workflow` directory.

You can read more about customizing workflows in the OpenIG documentation [here](https://doc.openidentityplatform.org/openidm/integrators-guide/chap-workflow) and [here](https://doc.openidentityplatform.org/openidm/samples-guide/chap-workflow-samples).
