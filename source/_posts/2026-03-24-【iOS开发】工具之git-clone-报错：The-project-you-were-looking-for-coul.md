---
title: "【iOS开发】工具之git-clone-报错：The project you were looking for could not be f"
date: 2026-03-24 14:51:03
tags:
  - 笔记
categories:
  - "iOS开发"
from_note: true
source_note: "iOS开发/【iOS开发】工具之git-clone-报错：The project you were looking for could not be f.md"
---

错误: remote: The project you were looking for could not be found.
fatal: repository 'http://XXXX.git/' not found
<!-- more -->
解决方法：

git clone http://username@XXXX.git/

把username 换成自己的用户名   之后会提醒你输入密码

原因：

之前登录过其他的账号，这个账号没有此路径权限
