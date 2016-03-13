---
layout: post_latex
title: 线性代数之透视矩阵Perspective Matrix
tags: ['matrix','linear algebra']
published: true
---

本文部分内容翻译自：[Tutorial 12: Perspective Projection](http://www.ogldev.org/www/tutorial12/tutorial12.html)


# 介绍


所谓的透视矩阵，指的是一个“降维”的转换过程。


设想下一个在3维空间里的3D模型，它必然拥有一些顶点信息，设其中任意顶点的坐标为(x,y,z,1)（后面的1是齐次坐标的意思），当我们需要把这个模型投影到某个平面上时，它就从3维变成了2维（看过三体3的童鞋就容易理解了，这就是二向箔!），而顶点坐标(x,y,z,1)则变成(x`,y`,d,?)。


可以注意到，经过透视变换后的顶点，依然是四维的形式，只是含义变了，其中的(x`,y`)分量指的是这个顶点在投影平面上的坐标(显然是因为投影平面相当于一个2维坐标系)。d指的是这个投影点的深度(depth)，d一般是规范化的，范围是[-1,1]。d的作用在下一个渲染阶段(Depth Test)大有用处。而后面的?，无法一言蔽之，下文会讲到这个问题。


# 视锥体 Frustum

<div>
  <iframe class="webgl_example" style="width: 400px; height: 600px;" src="http://webglfundamentals.org/webgl/frustum-diagram.html"></iframe>
</div>

[演示程序来源：http://webglfundamentals.org/webgl/lessons/webgl-3d-perspective.html](http://webglfundamentals.org/webgl/lessons/webgl-3d-perspective.html)
