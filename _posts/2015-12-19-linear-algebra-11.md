---
layout: post_latex
title: 线性代数之Cholesky分解
tags: ['matrix','linear algebra']
published: true
---

又到了矩阵分解时间。这次介绍的是**Cholesky分解**。这个方法只适用于符合厄米特矩阵、正定矩阵定义的矩阵。

## 算法原理

设A是一个n阶厄米特正定矩阵(Hermitian positive-definite matrix)。


Cholesky分解的目标是把A变成:

\\[ A = LL\^\{T\} \\]

L是下三角矩阵。

<!--more-->

## 推导过程

因为A是对称的矩阵，所以设A为：

{% assign matA = "a\_\{11\},A\_\{21\}\^\{T\},A\_\{21\},A\_\{22\}" | split: ',' %}

\\[ A = {% include render_matrix_raw.html mat = matA row = 2 col = 2 %} \\]

(注意：细心观察此式子可以发现\\(A\_\{21\}\\)是一个列向量，\\(A\_\{22\}\\)是一个n-1阶的方阵)

设L：

{% assign matL = "l\_\{11\},0,L\_\{21\},L\_\{22\}" | split: ',' %}

\\[ L = {% include render_matrix_raw.html mat = matL row = 2 col = 2 %} \\]

则有:

{% assign matL2 = "l\_\{11\},L\_\{21\}\^\{T\},0,L\_\{22\}\^\{T\}" | split: ',' %}

\\[ L\^\{T\} = {% include render_matrix_raw.html mat = matL2 row = 2 col = 2 %} \\]


设\\( A = LL\^\{T\} \\)，得到：

\\[ {% include render_matrix_raw.html mat = matA row = 2 col = 2 %} = {% include render_matrix_raw.html mat = matL row = 2 col = 2 %}{% include render_matrix_raw.html mat = matL2 row = 2 col = 2 %} \\]

{% assign matL3 = "l\_\{11\}\^\{2\},l\_\{11\}L\_\{21\}\^\{T\},l\_\{11\}L\_\{21\},L\_\{21\}L\_\{21\}\^\{T\}+L\_\{22\}L\_\{22\}\^\{T\}" | split: ',' %}

\\[ = {% include render_matrix_raw.html mat = matL3 row = 2 col = 2 %} \\]


其中，未知量是\\( l\_\{11\},L\_\{21\},L\_\{22\} \\)，这3个未知量的求解公式是：

\\[ l\_\{11\} = \\sqrt \{a\_\{11\}\} \\]

\\[ L\_\{21\} = \\frac \{1\}\{l\_\{11\}\}A\_\{21\} \\]

\\[ L\_\{22\}L\_\{22\}\^\{T\} =  A\_\{22\} - L\_\{21\}L\_\{21\}\^\{T\} \\]

显然，\\( l\_\{11\},L\_\{21\} \\)是易求的，而\\( L\_\{22\} \\)的求解救有意思了。

观察可以发现，\\( A\_\{22\} - L\_\{21\}L\_\{21\}\^\{T\} \\)也很好求，\\( A\_\{22\} \\)已知，\\( L\_\{21\}L\_\{21\}\^\{T\} \\)是一个对角线矩阵，对角线上的元素只是一个平方，好求。

那么设\\(A\_\{22\}' = A\_\{22\} - L\_\{21\}L\_\{21\}\^\{T\} \\)，则剩下的问题就是求:

\\[ A\_\{22\}' = L\_\{22\}L\_\{22\}\^\{T\} \\]

啊，这不也是Cholesky分解！被分解的矩阵是A的右下角的n-1阶子方阵！

所以这个算法具有递归性质。

附上一个实例：

设:

{% assign matA = "25,15,-5,15,18,0,-5,0,11" | split: ',' %}

{% assign matL1 = "l\_\{11\},0,0,l\_\{21\},l\_\{22\},0,l\_\{31\},l\_\{32\},l\_\{33\}" | split: ',' %}
{% assign matL2 = "l\_\{11\},l\_\{21\},l\_\{31\},0,l\_\{22\},l\_\{32\},0,0,l\_\{33\}" | split: ',' %}

\\[ A = {% include render_matrix_raw.html mat = matA row = 3 col = 3 %} = {% include render_matrix_raw.html mat = matL1 row = 3 col = 3 %}{% include render_matrix_raw.html mat = matL2 row = 3 col = 3 %} \\]

根据上文的公式，有：

{% assign matA21 = "15,-5" | split: ',' %}
{% assign matA21_ = "3,-1" | split: ',' %}

\\[ l\_\{11\} = \\sqrt \{ a\_\{11\} \} = 5 \\]
\\[ L\_\{21\} = \\frac \{1\}\{l\_\{11\}\}A\_\{21\} = \\frac \{1\}\{5\}{% include render_matrix_raw.html mat = matA21 row = 2 col = 1 %} = {% include render_matrix_raw.html mat = matA21_ row = 2 col = 1 %} \\]

\\[ A\_\{22\} - L\_\{21\}L\_\{21\}\^\{T\}  =  L\_\{22\}L\_\{22\}\^\{T\} \\]

{% assign matA22 = "18,0,0,11" | split: ',' %}
{% assign matL22 = "l\_\{22\},0,l\_\{32\},l\_\{33\}" | split: ',' %}
{% assign matL22_ = "l\_\{22\},l\_\{32\},0,l\_\{33\}" | split: ',' %}

\\[ A\_\{22\} - L\_\{21\}L\_\{21\}\^\{T\}  =  L\_\{22\}L\_\{22\}\^\{T\} \\]

\\[ {% include render_matrix_raw.html mat = matA22 row = 2 col = 2 %} - {% include render_matrix_raw.html mat = matA21_  row = 2 col = 1 %}{% include render_matrix_raw.html mat = matA21_ row = 1 col = 2 %} =  {% include render_matrix_raw.html mat = matL22 row = 2 col = 2 %}  {% include render_matrix_raw.html mat = matL22_ row = 2 col = 2 %} \\]

{% assign matB22 = "9,3,3,10" | split: ',' %}
\\[ {% include render_matrix_raw.html mat = matB22 row = 2 col = 2 %} = {% include render_matrix_raw.html mat = matL22 row = 2 col = 2 %}  {% include render_matrix_raw.html mat = matL22_ row = 2 col = 2 %} \\]

(注意，这里已经是n-1阶的Cholesky分解)

\\[ l\_\{22\} = \\sqrt \{ 9 \} = 3 \\]
\\[ l\_\{32\} = \\frac \{1\}\{3\}3 = 1 \\]
\\[ 10 = l\_\{32\}\^\{2\} + l\_\{33\}\^\{2\} = 1 + l\_\{33\}\^\{2\} \\]
\\[ l\_\{33\} = \\sqrt \{10 - 1\} = 3 \\]

综上：

{% assign matL1 = "5,0,0,3,3,0,-1,1,3" | split: ',' %}
{% assign matL2 = "5,3,-1,0,3,1,0,0,3" | split: ',' %}

\\[ A = {% include render_matrix_raw.html mat = matA row = 3 col = 3 %} = {% include render_matrix_raw.html mat = matL1 row = 3 col = 3 %}{% include render_matrix_raw.html mat = matL2 row = 3 col = 3 %} \\]

## 参考资料