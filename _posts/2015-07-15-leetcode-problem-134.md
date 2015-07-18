---
layout: post
title: leetcode题解 problem 134 Gas Station
published: true
tags: ['leetcode']
---


> There are N gas stations along a circular route, where the amount of gas at station i is gas[i].
> 
> You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from station i to its next station (i+1). You begin the journey with an empty tank at one of the gas stations.
> 
> Return the starting gas station's index if you can travel around the circuit once, otherwise return -1.
> 
> Note:
> The solution is guaranteed to be unique.

### 题意：

有N个加油站，连成环形，每个加油站有gas[i]的油，从第i个加油站到第i+1个加油站需要消耗cost[i]的油。现在有一辆车，它有无限大的油箱，但是是空的。求问这辆车应该从哪个加油站出发，才可以跑一遍所有的加油站，返回该加油站的序号，如果不存在这样的起点，返回-1。

### 题解：


设sum-gas是所有加油站的油的总和，sum-cost是汽车走一圈消耗的油的总和，容易知道，当sum-gas<sum-cost时，汽车是不可能遍历所有加油站的，因为油不够。

反过来说，当sum-gas>=sum-cost时，是不是一定有一个起点，可以让汽车顺序跑一圈加油站呢？

证明：
1）当N=1，g1 >= c1，那么预言正确；

2）当N=2，g1 + g2 >= c1 + c2，若g1 > c1且g2 > c2，则怎么走都可以，所以只要考虑 (g1 < c1 && g2 > c2) 或者 (g1 > c1 && g2 < c2) 的情况（实际上2个情况是等同的，只要证明其一即可）。设g1 < c1，因为g1 + g2 > c1 + c2，所以g2 > c2。那么只要从g > c的点出发，必然可以到另一个点。

3）当N=3，g1 + g2 + g3 >= c1 + c2 + c3，若g1 > c1且g2 > c2且g3 > c3，则怎么走都可以。所以只需要考虑g1 < c1 && g2 + g3 > c2 + c3 的情况（g1可以换成g2或g3，因为是加油站是环形的)。设g1 < c1，那么不能以1作为起点，分情况考虑：a)当g2 > c2，那么可以从2出发，而因为g2 + g3 > c2 + c3,所以2->3->1成立；b)当g2 < c2时，g3 > c3，又可得g3 + g1 > c3 + c1，所以3->1->2成立。 所以3个加油站也必然存在一个可走的路径。

4）当N=4时，g1 + g2 + g3 + g4 >= c1 + c2 + c3 + c4，因为在3)中已经证明3个加油站必然存在一条路径，那么对于4个加油站，可以设 g1 + g2 + g3 >= c1 + c2 + c3（也可以是234、341、412)，那么对于这3个加油站，肯定是有一条路的，那么久可以把这3个加油站合并，变成 g0 >= c0 且 g0 + g4 >= c0 +c4，问题就转化为2)的情况，而2）已经证明是有解的，所以综上可得，N=4也必然有解。

5) 当N>4时，通过上面的合并法，归纳得证。

所以，**当sum-gas>=sum-cost时，一定有一个起点，可以让汽车顺序跑一圈加油站。**


知道起点必然存在后，再利用上面的合并法，可以设起点为i，g(left)是从1到i-1所有加油站的油的总和，c(left)是从1到i-1所有加油站的开销的总和，同理g(right)是i+1到n所有加油站的油的总和，c(right)是从1+1到n所有加油站的开销的总和。那么问题就降级为3个加油站left、i、right的路径问题。因为i是起点，路径必然是i->right->left，i就可以合并到right区域里，那么路径进一步简化，变成right->left。即我们需要的i的值，同时也是right区间的起始点位置。

right和left的关系为：

- g(right) >= c(right)

- **g(left) + g(right) >= c(left) + c(right)**

- 区间left = [1, i - 1]

- 区间right = [i, n]

具体代码实现是，从1和n向中间扫，计算left和right的gas和cost，当2个指针相遇，且满足上面的关系式，则高位指针的位置就是我们的起点。

这里可以做一个优化，因为**g(left) + g(right) >= c(left) + c(right)**，可得**sum = g(left) + g(right) - ( c(left) + c(right) ) >= 0**那么即是说，在扫的过程中，可以把left和right视作一个合并中加油站集群，只要保证sum>=0成立，left和right就可以不断向中间逼近，直到相遇。

"伪"代码如下：

1. 设start = n, end = 1，sum = gas(start->end) - cost(start->end)

2. 初始sum = gas(start) - cost(start)

3. while(start > end):

	sum >= 0:
		当sum >= 0时，因为start的gas比cost大，必然可以走到end，所以可以把把gas(end)-cost(end)加到sum里，sum += gas(end)-cost(end)（也就是把start->end的所有加油站合并，变成一个start），合并后end加1；
	
	sum < 0:
		当sum < 0时，说明start的gas已经少到不能走到end了，但又因为start必然是路径的起点，于是start还可以尝试往左挪，start减一，并执行 sum += gas(start) - cost(start)。（也就是把start的左边的加油站合并到start）


```c
	int canCompleteCircuit(vector<int> &gas, vector<int> &cost) {
		int start = gas.size() - 1;
		int end = 0;
		int sum = gas[start] - cost[start];
		while (start > end) {
			if (sum >= 0) {
				sum += gas[end] - cost[end];
				++end;
			}
			else {
				--start;
				sum += gas[start] - cost[start];
			}
		}
		if (sum >= 0)
			return start;
		return -1;
	}
```
	
	