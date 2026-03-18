---
title: "[iOS开发]-swift-判断delegate是否实现了协议方法"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "[iOS开发]-swift-判断delegate是否实现了协议方法.md"
---


#协议:

    @objc protocol CaptureDelegate: NSObjectProtocol{
        @objc optional func settingView(_ settingView: LQCaptureView , preview previewSwitch: Bool)
    }

#class实现:

    class  LQCaptureView{
       var tapCallback: CaptureDelegate?

       func ifPerform() {
          self.delegate?.settingView?(self, preview: isOn)
        }
    }

#重点:
1 协议使用`@objc`修饰符
2 协议方法使用`@objc optional`修饰
3 调用方法时方法名后边添加 `?`, 如下图
>self.delegate?.settingView`?`(self, preview: isOn)
