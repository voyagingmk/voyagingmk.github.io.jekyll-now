---
layout: post_latex
title: 四元数公式的补充
tags: ['math', 'quaternion']
published: true
---

<!--more-->

继上一篇四元数的文章[Understanding Quaternions 中文翻译《理解四元数》](http://www.qiujiawei.com/understanding-quaternions/)，已经过去一两年了。我发现那篇文章有一些细节没有讲得特别清楚，遂现在写一篇关于四元数公式的文章补缺下。

## 四元数的指数函数

先给出最终公式。设有任意四元数q：

\\[q = s + x\\mathbf i + y\\mathbf j + z\\mathbf k = s + \\mathbf \{v\} = [s,\\mathbf \{v\}] = [s,\\mathbf 0] + [0,\\mathbf \{v\}] \\]

则有：


\\[ e\^\{q\} = e\^\{ s +\\mathbf \{v\}\} = e\^\{s\}e\^\{\\mathbf v\} =e\^\{s\}( cos|\\mathbf v| + \\mathbf v \\frac \{sin |\\mathbf v| \} \{ |\\mathbf v| \} ) \\]


### 推导过程

首先搬出四元数的**乘积**公式：


\\[ q\_\{a\} = [s\_\{a\},\\mathbf \{a\}] \\]

\\[ q\_\{b\} = [s\_\{b\},\\mathbf \{b\}] \\]

\\[ q\_\{a\}q\_\{b\} = [s\_\{a\}s\_\{b\} - a\\cdot b, s\_\{a\}b+s\_\{b\}a+a\\times b] \\]

代入上面的\\( \\mathbf v = 0 + x\\mathbf i + y\\mathbf j + z\\mathbf k \\)，得到：

\\[ \\mathbf v \^\{2\} = [ 0 - \\mathbf v\\cdot \\mathbf v, 0 * \\mathbf v + 0 * \\mathbf v + \\mathbf v\\times \\mathbf v] \\]

\\[ = [ - \\mathbf v\\cdot \\mathbf v, 0 + 0 + 0] \\]

\\[ = - \\mathbf v\\cdot \\mathbf v \\]

\\[ = - (x\^\{2\} + y\^\{2\} + z\^\{2\}) \\]

\\[ = -|\\mathbf v|\^\{2\} \\]

这时候设\\( |\\mathbf v| = θ  \\) （注意，这个θ没有实际意义，只是一个临时符号），那么就有：

\\[ \\mathbf v \^\{2\} =  -θ\^\{2\} \\ \\ ，\\ \\ \\mathbf v \^\{3\} =  -θ\^\{2\}\\mathbf v \\ \\ ，\\ \\ \\mathbf v \^\{4\} = θ\^\{4\}  \\ \\ ，\\ \\ \\mathbf v \^\{5\} = θ\^\{4\}\\mathbf v \\ \\ ，\\ \\ \\mathbf v \^\{6\} = -θ\^\{6\} \\ \\ ，\\cdots \\]


下一步，拿出指数函数使用极限形式的定义(证明见[2])：

\\[ e\^\{x\} = \\sum \_\{k=0\}\^\{\\infty \} \\frac \{x\^\{k\} \}\{k!\} \\ \\ \\ \\ x是实数 \\]


把实数x替换成上面的四元数\\(\\mathbf v\\)，并利用上面的数列，则得到：

\\[ e\^\{\\mathbf v\} = \\sum \_\{k=0\}\^\{\\infty \} \\frac \{\\mathbf v\^\{k\} \}\{k!\} \\]

\\[ = 1 + \\frac \{\\mathbf v\}\{1!\} - \\frac \{θ\^\{2\}\}\{2!\} - \\frac \{θ\^\{2\}\\mathbf v\}\{3!\} + \\frac \{θ\^\{4\}\}\{4!\} + \\frac \{θ\^\{4\}\\mathbf v\}\{5!\}  - \\frac \{θ\^\{6\}\}\{6!\} + \\cdots = \\]

\\[ = 1 + \\frac \{θ\\mathbf v\}\{1!θ\} - \\frac \{θ\^\{2\}\}\{2!\} - \\frac \{θ\^\{3\}\\mathbf v\}\{3!θ\} + \\frac \{θ\^\{4\}\}\{4!\} + \\frac \{θ\^\{5\}\\mathbf v\}\{5!θ\}  - \\frac \{θ\^\{6\}\}\{6!\} + \\cdots = \\]

\\[ = ( 1 - \\frac \{θ\^\{2\}\}\{2!\} + \\frac \{θ\^\{4\}\}\{4!\} - \\frac \{θ\^\{6\}\}\{6!\}  \\cdots ) +  \\frac \{ \\mathbf v \}\{θ\} ( \\frac \{θ\}\{1!\} - \\frac \{θ\^\{3\}\}\{3!\} + \\frac \{θ\^\{5\}\}\{5!\} \\cdots )  = \\]

\\[ = cosθ + \\frac \{ \\mathbf v \}\{θ\} sinθ  \\]

最后一步里，2个无穷数列变成三角函数，是用了泰勒公式[3]。

然后，把假设出来的θ去掉，得到： 

\\[ e\^\{\\mathbf v\}  = cos|\\mathbf v| + \\frac \{ \\mathbf v \}\{|\\mathbf v|\} sin|\\mathbf v|  \\]


所以有：

\\[ e\^\{q\} = e\^\{ s +\\mathbf \{v\}\} = e\^\{s\}e\^\{\\mathbf v\} =e\^\{s\}( cos|\\mathbf v| + \\mathbf v \\frac \{sin |\\mathbf v| \} \{ |\\mathbf v| \} ) \\]


得证。

# 参考资料

[1] [Exponential Function of Quaternion - Derivation](http://math.stackexchange.com/questions/1030737/exponential-function-of-quaternion-derivation)

[2]指数函数的泰勒展开公式的证明：

[MacLaurin series of Exponential function](http://www.songho.ca/math/taylor/taylor_exp.html)


[3] cos sin三角函数的泰勒展开公式的证明：

[MacLaurin series of Trigonometric function](http://www.songho.ca/math/taylor/taylor_tri.html)

[Quaternions, Interpolation and Animation](http://web.mit.edu/2.998/www/QuaternionReport1.pdf)