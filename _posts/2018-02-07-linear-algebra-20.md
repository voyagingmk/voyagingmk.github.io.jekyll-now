---
layout: post_latex
title: Canvas的transform函数与2D仿射变换矩阵分解
tags: ['matrix','linear algebra','math']
published: true
---

最近偶然接触了一下canvas的2D仿射变换。和3D一样，canvas有scale、translate、rotate操作，本质上这3个函数也是矩阵乘法。

canvas应该内置了一套矩阵运算系统，并且canvas内含有一个仿射变换矩阵（大概认为是3x3=9个浮点数变量即可，2D是3x3矩阵，3D是4x4矩阵）。每次调用scale、translate、rotate就是对这个矩阵做矩阵乘法。

另外还有3个函数可以控制canvas的仿射变换：

- resetTransform 重置为单位矩阵
- transform(a,b,c,d,e,f) 以a,b,c,d,e,f构造一个仿射变换矩阵并乘到当前canvas的仿射变换矩阵
- setTransform(a,b,c,d,e,f) 重置为单位矩阵并应用transform(a,b,c,d,e,f)

我遇到的需求是，**如果canvas没有提供transform函数，怎么用scale、translate、rotate三个函数的组合，来模拟transform函数？**

<!--more-->

## 自定义的transform函数实现

先抛出答案：

```javascript

var p = Math.PI / 180;
var degree = 45; // 旋转度数
var sx = 0.5;// x 轴缩放倍数
var sy = 2.0;// y 轴缩放倍数
var t = 0 * Math.PI / 180;// 斜切度数 
var tx = 200; // x轴平移
var ty = 100; // y轴平移
var args = [
    sx * Math.cos(p * degree),
    sx * Math.sin(p * degree),
    t * sx * Math.cos(p * degree) - sy * Math.sin(p * degree),
    t * sx * Math.sin(p * degree) + sy * Math.cos(p * degree),
    tx,
    ty];

var transform = function(a, b, c, d, e, f) {
    var angle = Math.atan2(b, a);
    var denom = Math.pow(a, 2) + Math.pow(b, 2);
    var scaleX = Math.sqrt(denom);
    var scaleY = (a * d - c * b) / scaleX;
    var skewX = Math.atan2(a * c + b * d, denom);
    var skewY = 0;
    var translateX = e;
    var translateY = f;

    console.log("angle", angle * 180 / Math.PI);
    console.log("skewX", skewX);
    console.log("scale", scaleX, scaleY);
    console.log("translate", translateX, translateY);
    /*
    Outout:
    angle 45
    skewX 0
    scale 0.5 2
    translate 200 100
    */
    ctx.translate(translateX, translateY);
    ctx.rotate(angle);
    ctx.scale(scaleX, scaleY);
}


var canvas = document.getElementById('test2');
var ctx = canvas.getContext('2d');
transform(...args);
ctx.fillRect(100, 100, 50, 50);
ctx.font = "30px Verdana";
ctx.fillText("Hello, World", 10, 90);

```

上面代码大意是，用户输入任意degree，sx， sy，t，tx，ty，并计算出它们的a,b,c,d,e,f，然后调用这个自定义transform函数，就能得到和内置的transform一样的变换效果。

下面将逐步讲解transform函数怎么得来。


## 2D仿射变换矩阵的分解

transform的参数a, b, c, d, e, f组成了一个3x3仿射变换矩阵A：


{% assign matA = "a,c,e,b,d,f,0,0,1" | split: ',' %}


\\( A = {% include render_matrix_raw.html mat = matA row = 3 col = 3 %}  \\)

设有2维向量\\(\\mathbf p=(x, y, 1)\\)，让它左乘A，就会得到经过A变换后的向量\\(\\mathbf p'=(x', y', 1)\\)。


{% assign matP = "x,y,1" | split: ',' %}

\\( \\mathbf p = {% include render_matrix_raw.html mat = matP row = 3 col = 1 %}  \\)

{% assign matP2 = "x',y',1" | split: ',' %}

{% assign matP3 = "ax+cy+e,bx+dy+f,1" | split: ',' %}

\\( \\mathbf p' = A\\mathbf p  = {% include render_matrix_raw.html mat = matP2 row = 3 col = 1 %} = {% include render_matrix_raw.html mat = matA row = 3 col = 3 %} {% include render_matrix_raw.html mat = matP row = 3 col = 1 %} = {% include render_matrix_raw.html mat = matP3 row = 3 col = 1 %} \\)


现在问题是，怎么把A分解成T(translate)、R(rotate)、S(scale)三个矩阵。

### 提取T

首先先把translate矩阵提取出来：

{% assign matT = "1,0,e,0,1,f,0,0,1" | split: ',' %}


\\( T = {% include render_matrix_raw.html mat = matT row = 3 col = 3 %}  \\)

显然这是正确的，可以试一下：

{% assign matP4 = "x+e,y+f,1" | split: ',' %}

\\( \\mathbf p' = T\\mathbf p = {% include render_matrix_raw.html mat = matT row = 3 col = 3 %} {% include render_matrix_raw.html mat = matP row = 3 col = 1 %} = {% include render_matrix_raw.html mat = matP4 row = 3 col = 1 %} \\)

x偏移了e，y偏移了f。

再设等式：A = TQ。Q是未知矩阵，且Q包含了scale、rotate变换。

Q可以用参数a, b, c, d, e, f表示：

{% assign matQ = "a,c,0,b,d,0,0,0,1" | split: ',' %}

\\( Q = {% include render_matrix_raw.html mat = matQ row = 3 col = 3 %}  \\)

验证下：


\\( TQ = {% include render_matrix_raw.html mat = matT row = 3 col = 3 %} {% include render_matrix_raw.html mat = matQ row = 3 col = 3 %} \\)

\\( = {% include render_matrix_raw.html mat = matA row = 3 col = 3 %} = A \\)

### 分解Q

设 Q = RS，S是scale，R是rotate。2D的R、S矩阵分别为：


{% assign matR = "cosθ, -sinθ, 0, sinθ, cosθ, 0, 0, 0, 1" | split: ',' %}

\\( R = {% include render_matrix_raw.html mat = matR row = 3 col = 3 %}  \\)

{% assign matS = "x, 0, 0, 0, y, 0, 0, 0, 1" | split: ',' %}

\\( S = {% include render_matrix_raw.html mat = matS row = 3 col = 3 %}  \\)

其实，Q还可能包含了shear斜切变换。一般来说斜切是比较少见到的一种变换，且canvas并没有单独的shear函数。所以本文开头的目标，自定义custom，怎么弄都不能实现shear变换（只有scale、translate、rotate可用）。

现在要分解Q，可以把shear也一并考虑。shear矩阵形式如下；

{% assign matSH = "1, s, 0, t, 1, 0, 0, 0, 1" | split: ',' %}

\\( Shear = {% include render_matrix_raw.html mat = matSH row = 3 col = 3 %}  \\)

如果没有shear变换，那么s=t=0。

同时用s和t是不对的，其中一个必需为0。下面推导的前提是s != 0，t = 0。

综上，得到Q' = Rotate * Scale * Shear

\\( Q' ={% include render_matrix_raw.html mat = matR row = 3 col = 3 %} {% include render_matrix_raw.html mat = matS row = 3 col = 3 %} {% include render_matrix_raw.html mat = matSH row = 3 col = 3 %}   \\)

{% assign matQ2 = "xcosθ, -ysinθ, 0, xsinθ, ycosθ, 0, 0, 0, 1" | split: ',' %}

{% assign matQ3 = "xcosθ - tysinθ, sxcosθ - ysinθ, 0, xsinθ + tycosθ, sxsinθ + ycosθ, 0, 0, 0, 1" | split: ',' %}

\\( =  {% include render_matrix_raw.html mat = matQ2 row = 3 col = 3 %}  {% include render_matrix_raw.html mat = matSH row = 3 col = 3 %} \\)

\\( = {% include render_matrix_raw.html mat = matQ3 row = 3 col = 3 %}  \\)

再回顾上一小节的Q：

\\( Q = {% include render_matrix_raw.html mat = matQ row = 3 col = 3 %}  \\)

对比Q和Q'，可以得到方程组：

- \\( a =  x cosθ - t y sinθ = x cosθ  \\)

- \\( b = x sinθ + t y cosθ = x sinθ  \\)

- \\( c = s x cosθ - y sinθ = sa - y sinθ = sa - y(b/x) \\)

- \\( d = s x sinθ + y cosθ = sb + y cosθ = sb + y(a/x) \\)


看起来有点乱，慢慢拆解下吧:

一二等式相除解出θ：

\\( tanθ = \\frac \{ b \} \{ a \} \\)

\\( θ = atan2(b, a) \\)

一二等式分别平方后相加，解出x：

\\( a\^\{2\} + b\^\{2\} = x\^\{2\} \\)

\\( x = \\sqrt \{ a\^\{2\} + b\^\{2\} \} \\\)

三四等式消去s：

\\( c = sa - y(b/x) \\)

\\( s = (c + y(b/x))/a \\)

\\( d = sb + y(a/x) =  b(c + y(b/x))/a + y(a/x)  \\)

对上式两边乘a：

\\( ad =  b(c + y(b/x)) + ay(a/x)  \\)

\\( ad =  bc + by(b/x) + ay(a/x)  \\)

\\( ad -  bc = by(b/x) + ay(a/x)  \\)

\\( ad -  bc = y(b\^\{2\}/x + a\^\{2\}/x)  \\)

\\( ad -  bc = y(a\^\{2\} + b\^\{2\})/ \\sqrt \{ a\^\{2\} + b\^\{2\} \}    \\)

\\( ad -  bc = y \\sqrt \{ a\^\{2\} + b\^\{2\} \}    \\)

\\( y = \\frac \{ ad -  bc \} \{  \\sqrt \{ a\^\{2\} + b\^\{2\} \}  \} \\)


然后可以求s了：

\\( s = (c + y(b/x))/a \\)

\\( s = \\frac \{ c \} \{ a \} + \\frac \{ yb \} \{ xa \} \\)

y/x上面已经有了，代入：

\\( s = \\frac \{ c \} \{ a \} + \\frac \{ (ad -  bc)b \} \{ (a\^\{2\} + b\^\{2\})a \} \\)

\\( s = \\frac \{ c(a\^\{2\} + b\^\{2\}) + (ad -  bc)b \} \{ (a\^\{2\} + b\^\{2\})a \} \\)

\\( s = \\frac \{ ca\^\{2\} + cb\^\{2\} + adb -  cb\^\{2\} \} \{ (a\^\{2\} + b\^\{2\})a \} \\)

\\( s = \\frac \{ ca\^\{2\} + adb \} \{ (a\^\{2\} + b\^\{2\})a \} \\)

\\( s = \\frac \{ a(ca + bd) \} \{ (a\^\{2\} + b\^\{2\})a \} \\)

\\( s = \\frac \{ ca + bd \} \{ a\^\{2\} + b\^\{2\} \} \\)



## 参考资料

 [stackoverflow - Find the Rotation and Skew of a Matrix transformation
](https://stackoverflow.com/questions/5107134/find-the-rotation-and-skew-of-a-matrix-transformation/32125700#32125700)

[unmatrix - parse(str) ](https://github.com/matthewmueller/unmatrix/blob/master/index.js)

[DecomposeMatrix 此代码最原始出处（有注释）](https://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp)

《GRAPHICS GEMS II edited by JAMES ARVO》
