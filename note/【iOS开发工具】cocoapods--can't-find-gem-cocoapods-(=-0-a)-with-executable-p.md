
#使用pod命令出现这个错误:
> can't find gem cocoapods (= 0.a) with executable pod (Gem::GemNotFoundException）

![image.png](https://upload-images.jianshu.io/upload_images/2791393-9c2ed74f8c68e9ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
#解决步骤：

>1 cd到git目录
2 显示隐藏文件 【shift+command+.】
3 打开【.bundle】文件
4 打开config文件，并清空
（完毕！）

#解决过程：

>1 重新安装最新版本cocoapods，不行
2 重新安装指定版本cocoapods，不行
3 重新安装ruby，不行
4 重新安装gem，不行
5 重新check代码，不行
6 重启电脑，不行
7 发现同一工程部分分支代码可以使用pod，后使用删除文件法，定位影响pod无法使用的文件，最后找到是.bundle/config问题

