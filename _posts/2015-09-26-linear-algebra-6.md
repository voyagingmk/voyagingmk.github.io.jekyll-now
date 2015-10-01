---
layout: post_latex
title: <复习向>线性代数之矩阵的特征值、特征向量、特征矩阵、迹
tags: ['matrix','linear algebra']
published: true
---

## 定义

设A是数域F上的n阶矩阵，如果存在数域F中的一个数\\(\\lambda \\)与数域上F的非零向量\\(\\alpha \\)，使得：
\\[ A\\alpha = \\lambda \\alpha \\]
则称\\(\\lambda \\)为A的一个**特征值(根)**(eigenvalue)，称\\(\\alpha \\)为A的属于特征值\\(\\lambda \\)的**特征向量**(eigenvector)。

\\( A\\alpha \\)和\\(\\alpha \\)平行（即在同一个直线上。

\\(\\lambda E - A\\)为A的**特征矩阵**，行列式\\(f(\\lambda ) = |\\lambda E - A|\\)为A的**特征多项式**，\\(|\\lambda E - A| = 0\\)为A的**特征方程**,\\((\\lambda E - A)X=0\\)是A关于该\\(\\lambda \\)的**齐次线性方程组**。

A的主对角线上元素之和称为A的**迹**(trace)，记为tr(A)，即

\\[ tr(A) = a\_\{11\} + a\_\{11\} + \\cdots + a\_\{nn\} \\]

迹和特征值有很重要的联系：

\\[ tr(A) = \\lambda \_\{1\} + \\lambda \_\{2\} + \\cdots + \\lambda \_\{n\} \\]

迹还和A的行列式有关系：

\\[ |A| = \\lambda \_\{1\}\\lambda \_\{2\}\\cdots \\lambda \_\{n\} \\]


<!--more-->

## A的全部特征值和特征向量的求法

1. 计算A的特征多项式
2. 求特征方程的全部根，即矩阵A的全部特征值
3. 对于A的每一个特征值\\(\\lambda \\)，求其相应的齐次线性方程组的一个基础解系\\(\\eta \_\{1\},\\eta \_\{2\},\\cdots \\eta \_\{n-r\}\\)，其中\\(r=r(\\lambda E - A)\\)，即r为矩阵A的特征矩阵的秩，A的属于该\\(\\lambda \\)的全部特征向量为:
\\[ k\_\{1\}\\eta \_\{1\} + k\_\{2\}\\eta \_\{2\} + \\cdots + k\_\{n-r\}\\eta \_\{n-r\} \\]
其中\\(k\_\{1\},k\_\{2\},\\cdots ,k\_\{n-r\}\\)是数域F上的一组不全为零的任意常数。

## 特征值的性质

1. \\(\\lambda \_\{n\} \\)为矩阵\\(A\_\{n\} \\)的特征值（n为正整数）
2. A可逆时，\\(1/\\lambda \\)为\\(A\^\{-1\}\\)的特征值
3. 矩阵A与其转置矩阵\\(A\^\{T\}\\)有相同的特征值
4. \\(k\\lambda \\)是矩阵kA的特征值(k是任意常数)。


## 迹的性质

1. \\( tr(A + B) = tr(A) + tr(B) \\)
2. \\( tr(kA) = k\cdot tr(A) \\)
3. \\( tr(A\^\{T\}) = tr(A) \\)
4. \\( tr(AB) = tr(BA) \\)
5. \\( tr(ABC) = tr(BCA) = tr(CAB) \\)
6. 设A、B为n阶方阵，P为n阶可逆矩阵，且\\(P\^\{-1\}AP = B \\)，则有\\(tr(A) = tr(B)\\)



## 当A为投影矩阵P时

因为投影矩阵P可以把一个向量b投影到一个空间的某一个向量，也就是\\(Pb = p\\)，这个式子和\\( A\\alpha = \\lambda \\alpha \\)有一致的地方。

那么P的特征向量是什么呢？前面已经说到，\\( A\\alpha \\)和\\( \\alpha \\)是平行关系，那么就是说，如果b在P的列空间之外，b就不是P的特征向量，当b在P的列空间内时，b是P的特征向量。

比如当P对应一个平面时，这个平面内的任意一个向量x都是特征向量（因为\\(Px = x\\)，P作用于x后还是得到x)

又因为\\(Px = x = 1\\cdot x\\)，所以P的一个特征值是1。

但是，P还有其他的特征值。当向量x正交于P的列空间时，有\\(Px = 0 \\)。所以P的另一个特征值为0。


## 当A为旋转矩阵Q时

因为旋转矩阵可以改变一个向量的方向，那么这个矩阵是否有特征值？事实是有的，但是是复数。

{% assign Q1 = "cos(90),-sin(90),sin(90),cos(90)" | split: ',' %}
{% assign Q2 = "0,-1,1,0" | split: ',' %}
\\[ Q = {% include render_matrix_raw.html mat = Q1 row = 2 col = 2 %} = {% include render_matrix_raw.html mat = Q2 row = 2 col = 2 %} \\]

\\[ |Q| = 0 - (-1) = 1 = \\lambda \_\{1\}\\lambda \_\{2\} \\]
\\[ tr(Q) = 0 = \\lambda \_\{1\} + \\lambda \_\{2\} \\]

显然，\\( \\lambda \_\{1\}\\lambda \_\{2\}\\)无实数域的解，但是有复数解i和-i。


## A的对角化(diagonalize)

设n阶方阵A存在n个线性无关的特征向量\\(x\_\{i\}\\)，将这n个特征向量组成方阵S(也称为特征向量矩阵），则有：

{% assign S = "x\_\{1\},x\_\{2\},\\cdots ,x\_\{n\}," | split: ',' %}
{% assign S2 = "\\lambda \_\{1\}x\_\{1\},\\lambda \_\{2\}x\_\{2\},\\cdots ,\\lambda \_\{n\}x\_\{n\}," | split: ',' %}
{% assign S3 = "\\lambda \_\{1\},0,\\cdots ,0,0,\\lambda \_\{2\},\\cdots ,0,\\vdots ,\\vdots, \\cdots ,\\vdots,0,0,\\cdots ,\\lambda \_\{n\}" | split: ',' %}

\\[ AS = A{% include render_matrix_raw.html mat = S  row = 1 col = 4 %} = {% include render_matrix_raw.html mat = S2 row = 1 col = 4 %} \\] 
\\[    = {% include render_matrix_raw.html mat = S  row = 1 col = 4 %}{% include render_matrix_raw.html mat = S3  row = 4 col = 4 %} \\]
\\[ = S\\Lambda \\]

所以有：

\\[ A = S\\Lambda S\^\{-1\} \\]

这个式子称为A的\\(S\\Lambda S\^\{-1\}\\)分解，或特征分解(Eigendecomposition)。


可以对角化的前提是A有n个线性无关的特征向量。A有n个线性无关的特征向量的前提是，所有的\\(\\lambda \\)都不重复（没有重根）。

BTW，对于A的幂，有一个性质：

- 如果有 \\( Ax = \\lambda x \\)，则有\\( A\^\{2\}x = AAx = \\lambda Ax = \\lambda \\lambda x = \\lambda \^\{2\}x\\) 

- \\( A\^\{2\} = S\\Lambda S\^\{-1\}S\\Lambda S\^\{-1\} = S\\Lambda \^\{2\}S\^\{-1\} \\)

这个性质说明，A的n次幂的特征值等于\\(\\lambda \^\{n\}\\)，且无论n等于多少(当前n得是正整数），特征向量不变。

这也是求矩阵的n次幂的快速解法。

特征分解还有一个用法是，求A的逆矩阵:

\\[ A\^\{-1\} = (S\\Lambda S\^\{-1\})\^\{-1\} =S\\Lambda \^\{-1\}S\^\{-1\} \\]

\\(\\Lambda\\)的逆矩阵是非常容易求的，因为它是一个对角矩阵，所以把对角线上的\\(\\lambda \\)都变成\\(1/\\lambda \\)即可。