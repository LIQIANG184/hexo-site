---
title: "【iOS知识点】rootViewController获取不到的原因"
date: 2026-03-18 18:30:13
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "【iOS知识点】rootViewController获取不到的原因.md"
---

 突然发现项目中获取rootViewController的代码失效了

复现步骤：是当弹出了UIAlertView后，再获取rootViewController发现获取不到如下图：
![image.png](/images/note/cb27a6ac2941debf603de09ff4f9b2f5.webp)
经查找资料，获取rootViewController的正确姿势:

    AppDelegate *appdelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    UIViewController *rootViewController1 = appdelegate.window.rootViewController;

一般怎么获取工程中window上面的RootViewController

第一种方法：

    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    UIViewController *rootViewController = window.rootViewController;
第二种方法：

    AppDelegate *appdelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    UIViewController *rootViewController1 = appdelegate.window.rootViewController;
这两种写法，在平常的时候是没有区别的，但是这两种写法在有的时候就不一样了。

keyWindow这个属性是什么意思？

![image](/images/note/9cd67b36600f471ded2f4558f2f18c8a.webp)

个人理解的意思是，在windows数组中，最近时间调用makeKeyAndVisible方法的属性。

当然可以参考关于UIAlertView显示的相关内容：

[http://www.jianshu.com/p/7ac398ef4532](http://www.jianshu.com/p/7ac398ef4532)

[http://stackoverflow.com/questions/5968703/how-to-find-root-uiviewcontroller](http://stackoverflow.com/questions/5968703/how-to-find-root-uiviewcontroller)

alertView的出现是因为，生成了一个新的window，加在了界面上面。这个时候获取到的keyWindow就是UIAlertControllerShimPresenterWindow。可以通过如下代码实验：

Appdelegate中的代码，设置RootViewController

    -  (BOOL)application:(UIApplication  *)application didFinishLaunchingWithOptions:(NSDictionary  *)launchOptions { 
     // Override point for customization after application launch.  
    self.window =  [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];  
    self.window.backgroundColor =  [UIColor whiteColor];  
    ViewController  *view =  [[ViewController alloc] init];  
    UINavigationController  *nav =  [[UINavigationController alloc] initWithRootViewController:view]; 
     self.window.rootViewController = nav;  [self.window makeKeyAndVisible]; 
     return  YES;  
    }

ViewController中的代码

    -  (void)viewDidLoad {  [super viewDidLoad];  
    // Do any additional setup after loading the view, typically from a nib.  
    UIButton  *tempBtn =  [UIButton buttonWithType:UIButtonTypeSystem]; 
    tempBtn.frame =  CGRectMake(100,  100,  100,  100); 
    tempBtn.backgroundColor =  [UIColor cyanColor]; 
     [tempBtn setTitle:@"测试1" forState:UIControlStateNormal];  
    [tempBtn addTarget:self action:@selector(clickBtn:) forControlEvents:UIControlEventTouchUpInside];  
    [self.view addSubview:tempBtn];  
    }

    -  (void)clickBtn:(UIButton  *)sender{  
    // 创建一个测试的alertView 
     UIAlertView  *alterView =  [[UIAlertView alloc] initWithTitle:@"测试" message:@"测试"  delegate:nil cancelButtonTitle:@"取消" otherButtonTitles:nil,  nil]; 
     [alterView show]; 
     UIWindow  *window1 =  [UIApplication sharedApplication].keyWindow; 
     AppDelegate  *appdelegate =  (AppDelegate  *)[UIApplication sharedApplication].delegate; 
     UIWindow  *window2 = appdelegate.window;  
    NSLog(@"\n\nwindow1 = %@    \n\nwindow2 = %@  \n\nwindow1.rootViewController = %@ \n\nwindow2.rootViewController = %@",window1,window2,window1.rootViewController,window2.rootViewController);  
    }

打印结果：

     
    window1 =  <_UIAlertControllerShimPresenterWindow:  0x7fb4ab720c80;  frame  =  (0  0;  375  667);  opaque  =  NO;  gestureRecognizers  =  <NSArray:  0x7fb4ab72fac0>; layer =  <UIWindowLayer:  0x7fb4ab7223f0>> window2 =  <UIWindow:  0x7fb4ab720650;  frame  =  (0  0;  375  667);  gestureRecognizers  =  <NSArray:  0x7fb4ab722310>; layer =  <UIWindowLayer:  0x7fb4ab720a70>> window1.rootViewController =  <UIApplicationRotationFollowingController:  0x7fb4ab9282e0> window2.rootViewController =  <UINavigationController:  0x7fb4ae820800></pre>

结果明显不一样，其实我们一般情况下想获取的rootViewController是第二种,希望我们获取到在appdelegate中设置的appdelaget.window.rootViewController。

所以了建议获取rootViewController的时候还是采用

第二种方法：

    AppDelegate  *appdelegate =  (AppDelegate  *)[UIApplication sharedApplication].delegate; 
    UIViewController  *rootViewController1 = appdelegate.window.rootViewController;</pre>

其实，和alertView类似的，UIActionSheet也是这样的。

一般人说无所谓，但是如果在AlertView弹出的时候去获取RootViewController，并且对你认为获取正确的RootViewController做相关的操作，你会死的很惨。

还有就是建议：即时通过第二种方法获取到了RootViewController，在使用之前建议再判断一下获取到的类是不是就是自己想要的类型，更保险一些。

    AppDelegate  *appdelegate =  (AppDelegate  *)[UIApplication sharedApplication].delegate; 
     if  ([appdelegate.window.rootViewController isKindOfClass:["想要获取到的rootVC"  class]]  ==  YES) { 
     // 为所欲为 
     }

转载自[此处](http://www.qingpingshan.com/rjbc/ios/181557.html)
