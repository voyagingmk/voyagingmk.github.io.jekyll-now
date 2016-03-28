---
layout: post_latex
title: 用线性代数知识解决光线和三角形的交点问题
tags: ['matrix','linear algebra']
published: true
---

本文可认为是《PBRT》3.6节的公式推导笔记。

<!--more-->

### Step1 抽象化问题

首先是问题中的3个对象的抽象：


三角形：由三角形的定义可知，只要确定空间中三个顶点的坐标，就能确定唯一的一个三角形。设三个顶点分别为\\(\\vec p\_\{0\}\\)，\\(\\vec p\_\{1\}\\)，\\(\\vec p\_\{2\}\\)。

光线：光线在本问题中，设为有起点、有发射方向的射线，起点设为\\(\\vec o\\)，方向为\\(\\vec d\\)。


光线和三角形的交点：设该交点为\\(\\vec g\\)。


这时候还要再用到几何数学的一个东西：质心坐标 Barycentric Coordinates。 [http://mathworld.wolfram.com/BarycentricCoordinates.html](http://mathworld.wolfram.com/BarycentricCoordinates.html)

\\[ \\vec p\_\{BC\} = b\_\{0\}\\vec p\_\{0\} + b\_\{1\}\\vec p\_\{1\} + b\_\{2\}\\vec p\_\{2\}\\]

规范化的质心坐标被称为Homogeneous  Barycentric Coordinates，特性是\\( b\_\{0\} +  b\_\{1\} + b\_\{2\} = 1 \\)，

因为光线和三角形的交点必然落在三角形内部，所以这个交点可认为是一个\\(\\vec p\_\{BC\} \\)。所以有：

\\[ \\vec g = (1 - b\_\{1\} - b\_\{2\})\\vec p\_\{0\} + b\_\{1\}\\vec p\_\{1\} + b\_\{2\}\\vec p\_\{2\} \\]


### Step2 问题方程

因为光线和三角形的交点要么不存在、要么有且只有一个，所以可列出下面的方程：

\\[ \\vec o + t \\vec d = \\vec g  = (1 - b\_\{1\} - b\_\{2\})\\vec p\_\{0\} + b\_\{1\}\\vec p\_\{1\} + b\_\{2\}\\vec p\_\{2\} \\]

中间的\\(\\vec g\\)去掉：

\\[ \\vec o + t \\vec d = (1 - b\_\{1\} - b\_\{2\})\\vec p\_\{0\} + b\_\{1\}\\vec p\_\{1\} + b\_\{2\}\\vec p\_\{2\} \\]

可以看到，只剩下3个未知量：\\(t\\)、\\(b\_\{1\}\\)、\\( b\_\{2\}\\)，它们就是最终要求出来的东西。(注意：这3个都是数，不是向量)

为了应用线性代数的知识来解决问题，我们需要把这个方程写成线性代数里的线性方程组形式：

\\[ \\vec o + t \\vec d = (1 - b\_\{1\} - b\_\{2\})\\vec p\_\{0\} + b\_\{1\}\\vec p\_\{1\} + b\_\{2\}\\vec p\_\{2\} \\]

\\[ \\vec o + t \\vec d = \\vec p\_\{0\} - b\_\{1\}\\vec p\_\{0\} - b\_\{2\}\\vec p\_\{0\} + b\_\{1\}\\vec p\_\{1\} + b\_\{2\}\\vec p\_\{2\} \\]

\\[ \\vec o - \\vec p\_\{0\} = -t\\vec d - b\_\{1\}\\vec p\_\{0\} - b\_\{2\}\\vec p\_\{0\} + b\_\{1\}\\vec p\_\{1\} + b\_\{2\}\\vec p\_\{2\} \\]

\\[ -\\vec d t + (\\vec p\_\{1\}- \\vec p\_\{0\}) b\_\{1\} + (\\vec p\_\{2\} - \\vec p\_\{0\}) b\_\{2\} = \\vec o - \\vec p\_\{0\} \\]

为了让后续的推导更简洁，需要设：

\\( \\vec e\_\{1\} = \\vec p\_\{1\} - \\vec p\_\{0\} \\)

\\( \\vec e\_\{2\} = \\vec p\_\{2\} - \\vec p\_\{0\} \\)

\\( \\vec s = \\vec o - \\vec p\_\{0\} \\)

因此，上面的线性方程(组)简化成：

\\[ -\\vec d t + \\vec e\_\{1\} b\_\{1\} + \\vec e\_\{2\} b\_\{2\} = \\vec s \\]

再进一步，把方程左边写成矩阵相乘的形式，参数和系数就更显而易见了：


{% assign A = "-\\vec d, \\vec e\_\{1\}, \\vec e\_\{2\} " | split: ',' %}

{% assign B = "t, b\_\{1\}, b\_\{2\}" | split: ',' %}

\\[ {% include render_matrix_raw.html mat = A row = 1 col = 3 %} {% include render_matrix_raw.html mat = B row = 3 col = 1 %} = \\vec s \\]

### Step3 解开问题方程

接下来使用大招——**克拉默(Cramer)法则**，来解方程。（在我的[<复习向>线性代数之矩阵与行列式(1)](http://www.qiujiawei.com/linear-algebra/) 一文中有介绍）

克拉默(Cramer)法则：

> 若系数行列式 \\( D\\neq 0 \\)，则方程组有唯一解，其解为：
\\[ x\_\{j\} = \\dfrac \{D\_\{j\}\} \{D\} \\]

> \\( D\_\{j\} \\)是将系数行列式D中第j列的元素\\( a\_\{1j\},a\_\{2j\},\cdots a\_\{nj\} \\)对应地换成方程组右端的常数项\\( b\_\{1j\},b\_\{2j\},\cdots b\_\{nj\} \\)，而其余各列保持不变得到的行列式。

对应到上面的方程，系数行列式D等于：

\\[ D = {% include render_det_raw.html mat = A row = 1 col = 3 %} \\]

而方程右边的常数项为\\(\\vec s\\)。


所以上面的方程的各个未知数的值为：

{% assign D1 = "\\vec s, \\vec e\_\{1\}, \\vec e\_\{2\} " | split: ',' %}

{% assign D2 = "-\\vec d, \\vec s, \\vec e\_\{2\} " | split: ',' %}

{% assign D3 = "-\\vec d, \\vec e\_\{1\}, \\vec s " | split: ',' %}

\\( t = \\frac \{ {% include render_det_raw.html mat = D1 row = 1 col = 3 %} \} \{ {% include render_det_raw.html mat = A row = 1 col = 3 %} \} \\)

\\( b\_\{1\} = \\frac \{ {% include render_det_raw.html mat = D2 row = 1 col = 3 %} \} \{ {% include render_det_raw.html mat = A row = 1 col = 3 %} \} \\)

\\( b\_\{2\} = \\frac \{ {% include render_det_raw.html mat = D3 row = 1 col = 3 %} \} \{ {% include render_det_raw.html mat = A row = 1 col = 3 %} \} \\)


将三个式子合并下：


\\[ {% include render_matrix_raw.html mat = B row = 3 col = 1 %} = \\frac \{ 1 \} \{ {% include render_det_raw.html mat = A row = 1 col = 3 %} \} \\left\[ \begin{matrix} {% include render_det_raw.html mat = D1 row = 1 col = 3 %}  \\\ {% include render_det_raw.html mat = D2 row = 1 col = 3 %}  \\\ {% include render_det_raw.html mat = D3 row = 1 col = 3 %}  \\\  \end{matrix} \\right\]    \\]

然后再使用另一杀招——**向量的混合积**[Scalar Triple Product](http://mathworld.wolfram.com/ScalarTripleProduct.html)，从而再次将上式简化。

向量的混合积公式：

\\[ [\\vec a,\\vec b, \\vec c] = \\vec a\\cdot (\\vec b \\times \\vec c) \\]

\\[ = \\vec b\\cdot (\\vec c \\times \\vec a) = \\vec b\\cdot (-\\vec a \\times \\vec c) \\]

\\[ = \\vec c\\cdot (\\vec a \\times \\vec b) \\]

\\[ = det(\\vec a \ \\vec b \ \\vec c) = |\\vec a \ \\vec b \ \\vec c| \\]

因此有：

\\[ |-\\vec d \ \\vec e\_\{1\} \ \\vec e\_\{2\}| = -(-\\vec d) \\times \\vec e\_\{2\})\\cdot \\vec e\_\{1\} = (\\vec d \\times \\vec e\_\{2\})\\cdot \\vec e\_\{1\} \\]

\\[ |\\vec s \ \\vec e\_\{1\} \ \\vec e\_\{2\}| = (\\vec s \\times \\vec e\_\{1\})\\cdot \\vec e\_\{2\} \\]

\\[ |-\\vec d \ \\vec s \ \\vec e\_\{2\}| = (\\vec d \\times \\vec e\_\{2\})\\cdot \\vec s \\]

\\[ |-\\vec d \ \\vec e\_\{1\} \ \\vec s| = (\\vec s \\times \\vec e\_\{1\})\\cdot \\vec d \\]

再代入到前面的方程，得到：

{% assign M2 = "(\\vec s \\times \\vec e\_\{1\})\\cdot \\vec e\_\{2\}, (\\vec d \\times \\vec e\_\{2\})\\cdot \\vec s, (\\vec s \\times \\vec e\_\{1\})\\cdot \\vec d" | split: ',' %}


\\[ {% include render_matrix_raw.html mat = B row = 3 col = 1 %} = \\frac \{ 1 \} \{ (\\vec d \\times \\vec e\_\{2\})\\cdot \\vec e\_\{1\} \} {% include render_matrix_raw.html mat = M2 row = 3 col = 1 %}  \\]

再设：

\\[ \\vec s\_\{1\} = \\vec d \\times \\vec e\_\{2\} \\]

\\[ \\vec s\_\{2\} = \\vec s \\times \\vec e\_\{1\} \\]

就得到最终的等式了：

{% assign M3 = "\\vec s\_\{2\}\\cdot \\vec e\_\{2\}, \\vec s\_\{1\}\\cdot \\vec s, \\vec s\_\{2\}\\cdot \\vec d" | split: ',' %}


\\[ {% include render_matrix_raw.html mat = B row = 3 col = 1 %} = \\frac \{ 1 \} \{ \\vec s\_\{1\} \\cdot \\vec e\_\{1\} \} {% include render_matrix_raw.html mat = M3 row = 3 col = 1 %}  \\]

推导到了这里就结束了。现在来分析下这个最终等式的特点：

- \\(\\vec d 、\  \\vec s 、\  \\vec e\_\{1\} 、\  \\vec e\_\{2\} \\) 是需要先求出来的，不过也是非常容易计算的(向量加减法)。

- 接着就是算\\( \\vec s\_\{1\} 、\   \\vec s\_\{2\} \\)，无法避免的2次叉积运算。算完后，就得到了等式右边所有变量的值了。

- 最后就是4次向量点积运算，1次求倒数运算，3次乘法运算，就分别得到了\\( t 、\ b\_\{1\} 、\ b\_\{2\} \\)的值。



## 总结

在上面的推导过程中，用到了矩阵、行列式、向量叉积、向量混合积等诸多概念，只为了得到相交点的坐标，确实复杂了点。

其中的**向量的混合积**，可以参考以下网页来理解：

[http://mathworld.wolfram.com/CrossProduct.html](http://mathworld.wolfram.com/CrossProduct.html)

[https://en.wikipedia.org/wiki/Triple_product](https://en.wikipedia.org/wiki/Triple_product)
