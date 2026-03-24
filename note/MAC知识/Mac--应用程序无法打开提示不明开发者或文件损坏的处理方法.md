

在安装Mac电脑应用程序的时候，经常会遇到“xxx.app已损坏，打不开。您应该将它移到废纸篓“或”打不开的xxx.app，因为它来自身份不明的开发者”，如图：
<!-- more -->
1 打开终端（Terminal.app）

2 拷贝粘贴 sudo spctl --master-disable，按回车键

3 输入你的账户密码，按回车键确认执行（输入密码不会显示，直接输入确定正确即可）

拷贝粘贴sudo spctl --master-disable的时候注意不要有多余的空格，输入密码的时候不会显示密码，别以为没输上呢，只要你输入对了回车就可以了。输入后到”隐私性与安全“那里看下，任何来源已经选中并已打开，这个时候不需要再解锁选中等其他操作。

![image.png](/images/note/449589a657ceae9fbe519cf7d05e2a82.webp)


如已经开启任何来源，但依旧打不开（macOS Catalina 10.15以上会遇到）按以下步骤执行：

1 打开终端；

2 输入以下命令，回车；
sudo xattr -d com.apple.quarantine /Applications/xxxx.app

![image.png](/images/note/52fa03bd13cfd65137ea4fb31ac23fd7.webp)
