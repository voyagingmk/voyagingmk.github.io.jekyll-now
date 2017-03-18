---
layout: post_latex
title: forwarder概况
tags: ['c++' ]
published: true
---

5个月没更新博客，是因为这段时间主要用在开发forwarder。forwarder是因为工作需要而开发的一个工具，它统一了游戏前后端之间、后端各个服务之间的通信，目前forwarder不仅已经通过了初步的压力和稳定性测试，并且已经在项目中发挥了实际作用。

<!--more-->


## 目前成果

1. 已经实现两种通信模式：enet(udp)和websocket(http based tcp)的一键切换

我们一开始用了websocket来实现服务端和客户端之间的通信。服务端架构做深入后，涌现了复杂的多服务器间通信的需求，为求快速开发，我们用上了npm上的一个websocket库，这样前后端、后端之间的通信模式就统一了：js + websocket。但是这个websocket库偶而会出现一个莫名其妙的error，第三方库的原因，修复无望，也不想死磕这个websocket，于是发现了新的方案：enet。

enet是一个神奇的库，它把udp通信做了一层封装，使得通过enet通信，不仅可以发不可靠的udp，也可以发可靠的udp，使得通过udp也可以做网游（作者似乎也是某个游戏公司的）。

更重要的是，tcp相比udp，有一个缺点，在网络状况不好时，tcp表现得很差，原因是RTO（Retransmission TimeOut)重传定时器跟不上RTT（Round Trip Time）的变化（这也是tcp的故意设计）。具体细节推荐这篇文章：[TCP超时重传机制探索](http://blog.csdn.net/heiyeshuwu/article/details/46402517)。RTO过高时，延迟就会变大，对有实时联网战斗的游戏是致命的。

除了可靠性，enet还有很多features：有序、连接管理、带宽控制、跨平台等，都是无缝地从tcp通信切换到enet通信的有利条件。

但我们项目如果要切换到enet还有很多问题，例如：

- 我们的web版客户端无法嵌入enet库（因为浏览器不支持），即使服务端支持了enet，web客户端也无法与之建立通信
- websocket在浏览器的js、spidermonkey的js、node.js（npm有现成的库），都算是内置的功能，但enet就需要我们自行解决这些平台问题了

因此，forwarder的就油然而生了，forwarder对通信方式做了一层简单的抽象，把enet亦或者websocket都隐藏了，使得通过forwarder做通信时，不需要太关心通信方式细节。

对于上面第一个问题就有了解决方案，服务端只需要开放2个访问端口，一个tcp(websocket)、一个udp(enet)，前者给web客户端连接，后者给支持enet的客户端连接，例如手机端、PC端。forwarder收到websocket线路来的包时，也交给enet线路的packer_handler处理就可以了，发包接口也类似。

第二个问题的处理就是写driver，forwarder对收发的packet包一层scheme，用于做加密等功能，而web端既然无法使用forwarder的代码，那么就只能写一个scheme parser和一套简易的forwarder-js接口，实现解包、压包；node.js的话也实现了一个[forwarder-node](https://www.npmjs.com/package/forwarder-node)了；而spidermonkey或者说cocos2d-x中的spidermonkey，我也写了一套driver用于项目中。

2. 动态长度header，支持加密、压缩、base64、ip查询

加密使用了AES算法，密钥要求128位；压缩使用了zlib库；动态长度header是指，在不开启任何功能时，单个packet的header最少需要8个字节，根据开启的flag，header会动态增长。（初期写了固定长度的header，发现很不好使，中间重构了一遍）


### 以后计划

目前forwarder也比较稳定，可以使用了，开发速度将放缓。我也想把时间留给学习和写blog。

forwarder目前剩下要做的大概就是几点：

- 完善API
- 写好document
- 实现新的通信模式：纯粹的tcp

第1点急不来，完美的接口需要长期的打磨；第2点主要是我懒的问题；第3点重要但不紧急，毕竟在web端只能用websocket做长连接，而手机端有更舒服的enet保驾护航。



