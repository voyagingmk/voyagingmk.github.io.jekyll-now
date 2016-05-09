---
layout: post_latex
title: 矩阵微分
tags: ['matrix','matrix calculus']
published: true
---


# 基本认识

## 3种标准导数(梯度)公式

1) 自变量是一个数值量(Scalar)时：

\\[ Df(x) = \\lim \_\{t\\to 0\} \\frac \{f(x+t)-f(t)\}\{t\} \\]



2) 自变量是一个向量(Vector)时：

\\[ D\_\{\\textbf \{w\}\}f(\\textbf \{x\}) = \\lim \_\{t\\to 0\} \\frac \{f(\\textbf \{x\} + t\\textbf \{w\}) - f(t)\}\{t\} \\]

(w的维数和x一致)

这个导数的含义是，在n维空间中f(x)所定义的(超)平面上的某个坐标点x相对于w的斜率。

3) 自变量是一个矩阵(Matrix)时：

\\[ D\_\{\\textbf \{W\}\}f(\\textbf \{X\}) = \\lim \_\{t\\to 0\} \\frac \{f(\\textbf \{X\}+t\\textbf \{W\})-f(\\textbf \{X\})\}\{t\} \\]

含义和2)类似。（已经无法想象了）


## 矩阵迹(trace)的各种性质

### 性质1

### 性质2


### 性质3

设有矩阵H、U，H和U都是n x m的矩阵，则有：

\\[ \\sum \_\{j=1\}\^\{m\} \\sum \_\{i=1\}\^\{n\}(h\_\{ij\}u\_\{ij\}) = \\sum \_\{j=1\}\^\{m\} \\sum \_\{i=1\}\^\{n\}((h\^\{T\})\_\{ji\}u\_\{ij\}) = tr(H\^\{T\}U) \\]


# 各种性质


设有关于矩阵A的一个函数f，记为\\( f(A) \\)，\\( f(A) \\)关于A的导数为：

\\[  \\nabla \_\{A\}f(A) = \\frac \{ \\partial f(A) \}\{ \\partial A \} \\]

{% assign D =  "\\frac \{\\partial f \}\{\\partial A\_\{11\}\},\\frac \{\\partial f \}\{\\partial A\_\{12\}\},\\cdots ,\\frac \{\\partial f \}\{\\partial A\_\{1n\}\},\\frac \{\\partial f \}\{\\partial A\_\{21\}\},\\frac \{\\partial f \}\{\\partial A\_\{22\}\},\\cdots ,\\frac \{\\partial f \}\{\\partial A\_\{2n\}\},\\vdots ,\\vdots ,\\ddots ,\\vdots ,\\frac \{\\partial f \}\{\\partial A\_\{m1\}\},\\frac \{\\partial f \}\{\\partial A\_\{m2\}\},\\cdots ,\\frac \{\\partial f \}\{\\partial A\_\{mn\}\}" | split: ',' %}

\\[  = {% include render_matrix_raw.html mat = D row = 4 col = 4 %} \\]


## 重要性质1

\\[ \\nabla \_\{ A\^\{T\} \}f(A) = (\\nabla \_\{A\}f(A))\^\{T\} \\]

证明：

\\[ \\nabla \_\{ A\^\{T\} \}f(A) = \\]

{% assign D2 =  "\\frac \{\\partial f \}\{\\partial A\_\{11\}\},\\frac \{\\partial f \}\{\\partial A\_\{21\}\},\\cdots ,\\frac \{\\partial f \}\{\\partial A\_\{m1\}\},\\frac \{\\partial f \}\{\\partial A\_\{12\}\},\\frac \{\\partial f \}\{\\partial A\_\{22\}\},\\cdots ,\\frac \{\\partial f \}\{\\partial A\_\{m2\}\},\\vdots ,\\vdots ,\\ddots ,\\vdots ,\\frac \{\\partial f \}\{\\partial A\_\{1n\}\},\\frac \{\\partial f \}\{\\partial A\_\{2n\}\},\\cdots ,\\frac \{\\partial f \}\{\\partial A\_\{mn\}\}" | split: ',' %}

\\[  = {% include render_matrix_raw.html mat = D2 row = 4 col = 4 %} \\]

\\[  = {% include render_matrix_raw.html mat = D row = 4 col = 4 %}\^\{T\} \\]

\\[  = (\\frac \{ \\partial f(A) \}\{ \\partial A \})\^\{T\}  = (\\nabla \_\{A\}f(A))\^\{T\} \\]


### 重要性质2

假设存在矩阵U，使得下面的等式成立：

\\[ D\_\{\\textbf \{W\}\}f(\\textbf \{X\}) = \\lim \_\{t\\to 0\} \\frac \{f(\\textbf \{X\}+t\\textbf \{W\})-f(\\textbf \{X\})\}\{t\} = tr(W\^\{T\}U) \\]

那么，对\\( \\textbf \{W\} \\)中任意一个\\(W\_\{ij\} \\)求导，则有：

\\[ D\_\{W\_\{ij\}\}f(\\textbf \{X\}) = tr(W\_\{ij\}\^\{T\}U) = \\sum \_\{j=1\}\^\{\} \\sum \_\{i=1\}\^\{\}(w\_\{ij\}u\_\{ij\}) = u\_\{ij\}  \\]

这个结果可能有点费解。首先要明白\\( W\_\{ij\} \\)是W矩阵的一个元素，是一个值(Scalar)，那么就可以确定这个导数也是一个值(Scalar)；对W矩阵的局部单个元素求导，其实按偏导数的概念理解即可，既然是偏导数，这就意味着除了存在\\( w\_\{ij\} \\)的那一项之外的其他元素都被当做常数，而对常数求导必然等于0，所以最后会得到唯一的\\( u\_\{ij\}\\)。

既然已经知道，对局部的\\( W\_\{ij\} \\)求导会得到\\( U\_\{ij\}\\)，那么把这个求导过程扩展到整个W矩阵的话，求导结果当然就是一个U矩阵了，又因为W是任意矩阵，所以f(X)关于X的导数等于U：

\\[  \\frac \{ \\nabla f(\\textbf \{X\}) \}\{ \\nabla X \} = \\textbf \{U\} \\]


这个式子的意义在于，当需要求一个自变量是矩阵X的函数关于X的导数时，可以把问题立即转变成求U，而U的求解，可以通过上面的标准导数公式来求。小结一下步骤：

1. 计算\\( \\lim \_\{t\\to 0\} \\frac \{f(\\textbf \{X\}+t\\textbf \{W\})-f(\\textbf \{X\})\}\{t\} \\)，并化简，直到得到一个形如\\(tr(Y\^\{T\}U\_\{?\} \\)的式子

2. 根据\\( \\frac \{ \\nabla f(\\textbf \{X\}) \}\{ \\nabla X \} = \\textbf \{U\} \\)，可以知道\\(tr(Y\^\{T\}Q \\) = \\(tr(Y\^\{T\}U \\)， 于是就得到了\\( U = Q \\) 。




## 重要性质3

\\[ \\nabla \_\{ A\}tr(A) = tr(\\nabla \_\{ A\}A) \\]

待续

## 重要性质4

\\[ \\frac \{ \\partial tr(AX) \}\{ \\partial X \} = A\^\{T\} \\]

证明：



设：

\\[ f(X) = \\nabla \_\{ A\}Tr(AXBX\^\{T\}C) \\]


则：

## 重要性质4

\\[ \\nabla \_\{ A\}Tr(AXBX\^\{T\}C) = CAXB + A\^\{T\}C\^\{T\}XB\^\{T\} \\]
