---
title: "iOS开发--运用AVPlayer播放视频"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "iOS开发--运用AVPlayer播放视频.md"
---


AVPlayer是可以高度定制性的播放器
利用AVPlayer播放的简单实现见下文:

    NSURL *url = [NSURL URLWithString:@"http://******"];
    playerItem  = [[AVPlayerItem alloc]initWithURL:url];
    //创建player
    player = [[AVPlayer alloc]initWithPlayerItem:playerItem];
    //生成layer层
    AVPlayerLayer *layer = [AVPlayerLayer playerLayerWithPlayer:player];
    self.playLayer = player;
    //设置坐标
    layer.frame = CGRectMake(0, 0, 480, 480);
    //把layer层假如到self.view.layer中
    [self.view.layer addSublayer:layer];
    //进行播放
    [player play];
如想了解AVPlayer的更多用法可以参考
