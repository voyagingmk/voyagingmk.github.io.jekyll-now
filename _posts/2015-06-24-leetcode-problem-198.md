---
layout: post
title: leetcode题解 problem198 House Robber
published: true
categories: leetcode
---

> You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security system connected and it will automatically contact the police if two adjacent houses were broken into on the same night.
> 
> Given a list of non-negative integers representing the amount of money of each house, determine the maximum amount of money you can rob tonight without alerting the police.

```c
class Solution {
public:
    int rob(vector<int>& nums) {
    }
};
```


### 题意：
	
一个坏蛋要去盗窃一排房子，每个房子都藏有一笔钱（函数参数nums记录了每个房子的钱的数量），盗窃的限制条件是，如果某两个相邻的房子同时被盗了，会触发安保系统，也就是说不能连续地盗窃房子。
求：这个坏蛋最多能盗取多少钱？

### 题解：

看得出题目是要求一个最优解，即安排这个窃贼的行动路线，让他拿到最多的钱。路线有很多种，目标是求最优解，似乎是动态规划题目？那么就试试分析状态转移方程：

f(n) : 代表窃贼在前n个房子最多能拿到多少钱，n==nums.size()时，即是我们要的解

f(0) : 窃贼在前0个房子最多能拿到多少钱（一家都不偷），显然 **f(0) == 0**

f(1) : 窃贼在前1个房子最多能拿到多少钱（只偷一家），显然 **f(1) == nums[0]**

f(2) : 窃贼在前2个房子最多能拿到多少钱，因为限制条件存在，窃贼只能选偷第1个房子或第2个房子，取决于哪个房子的钱多，那么 **f(2) = max(nums[0], nums[1])**

f(3) : 总共有4种路线：[0,2]、[0]、[1]、[2]，而因为nums[i]>=0（钱是非负数），那么可以剔除掉[0]、[2]这2个路线（偷了0后还可以偷2，不会亏，为什么不偷呢？），所以只剩[0,2]、[1]2种，于是 **f(3) = max(nums[1], nums[0] + nums[2])**

从而得到方程：

f(n) = max( f(n-1), nums[n-1] + f(n-2) ) 

对方程的解释：

偷前n个房子的最优解（即钱的总数），等于：偷前(n-1)个房子的最优解、偷前(n-2)个房子的最优解 + 第n个房子的钱，取这两者中较大的那个。

验证一下该方程是否合理：

**f(1)** = nums[0] = max(0，nums[0]) = **max(f(0), nums[0] + f(-1))** =  max(f(0), nums[0] + f(0)) （ 因为n<0时没有意义了，所以f(n<0) = f(0) )

**f(2)** = max(nums[0], nums[1]) = **max( f(1), nums[1] + f(0) )**

f(3) = max(nums[1], nums[0] + nums[2]) = max( **max(nums[0], nums[1])**, nums[0] + nums[2]) = max( f(2), nums[2] + f(1) )

代码如下(leetcode RunTime 0ms)：

```c
class Solution {
public:
	int rob(vector<int>& nums) {
		if (nums.size() == 0)
			return 0;
		if (nums.size() == 1)
			return nums[0];
		vector<int> f(nums.size() + 1);
		f[0] = 0;
		f[1] = nums[0];
		for (int i = 2, size = nums.size(); i <= size; ++i){
			f[i] = max(f[i - 1]，nums[i - 1] + f[i - 2]);
		}
		return f[nums.size()];
	}
};
```