---
layout: post_latex
title: 学习增强学习
tags: ['ml' ]
published: true
---


<!--more-->

# 马尔可夫决策过程

马尔可夫决策过程([Markov decision process](https://en.wikipedia.org/wiki/Markov_decision_process)，下文简称MDP)，可用来处理一些最优化问题，譬如非常出名的[动态规划](https://en.wikipedia.org/wiki/Dynamic_programming)问题，以及本文的核心——[增强学习](https://en.wikipedia.org/wiki/Reinforcement_learning)问题。


## MDP的定义

MDP包含5个东西：\\(S、A、P、R、\\gamma \\)

- S(State)，指的是目标系统的所有状态的集合

- A(Action)，状态之间的转换行为。可以把状态S想象成一堆节点，而A就是各个节点之间的有向连线集合

- P(probability)，\\(P\_\{a\}(s,s')\\)，某状态\\(s\\)通过某行为a进入另一个状态\\(s'\\)的概率

- R(Rewawrd)，\\(R\_\{a\}(s,s')\\)，某状态\\(s\\)通过某行为a进入另一个状态\\(s'\\)能获得的奖励值

- \\(\\gamma \\) (Discount Factor)，用于奖励值计算的一个系数，表示非立即奖励(future rewards)相对于立即奖励(present rewards)的重要程度，当为1时表示同等重要，小于1时表示非立即奖励要打个折，等于0时表示只考虑立即奖励。因此有\\( 0 \\leq \\gamma \\leq 1 \\)。注意，\\(\\gamma \\) 是一个常数

因为一般来说，状态之间是有时间先后顺序的（拓扑结构），所以每个状态s有它自己的固有属性t，表示这个s处于时间轴上的位置。

在MDP的定义中没有指出S、A是不是有限集合(finite)，但在实际应用MDP时，必然是有限的。

MDP的直观表示是一个有向图：


![1.png](https://upload.wikimedia.org/wikipedia/commons/2/21/Markov_Decision_Process_example.png
)
(from wiki)

## MDP的核心问题

MDP的核心核心是找出一个最理想的策略函数\\(\\pi \^\{\*\} (s)\\)给做决策的人，这个\\(\\pi \^\{\*\}(s)\\)决定了当处于状态s时，应采取哪个行为a，即\\( a\_\{t\} = \\pi \^\{\*\} (s\_\{t\})\\)。

这个问题的解决方案是：求出一个叫做**折算累积奖励(discounted cumulative reward)**多项式的最大值，此时的\\(\\pi (s)\\)就是最优解\\(\\pi \^\{\*\}(s)\\)。公式化表示就是：

\\[ r\_\{t\} =  R\_\{ a\_\{t\} \}(s\_\{t\}, s\_\{t+1\} ) \\]

\\[ V \^\{\\pi \} (s\_\{t\}) = r\_\{t\} + \\gamma r\_\{t+1\} + \\gamma \^\{2\} r\_\{t+2\} + \\cdots  =  \\sum \_\{i=0\}\^\{\\infty \}\\gamma \^\{i\}r\_\{t+i\} \\]


\\[\\pi \^\{\*\} = argmax  V \^\{\\pi \} (s) \\]

获得\\(\\pi \^\{\*\} (s)\\)后，就可以应用了，即对任意一个\\(s\_\{t\}\\)，都可以算出最理想的行为\\( a\^\{\*\}\_\{t\} = \\pi \^\{\*\} (s\_\{t\})\\)。

注意：\\( V \^\{\\pi \} (s\_\{t\}) \\)的实现不是唯一的，还有其他各种各样的公式可以选择，严格来说并不是MDP定义的一部分。


## Q函数

评估函数Q的公式定义：

\\[ Q(s,a) = r\_\{immediate\}(s,a) + \\gamma V\^\{ \\pi \^\{\*\} \}(s') \\]

用文字解释：Q的值为从状态s执行动作a所获得的立即奖励再加上后续遵循最优策略时的V值，V用\\(\\gamma \\)折算。

并且有：

\\[\\pi \^\{\*\} = argmax Q(s,a)  \\]

V函数和Q函数的关系：

\\[ V\^\{ \\pi \^\{\*\} \} = \\max \_\{a'\}Q(s,a') \\]

用这个式子重写Q的定义式：

\\[ Q(s,a) = r\_\{immediate\}(s,a) + \\gamma \\max \_\{a'\}Q(s',a') \\]


## 确定性MDP系统的基于Q函数的增强学习算法

在增强学习中，要学习的函数是Q函数而不是\\( V\^\{ \\pi \^\{\*\} \} \\)函数。这是因为后者是关于s的一元函数，计算过程要求知道每个状态\\(s\_\{t\}\\)的最佳\\(a\_\{t\}\\)，否则就算不出\\(r\_\{t\}\\)了；而Q函数是关于s、a的二元函数，不需要知道最佳\\(a\_\{t\}\\)，而仅仅需要知道\\( r\_\{immediate\}(s,a) \\)的值（右边的\\(  \\gamma \\max \_\{a'\}Q(s',a') \\)是递归式，熟悉动态规划的童鞋就知道Q可以计算出来的，实际上Q就是一个[Bellman方程](https://en.wikipedia.org/wiki/Bellman_equation)）；当算出所有Q(s,a)的值后，根据\\( a\_\{t\}  = argmax Q(s\_\{t\},a) \\)，就可以知道\\( \\pi \^\{\*\} \\)。

Q学习算法的流程如下：

1. 建一个二维表Q(s,a)，并把所有表项Q(s,a)初始化成0

2. 重复迭代：
	1. 根据当前状态s，选一个动作a并执行
	2. 得到立即奖励r：\\( r = R\_\{ a \}(s, s')  \\)
	4. 更新表项：\\( Q(s,a) = r + \\gamma \\max \_\{a'\}Q(s', a')  \\) 【向后传播(back propagation)】
	5. 进入新状态s'：\\(  s = s' \\)