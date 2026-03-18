---
title: "[iOS]证书授权文件不匹配错误-关于Provisioning-profile-“”-doesn't-include-any-certifi"
date: 2026-03-18 18:30:13
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "[iOS]证书授权文件不匹配错误-关于Provisioning-profile-“”-doesn't-include-any-certifi.md"
---

问题描述： 
    
日前，发布证书将要过期，重新做了一个证书，与其配套的授权文件同步更新。在这个过程中出现了问题，见下图：
![image.png](/images/note/7daab74ce1abce0e0cb2a3ac3a97a64c.webp)

报错信息：
    Provisioning profile “” doesn't include any certificate for which the matching private key is install in the keychain
>大意：
授权文件不包含钥匙串中能匹配私钥的证书---

>简单说就是：
授权文件与证书不匹配

>纠结点：
 我是用新的证书，做的授权文件（这一点很确定）

>尝试解决：
1 重新安装证书（不行）
2 删除Xcode所有授权文件，重新导入新的授权文件（不行）

最终解决方案：
    重启Xcode(对，你没有看错，就是这么简单)
