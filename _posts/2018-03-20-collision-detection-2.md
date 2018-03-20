---
layout: post_latex
title: 碰撞检测算法(二)：GJK详解
tags: ['collision detection']
published: true
---

GJK的特性：

- GJK是二元运算，输入2个几何体信息，返回碰撞判定信息
- GJK是维度无关的算法，2D、3D游戏都可以用

GJK包含的数学知识点：

- Minkowski数学
- 向量混合积

GJK算法原理：

- Support函数

本文将详解GJK的来龙去脉。

<!--more-->

# 数学知识点

## Minkowski 闵可夫斯基数学

### Minkowski扩大运算  [Minkowski Sum](https://en.wikipedia.org/wiki/Minkowski_addition)

\\[ A \oplus B = \\bigcup \_\{b \in B} A\^\{b\}  \\]

其中，\\(A\^\{b\} = \\{ a + b | a \\in A\\}  = A + b \\)，代表集合A整体移动b

（可以理解为几何形状的Union并集运算）

### Minkowski收缩运算 

\\[ A \ominus B = \\bigcap \_\{b \in B} A\^\{-b\}  \\]

其中，\\(A\^\{-b\} = \\{ a - b | a \\in A\\}  = A - b \\)，代表集合A整体移动-b

（可以理解为几何形状的Intersect交集运算）

### Minkowski减法运算（Minkowski差)

\\[ A - B =  A \oplus (-B)  \\]

这条公式才是真正应用到GJK算法里的公式。

（可以理解为B先做了一次镜像，然后再和A做并集运算）


## 向量混合积

曾经，我在我的[用线性代数知识解决光线和三角形的交点问题](http://127.0.0.1:4000/triangle-intersect/)一文中提到了一个数学公式，叫**标量混合积(Scalar Triple Product)**。

而在GJK中，需要用到相似的另一个东西——**[向量混合积(Vector Triple Product)](https://en.wikipedia.org/wiki/Triple_product)**, 同时也被称为**BAC-CAB特性**:

\\[ A\times (B\times C) = B(A\cdot C) - C(A\cdot B) \\]

\\[ (A\times B)\times C = -C\times (A\times B) \\]

\\[ (A\times B)\times C = -A(B\cdot C) + B(A\cdot C) \\]

Proof: [https://en.wikipedia.org/wiki/Triple_product#Proof](https://en.wikipedia.org/wiki/Triple_product#Proof)

# GJK算法原理

## GJK的时间复杂度问题

假设2个几何体的顶点数分别为n和m，最坏情况时，GJK要进行n x m次Minkowski减法运算，非常慢。然而，GJK不至于这么暴力。

GJK实际上是一个**迭代式**的算法，迭代次数上限就是n x m。

为了优化迭代次数，GJK定义了一个方向向量\\(d\\)，\\(d\\)贯穿了整个GJK算法。\\(d\\)如何选取，基本就决定了GJK的收敛速度。


## 几何体的定义：连续or离散

从GJK用到的数学知识来看，GJK并不要求输入的2个几何体必须是离散定义的几何体。

所以GJK的一个优点是，GJK是支持曲面几何体的碰撞检测的。曲面是什么？曲面就是用数学公式描述的连续几何体。

实际上在计算机领域，连续几何体总可以转换成离散的点集合。

继续下面的讨论之前，先定义一下本文中的几何体：由离散的有限的n个顶点唯一确定的凸几何体(Convex)。

\\[ One\ Geometry\ Shape = A\ Convex\ Defined\ By\ A\ Set\ Of\ Vertices \\]


## Support函数

伪代码：

```c
// 给定2个静态几何形状和一个方向向量，求出经过Minkowski减法运算得到的点（唯一）
Point support(Shape shape1, Shape shape2, Vector d) {
  // 沿着d方向找出shape1中最远的点p1
  Point p1 = shape1.getFarthestPointInDirection(d);
  // 沿着-d方向找出shape2中最远的点p2
  Point p2 = shape2.getFarthestPointInDirection(d.negative());
  // Minkowski减法运算（这里其实只是普通的向量运算）
  Point p3 = p1.subtract(p2);
  // p3刚好就在shape1、shape2闵可夫斯基差的这个新几何体的边上
  return p3;
}
```

## 参考资料

[Algorithms for the computation of the
Minkowski difference](file:///Users/wyman/Downloads/Tomiczkova.pdf)
