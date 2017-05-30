---
layout: post_latex
title: 错误使用四元数依然会出现Gimble Lock
tags: ['math', 'quaternion']
published: true
---

一直都说用欧拉角做旋转会出现万向节锁Bug（Gimble Lock），而用四元数就不会。其实这样的说法是不准确的，当用四元数做旋转，如果使用姿势错误，依然会出现Gimble Lock。

<!--more-->

## 错误的用法

下面是我自己录制的演示视频，当x轴转90度，y轴和z轴就合二为一了：

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZDQkzR_L7b0" frameborder="0" allowfullscreen></iframe>


演示代码：

```c++
    Transform4x4 trans1 = Translate(Vector3dF(0.0, 0.0, -2.0));
    Transform4x4 trans2 = Scale(0.5, 0.5, 0.5);
    static float pitch = 0.0, yaw = 0.0, roll = 0.0;
    pitch = 90.0f;
    yaw += 2.0f;
    roll += 3.0f;
    QuaternionF rotX = QuaternionF::RotateX(pitch); // x
    QuaternionF rotY = QuaternionF::RotateY(yaw); // y
    QuaternionF rotZ = QuaternionF::RotateZ(roll); // z
    QuaternionF rot = rotZ * rotX * rotY;
    Transform4x4 modelTrans = trans1 * trans2 * Transform4x4(rot.toMatrix4x4());
```

pitch即x轴，pitch到90度时，yaw和roll转的是同一条轴。这和欧拉角的情况没有区别。

原因在于要理解Gimble Lock问题的本质。只要你是利用坐标系3个正交基x、y、z去做转换，当其中一个基旋转了90度时，**另外的2个基的其中之一会跟着旋转90度**，然后和第三个基合并，那么对这合并的2个基做旋转，肯定都是一个效果。换句话说就是丢失一个自由度。

正确的旋转机制是，不要用3个**互相关联的**变量来表示物体的旋转，例如pitch、yaw、roll；而是用一个变量表示，例如用唯一一个四元数或旋转矩阵（旋转矩阵也可以由一个四元数导出）来表示物体的**朝向**，则是可行的。上面的例子虽然也用了四元数，但是错就错在用了三个四元数，所以就出bug了。

下面是正确的四元数转换代码:

```c++
    const float pitch = 1.0f, yaw = 2.0f, roll = 3.0f;
    static QuaternionF orientation = {0.0, 0.0, 0.0, 1.0};
    QuaternionF rotX = QuaternionF::RotateX(pitch); // x
    QuaternionF rotY = QuaternionF::RotateY(yaw); // y
    QuaternionF rotZ = QuaternionF::RotateZ(roll); // z
    QuaternionF quatDiff = rotX * rotY * rotZ;
    orientation *= quatDiff;
    orientation = orientation.Normalize();
    Transform4x4 modelTrans = trans1 * trans2 * Transform4x4(orientation.toMatrix4x4());
```

注意这段代码里依然出现了pitch、yaw、roll。为什么呢？这是因为**旋转**的数学描述用正交基表示依然是最人性化的。这段代码之所以可行是在于用了一个新的变量orientation，来表示物体的当前**朝向**。每次迭代更新朝向时，先把pitch、yaw、roll转成Quaternion，然后相乘，从而得到这一帧的**朝向改变量quatDiff**，最后把quatDiff应用到orientation里，就改变了当前朝向了。

最后要注意的是，orientation每次改变后都要重新规范化**(Normalize)**，否则旋转效果会和预期的不一样。

<iframe width="560" height="315" src="https://www.youtube.com/embed/RfM83dFT9ks" frameborder="0" allowfullscreen></iframe>

