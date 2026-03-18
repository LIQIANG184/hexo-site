---
title: "【iOS开发】真机调试--dyld_shared_cache_extract_dylibs-failed"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "【iOS开发】真机调试--dyld_shared_cache_extract_dylibs-failed.md"
---

无法真机调试，出现“dyld_shared_cache_extract_dylibs failed”，如下图

![image](//upload-images.jianshu.io/upload_images/2815759-e5288e68b6ca21f7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/420/format/webp)

解决办法：

1.完全退出Xcode

2.前往文件夹： ~/Library/Developer/Xcode/iOS DeviceSupport/ ，删除手机对应的系统版本。

![image](//upload-images.jianshu.io/upload_images/2815759-a01d93104e01acc8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/818/format/webp)

3.启动Xcode

引用链接：https://www.jianshu.com/p/be8b8f1dcc1e
來源：简书

