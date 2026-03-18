---
title: "iOS-drawRect-实现小船随波浪起伏的动画"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "iOS-drawRect-实现小船随波浪起伏的动画.md"
---

最近有朋友让我帮他看一个demo的实现,这个demo需求描述很简单: 
     
     实现小船随波浪起伏的动画    

先上效果图,有兴趣的童鞋,可以先自己想想实现方式再看我的思路:
![gif.gif](http://upload-images.jianshu.io/upload_images/2791393-641e35c0b1805bf6.gif?imageMogr2/auto-orient/strip)

1 分析问题:此需求页面有两个元素:一个小船,一个曲面

      1.1 小船很简单,UIImageView+一张小船图片就可以
      1.2 曲面是一个正弦曲线或者余弦曲线,向上偏移一定量,
          此曲线与一条线之间的空间填充上颜色,也能实现;

2 重难点问题分析:

      2.1 正弦或余弦曲线怎么画: 网上有很多实现方式,这里不再赘述,
          本文是参考一个类叫NBWaveView,实现正弦曲线的
      2.2 小船怎么与曲线同步起伏: 由观察得知小船在起伏的时候,
          大小没有变化,
          变化的是位置(center)和transform,
          接下来就是找出小船对应每一点的center和transform;

3  重点解决小船对应没一点的center和transform

  为了方便叙述,先画两张张图:

![示意图.jpg](http://upload-images.jianshu.io/upload_images/2791393-a5dc5d96ee378157.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![抽象图.jpg](http://upload-images.jianshu.io/upload_images/2791393-b9e82f42282a39b4.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
有兴趣的同学可以研究一下这两张图,
没兴趣请当做没有看到,直接看结论:

~~transform角度为
     CGFloat angle = self.config.waveA * self.config.wavePeriod *
                   cos(self.config.wavePeriod(self.width/2)+self.config.waveOffset)~~(鸣谢Colleny_Z君)

    //在当前点的斜率是
     CGFloat k = self.config.waveA * self.config.wavePeriod *
                   cos(self.config.wavePeriod*(self.width/2)+self.config.waveOffset);
    //transform角度为
     CGFloat angle = atan(k);

    //中心点坐标为
    self.imgView.centerY = self.imgView.size.height/2*cos(angle)+y-self.imgView.size.height;
    self.imgView.centerX = self.imgView.size.height/2*sin(angle)+self.width/2;

详细实现请下载[demo](https://github.com/CoderLi-Q/WaveViewAndShip)

如有任何问题欢迎留言,请各位看官不吝赐教!
