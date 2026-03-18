---
title: "Swift错误提示解决办法--Swift-Compiler-Error"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "Swift错误提示解决办法--Swift-Compiler-Error.md"
---

错误提示:

Swift Compiler Error

      '?' must be followed by a call, member lookup, or subscript
报错代码:

![错误代码.png](http://upload-images.jianshu.io/upload_images/2791393-cda16df1cf5263d2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

解决办法:
将代码行 head.backgroundColor = UIColor.hex2RGB("#e9f1f6")
改为:
head.backgroundColor = UIColor.hex2RGB("#e9f1f6") as UIColor


总结:

将代码: head.backgroundColor = UIColor.hex2RGB("#e9f1f6")分开发现不报错了....

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2791393-027c9e8a52a97c70.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 注: 为UIColor的增加的OC分类,放在swift里,返回值就变成了可选值,尤其是在闭包里,这个问题属于编译器的问题
