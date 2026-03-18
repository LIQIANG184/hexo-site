最近有朋友让我帮他看一个demo的实现,这个demo需求描述很简单: 
     
     实现小船随波浪起伏的动画    

先上效果图,有兴趣的童鞋,可以先自己想想实现方式再看我的思路:
![gif.gif](/images/note/ab2fd22ab501fd6abaee85fa21a49e2b.webp)

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

![示意图.jpg](/images/note/21b5714cee5a48702817614ffe3ea64d.webp)


![抽象图.jpg](/images/note/fd841cec0e52f8729e9b0ee358de93aa.webp)
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
