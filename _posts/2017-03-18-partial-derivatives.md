---
layout: post_latex
title: 微分几何与渲染(1)
tags: ['computer graphics', 'math' ]
published: true
---

<!--more-->

## 参数坐标——uv坐标系

在ComputerGraphics(CG)中，一般称纹理坐标是uv坐标，但其实uv坐标还有别的用处，例如下文将介绍的微分几何方程。

既然被叫做uv坐标，那么它只有2个变量，但要注意，uv坐标和初中课本里面的xy坐标是不一样的，uv坐标可以用在**曲面和平面**，而xy坐标只能处理平面。


举个好理解的例子：一个完整的Sphere的uv坐标是什么呢？首先，定义一个球需要2个信息：球心坐标\\( \\vec o \\)和半径r。

接着，对于球面上某个点，要怎么表示呢？中学几何课本里会这样子写：

\\[ x\^ 2 + y\^ 2 + z\^ 2 = r\^ 2  \\]

则有：

\\[ p = (\\vec o, r, x, y, z) \\]

参数可以进一步简化，第一个方法是应用球坐标系（Spherical coordinate），即用2个角\\(\\theta \\)、\\(\\phi \\)定位球面上的一个点：

\\[ p = (\\vec o, r, \\theta, \\phi ) ， 0 \\leq \\theta \\leq π， 0 \\leq \\phi \\leq 2π  \\]

![1.png](/images/2017.3/1.png)

这些球面点当然也有uv坐标表示法：

\\[ p = (\\vec o, r, u, v ) \\]

可以看到， θφ坐标和uv坐标都是可以表示曲面上的点的，而且都是2个变量，所以它们之间存在某种转换关系：

\\[ u=sinθcosϕ \\]
\\[ v=sinθsinϕ \\]

因为θ、φ是线性无关的，那么uv的取值范围为：

 \\[ -1 \\leq u \\leq 1， -1 \\leq v \\leq 1 \\]

 这个取值范围可以做一下转换，去掉负数：

 \\[ u' = \\frac \{1\}\{2\}(u + 1),   0 \\leq u' \\leq 1 \\]

 \\[ v' = \\frac \{1\}\{2\}(v + 1),   0 \\leq v' \\leq 1 \\]

另外，当uv坐标作为纹理坐标时，uv坐标的取值范围是 \\( 0 \\leq u \\leq 1 \\)，\\( 0 \\leq v \\leq 1 \\)。


## 三角面片中的偏微分方程

每个mesh都是由有限数量的三角面片(下文简称Tri)组成，在渲染过程中，处理一个Tri和处理一堆Tri是一样的算法，所以只要解决单个Tri的渲染问题，就能渲染复杂的mesh。

![3.png](/images/2017.3/3.png)

假设上面这个图里的三角形表示mesh中的一个三角面片，三个顶点分别为：

\\[ \\vec p\_\{0\} = (x\_\{0\}, y\_\{0\}, z\_\{0\}) \\]

\\[ \\vec p\_\{1\} = (x\_\{1\}, y\_\{1\}, z\_\{1\}) \\]

\\[ \\vec p\_\{2\} = (x\_\{2\}, y\_\{2\}, z\_\{2\}) \\]

虽然是三维的面片(顶点坐标有3个分量)，但我们可以把这个Tri想象成在一个二维空间里，并且设想这个二维平面上有一个原点\\( \\vec p\_\{o\} \\)(o代表origin), \\( \\vec p\_\{o\} \\)和Tri的相对位置取决于Tri三个顶点的uv坐标值。

既然有了 \\( \\vec p\_\{o\} \\)，就可以用方程表示三个顶点了：

\\[ \\vec p\_\{0\} = \\vec p\_\{o\} + u\_\{0\}\\frac \{ \\partial \\vec p \}\{ \\partial u \} + v\_\{0\}\\frac \{ \\partial \\vec p \}\{ \\partial v \} \\]

\\[ \\vec p\_\{1\} = \\vec p\_\{o\} + u\_\{1\}\\frac \{ \\partial \\vec p \}\{ \\partial u \} + v\_\{1\}\\frac \{ \\partial \\vec p \}\{ \\partial v \} \\]

\\[ \\vec p\_\{2\} = \\vec p\_\{o\} + u\_\{2\}\\frac \{ \\partial \\vec p \}\{ \\partial u \} + v\_\{2\}\\frac \{ \\partial \\vec p \}\{ \\partial v \} \\]

这3个方程里总共有3个未知量：\\( \\vec p\_\{o\}、\\frac \{ \\partial \\vec p \}\{ \\partial u \}、\\frac \{ \\partial \\vec p \}\{ \\partial v \} \\)。\\( \\vec p\_\{o\} \\)是可以消去的，后面的2个偏微分才是我们要求出来的。

要求这2个偏微分，需要先列出2个方程以便消去\\( \\vec p\_\{o\} \\)：\\( \\vec p\_\{0\} - \\vec p\_\{2\} 、 \\vec p\_\{1\} - \\vec p\_\{2\} \\)：

\\[ \\vec p\_\{0\} - \\vec p\_\{2\} = (u\_\{0\} - u\_\{2\})\\frac \{ \\partial \\vec p \}\{ \\partial u \} +  (v\_\{0\} - v\_\{2\})\\frac \{ \\partial \\vec p \}\{ \\partial v \} \\]


\\[ \\vec p\_\{1\} - \\vec p\_\{2\} = (u\_\{1\} - u\_\{2\})\\frac \{ \\partial \\vec p \}\{ \\partial u \} +  (v\_\{1\} - v\_\{2\})\\frac \{ \\partial \\vec p \}\{ \\partial v \} \\]

然后把这2个方程写成矩阵乘法的形式：


{% assign A =  "u\_\{0\} - u\_\{2\},  v\_\{0\} - v\_\{2\},  u\_\{1\} - u\_\{2\},  v\_\{1\} - v\_\{2\}" | split: ',' %}


{% assign B =  "\\frac \{ \\partial \\vec p \}\{ \\partial u \},  \\frac \{ \\partial \\vec p \}\{ \\partial v \}" | split: ',' %}

{% assign C =  " \\vec p\_\{0\} - \\vec p\_\{2\} ,  \\vec p\_\{1\} - \\vec p\_\{2\}" | split: ',' %}

\\[ {% include render_matrix_raw.html mat = A  row = 2 col = 2 %} {% include render_matrix_raw.html mat = B  row = 2 col = 1 %} = {% include render_matrix_raw.html mat = C  row = 2 col = 1 %} \\]

再根据矩阵初级变换，有：

\\[ {% include render_matrix_raw.html mat = B  row = 2 col = 1 %} = {% include render_matrix_raw.html mat = A  row = 2 col = 2 %} \^\{-1\} {% include render_matrix_raw.html mat = C  row = 2 col = 1 %} \\]

再根据二阶矩阵的逆矩阵公式：

{% assign D =  "a, b, c, d" | split: ',' %}

{% assign E =  "d, -b, -c, a" | split: ',' %}

\\[ A = {% include render_matrix_raw.html mat = D row = 2 col = 2 %} \\]

\\[ A\^\{-1\} = \\frac \{1\}\{ad - bc\} {% include render_matrix_raw.html mat = E row = 2 col = 2 %} \\]

上式的逆矩阵可以变成：

{% assign A2 =  "v\_\{1\} - v\_\{2\}, -(v\_\{0\} - v\_\{2\}), -(u\_\{1\} - u\_\{2\}), u\_\{0\} - u\_\{2\}" | split: ',' %}

\\[ {% include render_matrix_raw.html mat = A  row = 2 col = 2 %} \^\{-1\} = \\frac \{1\}\{(u\_\{0\} - u\_\{2\})(v\_\{1\} - v\_\{2\}) - (v\_\{0\} - v\_\{2\})(u\_\{1\} - u\_\{2\})\}  {% include render_matrix_raw.html mat = A2  row = 2 col = 2 %} \\]


总结一下：3维空间中，某3个不同顶点组成的三角平面上的任意点\\( \\vec p \\)关于u、v的偏微分的值完全一致，且可以通过三个顶点的xyz坐标和uv坐标求得。
