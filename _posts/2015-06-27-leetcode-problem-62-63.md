---
layout: post
title: leetcode题解 problem 62 63 Unique Paths I & II
published: true
tags: ['leetcode']
---

A robot is located at the top-left corner of a m x n grid (marked 'Start' in the diagram below).

The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).

How many possible unique paths are there?

<!--more-->

{% highlight cpp linenos %}
class Solution {
public:
	int uniquePaths(int m, int n) {

    }
};
{% endhighlight %}


### 题意：

求路径总数，每次只能往右或往下走


### 题解：

入门级别动态规划题目。

列下状态转移方程：

设sum(i，j)是从pos(0,0)到pos(i,j)的路径总数。

可得：

**S(i, j) = S(i - 1, j) + S(i, j - 1)**

方程的含义是：

每个格子的路径总数 等于 起点到它左边的格子的路径总数 + 起点到它上方的格子的路径总数。


### 代码（0ms RunTime)：

{% highlight cpp linenos %}
	int uniquePaths(int m, int n) {
		vector<vector<int>> sum(n);
		for (int i = 0; i < n; ++i){
			sum[i].resize(m);
		}
		for (int i = 0; i < n; ++i)
			sum[i][0] = 1;
		for (int i = 0; i < m; ++i)
			sum[0][i] = 1;

		for (int i = 1; i < n; ++i)
			for (int j = 1; j < m; ++j)
				sum[i][j] = sum[i - 1][j] + sum[i][j - 1];
		return sum[n - 1][m - 1];
	}
{% endhighlight %}


对于Unique Paths II，改变点是，有些格子变成了障碍物。其实也很简单，上面的代码稍微改下就好了。

### 代码（4ms RunTime)：

{% highlight cpp linenos %}
	int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
		int n = obstacleGrid.size();
		int m = obstacleGrid[0].size();
		vector<vector<int>> sum(n);
		for (int i = 0; i < n; ++i){
			sum[i].resize(m);
		}
		if (obstacleGrid[0][0] == 1)
			sum[0][0] = 0;
		else
			sum[0][0] = 1;
		for (int i = 1; i < n; ++i)
			if (obstacleGrid[i][0] == 1)
				sum[i][0] = 0;
			else
				sum[i][0] = sum[i-1][0];

		for (int i = 1; i < m; ++i)
			if (obstacleGrid[0][i] == 1)
				sum[0][i] = 0;
			else
				sum[0][i] = sum[0][i - 1];

		for (int i = 1; i < n; ++i)
			for (int j = 1; j < m; ++j){
				if (obstacleGrid[i][j] == 1)
					sum[i][j] = 0;
				else
					sum[i][j] = sum[i - 1][j] + sum[i][j - 1];
			}
		return sum[n - 1][m - 1];
	}
{% endhighlight %}

