---
layout: post_latex
title: 线性代数之平移、缩放、旋转矩阵
tags: ['matrix','linear algebra']
published: true
---

<!--more-->

## 平移矩阵 Translate Matrix

{% assign matT = "1,0,0,x, 0,1,0,y, 0,0,1,z, 0,0,0,1" | split: ',' %}

\\[ T = {% include render_matrix_raw.html mat = matT row = 4 col = 4 %} \\]


## 缩放矩阵 Scale Matrix

{% assign matS = "x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1" | split: ',' %}

\\[ S = {% include render_matrix_raw.html mat = matS row = 4 col = 4 %} \\]


## 旋转矩阵 Rotate Matrix

### 绕(1,0,0)旋转\\(\\theta \\)角度

{% assign matRx = "1,0,0,0, 0,cos\\theta ,sin\\theta ,0, 0,-sin\\theta ,cos\\theta ,0, 0,0,0,1" | split: ',' %}

\\[ R\_\{(1,0,0)\} = {% include render_matrix_raw.html mat = matRx row = 4 col = 4 %} \\]

### 绕(0,1,0)旋转\\(\\theta \\)角度


{% assign matRy = "cos\\theta,0,-sin\\theta,0,   0,1,0,0, sin\\theta ,0,cos\\theta ,0, 0,0,0,1" | split: ',' %}


\\[ R\_\{(0,1,0)\} = {% include render_matrix_raw.html mat = matRy row = 4 col = 4 %} \\]


### 绕(0,0,1)旋转\\(\\theta \\)角度

{% assign matRz = "cos\\theta,sin\\theta,0,0, -sin\\theta ,cos\\theta ,0,0,  0,0,1,0,  0,0,0,1" | split: ',' %}

\\[ R\_\{(0,0,1)\} = {% include render_matrix_raw.html mat = matRz row = 4 col = 4 %} \\]



### 绕任意轴旋转\\(\\theta \\)角度


设旋转轴为\\(\\vec n\\)，这是一个单位化的方向向量。设被旋转的向量为\\(\\vec v\\)，被旋转后是\\(\\vec v' \\)。

为了求出\\(\\vec v' \\)，需要迂回地处理：

- 将\\(\\vec v\\) 分解为 \\(\\vec v = \\vec v\_\{\\perp \}+\\vec v\_\{\\parallel \} \\)	，\\( \\vec v\_\{\\parallel \} \\)指的是\\(\\vec v\\)与\\(\\vec n\\)平行的部分，\\( \\vec v\_\{\\perp \} \\) 指的是\\(\\vec v\\) 与\\(\\vec n\\)垂直的部分。

- 分解为两部分后，可以分别对这两个部分做旋转，然后再合并，所以有： \\(\\vec v' = \\vec v'\_\{\\perp \}+\\vec v'\_\{\\parallel \} \\)

- 让 \\( \\vec v\_\{\\parallel \} \\) 绕旋转轴\\(\\vec n\\)旋转\\(\\theta \\)角度，它依然保持不变，因为它和\\(\\vec n\\)是同方向的向量，所以有 \\( \\vec v\_\{\\parallel \} = \\vec v'\_\{\\parallel \} \\)

- 根据上一点，可以得到： \\(\\vec v' = \\vec v'\_\{\\perp \}+\\vec v\_\{\\parallel \} \\)。因此，问题简化为求\\( \\vec v'\_\{\\perp \} \\)和\\( \\vec v\_\{\\parallel \} \\)



- 分析\\( \\vec v\_\{\\parallel \} \\)，可以发现它相当于是\\(\\vec v\\)在\\(\\vec n\\)上的投影，根据向量的点积公式：

\\[ \\vec A\\cdot \\vec B = |\\vec A||\\vec B|cos\\alpha  \\]


代入\\(\\vec v\\)、\\(\\vec n\\)后，得到：\\( \\vec v\\cdot \\vec n = |\\vec v||\\vec n|cos\\alpha = |\\vec v|cos\\alpha = |\\vec v\_\{\\parallel \}| \\)，即算出了\\( \\vec v\_\{\\parallel \} \\)的长度，又因为\\vec v\_\{\\parallel \} \\)和\\(\\vec n\\)方向一致、\\(\\vec n\\)长度为1，所以有:

\\[ \\vec v\_\{\\parallel \} = (\\vec v\\cdot \\vec n) \\vec n \\]


- 上一步已经解决了\\( \\vec v\_\{\\parallel \} \\)，剩下的就是求\\( \\vec v'\_\{\\perp \} \\)。求\\( \\vec v'\_\{\\perp \} \\)之前需要先求出\\( \\vec v\_\{\\perp \} \\)，而显然\\( \\vec v\_\{\\perp \} = v - \\vec v\_\{\\parallel\} \\) 


- 接着，需要计算一个新的向量\\(\\vec w \\)，\\( \\vec w = \\vec n \\times \\vec v\_\{\\perp \} \\) （注意叉乘的顺序不能错），所以\\(\\vec w \\)是一个垂直于\\(  \\vec n \\)、\\( \\vec v\_\{\\perp \} \\)所构成平面的向量。

- 把\\( \\vec v\_\{\\perp \}\\)、\\(\\vec w \\) 分别当做是\\(  \\vec n \\)、\\( \\vec v\_\{\\perp \} \\)平面的x、y轴(2D坐标系)，那么\\( \\vec v'\_\{\\perp \} \\)的含义就是指\\( \\vec v\_\{\\perp \} \\)在这个2D坐标系下旋转\\(\\theta \\)度。从而得到等式：

\\[ \\vec v'\_\{\\perp \} =  cos\\theta \\vec v\_\{\\perp \} + sin\\theta \\vec w \\]


好了，所有变量都得到了，总结下最终的公式：

\\( \\vec v\_\{\\parallel \} = (\\vec v\\cdot \\vec n) \\vec n \\)

\\( \\vec v\_\{\\perp \} = \\vec v - \\vec v\_\{\\parallel\} = \\vec v -  (\\vec v\\cdot \\vec n) \\vec n \\) 

\\( \\vec w = \\vec n \\times \\vec v\_\{\\perp \} \\) 

\\( = \\vec n \\times (\\vec v - \\vec v\_\{\\parallel\}) \\) 

\\( = \\vec n \\times \\vec v - \\vec n \\times \\vec v\_\{\\parallel\}) \\) 

\\( = \\vec n \\times \\vec v \\) 


\\( \\vec v'\_\{\\perp \} =  cos\\theta \\vec v\_\{\\perp \} + sin\\theta \\vec w \\)


\\( =  cos\\theta (v - (\\vec v\\cdot \\vec n) \\vec n) + sin\\theta (\\vec n \\times \\vec v)  \\)


\\( \\vec v' = \\vec v'\_\{\\perp \} + \\vec v\_\{\\parallel \} \\)

\\( = cos\\theta (v - (\\vec v\\cdot \\vec n) \\vec n) + sin\\theta (\\vec n \\times \\vec v) + (\\vec v\\cdot \\vec n) \\vec n \\)


