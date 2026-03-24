---
title: "【iOS开发工具】cocoapods--can't-find-gem-cocoapods-(=-0-a)-with-executable-p"
date: 2026-03-24 14:51:31
tags:
  - 笔记
categories:
  - "工具分享"
from_note: true
source_note: "工具分享/【iOS开发工具】cocoapods--can't-find-gem-cocoapods-(=-0-a)-with-executable-p.md"
---


#使用pod命令出现这个错误:
> can't find gem cocoapods (= 0.a) with executable pod (Gem::GemNotFoundException）
<!-- more -->
![image.png](/images/note/7219201dddd2e2ac1b5afc49ce60bac5.webp)
#解决步骤：

>1 cd到git目录
2 显示隐藏文件 【shift+command+.】
3 打开【.bundle】文件
4 打开config文件，并清空
（完毕！）

#解决过程：

>1 重新安装最新版本cocoapods，不行
2 重新安装指定版本cocoapods，不行
3 重新安装ruby，不行
4 重新安装gem，不行
5 重新check代码，不行
6 重启电脑，不行
7 发现同一工程部分分支代码可以使用pod，后使用删除文件法，定位影响pod无法使用的文件，最后找到是.bundle/config问题

