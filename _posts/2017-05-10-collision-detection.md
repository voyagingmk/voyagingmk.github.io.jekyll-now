---
layout: post_latex
title: 碰撞检测算法
tags: ['collision detection']
published: true
---

碰撞检测算法，暴力解决是一个\\( O(n\^\{2\}) \\)的过程：对于场景中的每一个obj都和所有其他的obj做相交测试。2个for循环解决问题，所以时间复杂度是\\( O(n\^\{2\}) \\)，这是最坏情况了。于是可以说，现在流传的各种碰撞检测算法的存在意义都是为了降低这个复杂度\\( O(n\^\{2\}) \\)。


<!--more-->


实际可用的碰撞检测算法，一般要分2个阶段：

1. [broad phase](http://www.bulletphysics.org/mediawiki-1.5.8/index.php/Broadphase) 快速找出潜在的碰撞物体对列表，不在这个列表里的是绝对没可能碰撞的。broad phase确定了一批需要进一步检查的物体对。

2. narrow phase 准确找出发生碰撞的物体对列表。因为上一个阶段的部分物体对实际上是没有碰撞的，需要在这个阶段剔除。

broad phase用的数据结构不一定和narrow phase用的数据结构是同一个结构。

### broad phase

分2个阶段的好处是，在第一个阶段，可以用不那么精确但快速的算法，找出潜在的碰撞物体。总好过直接就是应用narrow phase的精确但缓慢的算法去处理n个物体。更深刻的原因是，如果单个物体具有复杂的几何结构，那么narrow phase的计算开销非常大。

broad phase阶段的算法和需要的数据结构数据信息和narrow phase是不一样的。

broad phase阶段要求提供物体的包围盒信息，例如AABB盒。这就是broad phase为什么快但不精确的原因：物体的几何信息被近似地压缩了。

broad phase还要求把场景所有物体的包围盒信息放进一个数据结构（一般是一个树结构）中，例如插入到一个四叉树、八叉树、AABB树等。通过这个数据结构来实现快速相交判定。例如在Box2d中，是设计了一个proxy机制，每个场景物体对应唯一一个proxyAABB盒，这些proxyAABB盒就记录在一颗称之为Dynamic AABB Tree里，然后就可以做broad phase了。

broad phase其中有一个简单算法叫[sweep and prune(SAP)](https://en.wikipedia.org/wiki/Sweep_and_prune)，本质上是利用了排序算法。第一步是初始化排序列表，列表中的元素是包围盒，可以用任意排序算法完成，例如快排；之后的排序就不是用快排了，而是用冒泡排序，为什么用冒泡排序更好呢？是因为一个默认的前提：物体的运动有**时间相关性（temporal coherence）**，即当前帧和下一帧的位置是相近的，所以在冒泡排序过程中，发生的位置交换预期都很靠近。如果这个前提不成立，例如物体会经常发生远距离瞬移，那就不能用这种算法了。

### narrow phase


## 相交判定算法

根据我的调研，在2、3维情况下，可以用SAT、GJK算法做任意凸多边形的碰撞检测；但SAT各方面都不如GJK，并且GJK算法还有更多的SAT不具备的高级特性。另外，Box2D用的是GJK算法，所以证明了GJK算法是可以应用到2维情况的。除了SAT和GJK，还有一个sweep line算法可以求出多边形的相交点，此算法内部需要用到排序算法。

### [Separating Axis Theorem, SAT, 分离轴算法](https://en.wikipedia.org/wiki/Hyperplane_separation_theorem) 


### [GJK算法](https://en.wikipedia.org/wiki/Gilbert%E2%80%93Johnson%E2%80%93Keerthi_distance_algorithm)

## 用于做碰撞检测的场景管理树

这里讨论的场景管理树，只针对碰撞检测。

### 基于空间划分的八叉树

一般说到场景管理，都会想到四叉树（八叉树的简化）、八叉树，这种基于空间划分的结构，然而，基于空间划分的树，会遇到一个十分蛋疼的问题：物体可能会overlap边界。这种情况，有几种可行的处理方案：

1. [Loose OCTree](https://anteru.net/blog/2008/11/14/315/)，松散八叉树。

大概就是说，空间划分后的各个cell bound，各对应一个loose bound（relaxing the bounds slightly！），loose bound应是cell bound的两倍大小，这个loose bound可以保证完全包含cell bound里的所有物体的包围盒。这是个重要的性质，比如说如果有一个物体的包围盒刚好和cell bound一样大，但是物体包围盒中心点刚好在cell bound里，那么此时可以保证loose bound仍然能完全包含物体包围盒。

有了这个性质后，根据任意物体的包围盒中心点，决定把它放进哪个cell的列表里。即不会出现一个物体同时存在于2个cell的情况。然后查询相交时，就好办了，只需要根据query point确定要检查的cell，不过缺点是，如果query point处于多个loose bound的重叠区域，就需要这些loose bound的cell都做一次相交判定。

2. 允许内部节点存物体的OCTree。overlap了边界的物体，通通丢到父节点去。

3. 允许一个物体同时存进多个叶子节点的OCTree。这种方案主要是怕出bug，因为2个叶子节点都存了这个物体。需要严格管理好节点的增删，防止出现不一致性。

另外，还有一个问题是：当大量物体集中于一个cell。此时八叉树基本就废了，退化成了\\( O(n\^\{2\}) \\)级别的算法了。

因此我觉得，八叉树适合处理的场景是，物体分布均匀、静态物体较多、动态物体较少的情况。


### [btDbvt - Dynamic AABB Tree](http://www.bulletphysics.org/mediawiki-1.5.8/index.php?title=BtDbvt_dynamic_aabb_tree)

这个btDbvt数据结构是从Box2D、Bullet源码中发现的，并且Box2D在注释里写到Box2D的Dynamic AABB Tree是参考了Bullet的，那么可以知道Bullet的Dynamic AABB Tree才是根源。

更让人激动的是，Bullet的官网有介绍这个数据结构的[资料](http://www.bulletphysics.org/mediawiki-1.5.8/index.php/BtDbvt_dynamic_aabb_tree)。

btDbvt是一个**基于物体集合划分的二叉树**，注意和八叉树的区别，八叉树是基于空间划分的。btDbvt另一个性质是，它考虑到了时间相干性，这也是这个数据结构更适合物体引擎的原因，因为物理世界里，物体不会发生瞬移。

时间相干性是用了一个fatBound的机制体现的，大概意思是，每个物体的proxyBound都会比实际的Bound大那么一点，当物体移动时，如果移动后的没有超过fatBound范围，那么不会发生节点的移动。从而降低树的更新频率。

先贴出算法伪代码：


### 场景管理树的比较


