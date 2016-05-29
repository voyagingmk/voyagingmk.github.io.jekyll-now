---
layout: post_latex
title: 线性代数之伪逆矩阵(pseudoinverse matrix)
tags: ['matrix']
published: true
---

众所周知只有方阵才有逆矩阵，非方阵没有逆矩阵。这个不和谐的问题已在20世纪初被数学家[E. H. Moore](https://en.wikipedia.org/wiki/E._H._Moore)等人解决掉了，因为他们发明了**一般化的逆矩阵(generalized inverse)**，也称为**伪逆矩阵(Moore–Penrose pseudoinverse)**。

<!--more-->

# 定义

对于任意一个矩阵A，A的伪逆矩阵\\(A \^\{+\} \\)必然存在，且\\(A \^\{+\} \\)必然满足以下四个条件：

1. \\( AA \^\{+\}A = A \\)

2. \\( A \^\{+\}AA \^\{+\} = A \^\{+\} \\)

3. \\( (AA \^\{+\})\^\{*\} = AA \^\{+\} \\)

4. \\( (A \^\{+\}A)\^\{*\} = A \^\{+\}A \\)


伪逆矩阵\\( A \^\{+\} \\)的极限形式定义：

\\[ A\^\{+\} = \\lim \_\{\\delta \\searrow 0\} \(A\^\{*\}A + \\delta I\)\^\{-1\}A\^\{*\} \\]

\\[  = \\lim \_\{\\delta \\searrow 0\}A\^\{*\}\(A\^\{*\}A + \\delta I\)\^\{-1\} \\]

