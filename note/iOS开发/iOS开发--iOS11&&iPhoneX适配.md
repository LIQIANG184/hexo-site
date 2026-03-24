**一、前言**

iOS11发布也有一段时间了，每次版本升级，相关的适配工作当然是下个版本的核心工作之一。而且这次iOS11的更新，相对于iOS10的更新来说，改动点还是比较多的。除了iOS11系统的更新之外，iPhoneX刘海的打理工作也是必不可少。以前我们总是庆幸作为iOS开发者，不必像Android开发者需要考虑各种不同机型的适配问题。但是现在，随着iPhone各种历史版本的存在，各种花式的新版本产生，不同版本之间的适配问题，也是未来我们作为iOS开发者必然要考虑的重要问题之一。
<!-- more -->
这次我主要负责我们这边两款App(滴滴代驾司机端+驾管App)iOS11&iPhoneX适配工作。中间也躺过很多坑，一一记录了下来写成这篇文章，既是对自己工作的一次总结，也可以分享给其他iOS开发者，能够让大家少趟一些坑。

本文将分为三个部分，分别从三方库适配、UI适配、权限适配、补充知识等方面分别进行展开。

**二、三方库适配问题。**

**2.1 CocoaLumberjack 编译出错**

**![1.png](http://upload-images.jianshu.io/upload_images/2791393-b775b94658240a6d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521771491256554.png")** 

CocoaLumberjack编译报错

**问题原因：**

从错误提示可以看出在Xcode9中os_log_error的第二个参数format必须要为不可变的string类型，而不是char*。

**解决方案：**

我们只要改成如下形式就可以了
`os_log_error(OS_LOG_DEFAULT, "%s", msg);`

如果你的工程是pod依赖的话，将pod版本升级到3.3.0版本即可。

**2.2 WebViewJavascriptBridge崩溃处理**

我们代驾司机端web容器使用的是WKWebView，jsBridge使用的是WebViewJavascriptBridge这个三方库，更新到Xcode9之后，只要进入WKWebView容器，就会产生如下crash:

![1.png](http://upload-images.jianshu.io/upload_images/2791393-aa5177f55f4a57ad.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521771550751368.png")

WebViewJavascriptBridge crash

**问题原因：**

当你使用WKWebView作为你的H5容器的时候，WKNavigationDelegate有个回调就是

`- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void(^)(WKNavigationActionPolicy))decisionHandler;`

这个回调主要负责根据webView、navigationAction相关信息决定这次跳转是否可以继续进行。调用decisionHandler(WKNavigationActionPolicyAllow);响应这次跳转请求。调用decisionHandler(WKNavigationActionPolicyCancel);就是不响应这次跳转请求。

查看WebViewJavascriptBridge源码可以看出，在WKWebViewJavascriptBridge.m文件中

![WKVebViewCrash.png](http://upload-images.jianshu.io/upload_images/2791393-6434796338e8161e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521771604832877.png")

在Xcode9中，如果连续看了两次调用decisionHandler方法就会crash。这个问题在之前版本的Xcode均是没有问题的。

**解决方案：**

*   方案一：修改源码

    在上面代码的149行和150行之间添加return;

*   方案二：pod依赖，原作者没有修改此问题，无法修改源码，也可以在业务代码中进行规避。

    在你自己业务代码的对应对调中添加排除代码，如下：

![WKWebViewCrash2.png](http://upload-images.jianshu.io/upload_images/2791393-ef2cda92e020c47e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521771633371153.png")

**2.3 LumberjackConsole UI适配**

**![1.png](http://upload-images.jianshu.io/upload_images/2791393-549af064690c00ad.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521771742682266.png")** 

**问题原因:**

iOS7之后，如何你设置self.edgesForExtendedLayout = UIRectEdgeNone的话,系统通过设置UIViewController的automaticallyAdjustsScrollViewInsets属性来自动调整UIScrollView的contentInset，使UIscrollView能够呈现在我们的可是范围之内，而不会被navBar挡住。这个属性在iOS11中被废弃掉了，在iOS11中代替该属性功能的则是UIScrollView类中的contentInsetAdjustmentBehavior和adjustedContentInset属性.在iOS11中用来决定scrollView超出安全区域与边缘距离的属性是adjustedContentInset而不是contentInset。当scrollView超出安全区域时系统会自动调整SafeAreaInsets值，进而影

响 adjustedContentInset，所以导致scrollView下移20pt或者64pt。当使用自定义的 navigationbar，并且scrollView的frame超出安全区域，SafeAreaInsets为(20,0,0,0);当使用系统的navigationbar，SafeAreaInsets为(64,0,0,0)。

**解决方案:**

在UIScrollView或者UITableView初始化的地方，加入如下代码即可。

针对LumberjackConsole这个开源库，我们可以在PTEConsoleTableView.m文件中的commonInit最后加入如下代码即可。

`if([self respondsToSelector:@selector(setContentInsetAdjustmentBehavior:)]){`
`[self setContentInsetAdjustmentBehavior:UIScrollViewContentInsetAdjustmentNever];`
`}`


**三、UI适配**

**3.1 NavBar中右上角的customView产生偏移**

**![1.png](http://upload-images.jianshu.io/upload_images/2791393-39c74461c7d4020e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521771807148487.png")** 

**问题原因:**

在iOS11中，新的导航视图，使用了AutoLayout布局。而我们这边右上角的两个按钮组合成一个customView，然后把这个customView设置给setRightBarButtonItems而来。customView内部都是frame布局，所以在自动布局下面出错。

**解决方案:**

NavBar中的customView里面针对iOS11，均要采用自动布局。

![1.png](http://upload-images.jianshu.io/upload_images/2791393-aa007f074615bdb0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521771889744285.png")

**3.2 NavBar中自定义TitleView产生偏移**

**![1.png](http://upload-images.jianshu.io/upload_images/2791393-023e1c2055342964.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521771925217984.png")** 

**问题原因:**

同上

**解决方案:**

同上

这里需要注意一点，自动布局的UI是延迟设置frame的。如果aView采用自动布局。然后你马上调用它的aView.bounds是不正确的。

**3.3 NavBar中按钮的响应区域都变小了。**

![1.png](http://upload-images.jianshu.io/upload_images/2791393-f9562b0e8af92884.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521771969320121.png")

**问题原因:**

iOS11之前，虽然我们设置了NavBar上每一个[btn sizeToFit]。苹果依然会帮我们把每一个按钮的点击区域扩大，可以点击区域如上图绿色区域所示。但是在iOS11中，你的按钮的bounds为多大，那你的点击区域就只有多大。估计这个改动也与这次NavBar的大概有关系。

**解决方案:**

扩大每一个btn的bounds，而不要使用sizeToFit方法。

**3.4 NavBar的BarButtonItem无法贴边。有（非plus手机16pt，plus手机20pt）的区域浪费。造成UI偏移，并且最左侧和最右侧区域无法点击。**

![1.png](http://upload-images.jianshu.io/upload_images/2791393-86fae0b0b0c4f528.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521772008284264.png")

**问题原因:**

这个UINavigationBarContentView平铺在导航栏中作为iOS11的各个按钮的父视图,该视图的所有的子视图都会有一个layoutMargins被占用,也就是系统调整的占位。

**解决方案:**

去掉系统默认占位。

系统并没有提供我们直接去掉系统默认占位的方法，那怎么做呢？

我们新建一个UINavigationBar的分类，hook住UINavigationBar的layoutSubviews方法。然后遍历View，重新设置layoutMargin约束。

![1.png](http://upload-images.jianshu.io/upload_images/2791393-073b2caf6ebaa408.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521772030450415.png")

重新设置layoutMargin约束

**3.5 UITableView 默认开启Self-Sizing，导致UI显示有问题。**

![1.png](http://upload-images.jianshu.io/upload_images/2791393-4ea9a6bcc282e4f8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521772063265490.png")

**问题原因:**

在iOS11中UITableView会默认使 Self-Sizing,这会导致tableView

的 estimatedRowHeight 、 estimatedSectionHeaderHeight 、 estimatedSectionFooterHeight 的高度估算属性由默认的0变成 UITableViewAutomaticDimension ,reloadData时可能会导致最后显示的contentSize与预想的不一致;

同时在iOS11中如果不实现 -tableView: viewForHeaderInSection: 和 tableView: viewForFooterInSection: 方法，则 -tableView: heightForHeaderInSection: 和 - tableView: heightForFooterInSection: 不会被调用，而iOS11之前则没问题。上述都可能会导致界面出现错乱。

**解决方案:**

单独关闭摸一个UITableView的Self-Sizing。


`_tableView.estimatedRowHeight = 0;`

`_tableView.estimatedSectionFooterHeight = 0;`

`_tableView.estimatedSectionHeaderHeight = 0;`

关闭所有的UIScroolView、UITableView和UICollectionView的Self-Sizing：

`UIScrollView.appearance.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;`

`UITableView.appearance.estimatedRowHeight = 0;`

`UITableView.appearance.estimatedSectionFooterHeight = 0;`

`UITableView.appearance.estimatedSectionHeaderHeight = 0;`

**3.6 keyWindow获取错误, 导致UI问题。**

![1.png](http://upload-images.jianshu.io/upload_images/2791393-03faebc42ec2781e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521772110791559.png")

**问题原因:**

机器猫图标是一个UIWindow，windowLevel级别比UIWindowLevelStatusBar还高，所以可以常驻UI最上方。第一次进入该页面，点击“更多”，弹出popView，点击收藏，弹出系统UIAlertView，此时UIAlertView变成了keyWindow。当UIAlertView消失的时候，keyWindow会被谁接管呢？

iOS11之前，弹出UIAlertView之前的keyWindow是[[UIApplication sharedApplication].delegate window]，那么消失的时候，keyWindow还是[[UIApplication sharedApplication].delegate window]。

iOS11, 弹出UIAlertView之前的keyWindow是[[UIApplication sharedApplication].delegate window]，那么消失的时候，keyWindow变成z轴最高的UIWindow，即变成了机器猫那个window。所以导致popView被添加到机器猫window中，造成UI样式问题。

**解决方案:**

重写自定义UIWindow的becomeKeyWindow的方法，每次自定义window将会变为keyWindow的时候，把keyWindow改成[[UIApplication sharedApplication].delegate window]。

`- (void)becomeKeyWindow{`

`UIWindow *appWindow = [[UIApplication sharedApplication].delegate window];`

`[appWindow makeKeyWindow];`

`}`


**3.7 状态栏高度写死为20pt，导致在iPhoneX上面遮挡住statusBar。**

![1.png](http://upload-images.jianshu.io/upload_images/2791393-1a27717d175575fa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521772153502038.png")

**问题原因:**

iPhoneX上的statusBar的高度为44pt，跟其他iPhone型号的20pt不一样。所以以后我们在以statusBar为定位点的时候，不能写死20pt。而要使用[UIApplication sharedApplication].statusBarFrame.size.height来获取，为了方便，可以定义为宏，放到pch文件中，如下：

`#define kApplicationStatusBarHeight  [UIApplication sharedApplication].statusBarFrame.size.height `//状态栏的高度`

**解决方案:**

状态栏高度定位的时候不要写死20，要使用[UIApplication sharedApplication].statusBarFrame.size.height来获取。

**补充**

iOS11之前导航栏默认高度为64pt(这里高度指statusBar + NavigationBar)，iOS11之后如果设置 prefersLargeTitles = YES则为96pt，默认情况下还是64pt，但在iPhoneX上由于刘海的出现 statusBar由以前的20pt变成 44pt，所以iPhoneX上高度变为88pt，如果项目里隐藏了导航栏加了自定义按钮之类的，这里需要注意适配一下。

**3.8 通过遍历statusBar的subviews中的UIStatusBarDataNetworkItemView获取网络状态在iPhoneX上会crash。**

问题原因:

之前我们采用遍历statusBar，获取UIStatusBarDataNetworkItemView实例，再获取网络状态的。代码如下：
`+ (NSNumber *) dataNetworkTypeFromStatusBar {`

`UIApplication *app = [UIApplication sharedApplication];`

`NSArray *subviews = [[[app valueForKey:@"statusBar"] valueForKey:@"foregroundView"] subviews];`

`NSNumber *dataNetworkItemView = nil;`

`@try{`

`if` `([subviews count] > 0) {`

`for` `(id subview in subviews) {`

`if([subview isKindOfClass:[NSClassFromString(@"UIStatusBarDataNetworkItemView") class]]) {`

`dataNetworkItemView = subview;`

`break;`

`}`

`}`

`}`

`}`

`@catch(NSException *exception) {`

`}`

`@finally` `{`

`}`

`return` `[dataNetworkItemView valueForKey:@"dataNetworkType"];`

`}`

 |

但是在iphoneX的statusBar的内部结构已经改变，不能根据遍历获取UIStatusBarDataNetworkItemView的状态获取网络状态状态。

可以通过**po [statusBar recursiveDescription]**打印出来iphoneX内部结构了，可以看出变化非常的大。

**解决方案:**

使用AFNetworking中的AFNetworkReachabilityManager类，或者使用[Reachability库](https://link.jianshu.com/?t=https://github.com/tonymillion/Reachability)获取网络连接状态。

**四、权限适配**

**4.1 无法获取定位信息，第一次打开app也无法弹出定位权限提示框**

**问题原因:**

iOS11 定位相关的权限做了更改，在iOS11上使用了新的定位权限key。

**解决方案:**

如果原来申请的权限是始终允许NSLocationAlwaysUsageDescription，那么需要在保留原来的key的基础上增加NSLocationWhenInUseUsageDescription和NSLocationAlwaysAndWhenInUsageDescription。

**五、其他一些补充**

**5.1 如何判断该设备是不是iPhoneX**

**![1.png](http://upload-images.jianshu.io/upload_images/2791393-f34170d7fb16370d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "1521772277385416.png")** 

**5.2 一些常用的宏定义**

`#define IS_IPHONE_X [KDDeviceHelper is_iPhone_X]`

`#define IPHONE_NAVIGATIONBAR_HEIGHT  (IS_IPHONE_X ? 88: 64)`

`#define IPHONE_STATUSBAR_HEIGHT      (IS_IPHONE_X ? 44: 20)`

`#define IPHONE_SAFEBOTTOMAREA_HEIGHT (IS_IPHONE_X ? 34: 0)`

`#define IPHONE_TOPSENSOR_HEIGHT      (IS_IPHONE_X ? 32: 0)`

转发自[此文](http://www.cocoachina.com/ios/20180323/22731.html)特此声明，如有问题，请联系我！
