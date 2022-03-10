---
layout: post_latex
title: 线性代数之PLU分解
tags: ['matrix','linear algebra']
published: true
---

#行列式的求解

从行列式的定义出发去求行列式，是一个简单但低效的方法。而实际上，解决数学问题的途径往往有多种。这里，我将介绍其中一种比较常见的快速解法：**PLU分解**。

## PLU的LU

要理解PLU，得先搞懂LU分解。（这里分享一个外教的讲解视频，简单好理解：[https://www.youtube.com/watch?v=UlWcofkUDDU](https://www.youtube.com/watch?v=UlWcofkUDDU) 能翻墙的同学就直接看吧。)

LU分别代表：Lower Triangular Matrix 和 Upper Triangular Matrix，即下三角矩阵和上三角矩阵。

下面手动演示下LU分解过程：

<!--more-->

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

于是，A的LU分解完成了：

\\[ A = LU = {% include render_matrix_raw.html mat = matIE4 row = 3 col = 3 %} {% include render_matrix_raw.html mat = matA3 row = 3 col = 3 %}  \\]


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


## PA = LU？

为什么要先对A做P置换后，再做LU分解？这是因为不这样做的话，LU会不稳定(stability)。

举个例子：

{% assign mat22 = "10\^\{-20\},1,1,1" | split: ',' %}
{% assign mat22L = "1,0,10\^\{20\},1" | split: ',' %}
{% assign mat22U = "10\^\{-20\},1,0,1-10\^\{20\}" | split: ',' %}

\\[ A = {% include render_matrix_raw.html mat = mat22 row = 2 col = 2 %}  = {% include render_matrix_raw.html mat = mat22L row = 2 col = 2 %}{% include render_matrix_raw.html mat = mat22U row = 2 col = 2 %} = L\_\{0\}U\_\{0\} \\]

直接分解后得到的L、U矩阵，出现了**大数**。所以这是不能接受的。

而神奇的是，对A做一些P置换后，再来LU分解，是可以变稳定的：
{% assign matP = "0,1,1,0" | split: ',' %}
{% assign mat22N = "1,1,10\^\{-20\},1" | split: ',' %}
{% assign mat22L = "1,0,10\^\{-20\},1" | split: ',' %}
{% assign mat22U = "1,1,0,1-10\^\{-20\}" | split: ',' %}

\\[ PA = {% include render_matrix_raw.html mat = matP row = 2 col = 2 %}{% include render_matrix_raw.html mat = mat22 row = 2 col = 2 %} = {% include render_matrix_raw.html mat = mat22N row = 2 col = 2 %}  = {% include render_matrix_raw.html mat = mat22L row = 2 col = 2 %}{% include render_matrix_raw.html mat = mat22U row = 2 col = 2 %} = L\_\{1\}U\_\{1\} \\]

L、U中没有出现大数，于是认为这样的分解是稳定的。

PA的P，需要对A做一些检测后才可以得到，策略就是：**沿着对角线从左上角到右下角遍历A，并检测当前列的最大元素在下方的哪一行（当前行上方的行保持不变），找到后就将当前行和目标行交换，并记录下一个\\(P\_\{i\}\\)。最后按顺序算\\(P\_\{i\}\\)的乘积就得到了P。**

## A的行列式

在[线性代数之矩阵与行列式(1)](http://yiqizhumeng.com:4000/linear-algebra/)中，已经提到了一条行列式公式：

\\[ det(AB) = det(A)det(B) \\]

而，\\( PA = LU \\)又可以变成 \\( A = P\^\{-1\}LU \\)，所以：

\\[ det(A) = det(P\^\{-1\}LU) = det(P\^\{-1\})det(L)det(U) \\]

可以进一步将这个式子简化：

- L、U矩阵分别是下三角矩阵和上三角矩阵，它们的行列式等于对角线上元素的乘积
- L矩阵对角线上的元素都为1

于是有：

\\[ det(A) = det(P\^\{-1\})u\_\{11\}u\_\{22\}\\cdots u\_\{nn\} \\]

因为： \\( PP\^\{-1\} = PP\^\{T\} =  1 \\)，\\( det(P\^\{T\}) = det(P) \\)，所以问题变成了求det(P)。

P怎么求？首先，P相当于多个\\(E\_i\\)矩阵的乘积，而又有\\( det(E\_i)=\-1 \\)  (行列式的基本性质：交换行列式的两行，行列式变号），所以有：

\\[ P = E\_t\cdots E\_2E\_1 \implies \det(P) = \\prod\^t\_\{i=1\}\det(E\_i)=(-1)\^t \\]


于是：

\\[ det(A) = det(P\^\{-1\}LU) = det(P)u\_\{11\}u\_\{22\}\\cdots u\_\{nn\} = (-1)\^\{t\}u\_\{11\}u\_\{22\}\\cdots u\_\{nn\} \\]

## 总结

矩阵的分解(factorization)有很多种，PA=LU只是其中一种，但此类分解法都离不开**高斯消元**这把大杀器。理解好高斯消元是关键。

P.S. 已经有人证明了，任何方阵都存在它的PLU分解:[http://arxiv.org/pdf/math/0506382v1.pdf]()。





