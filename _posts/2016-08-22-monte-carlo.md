---
layout: post_latex
title: 蒙特·卡罗(Monte Carlo)积分和其在图形学中的应用
tags: ['math' ]
published: true
---


<!--more-->

## [蒙特·卡罗积分公式](https://en.wikipedia.org/wiki/Monte_Carlo_integration)

\\[ F\^\{N\} = \\frac \{1\}\{N\}\\sum \_\{i=1\}\^\{N\}\\frac \{f(X\_\{i\})\}\{ pdf(X\_\{i\}) \} \\]

蒙特卡罗最关键的就是理解这条公式了。其他延伸探讨都可以暂时忽略。那么这条公式如何理解呢？首先第一点是，虽然这条公式没有积分符号\\(\\int  \\)，但是它认被称为**积分**，这是因为这公式的作用相当于在对f(x)做积分，只不过不那么“精确”，即蒙特·卡罗积分是**对理想积分的近似**。

那么这个近似是如何完成的？很简单，核心就是两个字：**采样(Sampling)**。对一个连续函数的采样方法是在该函数的定义域中随机挑N个值，并求出对应的N个\\( f(X\_\{i\}) \\)，就得到了样本集合。再对这些样本集合做一些换算，就可以得到一个近似的积分了。一般而言，采样样本越多，就越逼近真实的积分结果。

继续观察上面的公式，里面还有一个极其重要的参数：pdf(probability distribution function，概率分布函数)。

## pdf和pmf

- pmf(probability mass function)，指的是**离散的**随机变量的概率分布函数
- pdf(probability distribution function)， 指的是**连续的**随机变量的概率分布函数

离散的随机变量X的数学期望为：

\\[E[X] = \\sum \^\{N\}\_\{i=1\}X\_\{i\}pmf(X\_\{i\}) \\]

连续的随机变量X的数学期望为：

\\[E[X] = \\int \^\{\\infty \}\_\{-\\infty \}Xpdf(X) \\]

可以说pdf和pmf是同个东西，只不过用的场合不一样。

在实际应用场合，随机变量X不能直接用，而是对X做一个转换，变成F(X)，但这时候要注意F(X)的pdf不等于X的pdf。


这个pdf的参数是\\( X\_\{i\} \\)，返回值是概率，即表示一个样本\\( X\_\{i\} \\)出现的概率，所有样本的出现概率之和(概率的积分)应等于1。要注意的是，pdf的存在说明有可能每个\\( X\_\{i\} \\)的概率都是各不相同的。


当目标函数的定义域满足均匀分布时，单个样本的出现概率是\\( \\frac \{1\}\{N\}\\)，蒙特·卡罗积分等于\\( \\frac \{1\}\{N\}\\sum \_\{i=1\}\^\{N\}\\frac \{f(X\_\{i\})\}\{ \\frac \{1\}\{N\} \} = \\sum \_\{i=1\}\^\{N\}f(X\_\{i\})  \\)，即样本值之和。

当不是均匀分布时，可以想象得到，我们采样得到的N个样本，有的样本的pdf值比较高，有的比较低。

## 在图形学中的应用



\\( p(θ,ϕ)\\) 被称为联合概率分布(joint probability distribution)。

[边缘分布(marginal distribution)](https://en.wikipedia.org/wiki/Marginal_distribution)

[累积分布函数CDF(Cumulative distribution function)](https://en.wikipedia.org/wiki/Cumulative_distribution_function)

# 参考资料

[http://www.scratchapixel.com/lessons/3d-basic-rendering/global-illumination-path-tracing/global-illumination-path-tracing-practical-implementation](http://www.scratchapixel.com/lessons/3d-basic-rendering/global-illumination-path-tracing/global-illumination-path-tracing-practical-implementation)


[http://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/monte-carlo-methods-in-practice/monte-carlo-integration](http://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/monte-carlo-methods-in-practice/monte-carlo-integration)

[http://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/monte-carlo-methods-mathematical-foundations/expected-value-of-the-function-of-a-random-variable](http://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/monte-carlo-methods-mathematical-foundations/expected-value-of-the-function-of-a-random-variable)