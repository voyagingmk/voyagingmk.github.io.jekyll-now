---
layout: post
title: 渲染器开发笔记2-延迟渲染下的天空盒
tags: ['computer graphics']
published: true
---

<!--more-->

defer和forward框架下实现天空盒渲染，区别并不是很大，这里备忘下流程：

## Deferred rendering:

1. geometry pass（计算GBuffer）

2. Deferred lighting pass（根据GBuffer计算光照）

3. 把GBuffer的深度信息复制到main framebuffer

4. 渲染天空盒

## Forward rendering:

1. 正常渲染场景（一遍vs + fs？）

2. 渲染天空盒

## 对比

可以看到，天空盒都是放在最后一步渲染的。这是因为天空盒体积巨大，如果放在第一步就渲染就可能会有多余的fs着色是白做的，具体地说就是和视角有关，如果摄像机朝天，那么天空盒提前算也没关系，最终还是看得到这些像素，但如果视角朝地面，可能所有天空盒的像素都被深度剔除了，那就不好了。


## 天空盒的实现要点

### view矩阵问题

首先天空盒的渲染需要用到Proj和View矩阵，但需要做一点trick：天空盒不需要translate变换（摄像机不能"靠近"天空盒），需要把view矩阵的translate信息剔除掉。学到的一个很聪明的做法是：mat4(mat3(view))，即剔除view矩阵的前三行前三列信息（translate信息在最后一列），然后再恢复成mat4。

### 天空盒的深度值问题

天空盒必须渲染后到最深的位置，所以天空盒的每一个fragment的depth必须为1.0。怎么保证呢？做法就是在vertex shader里加一行这样的代码：

```
gl_Position = pos.xyww;
```

因为OpenGL有一个perspective divide的过程，会在vs着色完成时，对gl_Position除以gl_Position的z值，所以x、y、w、w会变成x/w、y/w、1.0, 1.0，z值就固定1.0了。



### glDepthFunc问题

glDepthFunc的默认值为GL_LESS，渲染天空盒时需要临时改为GL_LEQUAL，因为对于屏幕上空白的地方（没有任何fragment画上去），depth buffer的深度值为1.0，如果是GL_LESS，那么天空盒的深度值即使是1.0也会过不了depth test。所以要加上EQUAL。
