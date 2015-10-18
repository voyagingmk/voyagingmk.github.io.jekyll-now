---
layout: post_latex
title: 理解卷积 Convolution
published: true
tags: ['math']
---

## 数学中的卷积

卷积的wiki：[Convolution](https://en.wikipedia.org/wiki/Convolution#Derivations)。

卷积和(convolution sum)的公式是:

\\[ y(t) = x(t)*h(t) = \\sum \_\{\\tau =-\\infty \}\^\{\\infty \}x(\\tau )h(t-\\tau )\\]

写成积分形式是:

<!--more-->

\\[ x(t)*h(t) = \\int \_\{-\\infty \}\^\{\\infty \}x(\\tau )h(t-\\tau )d\\tau = \\int \_\{-\\infty \}\^\{\\infty \}x(t-\\tau )h(\\tau )d\\tau \\]

要理解这个东西，比较难，一种是公式推导，不过是从傅里叶变换得到的；一种是用狄拉克δ函数来辅助理解（我自认为的）；最后一种是通过线性时不变系统理论[LTI system theory](https://en.wikipedia.org/wiki/LTI_system_theory#Overview)。

先讲第一种吧。

## 第一种思路：傅里叶变换与卷积

首先要搬出[傅里叶变换](http://www.qiujiawei.com/fourier-equation/)的一个推论：

\\[ \\mathcal \{F\}\[\\alpha f(t) + \\beta g(t)\] = \\alpha F(s) + \\beta G(s) \\]

这个公式意思是，一个时域下的复杂信号函数可以分解成多个简单信号函数的和，然后对各个子信号函数做傅里叶变换并再次求和，就求出了原信号的傅里叶变换。这个事实显然很有用处。

但除了加法之外，还有乘法。这时候有一个问题：**是否存在某种新的f(t)和g(t)的结合方式，使得f(t)和g(t)结合后的函数的傅里叶变换结果是F(s)G(s)？**

要求这个问题的解，要用倒推法。

首先，设有信号函数f(x)和g(t)（注意，x、t都是指横轴变量，只是用来区分开f和g），G(s)、F(s)分别是f(x)和g(t)的傅里叶变换，于是有:

\\[ G(s)F(s) = \\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi ist\}g(t)dt\\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi isx\}f(x)dx \\]

接着做一些变换:


\\[ \\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi ist\}g(t)dt\\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi isx\}f(x)dx = \\int \_\{-\\infty \}\^\{\\infty \}\\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi ist\}e\^\{-2\\pi isx\}g(t)f(x)dtdx \\]
\\[ = \\int \_\{-\\infty \}\^\{\\infty \}\\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi is(t+x)\}g(t)f(x)dtdx \\]
\\[ = \\int \_\{-\\infty \}\^\{\\infty \}\\left \(\\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi is(t+x)\}g(t)dt\\right \)f(x)dx \\]

现在设u = t + x，所以t = u - x，du = dt（这是把x看做常数项了）。则有：

\\[ \\int \_\{-\\infty \}\^\{\\infty \}\\left \(\\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi is(t+x)\}g(t)dt\\right \)f(x)dx =  \\int \_\{-\\infty \}\^\{\\infty \}\\left \(\\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi isu\}g(u - x)du\\right \)f(x)dx \\]

接着调整下积分顺序：
\\[ \\int \_\{-\\infty \}\^\{\\infty \}\\left \(\\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi isu\}g(u - x)du\\right \)f(x)dx = \\int \_\{-\\infty \}\^\{\\infty \}\\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi isu\}g(u - x)f(x)dudx \\]
\\[ = \\int \_\{-\\infty \}\^\{\\infty \}\\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi isu\}g(u - x)f(x)dxdu \\]
\\[ = \\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi isu\}\\left \(\\int \_\{-\\infty \}\^\{\\infty \}g(u - x)f(x)dx\\right \)du \\]

括号内那个积分是一个关于u的函数，所以可以设成h(u)：

\\[ h(u) = \\int \_\{-\\infty \}\^\{\\infty \}g(u - x)f(x)dx \\]

于是上面的式子就变成:

\\[ \\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi isu\}\\left \(\\int \_\{-\\infty \}\^\{\\infty \}g(u - x)f(x)dx\\right \)du = \\int \_\{-\\infty \}\^\{\\infty \}e\^\{-2\\pi isu\}h(u)du =  \\mathcal \{F\}[h(s)] = H(s)  \\]

这个结论，可以简化成：

\\[  H(s) = G(s)F(s) \\]

再来看下h(u)。如果把h(u)的u换成t（这是可以的，只是一个符号而已），就有:

\\[ h(t) = \\int \_\{-\\infty \}\^\{\\infty \}g(t - x)f(x)dx \\]

2个终极公式都出来了。

最后，我们还要定义一个特殊的二元运算符号*****来替代h(t)（也叫卷积运算符，注意，这个不是乘法的乘号哦）：

\\[ h(t) = (g*f)(t) = \\int \_\{-\\infty \}\^\{\\infty \}g(t - x)f(x)dx \\]

于是有：

\\[ H(s) = G(s)F(s) \\]
\\[ \\mathcal \{F\}[h(t)] = \\mathcal \{F\}[g(s)] \\mathcal \{F\}[f(s)] \\]
\\[ \\mathcal \{F\}[(g*f)(s)] = \\mathcal \{F\}[g(s)] \\mathcal \{F\}[f(s)] \\]

最后的公式，也被叫做**卷积定理**(Convolution Theorem)。

这个定理说明，信号f和信号g的卷积的傅里叶变换，等于f、g各自的傅里叶变换的积。


## 第二种思路：狄拉克δ函数与卷积

第二种思路的关键在于**狄拉克δ函数**。

### 狄拉克δ函数 dirac delta function

狄拉克δ函数的wiki：[dirac delta function](https://en.wikipedia.org/wiki/Dirac_delta_function)。


狄拉克δ函数在坐标系上的长相:

![8.png](../images/2015.10/8.png)

![Dirac_function_approximation.gif](../images/2015.10/Dirac_function_approximation.gif)

（图片来自wiki）

在**信号处理科学**中狄拉克δ函数被称为单位脉冲信号(unit impulse symbol）。上面这个图也很形象地说明了这一点。

狄拉克δ函数有这样的性质:


\\[ delta (t) =  \\begin \{cases\} +\\infty , t=0 \\\\  0, t\\neq 0 \\end \{cases\} \\]

\\[ \\int \_\{-\\infty \}\^\{\\infty \}\\delta (t)dt = 1 \\]

狄拉克δ函数在t等于0时值为正无穷，t不等于0时则为0，且在整个定义域的积分等于1。

### 狄拉克δ函数与卷积

考虑卷积公式的一个特殊情况：**当h(t)是狄拉克δ函数时**。现在试一下把h(t)代入卷积公式，得到:

\\[ x(t) * h(t) = x(t) * \\delta (t) = \\int \_\{-\\infty \}\^\{\\infty \}x(\\tau )\\delta (t-\\tau )d\\tau = x(t) \\]

(最后一步跳跃得比较厉害，后文会有说明）

这个结果说明，x(t)和狄拉克δ函数卷积的结果还是x(t)，为什么会这样呢？

再看下前面给出的卷积和标准公式：

\\[ y(t) = x(t)*h(t) = \\sum \_\{\\tau =-\\infty \}\^\{\\infty \}x(\\tau )h(t-\\tau )\\]

把其中的\\( h(t - \\tau ) \\)换成\\( \\delta (t - \\tau ) \\)，那么里面的\\( t - \\tau \\)，其实就是让那个脉冲信号在横轴上移动(偏移)\\( \\tau \\)距离。根据狄拉克δ函数的定义，可以知道，当\\( t = \\tau \\)时，\\( x(\\tau )h(t-\\tau ) \\)才非0，且等于\\( x(\\tau ) \\)。所以卷积和也就等于\\( x(\\tau ) \\)。（这也算是上面的公式的证明吧）

将这个特殊情况一般化，即不限制h = δ时，就是所谓的卷积公式了。

## 第三种思路：线性时不变系统·理论 LTI system theory

这个还没搞懂，搞懂了再来填坑




## 找到的相关资料

[The Convolution Sum for Discrete-Time LTI Systems. Andrew W. H. House](http://www.eecg.toronto.edu/~ahouse/mirror/engi7824/course_notes_7824_part6.pdf)

