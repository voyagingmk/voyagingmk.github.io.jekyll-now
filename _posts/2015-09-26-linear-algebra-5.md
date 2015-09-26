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




