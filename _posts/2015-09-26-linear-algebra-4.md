---
layout: post_latex
title: 线性代数之投影矩阵
tags: ['matrix','linear algebra']
published: true
---

## 投影矩阵是what？

先给出结论：投影矩阵P（projection），可以把一个向量b，投影到一个“空间”上，投影点称为p，从p到b的向量称为e，e = b - p，e的含义是误差向量（error）。

再举例子帮助读者理解：

## 上述的“空间”为一维时

一个向量b，投影到一个一维的空间，显然，这个空间是一条直线，设直线为单位向量a，那么这个投影其实就是找到这个直线上离b最近的点p，误差向量e就是b到p的距离。因为p在a上，所以有：

p = ax（p和a都是向量，x是一个值）【式子1】

然后，因为p是b在a上的投影，那么意味着，a与e成90度角，当2个向量互相垂直时，他们的点积（或 内积、 dot product）等于0，于是有：
<!--more-->
\\[ a\^\{T\}e = 0 \\]

\\[ a\^\{T\}(b-xa) = 0 \\]

再变换一下，得到：

\\[ xa\^\{T\}a = a\^\{T\}b  \\]

\\[ x = \\dfrac \{ a\^\{T\}b \}\{ a\^\{T\}a \} \\]

根据【式子1】，最后得到：

\\[ p = a\\dfrac \{ a\^\{T\}b \}\{ a\^\{T\}a \} 【式子2】 \\] 


看，式子左边的p是投影向量，右边有b和a，b是原向量，a是空间向量。所以这个式子隐含了一个变换关系：从b通过某种变换能够得到p。所谓的投影矩阵P（注意，是大写），就在这个式子里面了。

投影矩阵P应该有这样的效果：

\\[ p = Pb  \\]

P作用于任意一个向量b，能够得到b在某个空间的投影点p。

注意: **P是一个矩阵，不是一个数！**

【式子2】应该要变换成什么样子，才能变出一个矩阵呢？答案如下：

\\[ p = \\dfrac \{ aa\^\{T\} \}\{ a\^\{T\}a \}b \\] 

投影矩阵P：

\\[ P = \\dfrac \{ aa\^\{T\} \}\{ a\^\{T\}a \} \\] 

式子右边是一个矩阵，这是因为分子是\\(aa\^\{T\}\\)，这不是一个数，而是一个矩阵（分母才是一个数）。（顺序很重要！）

投影矩阵P的2条重要性质：

- \\( P = P\^\{T\} \\)

- \\( P\^\{n\} = P \\) , n为正整数

第二条性质说明，投影点p再次经过同一个投影变换，依然还是p。这样的矩阵称为幂等矩阵。


## 投影的实际意义?

为什么要找投影点，这是因为，当我们要计算线性方程组 \\( Ax=b \\)的解时，它可能是无解的。怎么办呢？既然没有正解，就找最优解！最优解就是找一个和b最近的p，并求解\\( A\\hat\{x\}=p \\)。

## 上述的“空间”为二维时

一个向量b，投影到一个二维的空间，显然，这个空间是一个平面。一个平面，可以由2个线性无关（independant)的向量\\(a\_\{1\}\\)和\\(a\_\{2\}\\)确定。a1和a2是这个平面的一组基（basis）。

一组基可以写成矩阵的形式：

\\[ A = [ \ a\_\{1\}\ \ a\_\{2\} ] \ \\] 【式子3】


和一维情况做一个对比：

投影点p，在一维时 p = ax。那么，在二维平面上呢？显然，p可以由这个平面的基得到：\\( p = \\hat\{x\_\{1\}\}a\_\{1\}+x\_\{2\}a\_\{2\} \\)。

根据【式子3】可以得到：

\\[ p = A\\hat\{x\} \\]

\\[ e = b - p = b - A\\hat\{x\} \\]

上述一维的情况时的那个e，在二维时也是一样的，e会垂直于这个空间，也就是e和这个平面是垂直的。

因为e和平面垂直，平面的基是\\(a\_\{1\}\\)和\\(a\_\{2\}\\)，即e与\\(a\_\{1\}\\)和\\(a\_\{2\}\\)垂直，所以：

\\[ a\_\{1\}\^\{T\}(b - A\\hat\{x\}) = 0 \\]

\\[ a\_\{2\}\^\{T\}(b - A\\hat\{x\}) = 0 \\]

{% assign matA = "a\_\{1\}\^\{T\},a\_\{2\}\^\{T\}" | split: ',' %}

{% assign matB = "0,0" | split: ',' %}

\\[ {% include render_matrix_raw.html mat = matA row = 2 col = 1 %} (b - A\\hat\{x\}) = {% include render_matrix_raw.html mat = matB row = 2 col = 1 %} \\]

\\[ A\^\{T\}(b - A\\hat\{x\}) = 0 \\]

\\[ A\^\{T\}A\\hat\{x\} = A\^\{T\}b \\]

这和一维情况的其中一个式子很像，对吧。 但\\(A\^\{T\}A\\)是一个高维的东西，它不是一个数，而是一个矩阵。

再变换一下，得到：

\\[ \\hat\{x\} = (A\^\{T\}A)\^\{-1\}A\^\{T\}b \\]

所以投影点p和b的变换公式就是：

\\[ p = A\\hat\{x\} = A(A\^\{T\}A)\^\{-1\}A\^\{T\}b \\]

抽出投影矩阵：

\\[ P = A(A\^\{T\}A)\^\{-1\}A\^\{T\} 【式子4】\\]

这条式子，中间的括号假如可以去掉的话，就变成了：


\\[ P = A A\^\{-1\} (A\^\{T\})\^\{-1\} A\^\{T\} \\]

\\[ P = II = I \\]

为什么P变成了单位矩阵I呢？这是因为把\\( (A\^\{T\}A)\^\{-1\} \\)解开的前提是**A是一个方阵**。但就现在这个二维平面的例子而言，A由2个基构成（（每个基有3个分量），A并不是方阵，所以是不能解开的。上述的变换是错误的。

当A是方阵时，意味着有3个基，而又因为基之间线性无关，所以方阵A不可能只是代表一个平面空间，实际上，A代表的是一个三维空间。所以，一个在三维空间的点b，投影到三维空间后，当然还是b。所以A是方阵时，投影矩阵就是单位矩阵I。

当A不是方阵时，要按照【式子4】去求投影矩阵P。

另外，在高维情况下，P的那2条性质依然成立。