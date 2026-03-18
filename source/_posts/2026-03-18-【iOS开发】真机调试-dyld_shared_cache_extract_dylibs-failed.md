---
title: "【iOS开发】真机调试--dyld_shared_cache_extract_dylibs-failed"
date: 2026-03-18 18:30:13
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "【iOS开发】真机调试--dyld_shared_cache_extract_dylibs-failed.md"
---

无法真机调试，出现“dyld_shared_cache_extract_dylibs failed”，如下图

![image](/images/note/45246186f8a2b86c991f329cdf5f04dc.webp)

解决办法：

1.完全退出Xcode

2.前往文件夹： ~/Library/Developer/Xcode/iOS DeviceSupport/ ，删除手机对应的系统版本。

![image](/images/note/c8b934955c6768522dece4913bf28edf.webp)

3.启动Xcode

引用链接：https://www.jianshu.com/p/be8b8f1dcc1e
來源：简书

