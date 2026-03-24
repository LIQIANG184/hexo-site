错误提示:

Swift Compiler Error

      '?' must be followed by a call, member lookup, or subscript
<!-- more -->
报错代码:

![错误代码.png](/images/note/5a8fcc8244c456f722fd3542a6d2f9c5.webp)

解决办法:
将代码行 head.backgroundColor = UIColor.hex2RGB("#e9f1f6")
改为:
head.backgroundColor = UIColor.hex2RGB("#e9f1f6") as UIColor


总结:

将代码: head.backgroundColor = UIColor.hex2RGB("#e9f1f6")分开发现不报错了....

![Paste_Image.png](/images/note/bdfdbd329624cbe2d908370faa5988d9.webp)
 注: 为UIColor的增加的OC分类,放在swift里,返回值就变成了可选值,尤其是在闭包里,这个问题属于编译器的问题
