---
layout: post_latex
title: <复习向>线性代数之正交矩阵
tags: ['matrix','linear algebra']
published: true
---

## 基础知识

标准正交向量组（Orthonormal vectors）的点积(内积)性质：

\\( q\_\{i\}\^\{T\}q\_\{j\} = 0 \\) **if** \\( i\\neq j \\)

\\( q\_\{i\}\^\{T\}q\_\{j\} = 1 \\) **if** \\( i = j \\)

其中每个正交向量的长度\\(||q\_\{i\}||=1\\)。


标准正交向量组成的矩阵是：

{% assign matA = "q\_\{1\},\\cdots,q\_\{n\}" | split: ',' %}
\\( Q = \\) \\( {% include render_matrix_raw.html mat = matA row = 1 col = 3 %} \\)

注意，列向量的分量数量未知，Q所以不一定是方阵。


{% assign matB = "q\_\{1\}\^\{T\},\\vdots,q\_\{n\}\^\{T\}" | split: ',' %}

\\( Q\^\{T\}Q = {% include render_matrix_raw.html mat = matB row = 3 col = 1 %}{% include render_matrix_raw.html mat = matA row = 1 col = 3 %} = I \\)

当Q是方阵时，显然Q有逆矩阵，且\\( Q\^\{-1\} = Q\^\{T\} \\)。

比如当Q为3阶单位矩阵I的置换矩阵时：


{% assign Q3 = "0,1,0,0,0,1,1,0,0" | split: ',' %}
{% assign Q3T = "0,0,1,1,0,0,0,1,0" | split: ',' %}

\\( Q\^\{T\}Q = {% include render_matrix_raw.html mat = Q3 row = 3 col = 3 %}{% include render_matrix_raw.html mat = Q3T row = 3 col = 3 %} = I \\)

或者三角函数作为元素的二阶Q：


{% assign Q2 = "cos\\theta,-sin\\theta,sin\\theta,cos\\theta" | split: ',' %}
{% assign Q2T = "cos\\theta,sin\\theta,-sin\\theta,cos\\theta" | split: ',' %}

\\( Q\^\{T\}Q = {% include render_matrix_raw.html mat = Q2 row = 2 col = 2 %} {% include  render_matrix_raw.html mat = Q2T row = 2 col = 2 %} = I \\)


## 定义

- 如果实数域上的方阵A满足 \\( A\^\{T\}A = I \\)，则称A为正交矩阵

- 当A的列向量的长度都为1时，称A为标准正交矩阵Q。


## 定理

- 当\\(A\^\{-1\} = A\^\{T\}\\)成立时A是正交矩阵
- A的列(或行)向量组是\\(R\^\{n\}\\)的一组标准正交基时，A是正交矩阵
- 正交矩阵A的行列式为1或-1
- 如果A是正交矩阵，则\\(A\^\{-1\},A\^\{T\},A\^\{*\}\\)都是正交矩阵
- 如果A、B都是正交矩阵，那么AB也是正交矩阵

## 正交矩阵怎么用？

在上一篇文章中，讲到了投影矩阵的各种公式，其中有一条是：

\\[ A\^\{T\}A\\hat\{x\} = A\^\{T\}b \\]

这个戴着帽子的x是未知量，要求它的值，就需要再变换下：

\\[ \\hat\{x\} = (A\^\{T\}A)\^\{-1\}A\^\{T\}b \\]


那么问题来了：右边的式子有点复杂，又要算矩阵乘法又要算逆矩阵，是不是可以简化呢？

答案是可以，且要用到正交矩阵。因为A是由一组线性无关的列向量组成，当把这组向量转换为标准正交向量组时，就得到了标准正交矩阵Q。拿Q代入上面的式子，得到：

\\[ Q\^\{T\}Q\\hat\{x\} = Q\^\{T\}b \\]

再根据上述的Q的公式，干掉左边的2个Q，得到：

\\[ \\hat\{x\} = Q\^\{T\}b \\]

瞬间豁然开朗。


但是还有一个问题，怎么从A得到Q呢？

### 矩阵的正交化算法

因为从A可以得到Q，所以必然某个矩阵R，使得 A = QR 成立。






