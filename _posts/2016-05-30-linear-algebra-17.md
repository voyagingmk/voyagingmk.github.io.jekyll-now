---
layout: post_latex
title: 线性代数之主成分分析(PCA)算法
tags: ['matrix','math']
published: true
---

PCA(Principal Component Analysis)的主要应用场景是：在大数据集中找出关键的信息并剔除冗余的信息。根据这个特性，PCA也可以用来做信息压缩(有损)、特征提取。不过在本文中，只会对PCA的数学原理进行阐述。

另外，PCA可以说是Machine Learning领域的自编码机(AutoEncoder,AE)的基础。主要区别在于，PCA是线性算法，而AE则不一定。所以在学习AutoEncoder之前，有必要先将PCA搞清楚。

<!--more-->

# Part I

设向量\\( \\vec x \\)表示对某个特征的n次采样(测量), 那么如果有m个不同的特征，就组成了一个\\(m\\times n \\)的矩阵\\( X \\)：

{% assign X =  "\\vec x\_\{1\},  \\vec x\_\{2\},  \\vdots , \\vec x\_\{m\}" | split: ',' %}

\\[ X = {% include render_matrix_raw.html mat = X  row = 4 col = 1 %}  \\]

然后问题来了：每个特征之间是否是**相互独立(independant)**的？如果是，那么说明这m个特征是良好的，可以直接拿去应用到任务中(譬如基于这些特征做一个分类器)；如果不是，那么就说明有特征是多余的，譬如\\(  \\vec x\_\{a\} \\)、\\(  \\vec x\_\{b\} \\)分别用米和英尺记录了同一个特征，虽然数值不一样，然而并没有什么卵用。

量化特征与特征之间的关系的最好办法是用**方差**([Variance](https://en.wikipedia.org/wiki/Variance))和**协方差**([Covariance](https://en.wikipedia.org/wiki/Covariance))，这2者又共同涉及到了更基础的概念**数学期望**([Expected Value](https://en.wikipedia.org/wiki/Expected_value))和**均值**([Mean](https://en.wikipedia.org/wiki/Mean))。先简单过一遍这4个东西的公式。

### 数学期望和均值

数学期望公式：

\\[ E[\\vec x] = \\sum \_\{i=1\}\^\{n\}x\_\{i}p\_\{i\} \\]

当每个\\( x\_\{i\} \\)的出现概率相等时(均匀分布)，有\\( p\_\{i\} = \\frac \{1\}\{n\} \\)，所以上式可简化成:

\\[ E[\\vec x] = \\frac \{1\}\{n\}\\sum \_\{i=1\}\^\{n \}x\_\{i} \\]

上式其实也就是均值\\( \\overline \{x\} \\)的定义，所以当\\(x\_\{i\}\\)均匀分布时，有：

\\[  E[\\vec x] =  \\overline \{x\} \\]

有时候也用\\( \\mu \\)来指代Mean。

### 方差和协方差

方差:

\\[ Var(\\vec x) = E[ (\\vec x - E[\\vec x])\^\{2 \} ] = E[ (\\vec x - E[\\vec x])(\\vec x -  E[\\vec x]) ]  \\]

协方差:

\\[ Cov(\\vec x, \\vec y) = E[ (\\vec x -  E[\\vec x])(\\vec y -  E[\\vec y]) ] \\]

可以发现方差是协方差的特殊情况:

\\[ Var(\\vec x) = Cov(\\vec x, \\vec x) \\]

### 协方差矩阵

在[线性代数之各种各样的矩阵](http://daobiao.win:4000/linear-algebra-7/)最后面已经提到了协方差矩阵(Covariance matrix):


{% assign C =  "E[(\\vec x\_\{1\} - \\mu\_\{1\})(\\vec x\_\{1\} - \\mu\_\{1\})],  E[(\\vec x\_\{1\} - \\mu\_\{1\})(\\vec x\_\{2\} - \\mu\_\{2\})],  \\cdots , E[(\\vec x\_\{1\} - \\mu\_\{1\})(\\vec x\_\{m\} - \\mu\_\{m\})],           E[(\\vec x\_\{2\} - \\mu\_\{2\})(\\vec x\_\{1\} - \\mu\_\{1\})],  E[(\\vec x\_\{2\} - \\mu\_\{2\})(\\vec x\_\{2\} - \\mu\_\{2\})],  \\cdots , E[(\\vec x\_\{2\} - \\mu\_\{2\})(\\vec x\_\{m\} - \\mu\_\{m\})],  \\vdots , \\vdots ,  \\ddots , \\vdots ,        E[(\\vec x\_\{m\} - \\mu\_\{m\})(\\vec x\_\{1\} - \\mu\_\{1\})],  E[(\\vec x\_\{m\} - \\mu\_\{m\})(\\vec x\_\{2\} - \\mu\_\{2\})],  \\cdots , E[(\\vec x\_\{m\} - \\mu\_\{m\})(\\vec x\_\{m\} - \\mu\_\{m\})]" | split: ',' %}

\\[ C = {% include render_matrix_raw.html mat = C  row = 4 col = 4 %}  \\]


### 当Mean等于0时的情况

当Mean等于0时，上面的协方差矩阵变成：


{% assign C2 =  "E[\\vec x\_\{1\}\\vec x\_\{1\}],  E[\\vec x\_\{1\} \\vec x\_\{2\}],  \\cdots , E[\\vec x\_\{1\}\\vec x\_\{m\}],           E[\\vec x\_\{2\}\\vec x\_\{1\}],  E[\\vec x\_\{2\}\\vec x\_\{2\}],  \\cdots , E[\\vec x\_\{2\}\\vec x\_\{m\}],  \\vdots , \\vdots ,  \\ddots , \\vdots ,        E[\\vec x\_\{m\}\\vec x\_\{1\}],  E[\\vec x\_\{m\}\\vec x\_\{2\}],  \\cdots , E[\\vec x\_\{m\}\\vec x\_\{m\}]" | split: ',' %}

\\[ C = {% include render_matrix_raw.html mat = C2  row = 4 col = 4 %}  \\]

再假设\\( \\vec x \\)每个分量的取值是均匀分布的，那么根据上面的定义，有：

\\[E[\\vec x\_\{a\}\\vec x\_\{b\}] = \\frac \{1\}\{n\}\\sum \_\{i=1\}\^\{n\} \\vec x\_\{ai\}\\vec x\_\{bi\} , 1 \\leq a\\leq m, 1 \\leq b\\leq m  \\]

代入上式，得到：

{% assign C3 =  "\\sum \_\{i=1\}\^\{n\} \\vec x\_\{1\}\\vec x\_\{1\},  \\sum \_\{i=1\}\^\{n\} \\vec x\_\{1\}\\vec x\_\{2\},  \\cdots , \\sum \_\{i=1\}\^\{n\} \\vec x\_\{1\}\\vec x\_\{m\},           \\sum \_\{i=1\}\^\{n\} \\vec x\_\{2\}\\vec x\_\{1\},  \\sum \_\{i=1\}\^\{n\} \\vec x\_\{2\}\\vec x\_\{2\},  \\cdots , \\sum \_\{i=1\}\^\{n\} \\vec x\_\{2\}\\vec x\_\{m\},  \\vdots , \\vdots ,  \\ddots , \\vdots ,       \\sum \_\{i=1\}\^\{n\} \\vec x\_\{m\}\\vec x\_\{1\},  \\sum \_\{i=1\}\^\{n\} \\vec x\_\{m\}\\vec x\_\{2\},  \\cdots , \\sum \_\{i=1\}\^\{n\} \\vec x\_\{m\}\\vec x\_\{m\}" | split: ',' %}

\\[ C = \\frac \{1\}\{n\}{% include render_matrix_raw.html mat = C3  row = 4 col = 4 %}  \\]

再设一个矩阵X：

{% assign X1  =  "\\vec x\_\{1\}, \\vec x\_\{2\}, \\vdots , \\vec x\_\{m\}" | split: ',' %}
{% assign X2  =  "\\vec x\_\{1\}, \\vec x\_\{2\}, \\cdots , \\vec x\_\{m\}" | split: ',' %}

\\[ X = {% include render_matrix_raw.html mat = X1  row = 4 col =1 %}  \\]


\\[ X\^\{T\} = {% include render_matrix_raw.html mat = X2  row = 1 col = 4 %}  \\]

于是有：

\\[ C = \\frac \{1\}\{n\}XX\^\{T\} \\]


**总结下**，对符合均匀分布的、且均值等于0的\\(\\vec x\_\{i, 1\\leq i \\leq m\}\\)，它的协方差矩阵如下：

\\[ X\^\{T\} = {% include render_matrix_raw.html mat = X2  row = 1 col = 4 %}  \\]

\\[ C = \\frac \{1\}\{n\}XX\^\{T\} \\]

为了下文能继续推导，需要把C记为\\( C\_\{x\} \\)。

# PART II

根据上面得到的协方差矩阵的公式，可以知道：

- \\( C\_\{x\} \\)是一个对称方阵

- \\( C\_\{x\} \\)的对角线上的元素分别代表了对某个特征的n次测量的方差

- \\( C\_\{x\} \\)的非对角线上的元素代表了任意2个特征之间的协方差

开始进入到PCA的环节。PCA的目标是提炼出\\( C\_\{x\} \\)的关键信息并剔除冗余信息，这个过程用线性代数表示就是：

\\[ Y  = PX  \\]

这里面P就是我们需要的目标矩阵。而关于矩阵Y的协方差矩阵\\( C\_\{y\} \\)的特性是：

- \\( C\_\{y\} \\)的对角线上的元素(方差)尽可能大（增大信号）

- \\( C\_\{y\} \\)的非对角线上的元素(协方差)应该等于零，因此\\( C\_\{y\} \\)还是一个对角线矩阵


\\( C\_\{x\} \\)、\\( C\_\{y\} \\)、P的关系是：

\\[  C\_\{y\} =  \\frac \{1\}\{n\}YY\^\{T\} \\]

\\[  = \\frac \{1\}\{n\}(PX)(PX)\^\{T\} \\]

\\[  = \\frac \{1\}\{n\}PXX\^\{T\}P\^\{T\} \\]

\\[  = P(\\frac \{1\}\{n\}XX\^\{T\})P\^\{T\} \\]

\\[  = PC\_\{x\}P\^\{T\} \\]

即：

\\[   C\_\{y\} = PC\_\{x\}P\^\{T\} \\]


PCA的求解方法多种多样，下面展示最经典的解法——特征值分解。


## 基于特征值分解的PCA



在[矩阵的特征值、特征向量、特征矩阵、迹、特征值分解](http://127.0.0.1:4000/linear-algebra-6/)一文中提到了对称方阵的特征值分解公式：

\\[ A =  S\\Lambda S\^\{-1\} = S\\Lambda S\^\{T\} \\]

矩阵\\( \\Lambda \\)是对角矩阵，对角线上的元素为特征值；矩阵S是一个行向量为特征向量的矩阵，\\( S\^\{-1\} = S\^\{T\} \\)。

有了这个公式后，立即可以知道对称矩阵\\( C\_\{x\} \\)的特征值分解(对角化)为：

\\[ C\_\{x\} =  S\\Lambda S\^\{T\} \\]

将其代入上面的公式，有:

\\[C\_\{y\} = PS\\Lambda S\^\{T\}P\^\{T\}   \\]

这里可以大胆做个假设：\\( P \\equiv  S\^\{T\} \\)。又因为 \\( S\^\{-1\} = S\^\{T\} \\)， 则有:

\\[ P\^\{-1\} =  (S\^\{T\})\^\{-1\} = (S\^\{-1\})\^\{-1\} = S = P\^\{T\} \\]

所以：

\\[ C\_\{y\} = PS\\Lambda S\^\{T\}P\^\{T\} = PP\^\{T\} \\Lambda PP\^\{T\} = PP\^\{-1\} \\Lambda PP\^\{-1\} = \\Lambda   \\]

总结：

**当\\( P \\)(主成分矩阵)是\\( C\_\{x\} \\)的特征向量矩阵\\( S \\)时，\\( C\_\{y\} \\)是特征值矩阵\\( \\Lambda\\)**。


## 基于奇异值分解的PCA

关于SVD的讨论我都会追加[线性代数之奇异值(SVD)分解](http://127.0.0.1:4000/linear-algebra-9/)一文中，在这里不展开对SVD的详细讨论。

SVD分解公式：

\\[ M = UΣV\^\{*\} \\]

（其中各个矩阵的含义就不赘述了）

和PCA最相关的SVD其中一条性质：

\\[ M\^\{\*\}M = V\\Sigma \^\{\*\}U\^\{\*\}U\\Sigma V\^\{\*\} = V\\Sigma \^\{\*\}\(U\^\{\*\}U\)\\Sigma V\^\{\*\} = V\\Sigma \^\{\*\}\\Sigma V\^\{\*\} = V\(\\Sigma  \^\{\*\}\\Sigma \)V\^\{-1\}  \\]

当元素是实数时，有：

\\[ M\^\{T\}M = V\(\\Sigma  \^\{T\}\\Sigma \)V\^\{-1\}  \\]

注意，这个公式包含了一个事实：\\( M\^\{T\}M \\)的特征值分解等于\\( V(\\Sigma  \^\{T\}\\Sigma \)V\^\{-1\}  \\)。

现在，假设有一个矩阵Y，Y满足：

\\[ Y = \\frac \{ 1 \}\{ \\sqrt \{n\} \}X\^\{T\} \\]

那么有：

\\[ Y\^\{T\}Y = (\\frac \{ 1 \}\{ \\sqrt \{n\} \}X\^\{T\})\^\{T\}\\frac \{ 1 \}\{ \\sqrt \{n\} \}X\^\{T\} \\]

\\[ = \\frac \{ 1 \}\{ \\sqrt \{n\} \}\\frac \{ 1 \}\{ \\sqrt \{n\} \} (X\^\{T\})\^\{T\}X\^\{T\} \\]

\\[ = \\frac \{ 1 \}\{ n \}XX\^\{T\} \\]

\\[ = C\_\{x\} \\]

而Y的SVD分解为：

\\[ Y = UΣV\^\{*\} \\]

所以有：

\\[ Y\^\{T\}Y = V\(\\Sigma  \^\{T\}\\Sigma \)V\^\{-1\} = C\_\{x\} \\] 

这时候事情又和特征值分解联系上了，在上一小节我们已经知道**当\\( P \\)是\\( C\_\{x\} \\)的特征向量矩阵\\( S \\)时，\\( C\_\{y\} \\)是特征值矩阵\\( \\Lambda\\)**，而在这个式子中，\\(V\\)就是\\( C\_\{x\} \\)的特征向量矩阵！

整理一下这个解法的思路：

1. 先设\\( Y = \\frac \{ 1 \}\{ \\sqrt \{n\} \}X\^\{T\} \\)

2. 对矩阵Y做SVD分解，得到矩阵V，V就是关于X的主成分矩阵


# 参考资料

A Tutorial on Principal Component Analysis, Jonathon Shlens