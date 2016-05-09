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

设有矩阵U、H，U和H都是n x m的矩阵，则有：

\\[ \\sum \_\{j=1\}\^\{m\} \\sum _\{i=1\}\^\{n\}(u\_\{ij\}h\_\{ij\}) = \\sum \_\{j=1\}\^\\{m\} \\sum _\{i=1\}\^\\{n\}((u\^\{T\})\_\{ji\}h\_\{ij\}) = tr(U\^\{T\}H) \\]


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

## 重要性质2

\\[ \\nabla \_\{ A\}tr(A) = tr(\\nabla \_\{ A\}A) \\]

待续

## 重要性质3

\\[ \\frac \{ \\partial tr(AX) \}\{ \\partial X \} = A\^\{T\} \\]

证明：



设：

\\[ f(X) = \\nabla \_\{ A\}Tr(AXBX\^\{T\}C) \\]


则：

## 重要性质4

\\[ \\nabla \_\{ A\}Tr(AXBX\^\{T\}C) = CAXB + A\^\{T\}C\^\{T\}XB\^\{T\} \\]
