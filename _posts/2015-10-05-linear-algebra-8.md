---
layout: post_latex
title: 线性代数之TRS分解
tags: ['matrix','linear algebra']
published: true
---


### pbrt的TRS分解

设矩阵A，假设A可以分解成T、R、S，则有A=TRS，设A:

{% assign A = "A\_\{11\},A\_\{12\},A\_\{13\},A\_\{14\},A\_\{21\},A\_\{22\},A\_\{23\},A\_\{24\},A\_\{31\},A\_\{32\},A\_\{33\},A\_\{34\},A\_\{41\},A\_\{42\},A\_\{43\},A\_\{44\}" | split: ',' %}
\\[ A = {% include render_matrix_raw.html mat = A row = 4 col = 4 %}  \\]

再设T、R、S分别为：
{% assign T = "1,0,0,t\_\{x\},0,1,0,t\_\{y\},0,0,1,t\_\{z\},0,0,0,1" | split: ',' %}
\\[ T = {% include render_matrix_raw.html mat = T row = 4 col = 4 %}  \\]

{% assign R = "r\_\{11\},r\_\{12\},r\_\{13\},0,r\_\{21\},r\_\{22\},r\_\{23\},0,r\_\{31\},r\_\{32\},r\_\{33\},0,0,0,0,1" | split: ',' %}
\\[ R = {% include render_matrix_raw.html mat = R row = 4 col = 4 %}  \\]


{% assign S = "s\_\{x\},0,0,0,0,s\_\{y\},0,0,0,0,t\_\{y\},0,0,0,0,1" | split: ',' %}
\\[ S = {% include render_matrix_raw.html mat = S row = 4 col = 4 %}  \\]


所以TRS等于：
{% assign RS = "r\_\{11\}s\_\{x\},r\_\{12\}s\_\{y\},r\_\{13\}s\_\{z\},0,r\_\{21\}s\_\{x\},r\_\{22\}s\_\{y\},r\_\{23\}s\_\{z\},0,r\_\{31\}s\_\{x\},r\_\{32\}s\_\{y\},r\_\{33\}s\_\{z\},0,0,0,0,1" | split: ',' %}

{% assign TRS = "r\_\{11\}s\_\{x\},r\_\{12\}s\_\{y\},r\_\{13\}s\_\{z\},t\_\{x\},r\_\{21\}s\_\{x\},r\_\{22\}s\_\{y\},r\_\{23\}s\_\{z\},t\_\{y\},r\_\{31\}s\_\{x\},r\_\{32\}s\_\{y\},r\_\{33\}s\_\{z\},t\_\{z\},0,0,0,1" | split: ',' %}

\\[ A = TRS = {% include render_matrix_raw.html mat = T row = 4 col = 4 %}{% include render_matrix_raw.html mat = R row = 4 col = 4 %}{% include render_matrix_raw.html mat = S row = 4 col = 4 %}\\]
\\[ = {% include render_matrix_raw.html mat = T row = 4 col = 4 %}{% include render_matrix_raw.html mat = RS row = 4 col = 4 %}\\]
\\[  = {% include render_matrix_raw.html mat = TRS row = 4 col = 4 %} \\]

从TRS矩阵可以看出：

- A矩阵的最后一行为[0,0,0,1]
- A的最后一列是T的最后一列

所以T是最好求的：
{% assign T = "1,0,0,A\_\{14\},0,1,0,A\_\{24\},0,0,1,A\_\{34\},0,0,0,1" | split: ',' %}
\\[ T = {% include render_matrix_raw.html mat = T row = 4 col = 4 %}  \\]

同时，我们也可以快速知道RS矩阵：
{% assign RS = "A\_\{11\},A\_\{12\},A\_\{13\},0,A\_\{21\},A\_\{22\},A\_\{23\},0,A\_\{31\},A\_\{32\},A\_\{33\},0,0,0,0,1" | split: ',' %}

\\[ RS = {% include render_matrix_raw.html mat = RS row = 4 col = 4 %}  \\]

问题就简化成：如果让RS分解成R和S。

pbrt的解法比较神奇，称为polar decomposition(极分解?)。

(这算法似乎是用来求矩阵的平方根的，但是为什么可以用在这里，我没搞明白，也没找到证明过程。有知道的朋友麻烦告知一下哈)

pbrt给了一个公式是：

\\[ M\_\{i+1\} = \\frac \{1\}\{2\}(M\_\{i\} + (M\_\{i\}\^\{T\})\^\{-1\}) \\]

把M = RS代入这个公式，迭代多次后，M的值会收敛，得到的最终的M就是R。

然后S就等于\\(S = (RS)R\^\{-1\} \\)。

因为R是一个转换矩阵，意味着经过S转换后的点，还是处于原来的空间，只是坐标变换了。那么R必然是一个正交矩阵(列向量之间线性无关)，所以有\\(R\^\{T\}=R\^\{-1\}\\)。
将这个式子代入上面的公式，可以发现:

\\[ S\_\{i+1\} = \\frac \{1\}\{2\}(S\_\{i\} + (S\_\{i\}\^\{T\})\^\{-1\}) \\]
\\[ = \\frac \{1\}\{2\}(S\_\{i\} + (S\_\{i\}\^\{-1\})\^\{-1\}) \\]
\\[ = \\frac \{1\}\{2\}(S\_\{i\} + S\_\{i\}) \\]
\\[ = \\frac \{1\}\{2\}2S\_\{i\}  = S\_\{i\} \\]

即是说，对于一个纯粹的旋转矩阵S，将S和S的转置的逆矩阵求平均，依然还是S。

