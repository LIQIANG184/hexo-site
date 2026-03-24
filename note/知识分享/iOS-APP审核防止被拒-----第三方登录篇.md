最近在上传appStore的时候遇到了一个问题--在用微信第三方登录的时候,如果没有安装微信,苹果拒绝提示.这个问题很多人遇到过了.但是我还是想说说过程.
<!-- more -->

---
一  第一次被拒:我们的第三方登录是用的ShareSDK,我们没有做"对于没有安装微信的处理",点击微信登录后的界面是ShareSDK的固有H5页面

    Design - 4.2.3
        We were required to install the Wechat apps before
    we can log-in via Wechat. The user should be able 
    to log-in and access their account, without 
    requiring additional applications to be installed.

    Next Steps

        If you choose to allow users to log-in via Wechat, 
    please use methods that can authenticate users from 
    within your app, such as a native web-view.

  后来我们讨论后,结果是,在未安装微信时,点击微信登录的按钮提示微信没有安装,有一个按钮是"确定",点击确定什么都不干.

---
结果就是迎来了第二次被拒.
苹果给发的邮件是:

    Design - 4.2.3
        We were required to install WeChat before we could
     use your app. Apps should be able to run on 
     launch, without requiring additional applications 
     to be installed.
    Next Steps
        Please revise your app to ensure that users can use
     it upon launch. If your app requires 
     authentication before use, please use methods that 
     can authenticate users from within your app.

后来我们谈论后,结果是,把未安装微信时,微信登录的按钮做成不可点击的灰置.

---
结果就是迎来了第三次被拒. 
苹果给发的邮件是:

    Design - 4.2.3
        We were required to install WeChat before we could
     use your app. Apps should be able to run on 
     launch, without requiring additional applications 
     to be installed.
    Next Steps
        Please revise your app to ensure that users can use
     it upon launch. If your app requires 
     authentication before use, please use methods that 
     can authenticate users from within your app.
    
我们怒了,再次讨论之后,决定在未安装微信时隐藏微信登录图标,结果..结果终于通过了,上线了.（最近好像这样干也不行了，有被拒的APP，我们目前没有发现）

  另外附上如何判断微信有没有安装的API
  
      //需要引入的头文件和库
      #import <ShareSDK/ShareSDK.h>
      #import "WXApi.h"
      //判断安装微信
     if ([WXApi isWXAppInstalled]){
         //安装了微信的处理
     } else {
         //没有安装微信的处理
     }
---

 2018-05-18更新

如果
