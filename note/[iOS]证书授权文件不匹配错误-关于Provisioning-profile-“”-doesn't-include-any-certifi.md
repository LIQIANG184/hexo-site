问题描述： 
    
日前，发布证书将要过期，重新做了一个证书，与其配套的授权文件同步更新。在这个过程中出现了问题，见下图：
![image.png](https://upload-images.jianshu.io/upload_images/2791393-890d0d02c430cff0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

报错信息：
    Provisioning profile “” doesn't include any certificate for which the matching private key is install in the keychain
>大意：
授权文件不包含钥匙串中能匹配私钥的证书---

>简单说就是：
授权文件与证书不匹配

>纠结点：
 我是用新的证书，做的授权文件（这一点很确定）

>尝试解决：
1 重新安装证书（不行）
2 删除Xcode所有授权文件，重新导入新的授权文件（不行）

最终解决方案：
    重启Xcode(对，你没有看错，就是这么简单)
