---
layout: post_latex
title: Filament中的exposure和lighting
tags: ['computer graphics']
published: true
---

<!--more-->




# exposure

Filament里面的exposure大有学问。先要掌握一大堆概念。

## Radiant flux 辐射通量

在我之前的一篇文章有介绍：[辐射通量](https://www.qiujiawei.com/rendering-equation/#%E8%BE%90%E5%B0%84%E9%80%9A%E9%87%8F(Flux))。

辐射通量可以客观衡量光源（如电灯泡）的功率。因为它描述了**所有波段的电磁波**。

## Luminance 亮度

单位是 \\( cd / m\^2\\)，也被叫做nit，亮度是表面看起来有多亮的指标。因为用了[candela](https://en.wikipedia.org/wiki/Candela)单位（下一小节介绍），所以亮度也是一个光度学的符号定义。

不严谨地说，在渲染中Luminance对应了radiance，也就是pbr着色算出来的rgb值。

一般用大写L表示Luminance。

## [Luminous flux](https://en.wikipedia.org/wiki/Luminous_flux) 光通量

在光度学中，光通量和辐射通量描述的东西有点近似但又各不一样，它只关注**人眼可见波段**的光强，它对各个可见波段做了加权并累加, 加权的介绍见: [Luminous efficiency function](https://en.wikipedia.org/wiki/Luminous_efficiency_function) 。

它的单位是[Lumen](https://en.wikipedia.org/wiki/Lumen_(unit)) (流明)，1流明等于1 [candela](https://en.wikipedia.org/wiki/Candela) 乘以单位立体角：

\\[ 1 lm = 1 cd ⋅ sr \\]

那么1 cd究竟是多亮呢？wiki给出了解释：一根普通的蜡烛（candle！)会发出大约 1 cd 强度的光。

因为一个完整sphere的立体角大小为4π，所以如果一个光源均匀沿着球面上所有方向发出一根普通的蜡烛的光，这个光源的光通量是4π sr * 1 cd ，约等于12.57 lm。

当这个球面有一半被遮挡时（例如把光源放在墙边），立体角变成2π，此时这个光源的光通量Luminous flux是2π流明，**但光强仍然是1 cd**。

把流明单位\\(1 lm = 1 cd ⋅ sr \\)代入到Luminance的单位\\( cd / m\^2\\)里，Luminance的单位也就可以用流明表示，为 \\( lm/(sr⋅m\^2) \\)

## [Lux](https://en.wikipedia.org/wiki/Lux) 勒克斯单位

理解了Luminous flux后，Lux就好理解了，它是一个计量单位：

\\[ 1 lx = 1 lm/m\^2 = 1 cd·sr/m\^2 \\]

这个咋一看有点怪，立体角除以面积。这里需要认识到，立体角的大小和对应的面积大小毫无关系，就比如说2D下一个90度的θ角，它对应的斜边的长度是多长，是不知道的。

在光度测量中，Lux一般被用来度量光照射到物体表面时，人眼所感知到的光强度 **light intensity**，记住light intensity这个词，在代码会经常看到。


## Illuminance 照度

一般Illuminance符号记为E，E的单位就是Lux。此时需要对比下Luminance的单位，进行对比理解：

- E 的单位是\\( lm/m\^2\\)
- L 的单位是\\( lm/(sr⋅m\^2) \\)

可见，L要比E多除一个sr即单位立体角，也就是说，当对整个立体角范围的L做积分后，就等于E了。

## [exposure](https://en.wikipedia.org/wiki/Exposure_(photography)) 曝光

曝光不是个动词，它是个名词，应该叫曝光量比较恰当。它指的是**一段时间内，到达单位面积的总光通量**。光通量已经是描述单位面积的了，所以exposure的单位是\\( lx \cdot s\\) ，符号表示如下：

\\[ H = E t \\]

E就是光通量，t是指时间。注意这里不限制t是单位时间，t可以是任意长度，毕竟exposure描述的是**一段时间**。

## [Shutter speed](https://en.wikipedia.org/wiki/Shutter_speed) 相机快门速度

快门速度是相机内的胶卷或数码感应器在拍照时（即相机快门打开时）暴露在光线下的时间长度。单位一般是秒。

## [f-number](https://en.wikipedia.org/wiki/F-number) 相机f数

f-number又名：focal ratio, f-ratio, or f-stop，公式为：

\\[ N = \frac \{f\} \{D\} \\]

f是焦距，D是diameter of the entrance pupil/effective aperture（光圈/入瞳直径/有效孔径）。例如当镜头的焦距为10mm，入瞳直径为5mm时，我们记f数为f/2。

N一般也被直接叫做**aperture 光圈**。

## ISO 感光度/灵敏度

ISO是指数码相机中CMOS图像传感器对光线的敏感度。增大ISO，只能模拟提高了像素列的信号强度（亮度）。但同时会增大噪声。

ISO符号为S，但ISO的单位比较含糊，认为没有单位即可。

ISO 一般取值为100、200、400、800 · · ·。

## [EV, exposure value](https://en.wikipedia.org/wiki/Exposure_value) 曝光值

EV指的是拍摄参数（camera settings）的组合，而不是什么基本物理参数。EV更确切的叫法是**camera exposure settings 机身曝光参数**。

计算公式为：

\\[ EV  = log\_2 \frac \{f数\^2\}\{快门速度\} = log\_2 \frac \{N\^2\}\{t\} \\]

可见，EV和f数(光圈)成正比，和快门速度成反比，即：

- 光圈固定，快门越快，t越小，EV越大
- 快门固定，光圈越大，EV越大
- EV的范围一般是-6到+17
- 因为光圈大小有限，有时候为了得到很低的EV，可能会采用超长时间的快门实现，例如几十秒的曝光时间

显然，**较高的EV会产生较暗的图像**。但EV只是基于快门和光圈定义出来的参数，拍出来的照片到底有多亮，还得看实际的拍摄环境。


例如当你想拍摄一个光线很充足的场景例如中午的室外时，应该使用一个高EV的相机设置，如+15，即用更快的快门或者更大的光圈去拍摄，否则就会产生**曝光过度**（overexposure）。

当你想拍摄北极光时，则需要一个大约-5的EV，避免**曝光不足**（underexposure）。


## ISO 100和EV

ISO 100是一个惯用标准，没什么复杂的，即那些拍摄参数参考表，都会默认拍摄时的ISO为100。

注意到，上面的EV公式里缺少了相机参数ISO。为了把ISO融入进去，需要把EV符号改为：\\( EV\_S \\)，表示感光度为S时的EV。

根据上面的公式我们知道，\\( EV\_S \\)无论S是多少，它都等于\\(log\_2 \frac \{N\^2\}\{t\} \\)。这样定义又似乎有点奇怪。

这时候要引入\\( EV\_\{100\}  \\)的概念，即ISO为100时的EV，\\( EV\_\{100\}  \\)并不是一个常量，它的大小还是取决于快门和光圈。但是呢，因为拍摄环境的不同，**最佳曝光**应该为多少，是可以测量的，要用到 [测光表](https://zh.wikipedia.org/wiki/%E6%B5%8B%E5%85%89%E8%A1%A8) ，**在胶片感光度和光缐强度已知的情况下, 测光表给出获得最佳曝光的光圈值和快门速度组合**。

总之，\\( EV\_\{100\}  \\)应该理解为，在该拍摄场景下且相机感光度为100时的最佳EV。

例如强烈阳光下的一般场景（阴影很清晰），\\( EV\_\{100\}  \\)测量值为15。

再回到公式中来。因为EV是一个log2函数，所以可以假设有：

\\[ EV\_S = EV\_\{100\} + log\_2 \frac \{S\}\{100\} \\]

代入S=100，发现等式确实成立：

\\[ EV\_\{S=100\} = EV\_\{100\} + log\_2 \frac \{100\}\{100\} =   EV\_\{100\} + 0 =  EV\_\{100\} \\]

当S不等于100时，说明拍摄者正在用ISO去控制影响EV，让它增大或降低。

对上式做一个变换：

\\[ EV\_\{100\}  = EV\_S - log\_2 \frac \{S\}\{100\} \\]

\\[ EV\_\{100\}  = log\_2 \frac \{N\^2\}\{t\} - log\_2 \frac \{S\}\{100\} \\]

这样就把ISO、光圈、快门统一到了一条公式中，这条公式的作用是，当光圈和快门固定不变后，如果还觉得EV过大或过小了，此时可以通关调节改大ISO，控制最终的EV，使得达到最佳曝光值\\( EV\_\{100\}  \\)。

将公式做一些变换，就和Filament中的代码对应上了：


\\[ EV\_\{100\}  = log\_2 \frac \{N\^2\}\{t\} - log\_2 \frac \{S\}\{100\} = log\_2 \frac \{N\^2 * 100\}\{t * S \} \\]

Filament中，camera.ev100的计算代码如下：

```c++
float ev100(const Camera& c) noexcept {
    const FCamera& camera = upcast(c);
    return ev100(camera.getAperture(), camera.getShutterSpeed(), camera.getSensitivity());
}

float ev100(float aperture, float shutterSpeed, float sensitivity) noexcept {
    return std::log2((aperture * aperture) / shutterSpeed * 100.0f / sensitivity);
}

//在CameraInfo的构造函数里调用了ev100接口
CameraInfo::CameraInfo(FCamera const& camera) noexcept {
    。。。
    ev100              = Exposure::ev100(camera);
    。。。
}

```

- camera.getAperture() 就是公式里的N，光圈
- camera.getShutterSpeed() 是快门时间 t
- camera.getSensitivity() 是感光度ISO


## Exposure value 和 luminance 的关系

上上节给出了一个脱离实际拍摄场景的EV公式。实际上EV还可以从场景亮度L转换得到：

\\[ EV =  log\_2 \frac \{ L\cdot S\}\{ K \} \\]

S是ISO，K是一个[反光校准常数](https://en.wikipedia.org/wiki/Light_meter#Calibration_constants)。K和摄像机制造商有关，以常见的Canon、Nikon为准的话，K等于12.5。

上一节介绍了ISO 100这个惯用标准，那么可以得到：


\\[ EV =  log\_2 \frac \{ L\cdot 100\}\{ 12.5 \} \\]

此时可以想象一个游戏场景：这个场景特别黑，但是又需要让玩家看得清环境，那么把玩家视角当成相机的话，此时就是要提高曝光，也就是降EV（记住，**较高的EV会产生较暗的图像**）。具体要降多少的EV呢，可以先算出**画面平均亮度**，代入上面这条公式得到。

有时候为了测试或验证，需要根据场景的EV100（一般是查表），算出场景对应的亮度：


\\[ L =  2\^\{EV\_\{100\} \} \frac \{ 12.5 \}\{ 100  \}  = 2\^\{EV\_\{100\} \} 0.125 \\]

用python求得：math.log(0.125,2) = -3，于是有：

\\[ L  = 2\^\{EV\_\{100\}  - 3\}\\]

翻译成代码就是：


```glsl
luminance = pow(2, EV - 3)
EV = log2(luminance) + 3
```

## Exposure compensation 曝光补偿

EC其实很简单，是指对EV做一个人为的偏移EC：

\\[ EV\_\{100\}' = EV\_\{100\} - EC \\]


## photometric exposure（luminous exposure）

前面提到的exposure还有别的定义方式：

\\[ H = \\frac \{qLt\}\{N\^2\}\\]

来源于wiki [Film speed](https://en.wikipedia.org/wiki/Film_speed) 的Measurements and calculations小节。

其中的q和镜片透光率有关，一般为0.65。

L是指拍摄场景的亮度Luminance，t是快门，N是光圈。

这个公式的H是指luminous exposure，即可见光波段的曝光，单位是\\(lux \cdot s\\)。

这个公式还缺少了ISO参数，这必须理解另外3个概念（上面的wiki里有）：

- saturation-based speed
- noise-based speed
- standard output sensitivity

speed其实认为是ISO即可，暂时我搞不懂这3个东西。


Filament选择了第一种，也就是这条公式：

\\[ H\_\{sat\} = \frac \{78\}\{S\_\{sat\}\} \\]

大写S就是ISO了，这个式子的sat下标是说，最佳的S和可以用78乘以最佳的H的倒数，算出来。具体不深究了。

代入到上面的H的公式后得到：

\\[ L\_\{max\} = \frac \{N\^2 78\}\{qtS\}\\]

算这个是为了在渲染里，单位化一下Pbr着色出来的L值(rgb)：


\\[ L' = L\frac \{1\}\{ L\_\{max\} \}\\]

\\( L\_\{max\} \\)可以用ISO=100化简：

\\[ L\_\{max\} = \frac \{N\^2 78\}\{qtS\} = 2\^\{EV\_\{100\}\} \frac \{78\}\{qS\} = 2\^\{EV\_\{100\}\} \frac \{78\}\{0.65 \cdot 100\}  = 2\^\{EV\_\{100\}\} \cdot 1.2 \\]


Filament里把\\(\frac \{1\}\{ L\_\{max\}\} \\)当成了exposure：

\\[ exposure = \frac \{1\}\{ L\_\{max\}\} = \frac \{1\}\{ 2\^\{EV\_\{100\}\} \cdot 1.2 \} \\]

对应代码是Exposure namespace下的静态函数exposure：

```c++
float exposure(float ev100) noexcept {
    return 1.0f / (1.2f * std::pow(2.0f, ev100));
}
```

在View.cpp的FView::prepareLighting里调用了exposure接口并用CameraInfo的ev100作为参数，计算出了exposure：

```c++
...
 const float exposure = Exposure::exposure(camera.ev100);
...
```

# lighting

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

本文关注的直接光的初始化代码：

```glsl
Light getDirectionalLight() {
    Light light;
    // note: lightColorIntensity.w is always premultiplied by the exposure
    light.colorIntensity = frameUniforms.lightColorIntensity;
    light.l = frameUniforms.lightDirection;
    light.attenuation = 1.0;
    light.NoL = saturate(dot(shading_normal, light.l));
    light.channels = frameUniforms.lightChannels & 0xFFu;
    return light;
}
```

其中重点要理解的是colorIntensity。

## colorIntensity

direct light的colorIntensity在CPU中计算，代码在PerViewUniforms::prepareDirectionalLight里面：

```c++
const float4 colorIntensity = {
        lcm.getColor(directionalLight), lcm.getIntensity(directionalLight) * exposure };
```
exposure就是上一节用Exposure::exposure(camera.ev100)算出来的exposure。

这个colorIntensity就是给shader用的：

```glsl
//shading_model_standard.fs

vec3 surfaceShading(const PixelParams pixel, const Light light, float occlusion) {
   。。。
    return (color * light.colorIntensity.rgb) *
        (light.colorIntensity.w * light.attenuation * NoL * occlusion);
}
```
- color相当于反射率albedo，表示要反射多少direct light的光
- light.colorIntensity.rgb是lcm.getColor(directionalLight)，这个就是美术指定的rgb而已
- light.colorIntensity.w是lcm.getIntensity(directionalLight) * exposure
- lcm.getIntensity就是直接光光源的光强度，单位是lux
- occlusion就是visibility，要用shadow map计算得到，本文不谈这个


Intensity由美术指定，也可以用光度计到目标环境测量，例如中午室外晴朗天气时是130000 lux。Intensity指的是入射角垂直于表面时的illuminance。所以公式还乘了NoL。

假设去掉attenuation、occlusion，代码的含义会更清晰一些，如下：

```glsl
float illuminance = lightIntensity * NoL;
vec3 luminance = BSDF(v, l) * illuminance;
return luminance;
```

# 一些概念的补充

### 白平衡

https://zhuanlan.zhihu.com/p/421424655

用户设置白色温度，默认是6500K，UE4里可以翻到相关c++代码：

```c++
float WhiteTemp = 6500.0f;
```

然后是shader里算CIE 1931 xy 坐标，算法来源于wiki [Standard illuminant](https://en.wikipedia.org/wiki/Standard_illuminant)的Computation小节：

```c++
// Accurate for 4000K < Temp < 25000K
// in: correlated color temperature
// out: CIE 1931 chromaticity
float2 D_IlluminantChromaticity( float Temp )
{
	// Correct for revision of Plank's law
	// This makes 6500 == D65
	Temp *= 1.4388 / 1.438;
	float OneOverTemp = 1.0/Temp;
	float x =	Temp <= 7000 ?
				0.244063 + ( 0.09911e3 + ( 2.9678e6 - 4.6070e9 * OneOverTemp ) * OneOverTemp) * OneOverTemp:
				0.237040 + ( 0.24748e3 + ( 1.9018e6 - 2.0064e9 * OneOverTemp ) * OneOverTemp ) * OneOverTemp;
	
	float y = -3 * x*x + 2.87 * x - 0.275;

	return float2(x,y);
}
```
这个算法只能算 4000K < Temp < 25000K的范围。对于Temp < 4000K范围，又有一套算法，来源于wiki [Planckian locus](https://en.wikipedia.org/wiki/Planckian_locus) 的Approximation小节，uv到xy的转换来源于wiki [CIE 1960 color space](https://en.wikipedia.org/wiki/CIE_1960_color_space) 的Relation to CIE XYZ小节：


```c++
// Accurate for 1000K < Temp < 15000K
// [Krystek 1985, "An algorithm to calculate correlated colour temperature"]
float2 PlanckianLocusChromaticity( float Temp )
{
	float u = ( 0.860117757f + 1.54118254e-4f * Temp + 1.28641212e-7f * Temp*Temp ) / ( 1.0f + 8.42420235e-4f * Temp + 7.08145163e-7f * Temp*Temp );
	float v = ( 0.317398726f + 4.22806245e-5f * Temp + 4.20481691e-8f * Temp*Temp ) / ( 1.0f - 2.89741816e-5f * Temp + 1.61456053e-7f * Temp*Temp );

	float x = 3*u / ( 2*u - 8*v + 4 );
	float y = 2*v / ( 2*u - 8*v + 4 );

	return float2(x,y);
}
```

然后就可以实现白平衡了：

```c++

float3 WhiteBalance( float3 LinearColor )
{
	float2 SrcWhiteDaylight = D_IlluminantChromaticity( WhiteTemp );
	float2 SrcWhitePlankian = PlanckianLocusChromaticity( WhiteTemp );

	float2 SrcWhite = WhiteTemp < 4000 ? SrcWhitePlankian : SrcWhiteDaylight;
	float2 D65White = float2( 0.31270,  0.32900 ); 

	{
		// Offset along isotherm
		float2 Isothermal = PlanckianIsothermal( WhiteTemp, WhiteTint ) - SrcWhitePlankian;
		SrcWhite += Isothermal;
	}

	if (!bIsTemperatureWhiteBalance)
	{
		float2 Temp = SrcWhite;
		SrcWhite = D65White;
		D65White = Temp;
	}

	float3x3 WhiteBalanceMat = ChromaticAdaptation( SrcWhite, D65White );
	WhiteBalanceMat = mul( XYZ_2_sRGB_MAT, mul( WhiteBalanceMat, sRGB_2_XYZ_MAT ) );

	return mul( WhiteBalanceMat, LinearColor );
}
```

PlanckianIsothermal和PlanckianLocusChromaticity差不多，只是多了一步在uv空间下用Tint做一个便宜，再继续转到xy。

D65White坐标来源于： [White points of standard illuminants](https://en.wikipedia.org/wiki/Standard_illuminant)。

### sRGB和CRT

因为早期计算器存储数据带宽有限(8bits)，线性空间的RGB直接存到8bits的话，会导致亮度低的区域编码不足，导致色调过少，**且因为人眼对颜色的感知是非线性的，对低亮度的颜色更敏感**，于是发明了sRGB非线性颜色空间，使得8bits可以存储更多的低亮度色调。

同时那时候发明的CRT显示器有个问题是，**输出的亮度和输入的电压并非线性关系**，即不支持输入什么颜色就显示什么颜色，有色差，并且是让颜色变暗，这就刚好可以和带宽问题互补：保存图片时提高亮度，CRT显示图片时降低亮度，使得亮度平衡。

sRGB和linear RGB的大约换算关系：

- linearRGB = pow(sRGB, 2.2)
- sRGB = pow(linearRGB, 1/2.2)

大部分美术输出的贴图都是sRGB。

### gamma encoding

gamma encoding指sRGB = pow(linearRGB, 1/2.2)这个操作。

### gamma correction
gamma correction指linearRGB = pow(sRGB, 2.2)这个操作。

gamma矫正对于单位化到0到1的rgb值，显然会让颜色变暗。

### 现代显示器

现代显示器和CRT不一样，技术上是可以做到**颜色输入是linear RGB，显示就是linear RGB**。但为了兼容sRGB图片以及优化带宽（能省则省），现代显示器**大部分**还是有gamma的。

### PBR和gamma

PBR着色是在线性空间下算的，但大部分贴图都是sRGB空间，需要在采样时或者采样前，把贴图颜色做一次gamma correction，变换到线性空间。

至于输出到显示器前需不需要做gamma encoding，得看显示器是否有gamma。假设显示器gamma为2.2，那么就要做pow(linearRGB, 1/2.2)。

### tone mapping

pbr整个管线可以做到线性了，但是HDR范围下，shading出来的亮度会大于1，还是要做一个映射，把亮度限制在0到1之间，然后才能做gamma encoding并输出到屏幕，毕竟LDR显示器还是8bits通道的。

这个映射就叫tone mapping。含义是色调映射，毕竟在映射前是正确的linear color space。


### [Middle gray](https://en.wikipedia.org/wiki/Middle_gray) 和 [Gray card](https://en.wikipedia.org/wiki/Gray_card)


中灰，也称为18%灰，是用来描述完美曝光质量的数值。本质上是指对可见光波段18%的反射率。Gray card是一个可以买到的卡片，它的颜色就是middle gray。

### Light meters 测光计
 
测光计会把拍摄场景转成灰度图，并算出灰度图的平均灰度值，也就是场景平均反射率。当反射率大于18%，就是过曝，小于18%就是曝光不足。

测光计会用EV显示曝光度，当EV等于0，说明场景等于18%灰，也就是最佳曝光。


# 参考资料

https://photographylife.com/exposure-value

https://pixelsandwanderlust.com/what-is-middle-grey-understanding-18-grey-reflectance/