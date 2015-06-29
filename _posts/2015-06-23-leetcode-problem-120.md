---
layout: post
title: leetcode题解 problem120 Triangle
published: true
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

很明显是动态规划方面的题（实际上我就是特地先做动态规划的题=。=）。

列下状态转移方程：

设总共有N层，T=triangle，每个节点的值表示为T(n,i)，从根节点到每个节点的最优路径的值总和为S(n,i)，
那么可以得到：

**S(n,i) = MAX( S(n-1, i-1), S(n-1, i) ) + T(n,i)**

初始状态：S(0,0) = T(0,0)

然后自顶向下地迭代一轮，即可求得最下面一层的S(n, i)，遍历这一层，找出S的最小值即可。

空间复杂度O(n)，时间复杂度O(n)

### 代码：


```c
	int minimumTotal(vector<vector<int>>& triangle) {
		if (triangle.size() == 0)
			return 0;
		if (triangle.size() == 1)
			return triangle[0][0];
		vector<vector<int>> sum(triangle.size());
		int maxLayer = triangle.size();
		for (int i = 0; i < maxLayer; ++i){
			sum[i].resize(i + 1);
		}
		sum[0][0] = triangle[0][0];
		int leftPathSum, righPathSum;
		for (int layer = 1 ; layer < maxLayer; ++layer){
			for (int i = 0; i <= layer; ++i){
				leftPathSum = INT_MAX;
				righPathSum = INT_MAX;
				if (i - 1 >= 0)
					leftPathSum = triangle[layer][i] + sum[layer - 1][i - 1];
				if (i < layer)
					righPathSum = triangle[layer][i] + sum[layer - 1][i];
				sum[layer][i] = min(leftPathSum, righPathSum);
			}
		}
		int result = INT_MAX;
		for (int i = 0, len = triangle.size(); i < len; ++i){
			if (sum[maxLayer - 1][i] < result)
				result = sum[maxLayer - 1][i];
		}
		return result;
 	}
```