---
layout: post_latex
title: 法向量矩阵
tags: ['matrix','linear algebra','math']
published: true
---

在对vertex做model、view、projection计算过程中，还有一个要同时考虑的东西是**法向量的矩阵变换**。

normal的变换并不能直接使用vertex的变换。如果直接使用的话，就会放了一个定时炸弹在你的shader里面，当哪天你的object做了一个不uniform的缩放变换时，例如x、y轴放大1.5倍，而z轴放大3倍，输出的normal就会出错，进而导致光照计算出错。

下面开始推导正确的只属于的normal的变换矩阵。


### 推导

在做顶点变换时，model、view、projection三个连续变换矩阵一般可以合并为一个变换矩阵，设为M。

假设现在要渲染一个三角形，它的三个顶点分别为P1、P2、P3。

那么可以设，做M变换前，有切向量T = P2 - P1， P2' = P2 * M， P1‘ = P1 * M。

且有关系式：

T * M = (P2 - P1) * M = P2 * M - P1 * M = P2' - P1' =  T'

M变换后，T’是P2、P1的切向量，且有T * M = T'。也就是说，M变换对切向量也同时成立。

现在，假设做M变换前三角形面片的法向量为N，则有：

\\[ N \cdot T = N\^\{T\}T = 0 \\]

设M变换后，新的三角形P1'、P2'、P3'的法向量为N'，那么可以列出等式：


\\[ N' \\cdot T' = (GN) \cdot (MT) \\]

其中，新出现的G是法向量专属的变换矩阵，也是我们要求出来的东西。

因为上式是一个点积，所以有：

\\[ (GN) \cdot (MT) =  (GN)\^\{T\}(MT) = N\^\{T\}G\^\{T\}MT  \\]

回顾刚才的一个式子：\\( N\^\{T\}T = 0 \\)，那么可以假设存在一个合适的G使得等式\\( G\^\{T\}M = I \\)成立，从而使\\( N' \\cdot T' = 0 \\) 也成立。

解开\\( G\^\{T\}M = I \\)很简单：

\\[ G\^\{T\} = M\^\{-1\} \\]

\\[ G = (M\^\{-1\})\^\{T\} \\]

G就是我们要求的normal matrix，相应的G变换的shader代码就是：

```c
    G = transpose(inverse(mat3(M));
```

注意，这里先对mat4的M做了个mat3的操作。这是为了去掉M变换的translation信息（因为normal和position不同，它是个朝向向量）。


<!--more-->
