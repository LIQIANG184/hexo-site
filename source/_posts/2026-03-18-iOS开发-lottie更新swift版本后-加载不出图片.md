---
title: "iOS开发--lottie更新swift版本后-加载不出图片"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - "iOS开发"
from_note: true
source_note: "iOS开发/iOS开发--lottie更新swift版本后-加载不出图片.md"
---

lottie更新swift版本后 加载不出图片:

     let animation:AnimationView = AnimationView(name: "data.json")
改为:

     let animation:AnimationView = AnimationView(name: "data")
