---
layout: post
title: leetcode题解 problem 221 Maximal Square
published: true
---

> Given a 2D binary matrix filled with 0's and 1's, find the largest square containing all 1's and return its area.

> For example, given the following matrix:

> 1 0 1 0 0
> 
> 1 0 1 1 1
> 
> 1 1 1 1 1
> 
> 1 0 0 1 0

> Return 4.

### 题意：

给定一个01矩阵，求矩阵里最大的1字正方形的面积


### 题解：

考虑动态规划来解题。

设DP(i,j)是子矩阵p(0,0)->p(i,j)里，以p(i,j)为右下顶点的正方形的最大边长(i属于x轴，j属于y轴）。那么DP(i,j)的最大值的平方，就是所要求的解。

以题目的矩阵来说，可以很容易看出DP(i,j)值：

DP(0,0) = 1  DP(1,0) = 0  DP(2,0) = 1  DP(3,0) = 0  DP(4,0) = 0

DP(0,1) = 1  DP(1,1) = 0  DP(2,1) = 1  DP(3,1) = 1  DP(4,1) = 1

DP(0,2) = 1  DP(1,2) = 1  DP(2,2) = 1  DP(3,2) = 2  DP(4,2) = 2

DP(0,3) = 1  DP(1,3) = 0  DP(2,3) = 0  DP(3,3) = 1  DP(4,3) = 0


DP(i,j)的值很好算，有一些规律存在：

if j == 0: DP(i,0) = M(i,0)

elif i == 0: DP(0,j) = M(0,j)

else if M(i,j)==0: DP(i,j) = 0

else: DP(i,j) = min( DP(i - 1, j), DP(i, j - 1), DP(i - 1, j - 1)) + 1

前2个if处理了DP(i,j)的边界值问题，后2个if就是DP(i,j)的状态转移方程了。

我的实现代码如下（runtime 12 ms）：

```c
	int maximalSquare(vector<vector<char>>& matrix) {
		if (matrix.size() == 0)
			return 0;
		if (matrix[0].size() == 0)
			return 0;
		int m, n;//row col
		char result = '0';
		m = matrix.size();
		n = matrix[0].size();
		vector<vector<char> > dp(m);
		for (int i = 0; i < m; ++i){
			dp[i].resize(n);
		}
		for (int i = 0; i < m; ++i){
			dp[i][0] = matrix[i][0];
			if (result < dp[i][0])
				result = dp[i][0];
		}
		for (int i = 0; i < n; ++i){
			dp[0][i] = matrix[0][i];
			if (result <dp[0][i])
				result = dp[0][i];
		}
		for (int i = 1; i < m ; ++i)
			for (int j = 1; j < n; ++j){
				if (matrix[i][j] == '0')
					dp[i][j] = '0';
				else
				{
					dp[i][j] = std::min(std::min(dp[i - 1][j], dp[i][j - 1]), dp[i - 1][j - 1]) + 1;
					if (result < dp[i][j])
						result = dp[i][j];
				}
			}
		return int(result - '0') * int(result - '0');
	}
```