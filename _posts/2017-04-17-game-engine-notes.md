---
layout: post_latex
title: mini引擎开发备忘
tags: ['computer graphics']
published: true
---

<!--more-->

## 跨平台问题汇总

### XCode 8 + iOS + SDL2 + OpenGL ES 

首先是记录xcode项目的创建问题：

1. 创建一个iOS平台的game或Single View Application项目。

2. Main和Lauch Screen这2个storyboard可以去掉，去掉后还要把info.plist里2个storyboard的选项也去掉，并设置用默认的Lauch Screen storyboard： 【Launch screen interface file base name：iOS Launch Screen】。相应的ViewController的h和m文件也去掉，只留下AppDelegate和main.m。

3. AppDelegate的h和m文件可以不修改，但main.m里面的代码需要全部删除（因为SDL自身会定义main入口）。

4. 下载SDL2源码，解压后找到里面的xcode-iOS目录，用xcode打开其中的SDL子目录里的工程，然后直接build，就获得里libsdl2.a静态库。

5. 把libsdl2.a放到刚才创建的xcode项目根目录里。并在Build Phases的Link项里把libsdl2.a加上。

6. 然后继续添加iOS项目需要的官方frameworks: GLKit、OpenGLES、CoreMotion、AVFoundation、GameController、AudioToolbox

7. 把SDL2的include目录复制到项目目录，并把目录拖进xcode左边的目录树里，然后设置后search path，这样等下编译就能找到SDL2库了

8. 然后就可以新建一个main.cpp文件，开始写SDL程序了

### renderer的代码在xcode中编译遇到的报错

一大堆报错，处理了一两个小时，主要产生原理是vc和gcc的不一致性，以及一些平台相关代码问题。

1. Point模板类，Vector模板继承Point，会出现一个偏特化的问题，症状就是Vector的代码里调用父类成员x y z，gcc会找不到（vc没问题），原因暂时没完全搞懂，关键词是偏特化，gcc要求明确指出x y z是哪来的对象，也就是说要么写成Point<T>::x, 要么写成this->x。

2. 当class的构造函数的参数没有加const限定符，但用右值作为参数去创建类实例时，vc不会报错，而gcc报错了，加上const后可以解决。

3. 【Non-constant-expression cannot be narrowed from type 'unsigned long' to 'int' in initializer list】 initial list初始化列表不支持非常量表达式的long到int的narrow转换，需要自行加上static_cast<int>。（vc不会报这个错）

4. 【Use of overloaded operator '/' is ambiguous (with operand types 'value_type' (aka 'nlohmann::basic_json<std::map, std::vector, std::__1::basic_string<char>, bool, long long, double, std::allocator>') and 'float') 】这个错和第三方json库有关，但vc没报错，大概就是编译器找到多个／操作符重载，不知道用哪个，需要把代码从 c[0] / 255.0f 改成 float(c[0]) / 255.0f

5. 【Non-const lvalue reference to type 'renderer::Ray' cannot bind to a temporary of type 'renderer::Ray'】 问题处在函数返回值类型和变量类型上。函数返回的是Ray，而变量是Ray&，如果是vc，那么不会报错。如果是gcc，有三个办法解决报错，一改成const Ray&（注意，改const的话，其他代码可能会有冲突），二改成Ray&&，三改成Ray。vc真是人性化到有点可怕，这种返回值没弄好，分分钟变成性能瓶颈的。

6. 【Control may reach end of non-void function】，这个在vc里没有报，在gcc里报了，gcc要严格得多呀。这个报错就是要求说，每个函数能到达的结束位置，都必须有返回值。我这里是不小心写漏了。小问题。


7. 头文件include报错，这种属于工程问题，通过配置xcode的include路径应该可以解决。

8. 平台相关的编译报错，通过#if可以粗暴解决。






