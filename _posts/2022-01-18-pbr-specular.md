---
layout: post_latex
title: Filament中的anisotropic specular和isotropic specular
tags: ['computer graphics']
published: true
---

<!--more-->

很久前总结了pbr公式内容：[PBR渲染原理](https://www.qiujiawei.com/pbr-rendering/)，但没有说到各向异性的问题。

最近发现Filament详细介绍了pbr相关的知识，也有源码可读，可以好好学习一番。

pbr理论中，高光项的公式如下：

\\[ f\_ r(v,l) = \\frac \{ D(h,\alpha ) G(v,l,\alpha ) F(v,h,F\_0) \} \{ 4 (n \cdot v)(n \cdot l) \} \\]


Filament用一个specularLobe统一描述了各向同性和各向异性的高光项：

```c++
vec3 specularLobe(const PixelParams pixel, const Light light, const vec3 h,
        float NoV, float NoL, float NoH, float LoH) {
#if defined(MATERIAL_HAS_ANISOTROPY)
    return anisotropicLobe(pixel, light, h, NoV, NoL, NoH, LoH);
#else
    return isotropicLobe(pixel, light, h, NoV, NoL, NoH, LoH);
#endif
}
```

本文的目标是理解这里面的代码。

## Filament的FS shader流程结构

代码都在shaders/src目录，根据宏变体，会组合这里面的代码，最终生成目标shader。

main.fs的main是入口:

```c++
void main() {
    filament_lodBias = frameUniforms.lodBias;

    // See shading_parameters.fs
    // Computes global variables we need to evaluate material and lighting
    computeShadingParams(); // 计算一些全局参数

    // Initialize the inputs to sensible default values, see material_inputs.fs
    MaterialInputs inputs;
    initMaterial(inputs); // 初始化默认值

    // Invoke user code
    material(inputs); //调用.mat文件里的用户代码

    fragColor = evaluateMaterial(inputs); // 着色
    ...
}
```

其中的evaluateMaterial具体是哪一个实现，得看选择的shading model。以基本的pbr为例（即LIT模型），代码在shading_lit.fs：

```c++
vec4 evaluateLights(const MaterialInputs material) {
    PixelParams pixel;
    getPixelParams(material, pixel); // 从材质参数转换得到后续计算用的PixelParams

    vec3 color = vec3(0.0);

    evaluateIBL(material, pixel, color); // 默认都有IBL间接光

#if defined(HAS_DIRECTIONAL_LIGHTING)
    evaluateDirectionalLight(material, pixel, color); // 下面会分析的重点接口
#endif

    ...

    return vec4(color, computeDiffuseAlpha(material.baseColor.a));
}

vec4 evaluateMaterial(const MaterialInputs material) {
    vec4 color = evaluateLights(material);
    addEmissive(material, color); // 自发光，先忽略
    return color;
}
```

然后就看evaluateDirectionalLight，代码在light_directional.fs：


```c++
void evaluateDirectionalLight(const MaterialInputs material,
        const PixelParams pixel, inout vec3 color) {

    Light light = getDirectionalLight();
    ...
    float visibility = 1.0;
#if defined(HAS_SHADOWING)
    //算阴影 得到visibility
    ...
#endif

#if defined(MATERIAL_HAS_CUSTOM_SURFACE_SHADING)
    color.rgb += customSurfaceShading(material, pixel, light, visibility);
#else
    color.rgb += surfaceShading(pixel, light, visibility); // 重点
#endif
}

```

surfaceShading的代码在shading_model_standard.fs，这个就已经是pbr的核心代码了。


## isotropic specular

先从各向同性开始：

```c++
vec3 isotropicLobe(const PixelParams pixel, const Light light, const vec3 h,
        float NoV, float NoL, float NoH, float LoH) {

    float D = distribution(pixel.roughness, NoH, h);
    float V = visibility(pixel.roughness, NoV, NoL);
    vec3  F = fresnel(pixel.f0, LoH);

    return (D * V) * F;
}
```
发现代码里少了\\( 4 (n \cdot v)(n \cdot l) \\)部分，这是因为Filament把specular公式拆成三部分：


\\[ f\_ r(v,l) = D(h,\alpha ) \cdot  \\frac \{  G(v,l,\alpha ) \} \{ 4 (n \cdot v)(n \cdot l) \}  \cdot F(v,h,F\_0) = D \cdot V \cdot F \\]


\\( 4 (n \cdot v)(n \cdot l) \\)被放进了V项中了。

## 几个材质关键参数的计算

```c++
struct PixelParams {
    vec3  diffuseColor;
    float perceptualRoughness;
    float perceptualRoughnessUnclamped;
    vec3  f0;
    float roughness;
    vec3  dfg;
    vec3  energyCompensation;
    ...
}

struct MaterialInputs {
    vec4  baseColor;
    float roughness;
    float metallic;
    float reflectance;
    float ior;
    ...
}

vec3 computeDiffuseColor(const vec4 baseColor, float metallic) {
    return baseColor.rgb * (1.0 - metallic);
}

void getCommonPixelParams(const MaterialInputs material, inout PixelParams pixel) {
    vec4 baseColor = material.baseColor;
    pixel.diffuseColor = computeDiffuseColor(baseColor, material.metallic);
#if !defined(SHADING_MODEL_SUBSURFACE) && (!defined(MATERIAL_HAS_REFLECTANCE) && defined(MATERIAL_HAS_IOR))
    float reflectance = iorToF0(max(1.0, material.ior), 1.0);
#else
    // Assumes an interface from air to an IOR of 1.5 for dielectrics
    float reflectance = computeDielectricF0(material.reflectance);
#endif
    pixel.f0 = computeF0(baseColor, material.metallic, reflectance);

    ...
}
```
