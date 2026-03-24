如果你已经对Swift精通,请略过此文,不惜勿喷,谢谢!
Swift在我心目中的地位: Swift是一门将要替代OC,并且正在替代OC,必然要替代OC的语言;作为一个iOS开发者,如果不想被淘汰,就必须要学Swift;
<!-- more -->
                                                                                    --

----
一 认识可选项
Swift里边有一个特殊的存在--可选项,要知道在Swift中String,Array等对象类型的变量不能复制为nil,会报错,错误如下:
![Paste_Image.png](/images/note/648eb2e82065460723b45aa87f6ebeac.webp)
那么怎么把一个对象赋值为空呢,这就需要用到可选项了,如下代码就不会报错了:
![Paste_Image.png](/images/note/e2bca716dbf93565eb5bd077f69558f7.webp)
可以看到,定义可选项变量并不复杂,只要在类型后边加一个"?"就可以了;
二 什么时候需要声明可选项

    总体的原则是: 有需要将对象赋值为空的时候需要用到可选项

例如定义模型的时候可以用可选项,代码如下:

    import UIKit

    class Model: NSObject {

         var name:String?
         var age:Int?
         var classes:Int?
    
         override init() {
              super.init()
         }
    }
如果不用可选项,代码如下:

    import UIKit

    class Model: NSObject {

         var name:String
         var age:Int
         var classes:Int
    
         override init() {
              super.init()
         }
    }
就会报错,错误如下:

![Paste_Image.png](/images/note/a3de38cdf945e3345c38072d64586410.webp)
也就是需要给 name,age,classes赋一个初始值,解决报错有以下两种办法:

![在声明时候赋值.png](/images/note/73996382dafa4d75bcfe803642a8be86.webp)

![在初始化方法里赋值.png](/images/note/e3cfef92a1b4c12e1346bb1e316d6afd.webp)
三 使用可选项
在使用的时候需要强制解包,解包运算符是"!",例如

    let model = Model()
        model.age = 10
        model.name = "老王"
        model.classes = 2
        print("我的名字叫" + model.name! + ",今年" +  
        String(describing: model.age!) + "岁,我的班级是5年级" + 
        String(describing: model.classes!) + "班." )
打印结果是:我的名字叫老王,今年10岁,我的班级是5年级2班.
