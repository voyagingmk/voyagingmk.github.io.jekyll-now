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

可以理解为B先做了一次镜像，然后再和A做并集运算。

所以，说到GJK的Minkowski运算时，可以叫Minkowski和，也可以叫Minkowski差。anyway。

## 向量混合积

曾经，我在我的[用线性代数知识解决光线和三角形的交点问题](http://127.0.0.1:4000/triangle-intersect/)一文中提到了一个数学公式，叫**标量混合积(Scalar Triple Product)**。

而在GJK中，需要用到相似的另一个东西——**[向量混合积(Vector Triple Product)](https://en.wikipedia.org/wiki/Triple_product)**, 同时也被称为**BAC-CAB特性**:

\\[ A\times (B\times C) = B(A\cdot C) - C(A\cdot B) \\]

\\[ (A\times B)\times C = -C\times (A\times B) \\]

\\[ (A\times B)\times C = B(A\cdot C) - A(B\cdot C)  \\]

Proof: [https://en.wikipedia.org/wiki/Triple_product#Proof](https://en.wikipedia.org/wiki/Triple_product#Proof)

GJK使用的第三条公式。

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
Point support(Shape& shape1, Shape& shape2, Vector& d) {
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

## GJK主循环

为了学到真正靠谱的GJK算法，所以下面使用Box2D的b2Distance函数，作为参考对象。（找到的其他GJK代码都觉得奇奇怪怪的）

b2Distance不仅实现了GJK算法，还实现了Simplex Cache机制，即支持时间相干性，从而提升计算效率。

下面将精简b2Distance代码（去掉了Simplex Cache、input->useRadii等），只保留和GJK相关的，来方便读者理解b2Distance。

```c


void b2Distance(b2DistanceOutput* output,
				b2SimplexCache* cache,
				const b2DistanceInput* input)
{
	const b2DistanceProxy* proxyA = &input->proxyA;
	const b2DistanceProxy* proxyB = &input->proxyB;

	b2Transform transformA = input->transformA;
	b2Transform transformB = input->transformB;

	b2Simplex simplex;

	b2SimplexVertex* vertices = &simplex.m_v1;
	const int32 k_maxIters = 20;

  // saveA、saveB、saveCount保存上一轮迭代的结果，用来判重，防止循环
	int32 saveA[3], saveB[3];
	int32 saveCount = 0;

	// 这就是传说中的GJK迭代loop了
	int32 iter = 0;
	while (iter < k_maxIters)
	{
		saveCount = simplex.m_count;
		for (int32 i = 0; i < saveCount; ++i)
		{
			saveA[i] = vertices[i].indexA;
			saveB[i] = vertices[i].indexB;
		}

    // 根据当前的单纯形的顶点数量，选择不同的处理流程
		switch (simplex.m_count)
		{
		case 1:
      // 
			break;

		case 2:
			simplex.Solve2();
			break;

		case 3:
			simplex.Solve3();
			break;

		default:
			b2Assert(false);
		}

		if (simplex.m_count == 3)
		{
      // 单纯形已经有3个顶点，说明原点已经在单纯形里面了
			break;
		}

		// Get search direction.
		b2Vec2 d = simplex.GetSearchDirection();

		// Ensure the search direction is numerically fit.
		if (d.LengthSquared() < b2_epsilon * b2_epsilon)
		{
			// The origin is probably contained by a line segment
			// or triangle. Thus the shapes are overlapped.

			// We can't return zero here even though there may be overlap.
			// In case the simplex is a point, segment, or triangle it is difficult
			// to determine if the origin is contained in the CSO or very close to it.
			break;
		}

		// Compute a tentative new simplex vertex using support points.
		b2SimplexVertex* vertex = vertices + simplex.m_count;
		vertex->indexA = proxyA->GetSupport(b2MulT(transformA.q, -d));
		vertex->wA = b2Mul(transformA, proxyA->GetVertex(vertex->indexA));
		b2Vec2 wBLocal;
		vertex->indexB = proxyB->GetSupport(b2MulT(transformB.q, d));
		vertex->wB = b2Mul(transformB, proxyB->GetVertex(vertex->indexB));
		vertex->w = vertex->wB - vertex->wA;

		// Iteration count is equated to the number of support point calls.
		++iter;
		// Check for duplicate support points. This is the main termination criteria.
		bool duplicate = false;
		for (int32 i = 0; i < saveCount; ++i)
		{
			if (vertex->indexA == saveA[i] && vertex->indexB == saveB[i])
			{
				duplicate = true;
				break;
			}
		}

		// If we found a duplicate support point we must exit to avoid cycling.
		if (duplicate)
		{
			break;
		}

		// New vertex is ok and needed.
		++simplex.m_count;
	}

	// Prepare output.
	simplex.GetWitnessPoints(&output->pointA, &output->pointB);
	output->distance = b2Distance(output->pointA, output->pointB);
	output->iterations = iter;

	// Cache the simplex.
	simplex.WriteCache(cache);

	// Apply radii if requested.
	if (input->useRadii)
	{
		float32 rA = proxyA->m_radius;
		float32 rB = proxyB->m_radius;

		if (output->distance > rA + rB && output->distance > b2_epsilon)
		{
			// Shapes are still no overlapped.
			// Move the witness points to the outer surface.
			output->distance -= rA + rB;
			b2Vec2 normal = output->pointB - output->pointA;
			normal.Normalize();
			output->pointA += rA * normal;
			output->pointB -= rB * normal;
		}
		else
		{
			// Shapes are overlapped when radii are considered.
			// Move the witness points to the middle.
			b2Vec2 p = 0.5f * (output->pointA + output->pointB);
			output->pointA = p;
			output->pointB = p;
			output->distance = 0.0f;
		}
	}
}


```



## 参考资料

[Algorithms for the computation of the
Minkowski difference](file:///Users/wyman/Downloads/Tomiczkova.pdf)

[http://www.dyn4j.org/2010/04/gjk-gilbert-johnson-keerthi/](http://www.dyn4j.org/2010/04/gjk-gilbert-johnson-keerthi/)

[https://github.com/kroitor/gjk.c](https://github.com/kroitor/gjk.c)