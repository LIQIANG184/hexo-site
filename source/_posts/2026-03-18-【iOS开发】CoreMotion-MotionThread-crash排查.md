---
title: "【iOS开发】CoreMotion-MotionThread-crash排查"
date: 2026-03-18 18:30:13
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "【iOS开发】CoreMotion-MotionThread-crash排查.md"
---

#背景 

程序开发都会有BUG,有大有小. crash问题视客户端需要重点关注的一个点.客户端有一个遗留的crash问题没有解决.现将排查过程记录下来,希望尽快解决问题

#问题描述
客户端有一个crash问题一直没有解决.

##错误原因
Attempted to dereference garbage pointer 0xab.
翻译: 试图间接引用垃圾指针地址0xab.
应该是:野指针访问

##海神崩溃堆栈:
![image.png](/images/note/0f3317d14b9f26a5e558a54cf5143b3d.webp)

    0 CoreMotion CLClientCreateIso6709Notation (in CoreMotion) + 206336
    1 CoreMotion CLClientCreateIso6709Notation (in CoreMotion) + 206300
    2 CoreMotion CLClientCreateIso6709Notation (in CoreMotion) + 190264 
    3 CoreMotion CLShouldDisplayEEDUI (in CoreMotion) + 309872
    4 IOKit _iohideventsystem_copy_event_from_virtual_service (in IOKit) + 292
    5 CoreFoundation _CFXNotificationCenterCreate (in CoreFoundation) + 48
    6 CoreFoundation -[__NSSetI containsObject:] (in CoreFoundation) + 276
    7 CoreFoundation __NSArrayGetIndexPassingTest (in CoreFoundation) + 588
    8 CoreFoundation CFRunLoopTimerGetInterval (in CoreFoundation) + 36
    9 CoreFoundation CFRunLoopObserverInvalidate (in CoreFoundation) + 228
    10 CoreFoundation CFRunLoopTimerInvalidate (in CoreFoundation) + 344
    11 CoreMotion CLClientCreateIso6709Notation (in CoreMotion) + 211692
    12 libsystem_pthread.dylib pthread_rwlock_wrlock$VARIANT$mp (in libsystem_pthread.dylib) + 60

#排查过程
#0 根据错误原因发现是访问了野指针
>小结: 大致方向是内存管理的问题
#1 根据堆栈信息发现是崩溃在了CoreMotion的线程,而且堆栈信息内没有任何客户端调用的代码逻辑
>小结: 不是客户端直接执行方法引起的崩溃,应该是客户端在运行过程中,系统在调用CoreMotion的底层代码时,引起了崩溃
#2 去掉首页列表的重力感应图片
CoreMotion是苹果的重力感应库,项目内有两个地方使用到了这个, 一个是拍摄页面,一个是首页列表的重力感应图片
>结果: crash情况没有任何好转,排除首页列表的嫌疑
#3 拍摄页面
##3.1 查看 '进入' 拍摄页面后线程情况

![线程情况.png](/images/note/af105d5360ae620090304adb662be682.webp)

![内存情况.png](/images/note/383038a73be57d213616b31f3029d1e6.webp)
我们发现: 
>1 拍摄页面会创建线程 com.apple.CoreMotion.MotionThread ,这个线程是crash线程
2 这个线程是ARSession自主创建的
![image.png](/images/note/2354a657307e45c57676e0cf8c460ea4.webp)




##3.2 查看 '退出' 拍摄页面后线程情况
![ '退出' 拍摄页面后线程.png](/images/note/e0a49f9981fe16b92b226e8cabba9060.webp)
我们发现: 
> 1 拍摄页面会创建线程 com.apple.CoreMotion.MotionThread 没有停止

##3.3 猜想
 1 会不会是线程没有关闭导致的问题
 2 能不能通过停止session自动释放此线程

##3.4 尝试
  1 在退出拍摄页面的时候对session进行释放
  2 能不能通过停止session自动释放此线程: 不能,
     猜测可能是苹果的一个机制,为了下次更快速启动ARSession
