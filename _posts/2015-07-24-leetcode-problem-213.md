---
layout: post
title: leetcode题解 problem213 House Robber II
published: true
tags: ['leetcode']
---

> After robbing those houses on that street, the thief has found himself a new place for his thievery so that he will not get too much attention. This time, all houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, the security system for these houses remain the same as for those in the previous street.

> Given a list of non-negative integers representing the amount of money of each house, determine the maximum amount of money you can rob tonight without alerting the police.


### 题意：
	
["House Robber"](http://www.qiujiawei.com/leetcode-problem-198/)的变种（尼玛又改需求了摔)。改动的地方是，房子分布从一条线变成了一个环，首尾相接了。依然是求最大值。

<!--more-->

### 题解：

变成环后，其实还是可以用动态规划来解。

f(n) : 代表窃贼在前n个房子最多能拿到多少钱

在变成环后，f(n)不能容许同时盗窃第1和第n个房子的情况。那么就分情况解决。

1. 绝对不偷第1个房子，只在其余房子中偷。也就是排除掉第1个房子，在剩余的第2->n个房子里偷；
2. 绝对不偷第n个房子，那么其实就是求f(n - 1)

按照这2种情况计算出的f1、f2，求出max(f1，f2)，就是要得到的解。

代码如下：

{% highlight cpp linenos %}
	int rob(vector<int>& nums) {
		if (nums.size() == 0)
			return 0;
		if (nums.size() == 1)
			return nums[0];
		int pre = 0, cur1 = 0, cur2 = 0, temp = -1;
		for (int i = 0, size = nums.size(); i < size - 1; ++i){
			temp = cur1;
			cur1 = max(nums[i] + pre, cur1);
			pre = temp;
		}
		pre = 0;
		for (int i = 1, size = nums.size(); i < size; ++i){
			temp = cur2;
			cur2 = max(nums[i] + pre, cur2);
			pre = temp;
		}
		return max(cur1, cur2);
	}
{% endhighlight %}