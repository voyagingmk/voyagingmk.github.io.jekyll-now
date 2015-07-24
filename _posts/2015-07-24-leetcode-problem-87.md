---
layout: post
title: leetcode题解 problem87 Scramble String
published: true
tags: ['leetcode']
---

### 题解：

设s1，s2是两个长度都为len的字符串（把s1、s2当做字符数组理解）

设状态量res[n][i][j]，(n < len, i <= n, j <= n), 元素是bool值

res的含义：

**长度为n，以i位置为起点的子串s1[i, i + n], 以j位置为起点的子串s2[i, i + n], res[n][i][j]标志了这2个子串是不是Scramble**

那么很显然，res[len-1][0][0]就是我们要的解。

状态转移方程：

**res[n][i][j] = ( res[k][i][j] && res[n - k][i + k][j + k] ) || ( res[k][i][j + n - k] && res[n - k][i + k][j] )**    ** (1<=k<n) **

这个式子看起来很吓人。先做个分解：

设 A = res[k][i][j] && res[n - k][i + k][j + k] = A1 && A2

设 B = res[k][i][j + n - k] && res[n - k][i + k][j] = B1 && B2

设 C = res[n][i][j] = A || B

也就是说，只要A、B中有一个为T，那么C就为T; 而A、B为T的条件分别是，A1和A2同时为真、B1和B2同时为真。

A1、A2、B1、B2的含义是什么呢？举例说明一下：

```c

great
rgtae

n = 5, k = 1, i = 0, j = 0 时：
res[k][i][j]           &&     res[n - k][i + k][j + k]
   g|****                          *|reat
   r|****                          *|gtae
   A1 = F						   A2 = F

res[k][i][j + n - k]   &&      res[n - k][i + k][j]
   g|****                          *|reat
   ****|e                          rgta|*
   B1 = F						   B2 = F

显然 C = A || B = (F && F) || (F && F) = F

n = 5, k = 2, i = 0, j = 0 时：
res[k][i][j]           &&     res[n - k][i + k][j + k]
   gr|***                          **|eat
   rg|***                          **|tae
   A1 = T						   A2 = T

res[k][i][j + n - k]   &&      res[n - k][i + k][j]
   gr|***                          **|eat
   ***|ae                          rgt|**
   B1 = F						   B2 = F

显然 C = A || B = (T && T) || (F && F) = T
```

1. **当(A1 && A2) = T时， s1-left和s2-left互为Scramble， s1-right和s2-right互为Scramble；** 

2. **当(B1 && B2) = T时， s1-left和s2-right互为Scramble， s1-right和s2-left互为Scramble。**


状态转移方程有了，还差个初始化状态:

**n = 0时，s1、s2退化成s1[i]和s2[j]，那么res[0][i][j] 等于 s1[i] == s2[j]**

代码如下:

```c
	bool isScramble(string s1, string s2) {
		int len = s1.length();
		if (len != s2.length()){
			return false;
		}
		if (len == 0){
			return true;
		}
		vector<vector<vector<bool>>> result(len);
		for (int i = 0; i<len; ++i){
			result[i].resize(len);
			for (int j = 0; j<len; ++j){
				result[i][j].resize(len);
				for (int k = 0; k<len; ++k)
					result[i][j][k] = false;
				result[0][i][j] = (s1[i] == s2[j]);//tricky
			}
		}

		for (int n = 2; n <= len; ++n){
			for (int i = len - n; i >= 0; --i){
				for (int j = len - n; j >= 0; --j){
					bool r = false;
					for (int k = 1; k < n && !r; ++k){
						r = (result[k - 1][i][j] && result[n - k - 1][i + k][j + k]) 
							|| (result[k - 1][i][j + n - k] && result[n - k - 1][i + k][j]);
					}
					result[n - 1][i][j] = r;
				}
			}
		}
		return result[len - 1][0][0];
	}
```


rumtime 196ms...别人最快有4ms的。应该是4重循环的自底而上的DP计算导致这么慢的，必须全部状态都算出来才可以返回最终结果。