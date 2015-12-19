---
layout: post_latex
title: 线性代数之逆矩阵
tags: ['matrix','linear algebra']
published: true
---


逆矩阵是一个很基本的概念，这里就不说定义了。本文只介绍求解方法。

## 初等变换求逆法——高斯消元法(Gauss-Jordan elimination)

先在要求解逆矩阵的A的右边增加一个临时的单位矩阵（阶数显然和A一致）。那么A就变成了一个n行、2n列的矩阵A'。
然后对A'进行高斯消元，也就是通过row operation不断对A'做变换，直到A'的左边的A变成单位矩阵时，A'的右边部分就是A的逆矩阵了。
要注意的是，A不一定有逆矩阵，当A没有逆矩阵时，这个高斯消元过程中肯定会出现A的某row全是0的情况。

<!--more-->

举例说明：

设A：


{% assign matA = "1,2,3,2,5,3,1,0,8" | split: ',' %}

\\[ A = {% include render_matrix_raw.html mat = matA row = 3 col = 3 %} \\]

扩展A，在A的右边增加(Adjoin)一个单位矩阵：

{% assign matA2 = "1,2,3,1,0,0,2,5,3,0,1,0,1,0,8,0,0,1" | split: ',' %}

\\[ A' = {% include render_matrix_raw.html mat = matA2 row = 3 col = 6 %} \\]

开始变换：

{% assign matA3 = "1,2,3,1,0,0,2-2*1,5-2*2,3-2*3,0-2*1,1-2*0,0-2*0,1-1,0-2,8-3,0-1,0-0,1-0" | split: ',' %}

\\( {% include render_matrix_raw.html mat = matA2 row = 3 col = 6 %} \\xrightarrow\{ R\_\{2\}=R\_\{2\}-2R\_\{1\}, R\_\{3\}=R\_\{3\}-R\_\{1\} \}  {% include render_matrix_raw.html mat = matA3 row = 3 col = 6 %}\\)

{% assign matA4 = "1,2,3,1,0,0,0,1,-3,-2,1,0,0,-2,5,-1,0,1" | split: ',' %}
{% assign matA5 = "1,2,3,1,0,0,0,1,-3,-2,1,0,0+2*0,-2+2*1,5+2*(-3),-1+2*(-2),0+2*1,1+2*0" | split: ',' %}


\\( {% include render_matrix_raw.html mat = matA4 row = 3 col = 6 %} \\xrightarrow\{ R\_\{3\}=R\_\{3\}+2R\_\{2\} \}  {% include render_matrix_raw.html mat = matA5 row = 3 col = 6 %}\\)


{% assign matA6 = "1,2,3,1,0,0,0,1,-3,-2,1,0,0,-0,-1,-5,2,1" | split: ',' %}
{% assign matA7 = "1,2,3,1,0,0,0,1,-3,-2,1,0,0,0,1,5,-2,-1" | split: ',' %}


\\( {% include render_matrix_raw.html mat = matA6 row = 3 col = 6 %} \\xrightarrow\{ R\_\{3\}=-R\_\{3\} \}  {% include render_matrix_raw.html mat = matA7 row = 3 col = 6 %}\\)

{% assign matA8 = "1,2,0,-14,6,3,0,1,0,13,-5,-3,0,0,1,5,-2,-1" | split: ',' %}


\\( {% include render_matrix_raw.html mat = matA7 row = 3 col = 6 %} \\xrightarrow\{ R\_\{1\}=R\_\{1\}-3R\_\{3\},R\_\{2\}=R\_\{2\}+3R\_\{3\} \}  {% include render_matrix_raw.html mat = matA8 row = 3 col = 6 %}\\)

{% assign matA9 = "1,0,0,-40,16,9,0,1,0,13,-5,-3,0,0,1,5,-2,-1" | split: ',' %}


\\( {% include render_matrix_raw.html mat = matA8 row = 3 col = 6 %} \\xrightarrow\{ R\_\{1\}=R\_\{1\}-2R\_\{2\} \}  {% include render_matrix_raw.html mat = matA9 row = 3 col = 6 %}\\)


所以A的逆矩阵为：

{% assign matAInv = "-40,16,9,13,-5,-3,5,-2,-1" | split: ',' %}

\\[  A\^\{-1\} = {% include render_matrix_raw.html mat = matAInv row = 3 col = 3 %} \\]


## 伴随矩阵求逆法

先回顾下2个定理：

1.n阶行列式\\(D=det(a\_\{ij\}) \\)等于它的任一行(列)的各元素与其代数余子式乘积之和，即：

\\[ D = a\_\{i1\}A\_\{i1\}+a\_\{i2\}A\_\{i2\}+\\cdots + a\_\{in\}A\_\{in\} , i = 1,2,\\cdots ,n \\]
\\[ D = a\_\{1j\}A\_\{1j\}+a\_\{2j\}A\_\{2j\}+\\cdots + a\_\{nj\}A\_\{nj\} , j = 1,2,\\cdots ,n \\]

2.n阶行列式\\(D=det(a\_\{ij\}) \\)的某一行(列)的元素与另一行(列)对应元素的代数余子式乘积之和等于零，即：

\\[ D = a\_\{i1\}A\_\{s1\}+a\_\{i2\}A\_\{s2\}+\\cdots + a\_\{in\}A\_\{sn\} , i \\neq s \\]
\\[ D = a\_\{1j\}A\_\{1t\}+a\_\{2j\}A\_\{2t\}+\\cdots + a\_\{nj\}A\_\{nt\} , j \\neq t \\]

以及伴随矩阵的定义：

设\\(A=(a\_\{ij\})\_\{nXm\}\\)，\\(A\_\{ij\}\\)是A的行列式\\( |A|=det(a\_\{ij\}) \\)的元素\\( a\_\{ij\} \\)的代数余子式\\( (i,j=1,2,\\cdots,n)\\), 则有：

{% assign AA = "A\_\{11\},A\_\{12\},\\ldots,A\_\{1n\},A\_\{21\},A\_\{22\},\\ldots,A\_\{2n\},\\vdots \ \ \ \ ,\\vdots \ \ \ \ ,\\vdots \ \ \ \ ,\\vdots \ \ \ \ ,A\_\{n1\},A\_\{n2\},\\ldots ,A\_\{nn\}" | split: ',' %}

\\[ (adj(A)) \^\{T\} = {% include render_matrix_raw.html mat = AA row = 4 col = 4 %}  \\]

{% assign AA2 = "A\_\{11\},A\_\{21\},\\ldots,A\_\{n1\},A\_\{12\},A\_\{22\},\\ldots ,A\_\{n2\},\\vdots \ \ \ \ ,\\vdots  \ \ \ \ ,\\vdots \ \ \ \ ,\\vdots \ \ \ \ ,A\_\{1n\},A\_\{2n\},\\ldots ,A\_\{nn\}" | split: ',' %}

\\[ adj(A) = {% include render_matrix_raw.html mat = AA2 row = 4 col = 4 %}  \\]

adj(A)称为伴随矩阵。

利用上面2条定理，计算\\(Aadj(A)\\):


{% assign aa = "a\_\{11\},a\_\{12\},\\ldots,a\_\{1n\},a\_\{21\},a\_\{22\},\\ldots,a\_\{2n\},\\vdots \ \ \ \ ,\\vdots \ \ \ \ ,\\vdots \ \ \ \ ,\\vdots \ \ \ \ ,a\_\{n1\},a\_\{n2\},\\ldots ,a\_\{nn\}" | split: ',' %}


\\[ Aadj(A) = {% include render_matrix_raw.html mat = aa row = 4 col = 4 %}{% include render_matrix_raw.html mat = AA2 row = 4 col = 4 %}\\]

{% assign AE = "|A|,0,\\ldots,0,0,|A|,\\ldots,0,\\vdots \ \ \ \ ,\\vdots \ \ \ \ ,\\vdots \ \ \ \ ,\\vdots \ \ \ \ ,0,0,\\ldots ,|A|" | split: ',' %}

\\[  = {% include render_matrix_raw.html mat = AE row = 4 col = 4 %}  = |A|E \\]

即:
\\[ Aadj(A)  = |A|E \\]

从而有：

\\[ A\^\{-1\}  = \\frac \{1\}\{|A|\}adj(A) \\]


因为用这条公式求逆矩阵要计算adj(A)和|A|，这个计算太慢了。所以可以认为这个解法对阶数<=3的矩阵才实用。

现在用伴随矩阵求逆法来求第一节中的A的逆矩阵：


{% assign matA = "1,2,3,2,5,3,1,0,8" | split: ',' %}

\\[ A = {% include render_matrix_raw.html mat = matA row = 3 col = 3 %} \\]

{% assign detA11 = "5,3,0,8" | split: ',' %}
\\( A\_\{11\} = (-1)\^\{1+1\}{% include render_det_raw.html mat = detA11 row = 2 col = 2 %} = 40 \\)

{% assign detA12 = "2,3,1,8" | split: ',' %}
\\( A\_\{12\} = (-1)\^\{1+2\}{% include render_det_raw.html mat = detA12 row = 2 col = 2 %} = -13\\)

{% assign detA13 = "2,5,1,0" | split: ',' %}
\\( A\_\{13\} = (-1)\^\{1+3\}{% include render_det_raw.html mat = detA13 row = 2 col = 2 %} = -5 \\)

{% assign detA21 = "2,3,0,8" | split: ',' %}
\\( A\_\{21\} = (-1)\^\{2+1\}{% include render_det_raw.html mat = detA21 row = 2 col = 2 %} = -16 \\)

{% assign detA22 = "1,3,1,8" | split: ',' %}
\\( A\_\{22\} = (-1)\^\{2+2\}{% include render_det_raw.html mat = detA22 row = 2 col = 2 %} = 5  \\)

{% assign detA23 = "1,2,1,0" | split: ',' %}
\\( A\_\{23\} = (-1)\^\{2+3\}{% include render_det_raw.html mat = detA23 row = 2 col = 2 %} = 2  \\)

{% assign detA31 = "2,3,5,3" | split: ',' %}
\\( A\_\{31\} = (-1)\^\{3+1\}{% include render_det_raw.html mat = detA31 row = 2 col = 2 %} = -9  \\)

{% assign detA32 = "1,3,2,3" | split: ',' %}
\\( A\_\{32\} = (-1)\^\{3+2\}{% include render_det_raw.html mat = detA32 row = 2 col = 2 %} = 3  \\)

{% assign detA33 = "1,2,2,5" | split: ',' %}
\\( A\_\{33\} = (-1)\^\{3+3\}{% include render_det_raw.html mat = detA33 row = 2 col = 2 %} = 1  \\)

于是:

{% assign AStar1 = "A\_\{11\},A\_\{21\},A\_\{31\},A\_\{12\},A\_\{22\},A\_\{32\},A\_\{13\},A\_\{23\},A\_\{33\}" | split: ',' %}
{% assign AStar = "40,-16,-9,-13,5,3,-5,2,1" | split: ',' %}

\\[ adj(A) = {% include render_matrix_raw.html mat = AStar1 row = 3 col = 3 %} = {% include render_matrix_raw.html mat = AStar row = 3 col = 3 %} \\]

\\[ |A| =  a\_\{31\}A\_\{31\} + a\_\{32\}A\_\{32\} + a\_\{33\}A\_\{33\} = 1*(-9) + 0*3 + 8*1 = -1 \\]

{% assign AInv = "-40,16,9,13,-5,-3,5,-2,-1" | split: ',' %}

\\[ A\^\{-1\}  = \\frac \{1\}\{|A|\}adj(A) = {% include render_matrix_raw.html mat = AInv row = 3 col = 3 %}   \\]

## 参考资料

[Inverse of a matrix by Gauss-Jordan elimination](http://www.mathportal.org/linear-algebra/matrices/gauss-jordan.php)
[Determinant and Inverse of Matrices](http://www.sosmath.com/matrix/inverse/inverse.html)