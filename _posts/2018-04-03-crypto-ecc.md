---
layout: post_latex
title: 漫谈网络通讯加密
tags: ['crypto']
published: true
---

<!--more-->

## 几种加密算法

### [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) （Rivest–Shamir–Adleman)（1977年）

基于大数质因子分解问题。

### [DH](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange)（Diffie-Hellman key exchange）（1976年）

密钥交换算法。

基于离散对数问题。

### [ECC](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography)（Elliptic-curve cryptography） （1985年）

基于在椭圆曲线上的离散对数的求取问题。


## DH算法

### key exchange例子（ [from here](https://scotthelme.co.uk/perfect-forward-secrecy/) )：

1. Alice和Bob首先线下商量好，使用**p (prime, 质数) = 23、g (generator, 生成器) = 5**作为通讯基础（p和g不需要绝对的保密，泄露了也没事）
2. 每次Alice和Bob想要建立通讯(连接)时，Alice自己随机生成一个在范围[1, p - 1]的数：a = 6
3. 同样，Bob自己也随机一个：b = 15
4. Alice计算： \\( A = ( g\^\{a\} ) \% p = ( 5\^\{6\} ) \% 23 =  15625 \% 23 = 8 \\)，把A发给Bob
5. Bob计算： \\( B = ( g\^\{b\} ) \% p = ( 5\^\{15\} ) \% 23 =  30517578125 \% 23 = 19 \\)，把B发给Alice
6. Alice收到B后，可计算出**对称密钥**：\\( s\_\{Alice\} = ( B\^\{a\} ) \% p = ( 19\^\{6\} ) \% 23 = 47045881 \% 23 = 2 \\)
7. Bob收到A后，可计算出**对称密钥**：\\( s\_\{Bob\} = ( A\^\{b\} ) \% p = ( 8\^\{15\} ) \% 23 = 35184372088832 \% 23 = 2 \\)

### 数学原理

其中，用到了**模幂运算**的基本定理，对于任意自然数a、b、n，有：

\\[ ab\  \%\  n =  ( ab\ \%\  n) \  \%\  n =  ( (a\ \%\  n)  (b\ \%\  n) ) \ \%\  n \\]

应用到幂运算：

\\[ a\^\{b\}\  \%\  n =  ( a \\cdots  a ) \  \%\  n =  ( (a\ \%\  n) \\cdots  (a\ \%\  n) ) \  \%\  n =  ( \ (a\ \%\  n)  \^\{b\}\  ) \ \%\  n \\]

于是有：

\\[ s\_\{Alice\} = ( B\^\{a\} ) \% p =  (\  (\  g\^\{b\} ) \% p\  ) \^\{a\}\   ) \% p =   (  \ g \% p\  ) \^\{ab\} \  ) \% p =  \ g \^\{ab\} \% p \\]

同理：

\\[ s\_\{Bob\} = ( A\^\{b\} ) \% p =  (\  (\  g\^\{a\} ) \% p\  ) \^\{b\}\   ) \% p =   (  \ g \% p\  ) \^\{ab\} \  ) \% p =  \ g \^\{ab\} \% p \\]

显然：

\\[  s\_\{Alice\} = s\_\{Bob\}  \\]

这样就协商出了对称的密钥。


### 为什么可行

从攻击者角度看，攻击者最多只能获得以下信息：

- p：23
- g：5
- A：8
- B：19

攻击者目标是获得s（serect）。要计算s，就是算2条式子：

\\[ s = ( B\^\{a\} ) \% p \\]

\\[ s = ( A\^\{b\} ) \% p \\]

显然，攻击者只需要破解出a或b，就能得到s。

又因为有：

\\[ A = ( g\^\{a\} ) \% p \\]

\\[ B = ( g\^\{b\} ) \% p \\]


所以破解a或b的方法是：

\\[ a = log\_\{g\}\^\{A\} \% p \\]

\\[ b = log\_\{g\}\^\{B\} \% p \\]

这看似很简单的算术（对数运算和取模运算），其实是很难算的。目前为止没有找到一个快速计算对数的算法。

关键在于**p这个素数要足够大**，那么以现在的计算机计算速度，就很难通过A（或B）、g、p这3个参数算出a，这被称为[离散对数难题](https://en.wikipedia.org/wiki/Discrete_logarithm)。


### p、g的选取问题

涉及到了一些数论的概念：

- [最大公约数gcd](https://en.wikipedia.org/wiki/Greatest_common_divisor)
- [数论阶](https://en.wikipedia.org/wiki/Multiplicative_order)
- [原根](https://en.wikipedia.org/wiki/Primitive_root_modulo_n)

首先明确下：

- p必须是素数，且必须是大数(1024-2048bits)，算法才安全
- g不需要是素数，且不需要很大

p、g不需要自己挑选，可以直接用[rfc5114](https://tools.ietf.org/html/rfc5114)给定的值。

例如[1024-bit MODP Group with 160-bit Prime Order Subgroup](https://tools.ietf.org/html/rfc5114#section-2.1):

![3.png](../images/2018.4/3.png)

再讲下去就是深入密码学、数论了，按住不表。


## **完全前向保密** PFS(Perfect Forward Secrecy)

### 没有PFS之前：

- 如果攻击者曾经窥探并保存了用户和服务器的加密数据流，且包括被公钥加密的对称密钥
- 如果有一天攻击者通过某种办法获得了服务器私钥
- 攻击者同时拥有了：“用公钥加密的对称密钥”、“私钥”
- 攻击者用“私钥”对“用公钥加密的对称密钥”解密，获得了对称密钥
- 攻击者此时就可以用破解出来的对称密钥对已存的历史加密数据做解密

### 基于DH的PFS：

- 不再使用公钥加密对称密钥的方案
- 改为用DH密钥交换算法（key exchange），协商对称密钥，可以直接明文传输协商时需要的信息（并不怕这些信息被窃取）
- 每次会话都协商新的对称密钥
- 因为公钥私钥没有用来加密对称密钥了，所以即使服务器私钥被盗了也不会导致历史对称密钥被破解
- 即使单次会话的对称密钥被破解了，也不会影响到别的会话

### 为什么可行

关键在于，用于生成会话密钥的“数据”，根本就没通过网络发送出去。而用公钥加密的密钥，本身就是通过网络传输的。

后者显然更容易被攻击，主要获得私钥并记录了整个会话的数据流，就可以破解了。

而前者，对称密钥的协商，根本没有用到公钥私钥，经过网络的也不是什么被加密后的密钥，而只是协商信息。攻击者要想破解某次会话的内容，只能从该次会话的加密数据流入手，没有他法。

### 问题

要做到perfect，意味着每次会话都要协商密钥，意味着增加了计算开销，不然不能保证密钥的转瞬即逝性质（ephemeral）。


## 参考资料

https://scotthelme.co.uk/perfect-forward-secrecy/
