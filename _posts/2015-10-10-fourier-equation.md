---
layout: post_latex
title: 学习傅里叶变换
published: true
tags: ['fourier','math']
---

本文主要写的是公式层面的推导，关于傅里叶变换的应用，请到知乎搜索'傅里叶'，能找到很多不错的文章。

本文主要参考了斯坦福大学Brad Osgood的公开课:

[http://open.163.com/special/opencourse/fouriertransforms.html](http://open.163.com/special/opencourse/fouriertransforms.html)

youtube的比较高清:

[https://www.youtube.com/watch?v=gZNm7L96pfY](https://www.youtube.com/watch?v=gZNm7L96pfY)

<!--more-->

## 傅里叶级数

翻译一下wiki的fourier series：

> 在数学中，傅里叶级数是一个**可以把(有波形的)函数表示成多个简单的sin函数的叠加**的方法。更形式地说，傅里叶级数能够把任意周期函数(信号)分解成**有限(或无限)个简单的震荡函数的叠加**，这些震荡函数可以是正弦函数、余弦函数或复指数。

傅里叶级数的公式定义（不要问为什么长这样，这只是一个定义，不是推出来的公式)：

\\[ S = \\sum\_\{k=1\}\^\{N\}A\_\{k\}\\sin (2\\pi kt+\\phi \_\{k\}) \\]

(如果不清楚什么是级数，请戳 [https://en.wikipedia.org/wiki/Series_(mathematics)](https://en.wikipedia.org/wiki/Series_(mathematics) )

使用三角函数的一道公式:

\\[ \\sin (\\alpha + \\beta ) = \\sin \\alpha \\cos \\beta + \\cos \\alpha \\sin \\beta \\]

代入到傅里叶级数，得：

\\[ \\sin (2\\pi kt + \\phi \_\{k\}) =\\sin 2\\pi kt \\cos \\phi \_\{k\} + \\cos 2\\pi kt \\sin \\phi \_\{k\} \\]

\\[ S = \\sum\_\{k=1\}\^\{N\}A\_\{k\}\\sin 2\\pi kt \\cos \\phi \_\{k\} + \\sum\_\{k=1\}\^\{N\}A\_\{k\}\\cos 2\\pi kt \\sin \\phi \_\{k\} \\]


再设:

\\[ a\_\{k\} = A\_\{k\}\\cos \\phi \_\{k\} \\]

\\[ b\_\{k\} = A\_\{k\}\\sin \\phi \_\{k\} \\]

则上面的傅里叶级数被简化成:

\\[ S = \\sum\_\{k=1\}\^\{N\}a\_\{k\}\\sin 2\\pi kt + \\sum\_\{k=1\}\^\{N\}b\_\{k\}\\cos 2\\pi kt \\]
\\[  S(x) = \\sum\_\{k=1\}\^\{N\}(a\_\{k\}\\sin 2\\pi kt + b\_\{k\}\\cos 2\\pi kt) \\]

这是傅里叶级数的常用形式1。

常用形式2是这样的：

\\[  S = \\frac \{A\_\{0\}\}\{2\} + \\sum\_\{k=1\}\^\{N\}(a\_\{k\}\\sin 2\\pi kt + b\_\{k\}\\cos 2\\pi kt) \\]

前面多出来的那个东西，不复杂，先不管它。

常用形式3，是最重要的：用复数来表示傅里叶级数。怎么实现？其实就是用了**欧拉公式**：

\\[ e\^\{ix\} = \\cos x + i\\sin x\\]

（关于欧拉公式的推导，可以看我的另一篇文章:[复数和三角函数](http://www.qiujiawei.com/complex-1) )

把 \\( x = 2\\pi kt \\)代入到欧拉公式，得到:

\\[   e\^\{i2\\pi kt\} = \\cos 2\\pi kt + i\\sin 2\\pi kt\\]

再搬出另外两条欧拉公式的推论:

\\[ \\cos x = \\frac \{e\^\{ix\} + e\^\{-ix\}\}\{2\} \\]

\\[ \\sin x = \\frac \{e\^\{ix\} - e\^\{-ix\}\}\{2i\} \\]

也把 \\( x = 2\\pi kt \\)代入，得到:


\\[ \\cos 2\\pi kt = \\frac \{e\^\{i2\\pi kt\} + e\^\{-i2\\pi kt\}\}\{2\} \\]

\\[ \\sin 2\\pi kt = \\frac \{e\^\{i2\\pi kt\} - e\^\{-i2\\pi kt\}\}\{2i\} \\]

这时候，教授突然说，傅里叶级数可以写成:

\\[ f(t) = \\sum\_\{k=-n\}\^\{n\}c\_\{k\}e\^\{2\\pi ikt\} \\]

莫名其妙的。下面是我自己尝试的推导：

\\[  S = \\sum\_\{k=1\}\^\{N\}(a\_\{k\}\\sin 2\\pi kt + b\_\{k\}\\cos 2\\pi kt) \\]

\\[  S' = \\sum\_\{k=-1\}\^\{-N\}(a\_\{k\}\\sin 2\\pi kt + b\_\{k\}\\cos 2\\pi kt) =  \\sum\_\{k=1\}\^\{N\}(a\_\{k\}\\sin (-2\\pi kt) + b\_\{k\}\\cos (-2\\pi kt)) \\]

\\[ S+S' = \\sum\_\{k=1\}\^\{N\}(a\_\{k\}\\sin 2\\pi kt + b\_\{k\}\\cos 2\\pi kt + a\_\{k\}\\sin (-2\\pi kt) + b\_\{k\}\\cos (-2\\pi kt))\\]

\\[ = \\sum\_\{k=1\}\^\{N\}(a\_\{k\}\\sin 2\\pi kt + b\_\{k\}\\cos 2\\pi kt - a\_\{k\}\\sin 2\\pi kt + b\_\{k\}\\cos 2\\pi kt) \\]

\\[ = \\sum\_\{k=1\}\^\{N\}(2b\_\{k\}\\cos 2\\pi kt) \\]

又因为:

\\[ S\_\{k=0\} = a\_\{k\}\\sin 2\\pi 0t + b\_\{k\}\\cos 2\\pi 0t = b\_\{k\} \\]

所以:

\\[ S'' = \\sum\_\{k=-N\}\^\{N\}(a\_\{k\}\\sin 2\\pi kt + b\_\{k\}\\cos 2\\pi kt) \\]
\\[ = S\_\{k=0\} + S + S' \\]
\\[ = -b\_\{k\} + \\sum\_\{k=-N\}\^\{N\}(2b\_\{k\}\\cos 2\\pi kt) \\]
\\[ = -b\_\{k\} + \\sum\_\{k=-N\}\^\{N\}2b\_\{k\}(\\frac \{e\^\{i2\\pi kt\} + e\^\{-i2\\pi kt\}\}\{2\}) \\]
\\[ = -b\_\{k\} + b\_\{k\}\\sum\_\{k=-N\}\^\{N\}(e\^\{i2\\pi kt\} + e\^\{-i2\\pi kt\}) \\]

还是没能推出教授的等式(虽然这个推导也不知道对不对，看官们可以无视这段)。

再换个思路，由这3个公式:

\\[  S = \\frac \{A\_\{0\}\}\{2\} + \\sum\_\{k=1\}\^\{N\}(a\_\{k\}\\sin 2\\pi kt + b\_\{k\}\\cos 2\\pi kt) \\]

\\[ \\cos 2\\pi kt = \\frac \{e\^\{i2\\pi kt\} + e\^\{-i2\\pi kt\}\}\{2\} \\]

\\[ \\sin 2\\pi kt = \\frac \{e\^\{i2\\pi kt\} - e\^\{-i2\\pi kt\}\}\{2i\} \\]

得:

\\[  S = \\frac \{A\_\{0\}\}\{2\} + \\sum\_\{k=1\}\^\{N\}(a\_\{k\}\\frac \{e\^\{i2\\pi kt\} - e\^\{-i2\\pi kt\}\}\{2i\} + b\_\{k\}\\frac \{e\^\{i2\\pi kt\} + e\^\{-i2\\pi kt\}\}\{2\}) \\]
\\[  = \\frac \{A\_\{0\}\}\{2\} + \\sum\_\{k=1\}\^\{N\}(\\frac \{b\_\{k\} - ia\_\{k\}\}\{2\}e\^\{i2\\pi kt\} + \\frac \{b\_\{k\} + ia\_\{k\}\}\{2\}e\^\{-i2\\pi  kt\})  \\]

设:

\\[ C\_\{0\} = \\frac \{1\}\{2\}A\_\{0\} \\]
\\[ C\_\{k\} = \\frac \{1\}\{2\}(b\_\{k\} - ia\_\{k\}) \\]
\\[ C\_\{-k\} = \\frac \{1\}\{2\}(b\_\{k\} + ia\_\{k\}) \\]

则:

\\[ S = C\_\{0\} + \\sum\_\{k=1\}\^\{N\}(C\_\{k\}e\^\{i2\\pi kt\} + C\_\{-k\}e\^\{-i2\\pi  kt\})  \\]

其中:

\\[ C\_\{-k\} = \\overline \{C\_\{k\}\} \\]

教授其实是这样子搞的：先假设可以变换成那个等式，然后再来求\\(C\_\{k\}\\)，求得出来的话，式子不就成立了嘛。教授也使用了新的招数：积分。

在教授的notes([https://see.stanford.edu/materials/lsoftaee261/book-fall-07.pdf](https://see.stanford.edu/materials/lsoftaee261/book-fall-07.pdf)]的第10-12页第1.5小节Lost at c，清楚地推导了一遍\\(C\_\{k\}\\)。


### 关于傅里叶级数里的\\(C\_\{k\}\\)

对于傅里叶级数f(t)，假设它是一个"实信号(real signal)"（一般来说，傅里叶变换处理的目标都是实信号)，
那么就有等式:

\\[ f(t) = \\overline \{f(t)\} \\]

即是说，f(t)没有虚部。而又因为：

\\[ f(t) = \\sum\_\{k=-n\}\^\{n\}c\_\{k\}e\^\{2\\pi ikt\} \\]

\\[ \\sum\_\{k=-n\}\^\{n\}c\_\{k\}e\^\{2\\pi ikt\} = \\overline \{\\sum\_\{k=-n\}\^\{n\}c\_\{k\}e\^\{2\\pi ikt\}\} = \\sum\_\{k=-n\}\^\{n\}\\overline \{c\_\{k\}\}\\overline \{e\^\{2\\pi ikt\}\} = \\sum\_\{k=-n\}\^\{n\}\\overline \{c\_\{k\}\}e\^\{-2\\pi ikt\} \\]

然后，要注意一个事实是：这个级数是从-n到n的累加，根据加法交换律，这个级数也可以变成从n到-n的累加，也即:

\\[ \\sum\_\{k=-n\}\^\{n\} = \\sum\_\{k=n\}\^\{-n\}  \\]

于是，把傅里叶级数的k变成-k，就有:

\\[ \\sum\_\{k=-n\}\^\{n\}c\_\{k\}e\^\{2\\pi ikt\} = \\sum\_\{-k=-n\}\^\{n\}c\_\{-k\}e\^\{-2\\pi ikt\} = \\sum\_\{k=n\}\^\{-n\}c\_\{-k\}e\^\{-2\\pi ikt\} = \\sum\_\{k=-n\}\^\{n\}c\_\{-k\}e\^\{-2\\pi ikt\} \\]

再对比上面的推导，就会发现：

\\[ c\_\{-k\} = \\overline \{c\_\{k\}\} \\]

先记住这个性质，然后继续往下看。

设有复数z，它必然会满足一个性质：

\\[ z + \\overline \{z\} = 2Re\\{ z \\} \\]

Re{···}代表取出花括号的复数表达式的实部。

对于傅里叶级数，也可以把它当成一个复数，再利用刚刚推导出来的\\(c\_\{-k\} = \\overline \{c\_\{k\}\} \\)，就有：


\\[ c\_\{k\}e\^\{2\\pi ikt\} + c\_\{-k\}e\^\{2\\pi i(-k)t\} = c\_\{k\}e\^\{2\\pi ikt\} + c\_\{-k\}e\^\{-2\\pi ikt\}\\]
\\[ = c\_\{k\}e\^\{2\\pi ikt\} + \\overline \{c\_\{k\}\}e\^\{\\overline \{2\\pi ikt\}\} \\]
\\[ = c\_\{k\}e\^\{2\\pi ikt\} + \\overline \{c\_\{k\}e\^\{2\\pi ikt\}\} \\]
\\[ = 2Re\\{ c\_\{k\}e\^\{2\\pi ikt\} \\} \\]

这个结果表明，\\(c\_\{k\}e\^\{2\\pi ikt\} + c\_\{-k\}e\^\{2\\pi i(-k)t\} \\)是一个实数。把这个结论代入到傅里叶级数，就可以得到：

\\[ f(t) = \\sum\_\{k=-n\}\^\{n\}c\_\{k\}e\^\{2\\pi ikt\} \\]
\\[ = \\sum\_\{k=0\}\^\{n\}2Re\\{ c\_\{k\}e\^\{2\\pi ikt\} \\} \\]
\\[ = 2Re\\{ \\sum\_\{k=0\}\^\{n\}c\_\{k\}e\^\{2\\pi ikt\} \\} \\]

注意，这个式子是把0和-0都算进去的。如果不允许signed zero，就要对k=0的情况特殊处理。


所以就证明了:





这时候推出来的式子还不是完整的。


终极的傅里叶级数的指数形式是：

\\[ f(t) = C\_\{0\} + \\sum\_\{k=-\\infty \}\^\{\\infty \}C\_\{k\}e\^\{ikt\} \\]

\\[ C\_\{k\} = \\frac \{1\}\{2\\pi \}\\int \_\{-\\pi \}^\{\\pi \}f(t)e\^\{-ikt\}dt \\]

随便找一个函数来测试一下，比如这个:

\\[ f(t) = t\^\{2\} \\]

然后用上面的2个公式，求出它的傅里叶级数指数形式的各个参数:


\\[ C\_\{0\} = \\frac \{1\}\{2\\pi \}\\int \_\{-\\pi \}^\{\\pi \}f(t)e\^\{-i0t\}dt = \\frac \{1\}\{2\\pi \}\\int \_\{-\\pi \}^\{\\pi \}f(t)dt =  \\left \[ \\frac \{6\\pi \}\{t\^\{3\} \}\\right \]\_\{-\\pi \}^\{\\pi \} = \\frac \{3\}\{t\^\{2\} \} \\]

\\[ C\_\{n\} = \\frac \{1\}\{2\\pi \}\\int \_\{-\\pi \}^\{\\pi \}f(t)e\^\{-int\}dt \\]








