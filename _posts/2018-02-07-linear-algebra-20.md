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

var transform = function(a, b, c, d, e, f) {
    var a = [a, b, c, d, e, f];
    var angle = Math.atan2(a[1], a[0]),
        denom = Math.pow(a[0], 2) + Math.pow(a[1], 2),
        scaleX = Math.sqrt(denom),
        scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX,
        skewX = Math.atan2(a[0] * a[2] + a[1] * a[3], denom);
    
    skewX = skewX / (Math.PI / 180); // Note: canvas has no skew only function!
    var skewY = 0;
    var translateX = a[4];
    var translateY = a[5];
    this.translate(translateX, translateY);
    this.rotate(angle);
    this.scale(scaleX, scaleY);
}

```

代码来源:

 [stackoverflow - Find the Rotation and Skew of a Matrix transformation
](https://stackoverflow.com/questions/5107134/find-the-rotation-and-skew-of-a-matrix-transformation/32125700#32125700)

[unmatrix - parse(str) ](https://github.com/matthewmueller/unmatrix/blob/master/index.js)

[DecomposeMatrix 此代码最原始出处（有注释）](https://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp)

[GRAPHICS GEMS II edited by JAMES ARVO]()

我这个版本代码看起来不复杂，但还是慢慢地来分析下数学原理吧。

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

## 原始注释解释

decomposition algorithm：

```c

/*
 * The relevant section of the transitions specification:
 * http://dev.w3.org/csswg/css3-transitions/#animation-of-property-types-
 * defers all of the details to the 2-D and 3-D transforms specifications.
 * For the 2-D transforms specification (all that's relevant for us, right
 * now), the relevant section is:
 * http://dev.w3.org/csswg/css3-2d-transforms/#animation
 * This, in turn, refers to the unmatrix program in Graphics Gems,
 * available from http://tog.acm.org/resources/GraphicsGems/ , and in
+
− * particular as the file GraphicsGems/gemsii/unmatrix.c
 * in http://tog.acm.org/resources/GraphicsGems/AllGems.tar.gz
 *
 * The unmatrix reference is for general 3-D transform matrices (any of the
 * 16 components can have any value).
 *
 * For CSS 2-D transforms, we have a 2-D matrix with the bottom row constant:
 *
 * [ A C E ]
 * [ B D F ]
 * [ 0 0 1 ]
 *
 * For that case, I believe the algorithm in unmatrix reduces to:
 *
 *  (1) If A * D - B * C == 0, the matrix is singular.  Fail.
 *
 *  (2) Set translation components (Tx and Ty) to the translation parts of
 *      the matrix (E and F) and then ignore them for the rest of the time.
 *      (For us, E and F each actually consist of three constants:  a
 *      length, a multiplier for the width, and a multiplier for the
 *      height.  This actually requires its own decomposition, but I'll
 *      keep that separate.)
 *
 *  (3) Let the X scale (Sx) be sqrt(A^2 + B^2).  Then divide both A and B
 *      by it.
 *
 *  (4) Let the XY shear (K) be A * C + B * D.  From C, subtract A times
 *      the XY shear.  From D, subtract B times the XY shear.
 *
 *  (5) Let the Y scale (Sy) be sqrt(C^2 + D^2).  Divide C, D, and the XY
 *      shear (K) by it.
 *
 *  (6) At this point, A * D - B * C is either 1 or -1.  If it is -1,
 *      negate the XY shear (K), the X scale (Sx), and A, B, C, and D.
 *      (Alternatively, we could negate the XY shear (K) and the Y scale
 *      (Sy).)
 *
 *  (7) Let the rotation be R = atan2(B, A).
 *
 * Then the resulting decomposed transformation is:
 *
 *   translate(Tx, Ty) rotate(R) skewX(atan(K)) scale(Sx, Sy)
 *
 * An interesting result of this is that all of the simple transform
 * functions (i.e., all functions other than matrix()), in isolation,
 * decompose back to themselves except for:
 *   'skewY(φ)', which is 'matrix(1, tan(φ), 0, 1, 0, 0)', which decomposes
 *   to 'rotate(φ) skewX(φ) scale(sec(φ), cos(φ))' since (ignoring the
 *   alternate sign possibilities that would get fixed in step 6):
 *     In step 3, the X scale factor is sqrt(1+tan²(φ)) = sqrt(sec²(φ)) = sec(φ).
 *     Thus, after step 3, A = 1/sec(φ) = cos(φ) and B = tan(φ) / sec(φ) = sin(φ).
 *     In step 4, the XY shear is sin(φ).
 *     Thus, after step 4, C = -cos(φ)sin(φ) and D = 1 - sin²(φ) = cos²(φ).
 *     Thus, in step 5, the Y scale is sqrt(cos²(φ)(sin²(φ) + cos²(φ)) = cos(φ).
 *     Thus, after step 5, C = -sin(φ), D = cos(φ), and the XY shear is tan(φ).
 *     Thus, in step 6, A * D - B * C = cos²(φ) + sin²(φ) = 1.
 *     In step 7, the rotation is thus φ.
 *
 *   skew(θ, φ), which is matrix(1, tan(φ), tan(θ), 1, 0, 0), which decomposes
 *   to 'rotate(φ) skewX(θ + φ) scale(sec(φ), cos(φ))' since (ignoring
 *   the alternate sign possibilities that would get fixed in step 6):
 *     In step 3, the X scale factor is sqrt(1+tan²(φ)) = sqrt(sec²(φ)) = sec(φ).
 *     Thus, after step 3, A = 1/sec(φ) = cos(φ) and B = tan(φ) / sec(φ) = sin(φ).
 *     In step 4, the XY shear is cos(φ)tan(θ) + sin(φ).
 *     Thus, after step 4,
 *     C = tan(θ) - cos(φ)(cos(φ)tan(θ) + sin(φ)) = tan(θ)sin²(φ) - cos(φ)sin(φ)
 *     D = 1 - sin(φ)(cos(φ)tan(θ) + sin(φ)) = cos²(φ) - sin(φ)cos(φ)tan(θ)
 *     Thus, in step 5, the Y scale is sqrt(C² + D²) =
 *     sqrt(tan²(θ)(sin⁴(φ) + sin²(φ)cos²(φ)) -
 *          2 tan(θ)(sin³(φ)cos(φ) + sin(φ)cos³(φ)) +
 *          (sin²(φ)cos²(φ) + cos⁴(φ))) =
 *     sqrt(tan²(θ)sin²(φ) - 2 tan(θ)sin(φ)cos(φ) + cos²(φ)) =
 *     cos(φ) - tan(θ)sin(φ) (taking the negative of the obvious solution so
 *     we avoid flipping in step 6).
 *     After step 5, C = -sin(φ) and D = cos(φ), and the XY shear is
 *     (cos(φ)tan(θ) + sin(φ)) / (cos(φ) - tan(θ)sin(φ)) =
 *     (dividing both numerator and denominator by cos(φ))
 *     (tan(θ) + tan(φ)) / (1 - tan(θ)tan(φ)) = tan(θ + φ).
 *     (See http://en.wikipedia.org/wiki/List_of_trigonometric_identities .)
 *     Thus, in step 6, A * D - B * C = cos²(φ) + sin²(φ) = 1.
 *     In step 7, the rotation is thus φ.
 *
 *     To check this result, we can multiply things back together:
 *
 *     [ cos(φ) -sin(φ) ] [ 1 tan(θ + φ) ] [ sec(φ)    0   ]
 *     [ sin(φ)  cos(φ) ] [ 0      1     ] [   0    cos(φ) ]
 *
 *     [ cos(φ)      cos(φ)tan(θ + φ) - sin(φ) ] [ sec(φ)    0   ]
 *     [ sin(φ)      sin(φ)tan(θ + φ) + cos(φ) ] [   0    cos(φ) ]
 *
 *     but since tan(θ + φ) = (tan(θ) + tan(φ)) / (1 - tan(θ)tan(φ)),
 *     cos(φ)tan(θ + φ) - sin(φ)
 *      = cos(φ)(tan(θ) + tan(φ)) - sin(φ) + sin(φ)tan(θ)tan(φ)
 *      = cos(φ)tan(θ) + sin(φ) - sin(φ) + sin(φ)tan(θ)tan(φ)
 *      = cos(φ)tan(θ) + sin(φ)tan(θ)tan(φ)
 *      = tan(θ) (cos(φ) + sin(φ)tan(φ))
 *      = tan(θ) sec(φ) (cos²(φ) + sin²(φ))
 *      = tan(θ) sec(φ)
 *     and
 *     sin(φ)tan(θ + φ) + cos(φ)
 *      = sin(φ)(tan(θ) + tan(φ)) + cos(φ) - cos(φ)tan(θ)tan(φ)
 *      = tan(θ) (sin(φ) - sin(φ)) + sin(φ)tan(φ) + cos(φ)
 *      = sec(φ) (sin²(φ) + cos²(φ))
 *      = sec(φ)
 *     so the above is:
 *     [ cos(φ)  tan(θ) sec(φ) ] [ sec(φ)    0   ]
 *     [ sin(φ)     sec(φ)     ] [   0    cos(φ) ]
 *
 *     [    1   tan(θ) ]
 *     [ tan(φ)    1   ]
 */

```