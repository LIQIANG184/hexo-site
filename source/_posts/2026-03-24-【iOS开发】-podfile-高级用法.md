---
title: "【iOS开发】-podfile-高级用法"
date: 2026-03-24 14:50:36
tags:
  - 笔记
categories:
  - "iOS开发"
from_note: true
source_note: "iOS开发/【iOS开发】-podfile-高级用法.md"
---

#问题
在多人开发时，遇到了频繁修改podfile引起冲突等问题，衍生了以下需求
```
product环境的podfile最好少动，podfile在不同环境下使用不同的podfile
```
<!-- more -->

#解决方法：
```
1 在podfile中加入环境变量的判断
2 不同的环境引用不同的podfile.xxx文件
```

*知识点*
```
1 cocoapods 基本使用
2 Podfile引用 `eval(File.read('Podfile.release'))`
3 Podfile 打印语句 `puts "product:#{product}"`
4 Podfile `if`语句
```

##Podfile 
修改前
```
source 'xxx'

target 'name2' do 
  # 第三方库
  pod 'AFNetworking', '3.1.0.8'
end
target 'name1' do 
  # 第三方库
  pod 'AFNetworking', '3.1.0.8'

end
```
修改后

```
product = ENV['product']

puts "product:#{product}"

if product 
  eval(File.read('Podfile.release'))
else
  eval(File.read('Podfile.local'))
```
其中 Podfile.release和之前的podfile一样
其中 Podfile.local如下：

```
source 'xxx'

target 'name2' do 
  # 第三方库
  pod 'AFNetworking', :path =>'xxx'
end
target 'name1' do 
  # 第三方库
  pod 'AFNetworking', :path =>'xxx'

end
```
