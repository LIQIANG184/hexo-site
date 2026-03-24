---
title: "[iOS开发]-Framework之podspec坑"
date: 2026-03-24 14:49:08
tags:
  - 笔记
categories:
  - "iOS开发"
from_note: true
source_note: "iOS开发/[iOS开发]-Framework之podspec坑.md"
---

vendored_frameworks 找不到

错误示范
s.vendored_frameworks = ['../SDK/*.framework', '../SDK/dependency/*.framework']
<!-- more -->
正确示范
s.vendored_frameworks = ['SDK/*.framework', 'SDK/dependency/*.framework']

现象结论:
podspec没有权限访问上级目录
