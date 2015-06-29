---
layout: post
title: leetcode题解 problem120 Triangle
published: false
---

Given a triangle, find the minimum path sum from top to bottom. Each step you may move to adjacent numbers on the row below.

For example, given the following triangle

- [
- ........[**2**],
- .......[**3**,4],
- .....[6,**5**,7],
- ....[4,**1**,8,3]
- ]


The minimum path sum from top to bottom is 11 (i.e., 2 + 3 + 5 + 1 = 11).

Note:

Bonus point if you are able to do this using only O(n) extra space, where n is the total number of rows in the triangle.

```c
class Solution {
public:
    int minimumTotal(vector<vector<int>>& triangle) {
        
    }
};
```


### 题意：

自顶向下寻找一条路径使得路径上每个节点的值的和，是所有路径中最小的。限制条件：每次只能选下一行的邻接节点。


### 题解：

