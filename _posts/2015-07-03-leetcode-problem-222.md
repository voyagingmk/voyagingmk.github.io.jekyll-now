---
layout: post
title: leetcode题解 problem 222 Count Complete Tree Nodes 
published: true
tags: ['leetcode']
---

> Given a complete binary tree, count the number of nodes.
> 
> Definition of a complete binary tree from Wikipedia:
> In a complete binary tree every level, except possibly the last, is completely filled, and all nodes in the last level are as far left as possible. It can have between 1 and 2h nodes inclusive at the last level h.

### 题意：

求一颗完全二叉树得节点的数量。


<!--more-->


### 题解：


看了这道题的discuss，发现一个挺有意思的解决方案（也可能是最快的方案了），这里分析一下。

{% highlight cpp linenos %}
    int countNodes(TreeNode* root) {

        if(!root) return 0;

        int hl=0, hr=0;

        TreeNode *l=root, *r=root;

        while(l) {hl++;l=l->left;}

        while(r) {hr++;r=r->right;}

        if(hl==hr) return pow(2,hl)-1;

        return 1+countNodes(root->left)+countNodes(root->right);
    }
{% endhighlight %}

函数内第4、5行，2个while循环，获得了root的最左节点和最右节点的深度，然后判断深度是否一样，一样的话，说明root是一棵满二叉树，于是可以用公式直接返回该子树的节点个数。

再利用分而治之的思想，就可以得到总的节点的个数了：

countNodes(root) = 一棵完全二叉树的节点个数 = 1（即根节点） + countNodes(左子树) + countNodes(右子树)

而因为完全二叉树的性质，可以知道root的左子树和右子树中肯定有一棵是满二叉树。所以这个算法是很快的，当countNodes遇到满二叉树时，一次lgn的迭代运算后，即可以返回该树的节点个数。因为只有满二叉树可以让递归中止，所以总的耗时就是计算各个满二叉树的总耗时。