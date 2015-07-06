---
layout: post
title: leetcode题解 problem 152 Maximum Product Subarray
published: true
---

> Find the contiguous subarray within an array (containing at least one number) which has the largest product.
> 
> For example, given the array [2,3,-2,4],
> 
> the contiguous subarray [2,3] has the largest product = 6.

### 题意：

求数组里最大的连续子序列的乘积。

### 题解：

Maximum Subarray的变形，把求和改成求积了。且有负数。

设DP[i]是以i位置元素为终点的子序列的乘积，那么DP[i]的最大值就是我们要的解。

DP[i] = max( DP[i - 1] * nums[i], nums[i] )

上面的方程是错的，因为没有考虑到负数的情况，比如数组[-10,5,-10]，DP[0] = -10, DP[1] = 5, DP[2] =-10，最大乘积是5。 但实际上最大乘积是 -10 * 5　＊ (-10) = 500。

正确的方程是，记录2个DP数组，一个记乘积最大值，一个记乘积最小值，然后综合2个DP数组的结果，就可以得到真正的最大值。

```c
 DP_max[i] = max( DP_min[i - 1] * nums[i], DP_max[i - 1] * nums[i], nums[i])

 DP_min[i] = min( DP_min[i - 1] * nums[i], DP_max[i - 1] * nums[i], nums[i])
```

按这个方程组来做的话，需要O(n)的空间，考虑到题目只要求输出最大值，那么可以优化到O(1)的空间消耗。

原理就是，DP_*[i]只和上一个状态以及当前的值有关，那么只需要保存上一个状态的结果，就足够求最大乘积了。

下面是我的代码：（runtime 8 ms）

```c
	int maxProduct(vector<int>& nums) {
		if (nums.size() == 0)
			return 0;
		int dp_pre_min = nums[0];
		int dp_pre_max = nums[0];
		int dp_max = dp_pre_max;
		for (int i = 1, len = nums.size(); i < len; ++i){
			int dp_cur_max = max( max(nums[i], dp_pre_max*nums[i]), dp_pre_min*nums[i]);
			int dp_cur_min = min( min(nums[i], dp_pre_max*nums[i]), dp_pre_min*nums[i]);
			if (dp_max < dp_cur_max)
				dp_max = dp_cur_max;
			dp_pre_max = dp_cur_max;
			dp_pre_min = dp_cur_min;
		}
		return dp_max;
	}
```