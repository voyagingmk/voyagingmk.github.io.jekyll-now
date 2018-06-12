---
layout: post
title: 各种多路复用API用法总结
tags: ['c++']
published: true
---

<!--more-->


## select

资料：https://notes.shichao.io/unp/ch6/#select-function

- struct fd_set，fd的集合
- FD_ZERO(fd_set *)， 清零一个fd_set，传fd_set的地址
- FD_SET(int fd, fdset *)，把fd添加到这个fd_set
- FD_CLR(int fd, fdset *)，把fd移出这个fd_set
- int FD_ISSET(int fd, fd_set *fdset); 查询fd是否在这个fd_set

核心函数：

```c
/*
返回值：
<0：出错
0：select超时返回了，没有读、写事件
>0：有事件发生的fd数量

maxfdp：是最大的fd再加1！

readfds、writefds、errorfds是值-结果参数，调用的时候作为值语义参数，函数返回的时候作为结果，所以没有const修饰
readfds：   要监听读事件的fd集合   /    有读事件的fd集合
writefds：  要监听写事件的fd集合   /    有写事件的fd集合
errorfds：  错误事件，一般传null即可
*/
int select(int maxfdp, fd_set *readfds, fd_set *writefds, fd_set *errorfds, struct timeval *timeout);
```

用法要点：

1. 按读、写声明2个fd_set：rfds、wfds
2. 需要再声明2个读、写fd_set，用于存放第一步的fd_set的拷贝，用于select：_rfds、_wfds
3. 用FD_SET和FD_CLR控制要监听哪个fd的读、写事件
4. 调用select前，要先复制一份fd_set，用memcpy即可
5. 调用select：retval = select(eventLoop->getMaxFd() + 1, &_rfds, &_wfds, NULL, tvp);
6. 如果retval>0，就遍历所有fd（[0, maxfd]），用FD_ISSET(fd, _rfds)，判断这个fd是否可读，写事件同理
7. 到此就完成一次循环，做完其他逻辑后，回到第4步


总结：

select是基于位掩码的设计，所以fd_set有固定长度。长度由FD_SETSIZE确定，FD_SETSIZE可以用户自己定。默认只有1024。


## poll


## epoll

### 创建epfd

 epoll_create1(0)，创建一个epfd，epoll所有接口都会用到它，它也是个文件描述符，持有资源

### 添加监听事件

需要区分是首次添加还是修改操作（用户自己要做记录），op = EPOLL_CTL_ADD或者EPOLL_CTL_MOD。

然后创建一个epoll_event ee，如果需要监听读事件就执行ee.events |= EPOLLIN，写事件就 ee.events |= EPOLLOUT；然后要登记目标fd到ee里，ee.data.fd = fd。

ee准备好后，就可以调用epoll_ctl(epfd, op, fd, &ee)。

epoll_ctl返回值：0是成功；-1失败，errno记录错误类型。


### 删除监听事件

和添加监听事件类似，也是构造ee，也要设置ee.data.fd，最终调用epoll_ctl。

op的就有点不一样，如果已经没有任何要监听的事件了，那么op是EPOLL_CTL_DEL；如果至少有监听某种事件，那么用EPOLL_CTL_MOD。

需要注意的是，即使是删除监听事件，epoll_ctl一个参数都不能少。

### 轮询

```c
int epoll_wait(int epfd, struct epoll_event *events,
               int maxevents, int timeout);
```

timeout：-1，永久阻塞；0，立即返回，不阻塞； >0，阻塞多少毫秒后返回
events和maxevents：就是指定一块数组用来存epoll_wait的返回结果，maxevents就是这个数组的长度。

如果返回值（numevents）大于0，那么就可以遍历events，遍历上限为numevents，逐个epoll_event访问它的events变量，看含有什么事件。也就是说，epoll_wait只返回了有事件的fd集合，比select要高效。


### 底层特点

epfd被创建时，会相应地创建一个eventpoll结构体：

```
struct eventpoll {  
    /*红黑树的根节点，这颗树中存储着所有添加到epoll中的需要监控的事件*/  
    struct rb_root  rbr;  
    /*双链表中则存放着将要通过epoll_wait返回给用户的满足条件的事件*/  
    struct list_head rdlist;    
};  
```

eventpoll可理解为存了2个数据结构的头部指针，一个指向一个红黑树的根，一个指向双向链表的头。

只要某个fd的某个事件被监听中，就会存在和这个fd关联的一个epitem:

```c
struct epitem{  
    struct rb_node  rbn;//红黑树节点  
    struct list_head    rdllink;//双向链表节点  
    struct epoll_filefd  ffd;  //事件句柄信息  
    struct eventpoll *ep;    //指向其所属的eventpoll对象  
    struct epoll_event event; //期待发生的事件类型  
}  
```

红黑树中的每个节点都等同于某个epitem的rbn对象指针；双向链表的每个节点都等同于某个epitem的rdllink指针。

所以epitem应该是一个内存连接的数组，而红黑树和双向链表用指针的方式和这个数组产生联系。



为什么高效：

1. 当监听的事件发生时，会回调ep_poll_callback，把事件信息添加到双向链表rdlist
2. 当调用epoll_wait检查是否有事件发生时，只需检查eventpoll的rdlist链表中是否有epitem元素即可。

1、2点已经凸显了epoll_wwit的高效，这是一种基于驱动回调的技术，epoll_wait的成本只是获取这个rdlist而已。

另外，为了保证不会重复添加同个fd的epitem，只能遍历内核的epitem数组，但这是个O(n)的操作，所以就需要红黑树，可以快速找出某个fd是否已被监听，并且也用于快速找到epitem从而修改fd的监听事件。这可是log(n)的复杂度，性能大大提高。


### 总结：

epoll是在内核维护复杂数据结构的设计，用户态的接口就相对复杂一些，但可控制性高一点；另外利用了回调技术，就不需要主动去查询每个fd是否有事件，效率自然就高了。


