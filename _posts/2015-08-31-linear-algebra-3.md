---
layout: post_latex
title: <复习向>线性代数之矩阵与行列式(3)
tags: ['matrix','linear algebra']
published: true
---

#行列式的求解

从行列式的定义出发去求行列式，是一个简单但低效的方法。而实际上，解决数学问题的途径往往有多种。这里，我将介绍其中一种比较常见的快速解法：**PLU分解**。

## PLU的LU

要理解PLU，得先搞懂LU分解。（这里分享一个外教的讲解视频，简单好理解：[https://www.youtube.com/watch?v=UlWcofkUDDU]() 能翻墙的同学就直接看吧。)

LU分别代表：Lower Triangular Matrix 和 Upper Triangular Matrix，即下三角矩阵和上三角矩阵。

下面手动演示下LU分解过程：

设A：

{% assign matA = "9,6,0,6,5,4,3,4,10" | split: ',' %}

\\[ A = {% include render_matrix_raw.html mat = matA row = 3 col = 3 %} \\]


要把A分解成LU，第一步是先用高斯消元法，把A变成阶梯型矩阵U：

- \\( R2 -= R1 * a\_\{10\}/a\_\{00\} = R1 * 6/9 \\)

{% assign matA1 = "9,6,0,0,1,4,3,4,10" | split: ',' %}
{% assign matE1 = "1,0,0,-6/9,1,0,0,0,1" | split: ',' %}

\\[ A\_\{0\} = {% include render_matrix_raw.html mat = matA1 row = 3 col = 3 %} = E\_\{0\}A = {% include render_matrix_raw.html mat = matE1 row = 3 col = 3 %}
{% include render_matrix_raw.html mat = matA row = 3 col = 3 %} \\]


- \\( R3 -= R1 * a\_\{20\}/a\_\{00\} = R1 * 3/9 \\)

{% assign matA2 = "9,6,0,0,1,4,0,2,10" | split: ',' %}
{% assign matE2 = "1,0,0,0,1,0,-3/9,0,1" | split: ',' %}

\\[ A\_\{1\} = {% include render_matrix_raw.html mat = matA2 row = 3 col = 3 %} = E\_\{1\}A\_\{0\} = {% include render_matrix_raw.html mat = matE2 row = 3 col = 3 %}
{% include render_matrix_raw.html mat = matA1 row = 3 col = 3 %}  \\]

- \\( R3 -= R2 * a\_\{21\}/a\_\{11\} = R1 * 2/1 \\)

{% assign matA3 = "9,6,0,0,1,4,0,0,2" | split: ',' %}
{% assign matE3 = "1,0,0,0,1,0,0,-2/1,1" | split: ',' %}

\\[ U = A\_\{2\} = {% include render_matrix_raw.html mat = matA3 row = 3 col = 3 %} = E\_\{2\}A\_\{1\} = {% include render_matrix_raw.html mat = matE3 row = 3 col = 3 %}
{% include render_matrix_raw.html mat = matA2 row = 3 col = 3 %}  \\]

- 因此得：\\( U = E\_\{2\}A\_\{1\} = E\_\{2\}E\_\{1\}A\_\{0\} = E\_\{2\}E\_\{1\}E\_\{0\}A \\)

- 再调换下，得到：\\( A = E\_\{0\}\^\{-1\}E\_\{1\}\^\{-1\}E\_\{2\}\^\{-1\}U \\)

- 所以， \\( L = E\_\{0\}\^\{-1\}E\_\{1\}\^\{-1\}E\_\{2\}\^\{-1\} \\)


要得到最终的L，需要算3个\\(E\_\{x\}\\)矩阵的逆矩阵，看似麻烦，其实很简单，因为\\(E\_\{x\}\\)有这样的性质：

{% assign matE = "1,0,0,0,1,0,0,0,1" | split: ',' %}
{% assign matE11 = "1,0,0,a,1,0,0,0,1" | split: ',' %}
{% assign matE12 = "1,0,0,-a,1,0,0,0,1" | split: ',' %}

\\[ {% include render_matrix_raw.html mat = matE11 row = 3 col = 3 %} {% include render_matrix_raw.html mat = matE12 row = 3 col = 3 %} = {% include render_matrix_raw.html mat = matE row = 3 col = 3 %} \\]

{% assign matE21 = "1,0,0,0,1,0,a,0,1" | split: ',' %}
{% assign matE22 = "1,0,0,0,1,0,-a,0,1" | split: ',' %}

\\[ {% include render_matrix_raw.html mat = matE21 row = 3 col = 3 %} {% include render_matrix_raw.html mat = matE22 row = 3 col = 3 %} = {% include render_matrix_raw.html mat = matE row = 3 col = 3 %} \\]

{% assign matE31 = "1,0,0,0,1,0,0,a,1" | split: ',' %}
{% assign matE32 = "1,0,0,0,1,0,0,-a,1" | split: ',' %}

\\[ {% include render_matrix_raw.html mat = matE31 row = 3 col = 3 %} {% include render_matrix_raw.html mat = matE32 row = 3 col = 3 %} = {% include render_matrix_raw.html mat = matE row = 3 col = 3 %} \\]

所以：

{% assign matIE1 = "1,0,0,6/9,1,0,0,0,1" | split: ',' %}
{% assign matIE2 = "1,0,0,0,1,0,3/9,0,1" | split: ',' %}
{% assign matIE3 = "1,0,0,0,1,0,0,2/1,1" | split: ',' %}
\\[ L = E\_\{0\}\^\{-1\}E\_\{1\}\^\{-1\}E\_\{2\}\^\{-1\} = {% include render_matrix_raw.html mat = matIE1 row = 3 col = 3 %} {% include render_matrix_raw.html mat = matIE2 row = 3 col = 3 %} {% include render_matrix_raw.html mat = matIE3 row = 3 col = 3 %} \\]

只要搞定右边的3矩阵乘法运算，就能得到L。而又因为：

{% assign matEX1 = "1,0,0,a\_\{1\},1,0,b\_\{1\},c\_\{1\},1" | split: ',' %}
{% assign matEX2 = "1,0,0,a\_\{2\},1,0,b\_\{2\},c\_\{2\},1" | split: ',' %}
{% assign matEX3 = "1,0,0,a\_\{1\}+a\_\{2\},1,0,b\_\{1\}+a\_\{2\}c\_\{2\}+b\_\{2\},c\_\{1\}+c\_\{2\},1" | split: ',' %}


\\[ {% include render_matrix_raw.html mat = matEX1 row = 3 col = 3 %}{% include render_matrix_raw.html mat = matEX2 row = 3 col = 3 %} = {% include render_matrix_raw.html mat = matEX3 row = 3 col = 3 %}
\\]

所以，L的结果可以迅速得到：
{% assign matIE4 = "1,0,0,6/9,1,0,3/9,2/1,1" | split: ',' %}

\\[ L = E\_\{0\}\^\{-1\}E\_\{1\}\^\{-1\}E\_\{2\}\^\{-1\} = {% include render_matrix_raw.html mat = matIE4 row = 3 col = 3 %}  \\]



## PLU的P

这里的P，指的是Permutation Matrix，置换矩阵。

何谓置换矩阵？其实就是经过一系列初等变换的单位矩阵，且元素\\( a\_\{ij\} = 0 or 1 \\)。

置换矩阵的作用，是用来交换某个矩阵的行（列）顺序。

比如：

{% assign matP = "0,1,0,0,0,1,1,0,0" | split: ',' %}
{% assign matA = "3,4,0,1,2,9,0,5,6" | split: ',' %}

\\[ P = {% include render_matrix_raw.html mat = matP row = 3 col = 3 %}\ \  A = {% include render_matrix_raw.html mat = matA row = 3 col = 3 %} \\]

{% assign matA1 = "1,2,9,0,5,6,3,4,0" | split: ',' %}

\\[ PA = {% include render_matrix_raw.html mat = matP row = 3 col = 3 %} {% include render_matrix_raw.html mat = matA row = 3 col = 3 %} = {% include render_matrix_raw.html mat = matA1 row = 3 col = 3 %} \\]

{% assign matA2 = "0,3,4,9,1,2,6,0,5" | split: ',' %}

\\[ AP = {% include render_matrix_raw.html mat = matA row = 3 col = 3 %} {% include render_matrix_raw.html mat = matP row = 3 col = 3 %}  = {% include render_matrix_raw.html mat = matA2 row = 3 col = 3 %} \\]

从这个例子就可以看出，P左乘A时，改变了A的行的顺序；P右乘A时，改变了A的列的顺序。

https://www.youtube.com/watch?v=wTlAUfv_O4s


已经有人证明了，任何方阵都存在它的PLU分解:[http://arxiv.org/pdf/math/0506382v1.pdf]()。





