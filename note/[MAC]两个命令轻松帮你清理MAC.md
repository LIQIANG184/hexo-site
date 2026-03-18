**背景：**

最近老提示空间不够，这就比较讨厌了，为什么存储空间这么快就花完了。。。

![image.png](/images/note/41c5f19e2341ecb66ea2bf595886daf7.webp)
40)

如图，128的空间，就剩下几个G了，其中最大头的系统占用：62G，占比50%多

正常情况下：一般我们能够通过 **清理文稿 **和 **回收箱 **来解决空间不够的问题。

1、清空回收站。

2、在文稿里，按文件大小排序，删除不需要的文件。

3、对于GarageBand，这个是系统上的模拟乐器，一般都使用不到。

清除方法：
>rm -rf /Library/Application\ Support/GarageBand
rm -rf /Library/Application\ Support/Logic
rm -rf /Library/Audio/Apple\ Loops

不过，对于罪魁祸首，系统的160G，我们怎么才能知道她的内部存储分布呢？

**正文：**

下面就是重点了：关于如何查看系统的文件占用详情。

一、首先打开终端，输入

>du -sh *

这个命令用来查看根目录下，所有文件的大小分布，如图所示：

![image.png](/images/note/ea4393dd5ee2676e8116429492a95e5f.webp)

其中，我们很容易能看到每个文件的大小占比，快速定位到最大占比的文件：Library

二、输入命令，进入到Library文件路径

>cd Library



然后，查看Library下的所有文件大小分布。

输入：

>du -sh *

重复以上步骤,找到占用内存最大的文件,然后结合实际情况,进行删减,如果你是开发者,你会发现占用空间最大的,往往是**Xcode/DerivedData和Xcode/Archives**,这两个一般可以直接删除
希望能对大家有帮助～
