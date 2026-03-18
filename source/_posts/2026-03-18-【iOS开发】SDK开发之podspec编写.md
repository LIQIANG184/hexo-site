---
title: "【iOS开发】SDK开发之podspec编写"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "【iOS开发】SDK开发之podspec编写.md"
---

#介绍
  本系列是SDK打包的实践，主要解决一下3个问题，本篇是第二篇。
[【iOS开发】SDK开发之编译c/c++](https://www.jianshu.com/p/64a7757d3fae?v=1734334386926)
[【iOS开发】SDK开发之podspec编写](https://www.jianshu.com/p/daeaf5728100?v=1742283697172)
[【iOS开发】SDK开发之podspec内执行脚本](https://www.jianshu.com/p/99ca9803cb48?v=1742283732210)

#本期问题
   - APP内使用cocoapods管理第三方库，所以需要自己写podspec并发布到私有repo
   - podspec嵌入打包脚本

##podspec编写：
```
Pod::Spec.new do |s|
  s.name             = 'sdkName'
  s.version         = "1.0.0"
  s.summary          = '***'
  s.description      = "***."
  s.homepage         = "**"
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'lq' => '**' }
  s.source           = { :git => "****", :tag => s.name.to_s + "-" + s.version.to_s }
  s.frameworks = "AVFoundation", "Foundation", "Metal", "CoreMedia"
  s.libraries = "c++","z"
  s.preserve_paths = "ios/build/Debug-iphoneos/**/*", "ios/algorithms/**/data/**/*", "3rd/iOS/lib/**/*.framework/**/*", "3rd/iOS/lib/*.framework/**/*", "3rd/iOS/dependence/png/*"
  s.resource_bundle = { 'sdkName' => "ios/algorithms/**/data/*" }
  s.public_header_files = "3rd/iOS/dependence/png/*.h"
  s.ios.deployment_target = '9.0'
 s.vendored_frameworks = "ios/Debug-iphoneos/Release/*.framework","ios/build/Debug-iphoneos/Release/*.framework", "3rd/iOS/lib/**/*.framework", "3rd/iOS/lib/*.framework"
end
```
这个podspec意思是把很多framework加进来（没有源文件），这些framework是由[上一篇](https://www.jianshu.com/p/64a7757d3fae?v=1734334386926)文章cmake编译出来的
