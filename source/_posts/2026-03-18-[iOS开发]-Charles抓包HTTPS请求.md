---
title: "[iOS开发]--Charles抓包HTTPS请求"
date: 2026-03-18 18:30:13
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "[iOS开发]--Charles抓包HTTPS请求.md"
---

> 抓取HTTPS请求包，对数据进行排查检验

**1.安装Charles**
**2.电脑安装Charles证书**

![image.png](/images/note/fa8273570b03f096ccfcccb3faf75f89.webp)


![image.png](/images/note/cbc7dcd7e88d5f28656863d1b2240374.webp)


**3.手机安装证书**

![image.png](/images/note/ed698f4d68abd7b631568abc6b787329.webp)


**4.手机网页输入网址 下载证书并信任**

![image.png](/images/note/1e31ac5f939fe0f02ad96b2d1fc21085.webp)


![image.png](/images/note/bf1202241c95f911d05d80bc99019772.webp)


`注意`：在iOS 10.3之前,当你将安装一个自定义证书,iOS会默认信任,不需要进一步的设置。而iOS 10.3之后,安装新的自定义证书默认是不受信任的。如果要信任已安装的自定义证书,需要手动打开开关以信任证书。

iOS11下需要手动信任已下载好的证书，方法如下：

> 设置->通用->关于本机->证书信任设置-> 找到charles proxy custom root certificate然后信任该证书即可.
> 
![image.png](/images/note/35c47735cd7c079899c6edacc883eab3.webp)


**5.开始抓包**
Charles设置Proxy
Proxy -> SSL Proxying Settings...，如下图所示：

![image.png](/images/note/59cc3559996a4cc10b7db74823eca2ae.webp)


选择Proxy | Recording Settings，弹出Recording Settings设置选项卡，勾选include

![image.png](/images/note/49878e9d923a84e4d2a7d82fe65082dc.webp)


**6.原理简析**
如果是HTTP请求，因为数据本身并没加密所以请求内容和返回结果是直接展现出来的。
但HTTPS是对数据进行了加密处理的，如果不做任何应对是无法获取其中内容。所以Charles做的就是对客户端把自己伪装成服务器，对服务器把自己伪装成客户端：

1.  Charles拦截客户端的请求，伪装成客户端向服务器进行请求
2.  服务器向“客户端”（实际上是Charles）返回服务器的CA证书
3.  Charles拦截服务器的响应，获取服务器证书公钥，然后自己制作一张证书，将服务器证书替换后发送给客户端。（这一步，Charles拿到了服务器证书的公钥）
4.  客户端接收到“服务器”（实际上是Charles）的证书后，生成一个对称密钥，用Charles的公钥加密，发送给“服务器”（Charles）
5.  Charles拦截客户端的响应，用自己的私钥解密对称密钥，然后用服务器证书公钥加密，发送给服务器。（这一步，Charles拿到了对称密钥）
6.  服务器用自己的私钥解密对称密钥，向“客户端”（Charles）发送响应
7.  Charles拦截服务器的响应，替换成自己的证书后发送给客户端

当然，如果用户不选择信任安装Charles的CA证书，Charles也无法获取请求内容。还有一种，如果客户端内置了本身的CA证书，这时如果Charles把自己的证书发送给客户端，客户端会发现与程序内的证书不一致，不予通过，此时Charles也是无法获取信息的。

**参考**
[mac环境下使用Charles抓包Https请求](https://link.jianshu.com?t=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000005070614)
[浅谈Charles抓包](https://www.jianshu.com/p/405f9d76f8c4)
[Charles 抓包IOS中https乱码解决](https://link.jianshu.com?t=https%3A%2F%2Fblog.csdn.net%2Fdounine%2Farticle%2Fdetails%2F78484439)

**写在最后**
本文仅做个人学习记录，不做他用！

[ 转载自](https://www.jianshu.com/p/ec0a38d9a8cf)
