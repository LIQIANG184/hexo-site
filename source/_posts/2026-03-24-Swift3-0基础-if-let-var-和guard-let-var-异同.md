---
title: "Swift3-0基础----if-let-var-和guard-let-var-异同"
date: 2026-03-24 15:00:25
tags:
  - 笔记
categories:
  - "swift语言"
from_note: true
source_note: "swift语言/Swift3-0基础----if-let-var-和guard-let-var-异同.md"
---

如果你已经对Swift精通,请略过此文,不惜勿喷,谢谢!
Swift在我心目中的地位: Swift是一门将要替代OC,并且正在替代OC,必然要替代OC的语言;作为一个iOS开发者,如果不想被淘汰,就必须要学Swift;
<!-- more -->
                                                                                    --

----
Swift里边有一个特殊的存在--可选项,我们知道可选项变量在具体使用的时候必须要解包. 在解包的时候就要注意了,如果在强制解包的时候,可选项变量是nil,在运行时就会崩溃(编译器不会报错)!

     针对这个问题苹果做了两个句式: if let/var   guard let/var 
下面根据一个例子说明两个句式的使用环境和异同


    //两个可选项
     var optionalName: String? = "John Appleseed"
     var greeting: String? = "Hello!"
    //需求: 拼接两个字符串
 1 有同学就想直接用"+"连接就好了(此处须强制解包),代码如下:

    optionalName! + greeting! 
但是如果optionalName = nil时候,强制解包会崩溃,如何避免此崩溃呢?
2 你可能会想到在解包前做一个判断就好了,代码如下:

    if optionalName != nil && greeting != nil {
       optionalName! + greeting!
    }
对的,当然可以这样!
但是本文的重点是怎么用 if let/var 和 guard let/var
3 用if let/var 和 guard let/var,代码如下:

    // if let 代码
    if let name = optionalName, let greet = greeting {
       name + greet
    }

    // guard let 代码
    guard let name = optionalName, let greet = greeting  else {
        return
    }
    name + greet
是不是比 2 里边的代码优雅许多!
相同点: 都可以用来判断一个可选项是不是空
不同点: 
1 新赋值的变量的作用域不同 if let/var 创建的变量的作用域是 花括号里边 例如3中的name和greet;而guard let/var创建的变量作用域是 guard let/var 语句下边
2 if let/var 创建的变量名字可以与原变量名相同,guar let/var 不行
错误如下:
![guar let_错误.png](/images/note/210cf6a75608b1ebc8ef046530825c5b.webp)

![if let_正确.png](/images/note/f634ef50b2ed27b217b18b0ca037e5b1.webp)
