---
layout: post_latex
title: 矩阵微分（一）
tags: ['math']
published: true
---


# 基本认识

## 3种标准导数(梯度)公式

1) 自变量是一个标量(Scalar)时：

\\[ Df(x) = \\lim \_\{t\\to 0\} \\frac \{f(x+t)-f(x)\}\{t\} \\]



2) 自变量是一个向量(Vector)时：

\\[ D\_\{\\textbf \{w\}\}f(\\textbf \{x\}) = \\lim \_\{t\\to 0\} \\frac \{f(\\textbf \{x\} + t\\textbf \{w\}) - f(\\textbf \{x\})\}\{t\} \\]



<!--more-->


(w的维数和x一致)

这个导数的含义是，在n维空间中f(x)所定义的(超)平面上的某个坐标点x相对于w的斜率。

3) 自变量是一个矩阵(Matrix)时：

\\[ D\_\{\\textbf \{W\}\}f(\\textbf \{X\}) = \\lim \_\{t\\to 0\} \\frac \{f(\\textbf \{X\}+t\\textbf \{W\})-f(\\textbf \{X\})\}\{t\} \\]

含义和2)类似。（已经无法想象了）


### 实例

已知一个三维空间曲面：\\( x\^\{2\} + y\^\{2\} + z\^\{2\} = 30 \\)，和曲面上的一点P(1,-2,5)。如何求出曲线在P点处的切平面、法线?

切平面求法：

设\\(f(x,y,z) = x\^\{2\} + y\^\{2\} + z\^\{2\} - 30 \\)

**梯度**公式为：

\\( \nabla f = \< f\_\{x\}, f\_\{y\}, f\_\{z\} \> \\) 

即曲线方程分别对x、y、z求导数得到一个三维向量，就是曲线的梯度公式了。

因此可以得到这条曲线的梯度公式：

\\( \nabla f = (2x, 2y, 2z)  \\)

（再次注意，\\(f(x\_\{0\},y\_\{0\},z\_\{0\})\\)是标量，而 \\( \nabla F(x\_\{0\},y\_\{0\},z\_\{0\}) \\)则是三维向量。）

 把P(1,-2,5)代入梯度公式得到：


\\( \nabla f(1,-2,5) = (2, -4, 10)  \\)

含义是，曲面上P处的梯度方向为(2,-4,10)。

有了梯度方向，就可以求切平面了，先给出切平面公式：

\\[ f\_\{x\}(x\_\{0\}, y\_\{0\}, z\_\{0\})(x - x\_\{0\}) + f\_\{y\}(x\_\{0\}, y\_\{0\}, z\_\{0\})(y - y\_\{0\}) + f\_\{z\}(x\_\{0\}, y\_\{0\}, z\_\{0\})(z - z\_\{0\}) = 0\\]

其实就是**切平面上的任一点(x,y,z)，与定点\\( x\_\{0\},y\_\{0\},z\_\{0\} \\)构成的向量，这个向量和关于该定点的导数向量的点积必然为0**。显然这是因为切平面和导数向量是正交关系。

代入P点和导数向量，得：

\\( 2(x - 1) + (-4)(y - (-2)) + 10(z - 5) = 0\\)

化简：

\\( 2(x - 1) -4(y + 2) + 10(z - 5) = 0\\)

这就是P点的切平面公式了。从方程也可以看出x、y、z都为1次，这条方程必然代表三维空间的一个平面。

最后求法线方程。注意了，梯度方向和法线方向是一样的，但法线是空间里的线，不只是方向，所以可以用**平行线定理**来求：

\\( 法线 = 梯度向量 * t + 法线必须经过的点 \\)

\\( \\vec n(t) = t(2, -4, 10) + (1, -2, 5)  = (2t + 1,  -4t - 2, 10t + 5)  \\) 

### 要注意的点

梯度需要转置！

## 矩阵迹(trace)的各种性质

### 性质1

\\[ tr(A) = tr(A\^\{T\}) \\]

### 性质2

\\[ tr(AB) = tr(BA) \\]

\\[ tr(ABC) = tr(CAB) = tr(BCA) \\]

\\[ tr(ABCD) = tr(DABC) = tr(CDAB) = tr(BCDA) \\]

(看出规律了吧)

### 性质3

\\[ tr(A+B) = tr(A) + tr(B) \\]

### 性质4

\\[ tr(\\alpha A) = \\alpha tr(A) \\]

### 性质5

设有矩阵H、U，H和U都是n x m的矩阵，则有：

\\[ \\sum \_\{j=1\}\^\{m\} \\sum \_\{i=1\}\^\{n\}(h\_\{ij\}u\_\{ij\}) = \\sum \_\{j=1\}\^\{m\} \\sum \_\{i=1\}\^\{n\}((h\^\{T\})\_\{ji\}u\_\{ij\}) = tr(H\^\{T\}U) \\]


# 矩阵微分的各种性质


设有关于矩阵A的一个函数f，记为\\( f(A) \\)，\\( f(A) \\)关于A的导数为：

\\[  \\nabla \_\{A\}f(A) = \\frac \{ \\partial f(A) \}\{ \\partial A \} \\]

{% assign D =  "\\frac \{\\partial f \}\{\\partial A\_\{11\}\},\\frac \{\\partial f \}\{\\partial A\_\{12\}\},\\cdots ,\\frac \{\\partial f \}\{\\partial A\_\{1n\}\},\\frac \{\\partial f \}\{\\partial A\_\{21\}\},\\frac \{\\partial f \}\{\\partial A\_\{22\}\},\\cdots ,\\frac \{\\partial f \}\{\\partial A\_\{2n\}\},\\vdots ,\\vdots ,\\ddots ,\\vdots ,\\frac \{\\partial f \}\{\\partial A\_\{m1\}\},\\frac \{\\partial f \}\{\\partial A\_\{m2\}\},\\cdots ,\\frac \{\\partial f \}\{\\partial A\_\{mn\}\}" | split: ',' %}

\\[  = {% include render_matrix_raw.html mat = D row = 4 col = 4 %} \\]


## 性质1

\\[ \\nabla \_\{ A\^\{T\} \}f(A) = (\\nabla \_\{A\}f(A))\^\{T\} \\]

证明：

\\[ \\nabla \_\{ A\^\{T\} \}f(A) = \\]

{% assign D2 =  "\\frac \{\\partial f \}\{\\partial A\_\{11\}\},\\frac \{\\partial f \}\{\\partial A\_\{21\}\},\\cdots ,\\frac \{\\partial f \}\{\\partial A\_\{m1\}\},\\frac \{\\partial f \}\{\\partial A\_\{12\}\},\\frac \{\\partial f \}\{\\partial A\_\{22\}\},\\cdots ,\\frac \{\\partial f \}\{\\partial A\_\{m2\}\},\\vdots ,\\vdots ,\\ddots ,\\vdots ,\\frac \{\\partial f \}\{\\partial A\_\{1n\}\},\\frac \{\\partial f \}\{\\partial A\_\{2n\}\},\\cdots ,\\frac \{\\partial f \}\{\\partial A\_\{mn\}\}" | split: ',' %}

\\[  = {% include render_matrix_raw.html mat = D2 row = 4 col = 4 %} \\]

\\[  = {% include render_matrix_raw.html mat = D row = 4 col = 4 %}\^\{T\} \\]

\\[  = (\\frac \{ \\partial f(A) \}\{ \\partial A \})\^\{T\}  = (\\nabla \_\{A\}f(A))\^\{T\} \\]


## 性质2

假设存在矩阵U，使得下面的等式成立：

\\[ D\_\{\\textbf \{W\}\}f(\\textbf \{X\}) = \\lim \_\{t\\to 0\} \\frac \{f(\\textbf \{X\}+t\\textbf \{W\})-f(\\textbf \{X\})\}\{t\} = tr(W\^\{T\}U) \\]

（这里要注意一下：中间的式子的分子包含矩阵，而分母只是一个t，那么这个极限的结果应仍然仍是一个矩阵，然而等式右边却是一个trace，trace是一个数。矩阵等于数？其实是可以的，譬如当f(X)是一个tr运算的时候。）

那么，对\\( \\textbf \{W\} \\)中任意一个\\(W\_\{ij\} \\)求导，则有：

\\[ D\_\{W\_\{ij\}\}f(\\textbf \{X\}) = tr(W\_\{ij\}\^\{T\}U) = \\sum \_\{j=1\}\^\{\} \\sum \_\{i=1\}\^\{\}(w\_\{ij\}u\_\{ij\}) = u\_\{ij\}  \\]

这个结果可能有点费解。首先要明白\\( W\_\{ij\} \\)是W矩阵的一个元素，是一个标量(Scalar)，那么就可以确定这个导数也是一个值(Scalar)；对W矩阵的局部单个元素求导，其实按偏导数的概念理解即可，既然是偏导数，这就意味着除了存在\\( w\_\{ij\} \\)的那一项之外的其他元素都被当做常数，而对常数求导必然等于0，所以最后会得到唯一的\\( u\_\{ij\}\\)。(中间那一步用到了trace的性质5)

既然已经知道，对局部的\\( W\_\{ij\} \\)求导会得到\\( U\_\{ij\}\\)，那么分别对所有\\( W\_\{ij\} \\)求导，并把各个求导结果再组成一个矩阵，就是U矩阵了。又因为W代表任意矩阵，所以f(X)关于X的导数等于U：

\\[  \\frac \{ \\partial f(\\textbf \{X\}) \}\{ \\partial X \} = \\textbf \{U\} \\]


这个式子的意义在于，当题目是“给你一个自变量是矩阵X的函数f(X),求它关于X的导数”时，可以把问题立即转变成求U，而U的求解，可以通过上面的标准导数公式来求。小结一下步骤：

1. 计算\\( \\lim \_\{t\\to 0\} \\frac \{f(\\textbf \{X\}+t\\textbf \{W\})-f(\\textbf \{X\})\}\{t\} \\)，并化简，直到得到一个形如\\(tr(W\^\{T\}Q) \\)的式子；

2. 根据\\( \\frac \{ \\partial f(\\textbf \{X\}) \}\{ \\partial X \} = \\textbf \{U\} \\)，可以知道\\(tr(W\^\{T\}Q) \\) = \\(tr(W\^\{T\}U) \\)， 于是就得到了\\(\\frac \{ \\partial f(\\textbf \{X\}) \}\{ \\partial X \} = U = Q \\) 。



## 性质3

\\[ \\frac \{ \\partial tr(AX) \}\{ \\partial X \} = A\^\{T\} \\]

证明过程需要用到上面的性质2，刚好作为一个应用举例。

证明，设：

\\[ f(X) = tr(AX)   \\]

根据上面的结论，只需要把下面这个极限简化，理论上就可以求出 \\( \\frac \{ \\partial tr(AX) \}\{ \\partial X \} \\) 了：

\\[ D\_\{\\textbf \{W\}\}f(\\textbf \{X\}) = \\lim \_\{t\\to 0\} \\frac \{f(\\textbf \{X\}+t\\textbf \{W\})-f(\\textbf \{X\})\}\{t\} \\]


\\[  = \\lim \_\{t\\to 0\} \\frac \{  tr(A(X + tW)) -  tr(AX) \}\{t\} \\]

\\[  = \\lim \_\{t\\to 0\} \\frac \{  tr(AX + AtW) -  tr(AX) \}\{t\} \\]

\\[  = \\lim \_\{t\\to 0\} \\frac \{  tr(AX) + tr(AtW) -  tr(AX) \}\{t\} \\]

\\[  = \\lim \_\{t\\to 0\} \\frac \{  tr(AtW) \}\{t\} \\]

\\[  = \\lim \_\{t\\to 0\} \\frac \{  tr(AW)t \}\{t\} \\]

\\[  = \\lim \_\{t\\to 0\} tr(AW) \\]

\\[  = tr(AW) \\]

\\[  = tr((AW)\^\{T\}) \\]

\\[  = tr(W\^\{T\}A\^\{T\}) \\]

所以有：

\\[ D\_\{W\}f(X) = tr(W\^\{T\}A\^\{T\}) = tr(W\^\{T\}U)  \\]

\\[ U = A\^\{T\} \\]

得证：

\\[ \\frac \{ \\partial tr(AX) \}\{ \\partial X \} = U =  A\^\{T\}  \\] 

## 性质4

\\[ \\frac \{ \\partial tr(X\^\{T\}A\^\{T\}) \}\{ \\partial X \} = A\^\{T\} \\]

有了性质3，就可以推导出这个：

\\[ \\frac \{ \\partial tr(AX) \}\{ \\partial X \} =  A\^\{T\}  \\] 

\\[ \\frac \{ \\partial tr((AX)\^\{T\}) \}\{ \\partial X \} =  A\^\{T\}  \\] 

\\[ \\frac \{ \\partial tr(X\^\{T\}A\^\{T\}) \}\{ \\partial X \} =  A\^\{T\}  \\] 


## 性质5

\\[ \\nabla \_\{ X\}tr(X) = tr(\\nabla \_\{ X\}X) \\]

待证。

## 性质6

\\[ \\nabla \_\{ X\}tr(AXBX\^\{T\}C) = A\^\{T\}C\^\{T\}XB\^\{T\} + CAXB \\]

类似性质3的证明过程，只是复杂一些。设:


\\[ f(X) = tr(AXBX\^\{T\}C)  \\]


\\[ D\_\{\\textbf \{W\}\}f(\\textbf \{X\}) = \\lim \_\{t\\to 0\} \\frac \{f(\\textbf \{X\}+t\\textbf \{W\})-f(\\textbf \{X\})\}\{t\} \\]

\\[  = \\lim \_\{t\\to 0\} \\frac \{  tr(A(X + tW)B(X + tW)\^\{T\}C) -  tr(AXBX\^\{T\}C) \}\{t\} \\]

\\[  = \\lim \_\{t\\to 0\} \\frac \{  tr( A(X + tW)B(X + tW)\^\{T\}C - AXBX\^\{T\}C ) \}\{t\} \\]

\\[  = \\lim \_\{t\\to 0\} \\frac \{  tr( (AXB + tAWB)(X\^\{T\}C + tW\^\{T\}C) - AXBX\^\{T\}C ) \}\{t\} \\]

\\[  = \\lim \_\{t\\to 0\} \\frac \{  tr( AXBX\^\{T\}C + tAWBX\^\{T\}C + tAXBW\^\{T\}C + t\^\{2\}AWBW\^\{T\}C - AXBX\^\{T\}C ) \}\{t\} \\]

\\[  = \\lim \_\{t\\to 0\} \\frac \{  tr( tAWBX\^\{T\}C + tAXBW\^\{T\}C + t\^\{2\}AWBW\^\{T\}C ) \}\{t\} \\]

\\[  = \\lim \_\{t\\to 0\} \\frac \{  tr( AWBX\^\{T\}C + AXBW\^\{T\}C + tAWBW\^\{T\}C )t \}\{t\} \\]

\\[  = \\lim \_\{t\\to 0\} [tr( AWBX\^\{T\}C + AXBW\^\{T\}C + tAWBW\^\{T\}C )] \\]

\\[  = \\lim \_\{t\\to 0\} [tr( AWBX\^\{T\}C + AXBW\^\{T\}C)] + \\lim \_\{t\\to 0\} [tr( tAWBW\^\{T\}C )] \\]

\\[  = \\lim \_\{t\\to 0\} [tr( AWBX\^\{T\}C + AXBW\^\{T\}C)] \\]

\\[  = tr( AWBX\^\{T\}C ) + tr( AXBW\^\{T\}C ) \\]

\\[  = tr( (AWBX\^\{T\}C)\^\{T\} ) + tr( AXBW\^\{T\}C ) \\]

\\[  = tr( C\^\{T\}XB\^\{T\}W\^\{T\}A\^\{T\} ) + tr( AXBW\^\{T\}C ) \\]

\\[  = tr( W\^\{T\}A\^\{T\}C\^\{T\}XB\^\{T\} ) + tr( W\^\{T\}CAXB ) 【用了trace的性质2】 \\]

\\[  = tr( W\^\{T\}A\^\{T\}C\^\{T\}XB\^\{T\} + W\^\{T\}CAXB ) \\]

\\[  = tr( W\^\{T\}  (A\^\{T\}C\^\{T\}XB\^\{T\} + CAXB) ) \\]

所以有：

\\[ D\_\{W\}f(X) = tr( W\^\{T\}  (A\^\{T\}C\^\{T\}XB\^\{T\} + CAXB) ) = tr(W\^\{T\}U)  \\]

得证：

\\[ \\frac \{ \\partial tr(AXBX\^\{T\}C) \}\{ \\partial X \} = U = A\^\{T\}C\^\{T\}XB\^\{T\} + CAXB \\]


在wiki[Matrix Calculus](https://en.wikipedia.org/wiki/Matrix_calculus)还给出了用性质5公式：\\( \\nabla \_\{ X\}tr(X) = tr(\\nabla \_\{ X\}X) \\)推导性质6。为了方便，把图也贴进来吧：

![https://upload.wikimedia.org/math/c/6/1/c61612bff41e8572a97d977871ce2be2.png](https://upload.wikimedia.org/math/c/6/1/c61612bff41e8572a97d977871ce2be2.png)

![https://upload.wikimedia.org/math/1/e/7/1e761891d19891ff75670424341b8425.png](https://upload.wikimedia.org/math/1/e/7/1e761891d19891ff75670424341b8425.png)

它最后得到的式子和我的推导似乎不一样，但其实是一样的，用trace的性质1\\( tr(A) = tr(A\^\{T\}) \\)可以转换得到。（误)

上面这个最终等式是错的，要得到梯度得转置一下。zhangyifeng童鞋已更正wiki，可以自己看下wiki的修改历史。

正确的等式为：

![a.png](https://wikimedia.org/api/rest_v1/media/math/render/svg/62d25cb1609fc051df7d17cf84eabecc194404aa)

这样就和我的推导完全一致了。

## 性质7


\\[ \\nabla \_\{ X\}tr(XBX\^\{T\}C) = C\^\{T\}XB\^\{T\} + CXB \\]

证明：把性质6的A设为单位矩阵E，得到：


\\[ \\nabla \_\{ X\}tr(EXBX\^\{T\}C) = E\^\{T\}C\^\{T\}XB\^\{T\} + CEXB \\]

化简得到：


\\[ \\nabla \_\{ X\}tr(XBX\^\{T\}C) = C\^\{T\}XB\^\{T\} + CXB \\]



## 参考资料



[http://www.tc.umn.edu/~nydic001/docs/unpubs/Schonemann_Trace_Derivatives_Presentation.pdf](http://www.tc.umn.edu/~nydic001/docs/unpubs/Schonemann_Trace_Derivatives_Presentation.pdf)

https://zhuanlan.zhihu.com/p/24709748

http://cherishlc.iteye.com/blog/1765932