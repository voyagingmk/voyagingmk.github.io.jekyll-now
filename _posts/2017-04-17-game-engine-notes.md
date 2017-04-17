---
layout: post_latex
title: mini引擎开发备忘
tags: ['game engine']
published: true
---

<!--more-->

## 跨平台问题汇总

### XCode 8 + iOS + SDL2 + OpenGL ES 

首先是记录xcode项目的创建问题：

1. 创建一个iOS平台的game或Single View Application项目。

2. Main和Lauch Screen这2个storyboard可以去掉，去掉后还要把info.plist里2个storyboard的选项也去掉，并设置用默认的Lauch Screen storyboard： 【Launch screen interface file base name：iOS Launch Screen】。相应的ViewController的h和m文件也去掉，只留下AppDelegate和main.m。

3. AppDelegate的h和m文件可以不修改，但main.m里面的代码需要全部删除（因为SDL自身会定义main入口）。

4. 下载SDL2源码，解压后找到里面的xcode-iOS目录，用xcode打开其中的SDL子目录里的工程，然后直接build，就获得里libsdl2.a静态库。

5. 把libsdl2.a放到刚才创建的xcode项目根目录里。并在Build Phases的Link项里把libsdl2.a加上。

6. 然后继续添加iOS项目需要的官方frameworks: GLKit、OpenGLES、CoreMotion、AVFoundation、GameController、AudioToolbox

7. 把SDL2的include目录复制到项目目录，并把目录拖进xcode左边的目录树里，然后设置后search path，这样等下编译就能找到SDL2库了

8. 然后就可以新建一个main.cpp文件，开始写SDL程序了



