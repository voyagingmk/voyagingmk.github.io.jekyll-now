---
layout: post_latex
title: 碰撞检测算法(二)：GJK详解
tags: ['collision detection']
published: true
---

GJK有以下几个知识点要掌握：

1. 闵可夫斯基运算
2. Support函数

下面，将根据这些知识点，逐步拉开GJK算法的面纱。

<!--more-->

## Minkowski 闵可夫斯基运算

### Minkowski扩大运算  [Minkowski Sum](https://en.wikipedia.org/wiki/Minkowski_addition)

\\[ A \oplus B = \\bigcup \_\{b \in B} A\^\{b\}  \\]

其中，\\(A\^\{b\} = \\{ a + b | a \\in A\\}  = A + b \\)，代表集合A整体移动b

### Minkowski收缩运算 

\\[ A \ominus B = \\bigcap \_\{b \in B} A\^\{-b\}  \\]

其中，\\(A\^\{-b\} = \\{ a - b | a \\in A\\}  = A - b \\)，代表集合A整体移动-b

### Minkowski减法运算

\\[ A - B =  A \oplus (-B)  \\]

这条公式才是真正应用到GJK算法里的公式。

## 参考资料

[Algorithms for the computation of the
Minkowski difference](file:///Users/wyman/Downloads/Tomiczkova.pdf)
