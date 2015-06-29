---
layout: post
title: leetcode题解 problem53 Maximum Subarray
published: true
---

Find the contiguous subarray within an array (containing at least one number) which has the largest sum.

For example, given the array [−2,1,−3,4,−1,2,1,−5,4],
the contiguous subarray [4,−1,2,1] has the largest sum = 6.


```c
class Solution {
public:
	int maxSubArray(vector<int>& nums) {
        
    }
};
```


### 题意：

求子串和最大值


### 题解：

经典动态规划题目。

列下状态转移方程：

设数组为T(i), 设S(i)是数组从0到i位置的子串和的最大值。明确一下，S(i)对应的子串的左右2个索引[start,end]，start的取值范围是[0,i],end必然是i，即[start,end]是数组[0,i]段的一个后缀。

可得：

**S(i) = T(i) + ( S(i - 1) > 0 ? S(i - 1) : 0 )**

方程的含义是：
求S(i)时，S(i-1)如果大于0，那么说明i-1存在一个后缀（必然是连续的）使得S(i-1)大于0，此时把T[i]也加进去S(i-1)，当然就是S(i)的最长后缀了。（S(i)可能小于等于0）；

S(i-1)如果小于等于0，说明S(i-1)对增大S(i)没有意义了，也即说明S(i)的最长后缀等于[i,i]，S(i) = T(i)。

空间复杂度O(n)，时间复杂度O(n)。

### 代码：


```c
	int maxSubArray(vector<int>& nums) {
		if (nums.size() == 0)
			return 0;
		if (nums.size() == 1)
			return nums[0];
		vector<int> s(nums.size() + 1);
		s[0] = 0;
		int maxS = INT_MIN;
		for (int i = 1; i <= nums.size(); ++i){
			s[i] = nums[i - 1] + (s[i - 1] > 0 ? s[i - 1] : 0);
			if (s[i] > maxS){
				maxS = s[i];
			}
		}
		return maxS;
	}
```

考虑到S(i)数组对于这个题目是多余的，题目只是要求S(i)的max值，那么可以改下代码，把空间复杂度从O(n)降到O(1)。

```c
	int maxSubArray(vector<int>& nums) {
		if (nums.size() == 0)
			return 0;
		if (nums.size() == 1)
			return nums[0];
		int sum = 0, maxS=INT_MIN;
		for (int i = 1; i <= nums.size(); ++i){
			sum = nums[i - 1] + sum;
			if (sum < 0)
				sum = 0;
			if (sum > maxS){
				maxS = sum;
			}
		}
		return maxS;
	}
```