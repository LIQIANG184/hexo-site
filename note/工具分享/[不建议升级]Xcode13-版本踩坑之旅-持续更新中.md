在iOS15发布来临之际,下载了Xcode13 版本
![image.png](/images/note/9b4b1153712c46e578072cbc5a0e8b60.webp)
<!-- more -->
运行过程中经常无响应
![image.png](/images/note/4d7e4de989f03f0bc06cd13918390179.webp)
配上我的电脑配置:
![image.png](/images/note/4e438639823951a49f7cd4bde5de4c72.webp)




#总结一句不要升级




如果不幸入坑, 又不想回退可能会遇到以下问题,欢迎留言交流:

#问题 1 : 彻底废弃Legacy Build System

 The  Legacy Build System will be removed in a future release. 

![image.png](/images/note/c754fdee377e722cd6292ee279ebfb41.webp)

##修改方法
Xcode顶部菜单:  File > Workspace Settings. 改成: New Build System(Default)
![image.png](/images/note/2346ceb798e497d235b5551ea10921b4.webp)

#2  多Info.plist问题
Multiple commands produce 'xxx/Info.plist':
1) That command depends on command in Target 'xx'): script phase “[CP] Copy Pods Resources”
2) Target 'xx' (project 'xx') has process command with output 'xx/Info.plist'


![image.png](/images/note/c8fc42e0662cfa8ef66546cd8c8fe59b.webp)

##修改方法

Podfile文件增加一行:

    install! 'cocoapods', :disable_input_output_paths => true
`然后一定要  pod install`


#3 方法冲突
![image.png](/images/note/afd76f470c65b4462c3fd3d3c7bd8d23.webp)

##修改方法
删除冲突方法的其中之一

4 clip证书报错问题(待解决,解决后立刻更新):
![image.png](/images/note/1b4cbd99673c41f0f9f173725003bd83.webp)
