在iOS15发布来临之际,下载了Xcode13 版本
![image.png](https://upload-images.jianshu.io/upload_images/2791393-721be6a020d970ee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

运行过程中经常无响应
![image.png](https://upload-images.jianshu.io/upload_images/2791393-924387624745c1d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
配上我的电脑配置:
![image.png](https://upload-images.jianshu.io/upload_images/2791393-36a95c0cab50ff48.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)




#总结一句不要升级




如果不幸入坑, 又不想回退可能会遇到以下问题,欢迎留言交流:

#问题 1 : 彻底废弃Legacy Build System

 The  Legacy Build System will be removed in a future release. 

![image.png](https://upload-images.jianshu.io/upload_images/2791393-7c2c6b77b2bc8ed6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##修改方法
Xcode顶部菜单:  File > Workspace Settings. 改成: New Build System(Default)
![image.png](https://upload-images.jianshu.io/upload_images/2791393-bcd2d8dddb196f9d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#2  多Info.plist问题
Multiple commands produce 'xxx/Info.plist':
1) That command depends on command in Target 'xx'): script phase “[CP] Copy Pods Resources”
2) Target 'xx' (project 'xx') has process command with output 'xx/Info.plist'


![image.png](https://upload-images.jianshu.io/upload_images/2791393-dfe5a1ea2047c7b8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##修改方法

Podfile文件增加一行:

    install! 'cocoapods', :disable_input_output_paths => true
`然后一定要  pod install`


#3 方法冲突
![image.png](https://upload-images.jianshu.io/upload_images/2791393-b453411a570dfc4b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##修改方法
删除冲突方法的其中之一

4 clip证书报错问题(待解决,解决后立刻更新):
![image.png](https://upload-images.jianshu.io/upload_images/2791393-bf46cc9ea045a20f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
