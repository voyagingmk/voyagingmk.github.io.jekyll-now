---
layout: post_latex
title: 蒙特·卡罗(Monte Carlo)积分和其在图形学上的应用
tags: ['math' ]
published: true
---


<!--more-->

## [蒙特·卡罗积分公式](https://en.wikipedia.org/wiki/Monte_Carlo_integration)

\\[ F\^\{N\} = \\frac \{1\}\{N\}\\sum \_\{i=1\}\^\{N\}\\frac \{f(X\_\{i\})\}\{ pdf(X\_\{i\}) \} \\]

蒙特卡罗最关键的就是理解这条公式了。其他延伸探讨都可以暂时忽略。那么这条公式如何理解呢？首先第一点是，虽然这条公式没有积分符号\\(\\int  \\)，但是它认被称为**积分**，这是因为这公式的作用相当于在对f(x)做积分，只不过不那么“精确”，即蒙特·卡罗积分是**对理想积分的近似**。

那么这个近似是如何完成的？很简单，核心就是两个字：**采样(Sampling)**。对一个连续函数的采样，方法是在该函数的定义域中随机挑N个值，并求出对应的N个\\( f(X\_\{i\}) \\)，

\\( p(θ,ϕ)\\) 被称为联合概率分布(joint probability distribution)。

[边缘分布(marginal distribution)](https://en.wikipedia.org/wiki/Marginal_distribution)

[累积分布函数CDF(Cumulative distribution function)](https://en.wikipedia.org/wiki/Cumulative_distribution_function)

# 参考资料

[http://www.scratchapixel.com/lessons/3d-basic-rendering/global-illumination-path-tracing/global-illumination-path-tracing-practical-implementation](http://www.scratchapixel.com/lessons/3d-basic-rendering/global-illumination-path-tracing/global-illumination-path-tracing-practical-implementation)


[http://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/monte-carlo-methods-in-practice/monte-carlo-integration](http://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/monte-carlo-methods-in-practice/monte-carlo-integration)