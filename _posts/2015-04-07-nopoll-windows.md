---
layout: post
title: windows 7 下编译 nopoll
published: true
tags: ['nopoll', 'c', 'c++']
---

### 编译环境 ###

- windows 7 64位

- VS 2013 Ultimate

- openssl-1.0.2a

- nopoll-0.2.8.b184


### 编译步骤 ###


1. nopoll官网提供了二进制安装包，不过不知为什么无法直接用（运行时错误，无法debug)，所以还是得手动编译<
2. nopoll依赖openssl，所以先编译openssl：
	- 下载[http://www.openssl.org/source/openssl-1.0.2a.tar.gz](http://www.openssl.org/source/openssl-1.0.2a.tar.gz)
	- 安装perl [http://downloads.activestate.com/ActivePerl/releases/5.20.1.2000/ActivePerl-5.20.1.2000-MSWin32-x64-298557.msi](http://downloads.activestate.com/ActivePerl/releases/5.20.1.2000/ActivePerl-5.20.1.2000-MSWin32-x64-298557.msi)
	- 解压后，阅读INSTALL.W64安装说明
		> We loved with a love that was more than love
		> To build for Win64/x64: 
		> perl Configure VC-WIN64A
		> ms\do_win64a
		> nmake -f ms\ntdll.mak
		> cd out32dll
		> ..\ms\test
	- 第三步的ms\do_win65a和nmake -f ms\ntdll.mak必须要用vs的控制台程序来执行，否则会出错

		![1.png](/images/2015.4/1.png)
	- 编译完成通过后，执行nmake -f ms\ntdll.mak install来生成最终发布文件, 生成位置默认是在usr/local/里，但windows下没有这个目录，所以Perl把ssl生成到当前控制台所在分区的根目录了（如源码在d:/openssl/，则会生成到D:/usr/local/)


3. 用编译好的openssl库来编译Nopoll

	nopoll虽然提供了Makefile.win，但我试了下，发现并不能一键编译，会提示缺少versions.mk和config.mk（这2个文件最后在nopoll的svn仓库里找到），补上这2个文件后再次执行nmake，会提示./prepare-nsh.sh permission denied（win平台执行sh文件？）

	按官方的编译方法失败后，只能自行建工程编译了：
    - 新建一个vs工程，取名libnopoll
    - 添加 nopoll-0.2.8.b184/src目录的源码文件到工程
    - 这里要改下nopoll_config.h（此文件应该是自动生成的，我们要手动修改一个出来）

      ```c
      /*
      * Nopoll Library nopoll_config.h
      * Platform dependant definitions.
      *
      * This is a generated file.  Please modify 'configure.in'
      */
      #ifndef __NOPOLL_CONFIG_H__
      #define __NOPOLL_CONFIG_H__
      /**
      * \addtogroup nopoll_decl_module
      * @{
      */
      /**
      * @brief Allows to convert integer value (including constant values)
      * into a pointer representation.
      *
      * Use the oposite function to restore the value from a pointer to a
      * integer: \ref PTR_TO_INT.
      *
      * @param integer The integer value to cast to pointer.
      *
      * @return A \ref noPollPtr reference.
      */
      #ifndef INT_TO_PTR
      #define INT_TO_PTR(integer)   ((noPollPtr) (long) ((int)integer))
      #endif
      /**
      * @brief Allows to convert a pointer reference (\ref noPollPtr),
      * which stores an integer that was stored using \ref INT_TO_PTR.
      *
      * Use the oposite function to restore the pointer value stored in the
      * integer value.
      *
      * @param ptr The pointer to cast to a integer value.
      *
      * @return A int value.
      */
      #ifndef PTR_TO_INT
      #define PTR_TO_INT(ptr) ((int) (long) (ptr))
      #endif
      /**
      * @brief Allows to get current platform configuration. This is used
      * by Nopoll library but could be used by applications built on top of
      * Nopoll to change its configuration based on the platform information.
      */
      //#define NOPOLL_OS_UNIX (1)
      #define NOPOLL_OS_WIN32 (1)
      #define R_OK 4
      #define W_OK 2
      /**
      * @internal Allows to now if the platform support vasprintf
      * function. Do not use this macro as it is supposed to be for
      * internal use.
      */
      //#define NOPOLL_HAVE_VASPRINTF (1)
      /**
      * @brief Indicates that this platform have support for 64bits.
      */
      #define NOPOLL_64BIT_PLATFORM (1)
      /* @} */
      #endif
      ```
    - 配置编译环境

		![1.png](/images/2015.4/2.png)

		![1.png](/images/2015.4/3.png)

		- 添加openssl的include、nopoll的src到包含目录

		- 添加上一步生成的ssl/lib目录 到 库目录
	
		- 执行 生成项目，就得到了libnopoll.lib文件
	

4. 测试libnopoll.lib是否可用：
	- 新建测试项目，一样是	![1.png](/images/2015.4/4.png)
	- 添加nopoll官方的example代码，[https://dolphin.aspl.es/svn/publico/nopoll/trunk/test/nopoll-regression-listener.c](https://dolphin.aspl.es/svn/publico/nopoll/trunk/test/nopoll-regression-listener.c)
	- 复制 /test的pem、crt、key文件到工程目录里:
	
		![1.png](/images/2015.4/5.png)
	- 然后是附加依赖项：
	
		![1.png](/images/2015.4/6.png)
	- 之后就可以编译 运行了：

		![1.png](/images/2015.4/7.png)
    
		看样子是成功了。
	- 最后客户端的例子也试着编译下，工程配置和server的一样，咦！！ 编译时出现各种error:

		![1.png](/images/2015.4/8.png)
		
		照着反馈做即可，在文件头添加一个define 

		```c
  			#define _CRT_SECURE_NO_WARNINGS
 		 ```
		![1.png](/images/2015.4/9.png)
	
		unlink改成_unlink呗；

		VERSION可能是要自己定义，也定义一个，之后就顺利编译出来了。
    
		不过运行的时候又出现报错：

		![1.png](/images/2015.4/10.png)

		问题就是windows下没有linux的diff工具，先把相关的几行代码屏蔽掉先把，再次编译运行：

		![1.png](/images/2015.4/11.png)
    
		Nice，客户端和服务端协同工作了。


### 附 ###

- 编译debug版的openssl :  [http://blog.csdn.net/wangxvfeng101/article/details/7261264](http://blog.csdn.net/wangxvfeng101/article/details/7261264)