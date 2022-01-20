---
layout: post_latex
title: Filament中的lighting
tags: ['computer graphics']
published: true
---

<!--more-->


Filament中把direct、point、spot light等都统一到一个Light结构：

```glsl
struct Light {
    vec4 colorIntensity;  // rgb, pre-exposed intensity
    vec3 l;
    float attenuation;
    float NoL;
    vec3 worldPosition;
    bool castsShadows;
    bool contactShadows;
    uint shadowIndex;
    uint shadowLayer;
    uint channels;
};

```

# colorIntensity

Light里面的colorIntensity大有学问。先要掌握一大堆概念。

## Radiant flux 辐射通量

在我之前的一篇文章有介绍：[辐射通量](https://www.qiujiawei.com/rendering-equation/#%E8%BE%90%E5%B0%84%E9%80%9A%E9%87%8F(Flux))。

辐射通量可以客观衡量光源（如电灯泡）的功率。因为它描述了所有波段的电磁波。

## [Luminous flux](https://en.wikipedia.org/wiki/Luminous_flux) 光通量

在光度学中，光通量和辐射通量描述的东西有点近似但又各不一样，它只关注**人眼可见波段**的光强，它对各个可见波段做了加权并累加, 加权的介绍见: [Luminous efficiency function](https://en.wikipedia.org/wiki/Luminous_efficiency_function) 。

它的单位是[Lumen](https://en.wikipedia.org/wiki/Lumen_(unit)) (流明)，1，流明等于1 [candela](https://en.wikipedia.org/wiki/Candela) 乘以单位立体角：

\\[ 1 lm = 1 cd ⋅ sr \\]

那么1 cd究竟是多亮呢？wiki给出了解释：一根普通的蜡烛（candle！)会发出大约 1 cd 强度的光。

因为一个完整sphere的立体角大小为4π，所以如果一个光源均匀沿着球面上所有方向发出一根普通的蜡烛的光，这个光源的光通量是4π sr * 1 cd ，约等于12.57 lm。

当这个球面有一半被遮挡时（例如把光源放在墙边），立体角变成2π，此时这个光源的光通量Luminous flux是2π流明，**但光强仍然是1 cd**。

## [Lux](https://en.wikipedia.org/wiki/Lux) 勒克斯

理解了Luminous flux后，Lux就好理解了：

\\[ 1 lx = 1 lm/m\^2 = 1 cd·sr/m\^2 \\]

这个咋一看有点怪，立体角除以面积。这里需要认识到，立体角的大小和对应的面积大小毫无关系，就比如说2D下一个90度的θ角，它对应的斜边的长度是多长，是不知道的。

## [exposure](https://en.wikipedia.org/wiki/Exposure_(photography)) 曝光

曝光不是个动词，它是个名词，指的是**一段时间内，到达单位面积的总光通量**。光通量已经是描述单位面积的了，所以exposure的单位是\\( lx \cdot s\\) ，符号表示如下：

\\[ H = E t \\]

E就是光通量，t是指时间。注意这里不限制t是单位时间，t可以是任意长度，毕竟exposure描述的是**一段时间**。

## [Shutter speed](https://en.wikipedia.org/wiki/Shutter_speed) 相机快门速度

快门速度是相机内的胶卷或数码感应器在拍照时（即相机快门打开时）暴露在光线下的时间长度。单位一般是秒。

## [f-number](https://en.wikipedia.org/wiki/F-number) 相机f数

f-number又名：focal ratio, f-ratio, or f-stop，公式为：

\\[ N = \frac \{f\} \{D\} \\]

f是焦距，D是diameter of the entrance pupil （入瞳直径/有效孔径）。例如当镜头的焦距为10mm，有效孔径为5mm时，我们记f数为f/2。


## [exposure value](https://en.wikipedia.org/wiki/Exposure_value) 曝光值


符号为EV，计算公式为：

\\[ EV  = log\_2 \frac \{f数\^2\}\{快门速度\} = log\_2 \frac \{N\^2\}\{t\} \\]


# 实现


在View.cpp的FView::prepareLighting里计算了曝光度：


```c++
...
 const float exposure = Exposure::exposure(camera.ev100);
...
```

Exposure名空间下的静态函数exposure：

```c++
float exposure(float ev100) noexcept {
    return 1.0f / (1.2f * std::pow(2.0f, ev100));
}
```

camera.ev100的计算：

```c++
float ev100(const Camera& c) noexcept {
    const FCamera& camera = upcast(c);
    return ev100(camera.getAperture(), camera.getShutterSpeed(), camera.getSensitivity());
}

float ev100(float aperture, float shutterSpeed, float sensitivity) noexcept {
    return std::log2((aperture * aperture) / shutterSpeed * 100.0f / sensitivity);
}

```