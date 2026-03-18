最近了解到StarUML比较多，所以写一篇教程供大家，不足之处，请见谅。

StarUML(简称SU)，是一种创建UML类图，生成类图和其他类型的统一建模语言(UML)图表的工具。StarUML是一个开源项目之一发展快、灵活、可扩展性强(zj).

StarUML官方下载地址： http://staruml.io/download

安装教程： 
安装步骤很简单，省略。 
注意：付费软件，如需破解网上很多教程，不破解不影响使用

安装之后的主界面简介如图所示： 
![image.png](https://upload-images.jianshu.io/upload_images/2791393-25c0472068f87629.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


2.创建工程 
在启动star UML时，系统会默认帮我们创建一个工程

如果这个工程不是你想要的工程，你可以点击File–》new from template中修改为你需要的工程类型。如图所示。 
 ![image.png](https://upload-images.jianshu.io/upload_images/2791393-89094e92b904abf9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3.介绍类与类之间的关系 
既然介绍类图，我们首先了解，什么是类？ 
类图: 类图是面向对象系统建模中最常用和最重要的图，是定义其它图的基础。类图主要是用来显示系统中的类、接口以及它们之间的静态结构和关系的一种静态模型。 
类图的3个基本组件：类名、属性、方法。 
类的几个主要关系：实现，关联，泛化，聚合，组合，依赖 
在StarUML中默认打开的“toolbox”工具中就是类相关的一下基础功能组件，以及组件的功能简介基础组件中有类实例，以及描述类的各个功能组件。如图所示。 

![image.png](https://upload-images.jianshu.io/upload_images/2791393-0bb599f101d9dce7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

类组件的基本操作介绍： 
单击选择Class，至工作区域内单机左键，即可创建一个class实例。创建实例后，周围会出现一堆，功能按钮，去描述这个类，如图所示。图后会有介绍各个租价功能的介绍。 
 ![image.png](https://upload-images.jianshu.io/upload_images/2791393-24d26a4cb025f424.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

功能介绍： 
1. 用来标识Class的可见性（默认为public） 
2. 用来添加note的，比如：类的说明 
3. 增加类的属性 
4. 增加类的操作方法。 
5. 增加Reception 
6. 增加子类 
7. 增加父类 
8. 添加已有的接口 
9. 添加需要的接口 
10. 添加关联 
11. 添加聚合 
12. 添加组合 
13. 添加端口 
14. 添加部件

泛化（继承） 
泛化关系是类元的一般描述和具体描述之间的关系，具体描述建立在一般描述的基础之上，并对其进行了扩展。具体描述完全拥有一般描述的特性、成员和关系， 并且包含补充的信息。在Java中用“extend”来表示此关系。举个计算机的例子来说：冯诺依曼结构是最初的计算机结构，无论是个人计算机，服务器，还是超级计算机，都具有该特性，并在此特性上进行了扩展。 
UML图中实现泛化管理的描述，在类图中使用带空心三角箭头的实线表示，箭头从子类、子接口指向父类、父接口。具体如图所示。 
![image.png](https://upload-images.jianshu.io/upload_images/2791393-b6a1184b7e151f34.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


实现 
实现指的是一个class类实现interface接口（可以是多个）的功能，实现是类与接口之间最常见的关系。在类图中使用带空心三角箭头的虚线表示，箭头从实现类指向接口。如图。
![image.png](https://upload-images.jianshu.io/upload_images/2791393-66fbd8b0e9f5d519.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 
3. 依赖 
类A的实现需要引用类B，这就是依赖，这种使用关系是具有偶然性的、临时性的、非常弱的，而B类的变化会影响到A，则A与B存在依赖关系，依赖关系是弱的关联关系。例如：人依赖计算机去做软件开发。在UML类图设计中，依赖关系用由类A指向类B的带箭头虚线表示。如图所示。 
![image.png](https://upload-images.jianshu.io/upload_images/2791393-0a6eb5ad3f492fac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


聚合 
聚合是关联关系的一种特例，它体现的是整体与部分的关系，是has-a的关系，此时整体与部分之间是可分离的，即没有了整体，局部也可单独存在。就比如我们航母战斗群：驱逐舰，巡洋舰，护卫舰，航空母舰等。在UML类图设计中，聚合关系以空心菱形加实线箭头表示如图所示。
![image.png](https://upload-images.jianshu.io/upload_images/2791393-467ce45bf8b19da7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


5. 组合 
是一种contains-a的关系，部分不能脱离整体存在。这是一种比聚合更强的关系，又称强聚合。整体的生命周期即为组成部分的生命周期。例如：人和人的构成部分大脑，心脏等。在UML类图设计中，组合关系以实心菱形加实线箭头表示。 如图所示。
![image.png](https://upload-images.jianshu.io/upload_images/2791393-0de4ad91b4ef9059.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 
StarUML制作用例图 
该软件最常用的功能就是制作用例图，时序图，序列图等，本节以用例图为基础讲解基本使用。 
单击Model选择Add Diagram 会出现许多模型，选择你想要使用的，如我想要使用：用例图，则我选择Use Case Diagram如图所示。选择后，tool box会产生相应的变化，更新出配套的功能组件，如图所示。 
 ![image.png](https://upload-images.jianshu.io/upload_images/2791393-6b7246da62c02912.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Tool box工具盒中有用例图的参与者（Actor）、用例 （Use Case）、系统边界、箭头等工具组成。我们可以根据需要选择恰当的工具。模拟制作图书馆的一部分用例：学生借书的操作如图所示。 
![image.png](https://upload-images.jianshu.io/upload_images/2791393-89c29ca664037fd5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

--------------------- 
作者：luansha0 
来源：CSDN 
原文：https://blog.csdn.net/luansha0/article/details/82260678 
版权声明：本文为博主原创文章，转载请附上博文链接！
