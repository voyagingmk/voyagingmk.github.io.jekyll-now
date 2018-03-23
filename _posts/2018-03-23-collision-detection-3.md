---
layout: post_latex
title: 碰撞检测算法(三)：增强GJK详解
tags: ['collision detection']
published: false
---


增强GJK的知识点:

- witness point
- [EPA](http://www.dyn4j.org/2010/05/epa-expanding-polytope-algorithm/)算法


原始GJK告诉调用者2个几何体有没发生碰撞，而增强GJK不仅告知有没碰撞，还返回了碰撞点、碰撞距离信息。
