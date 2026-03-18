## 很长的前言

在block语句块中，如果需引用self，而self对象中又持有block对象，就会造成循环引用`循环引用(retain cycle)`，导致内存泄露，比如以下代码

      self.block = ^{
        [self description];
    };


一般我们是这么解决的，使用一个`__weak`修饰的weakSelf变量指向self对象，在block中使用weakSelf:

     __weak typeof(self) weakSelf = self;
    self.block = ^{
        [weakSelf description];
    };

但是酱紫写，还是可能出问题，因为weakSelf是弱引用，而self一旦释放了，weakSelf可能为nil，还是举个栗子吧:1.先定义一个TestObj对象，他的属性有一个block对象

    @interface TestObj : NSObject
    @property (nonatomic, copy)void(^block)();
    @end
    
    @implementation TestObj
    - (void)dealloc {
    NSLog(@"%s",__func__);
    }
    - (instancetype)init {
    self = [super init];
    if (self) {
        __weak typeof(self) weakSelf = self;
        self.block = ^{
            dispatch_async(dispatch_get_global_queue(0, 0), ^{
                [NSThread sleepForTimeInterval:1];
                NSLog(@"%@",weakSelf);
            });
        };
    }
    return self;
    }

    @end


2.再另一个类实例中定义一个testFunc方法

    - (void)testFunc{
    TestObj *obj = [TestObj new];
    obj.block();
}

执行`testFunc`方法，结果是打印的是(null)，因为block里打印的方法是异步执行的，在 `NSLog(@"%@",weakSelf);`这句代码执行之前`testFunc`函数就结束，所以`obj`对象已经被release了。怎么解决呢？所以再对`weakSelf`做一次 `__strong`就可以了:

    __weak typeof(self) weakSelf = self;
        self.block = ^{
            __strong typeof(weakSelf) strongSelf = weakSelf;
            dispatch_async(dispatch_get_global_queue(0, 0), ^{
                [NSThread sleepForTimeInterval:1];
                NSLog(@"%@",strongSelf);
            });
        };
    }


使用了`__strong`在dispatch_async 里边 block 代码执行完毕之前，对`self`有一个引用，防止对象(self)提前被释放。而作用域一过，`strongSelf`不存在了，对象(self)也会被释放，具体可以看看我之前写的[这篇文章](http://ziecho.com/post/ios/2015-09-02)。

## 1.问题

前面的写法虽然严谨了，也解决了问题了，但是作为喜欢偷懒的程序猿，会不会觉得很啰嗦？每次都要写那两条长长的`__weak`和`__strong`，而且在block里用到的self的全部要改成strongSelf，假设把一段很多self的代码拷贝到block里，一个个改成strongSelf是不是很蛋疼？

## 2.RAC是怎么解决的

    @weakify(self);
    [[button rac_signalForControlEvents:UIControlEventTouchUpInside] subscribeNext:^(id x) {
    @strongify(self);
    [self popViewControllerAnimated:YES];
    }];


只要在block外用了@weakify(self);然后再block里写@strongify(self);就可以了，@strongify(self);语句后的的self可以原封不动，好像很神奇，下面一起看看@weakify、@strongify 这两个神奇的宏最终替换了什么东西。导入RAC的头文件，把上面的测试代码替换成RAC中用的@weakify(self);和@strongify(self), 分屏显示Xcode，让右侧的显示内容改为 preprocess“,就可以看到宏最终替换的结果。

![image.png](https://upload-images.jianshu.io/upload_images/2791393-9eec71afc106cd91.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


1.  @autoreleasepool {} 是什么鬼？

注意到@weakify(self)前面的@颜色并不是橙色没有？`@`并不属于宏的一部分，当然你不能平白无故写个@对吧，所以RAC的weakify宏定义机智地给你补了一句`autoreleasepool {}` 这样一前一后就变成了啥事都没干的@autoreleasepool {}

1.  __attribute__((objc_ownership(weak)))是什么鬼？

    这个就是__weak在编译前被编译器替换的结果，而weakify这个宏最终替换的代码包含有__weak（后面说到），所以编译器再替换就成了__attribute__((objc_ownership(weak))) 

## 2.weakify、strongify的定义

### 预备知识

1.  `...`和 `__VA_ARGS__` 

看下`NSLog`和`printf`，他们的传入参数有多个，用...表示不确定参数个数，看看NSLog的定义：`NSLog(NSString *format, ...)`在宏里也可以用`...`来表示多个参数，而`__VA_ARGS__`就对应多个参数的部分。举个例子，你觉得NSLog太难看，想造一个自己的log打印函数，比如Zlog你就可以这么写：`#define Zlog(...) NSLog(__VA_ARGS__)`

1.  宏连接符`##`: 

`##`这个符号 会将出现在 `##` 左右两边连接的东西起来,举个例子：宏定义为`#define XLink(n) x ## n`，这宏的意思是把x和传入的n连接起来书写:

    #define XLink(n) x ## n
    int x1 = 1;
    int x2 = 2;
    int x3 = 3;
    //打印x1 x2 x3
    NSLog(@"%d",XLink(1)); //NSlog(@"%zd",x1);
    NSLog(@"%d",XLink(2)); //NSlog(@"%zd",x2);
    NSLog(@"%d",XLink(3)); //NSlog(@"%zd",x3);


### 一层层展开weakify

假设我们写了@weakify(self) 发生了什么第一层：

    #define weakify(...) \
     rac_keywordify \
     metamacro_foreach_cxt(rac_weakify_,, __weak, __VA_ARGS__)

`rac_keywordify` 实际上就是`autoreleasepool {}`的宏替换而__VA_ARGS__就是对应我们传入的参数这里我们就可以变成这样：

    autoreleasepool {} 
    metamacro_foreach_cxt(rac_weakify_,, __weak, self)


第二层：

    #define metamacro_foreach_cxt(MACRO, SEP, CONTEXT, ...) \
     metamacro_concat(metamacro_foreach_cxt, metamacro_argcount(__VA_ARGS__))(MACRO, SEP, CONTEXT, __VA_ARGS__)


这一层开始就比较神奇了，替换第一层的结果就变成这样：

    autoreleasepool {}
    metamacro_concat(metamacro_foreach_cxt, metamacro_argcount(self))(rac_weakify_,  , __weak, self)


我们先看`metamacro_argcount(self)`这部分，`metamacro_argcount(...)`这个宏很强大，可以替换可变参数(...)的个数：举个例子metamacro_argcount(@"obj") > 会被替换成`1`metamacro_argcount(@"obj"，@“obj”) > 会被替换成`2`所以metamacro_argcount(self) > 会被替换成`1`(只有一个参数)再看看metamacro_concat的定义：

    #define metamacro_concat(A, B) \
     metamacro_concat_(A, B)


居然还包了一次，那好，再点进去看看metamacro_concat_的定义

    #define metamacro_concat_(A, B) A ## B


嗯，搞了半天就是之前说到的宏连接符 `##`所以metamacro_concat(A, B) 就是把A、B连接起来变成AB根据上面分析的metamacro_argcount(self) > 1 ，再用metamacro_concat连接：

    autoreleasepool {}
    metamacro_foreach_cxt ## 1 (rac_weakify_,  , __weak, self)

也就是：

    autoreleasepool {}
    metamacro_foreach_cxt1(rac_weakify_,  , __weak, self)

第三层：`metamacro_foreach_cxt1` 没错,不要怀疑，他还定义了metamacro_foreach_cxt1这个后面数组为1的宏，搜索一下：

![image.png](https://upload-images.jianshu.io/upload_images/2791393-40f7832dab9390a6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

嗯，你没猜错，有metamacro_foreach_cxt1就有metamacro_foreach_cxt2、3、4、5、6、7、8...，这些是什么鬼，我们先不管，先看我们的metamacro_foreach_cxt1

    #define metamacro_foreach_cxt1(MACRO, SEP, CONTEXT, _0) MACRO(0, CONTEXT, _0)


替换第二层分析的结果：

    autoreleasepool {}
    rac_weakify_（0,__weak,self）    


额，好像明朗起来了，毫不犹豫看看rac_weakify这个宏是怎么定义的：

    #define rac_weakify_(INDEX, CONTEXT, VAR) \
     CONTEXT __typeof__(VAR) metamacro_concat(VAR, _weak_) = (VAR);


再替换一次：`__weak __typeof__(self) self ## _weak_ = self`最终真相大白变成：

    autoreleasepool {}__weak __typeof__(self) self_weak_ = self


同理 strongify(self) 这个宏最终展开是这样的，注意这里他重新定义了self，在block语句块里面是允许这么干的，之后用self就是文章一开头的使用strongSelf一样。

    autoreleasepool {}
     __attribute__((objc_ownership(strong))) __typeof__(self) self = self_weak_;


裤子都脱了 你就给我看这个?有人要问了 为什么不直接用rac_weakify_就好，搞那么复杂饶了一大圈，这不是装逼么 - -其实饶了一大圈的函数就是 @weakify(...);可以支持最多20个参数比如： @weakify(ob1,obj2...,obj20);最终会替换成：

    @autoreleasepool {}
    __weak type(obj1) obj1_weak_ = obj1;
    __weak type(obj2) obj2_weak_ = obj2;
    ...
    __weak type(obj20) obj20_weak_ = obj20;


下面，我们来讲一讲RAC是怎么装逼的。

## 3.RAC装逼宏

### metamacro_argcount 的定义

前面说过metamacro_argcount这个宏可以把可变参数...替换成参数的个数，看看他的定义:

    #define metamacro_argcount(...) \
     metamacro_at(20, __VA_ARGS__, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1)


一脸懵逼？没关系，我们一层层来看：假设：metamacro_at(self)就变成：metamacro_at(20, self, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1)

看看metamacro_at的定义

    #define metamacro_at(N, ...) \
     metamacro_concat(metamacro_at, N)(__VA_ARGS__)

替换进去就是

    metamacro_concat(metamacro_at, 20)(self, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1)


之前已经知道`metamacro_concat`是连接宏，所以变成

    metamacro_at20(self, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1)

搜索`metamacro_at20`

![image.png](https://upload-images.jianshu.io/upload_images/2791393-079783e06aedc3e6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

呵呵 又是一堆乱七八糟的，没事看懂一个就全懂了。

    #define metamacro_at20(_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, ...) 
    metamacro_head(__VA_ARGS__)

嗯，这个宏的意思就是 去掉传入参数中`前20个`参数，把`剩下的`参数传入metamacro_head宏，上面的metamacro_at20 前20个参数就是:`self, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2`所以剩下的参数是 `1`假设一开始不是 metamacro_at(self)而是两个或多个参数会发生什么？比如 metamacro_at(self,self)？根据上面的规则替换，就会变成

    metamacro_at20(self,self, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1)

除去前面20个参数，剩下 只有 2，1 所以把 2,1 这两个参数传入`metamacro_head（2,1）`看看的`metamacro_head`的定义

    #define metamacro_head(...) \
     metamacro_head_(__VA_ARGS__, 0)


又是一层，继续点进去metamacro_head_

    #define metamacro_head_(FIRST, ...) FIRST

其实就是截取第一个参数，所以metamacro_head（2,1）就是 2。而前面的metamacro_head（1）就是 1。到这里 相信你已经弄清楚 metamacro_at 是怎么替换成参数个数的了

其他metamacro_at 也是一个道理

### metamacro_foreach_cxt 的定义

回过头看metamacro_foreach_cxt

    #define metamacro_foreach_cxt1(MACRO, SEP, CONTEXT, _0) MACRO(0, CONTEXT, _0)

    #define metamacro_foreach_cxt2(MACRO, SEP, CONTEXT, _0, _1) \
     metamacro_foreach_cxt1(MACRO, SEP, CONTEXT, _0) \
     SEP \
     MACRO(1, CONTEXT, _1)

    #define metamacro_foreach_cxt3(MACRO, SEP, CONTEXT, _0, _1, _2) \
     metamacro_foreach_cxt2(MACRO, SEP, CONTEXT, _0, _1) \
     SEP \
     MACRO(2, CONTEXT, _2)
    ...省略N多行

回到最开始，举个例子metamacro_argcount(obj1,obj2,obj3)通过上面metamacro_argcount宏，确定出参数为3后，对号入座传入metamacro_foreach_cxt3

    #define metamacro_foreach_cxt3(MACRO, SEP, CONTEXT, _0, _1, _2) \
     metamacro_foreach_cxt2(MACRO, SEP, CONTEXT, _0, _1) \
     SEP \
     MACRO(2, CONTEXT, _2)

所以也就变成了

    metamacro_foreach_cxt3(rac_weakify_, , __weak , obj1 ,obj2 ,obj3)

发现是个递归，也就是

    metamacro_foreach_cxt2(rac_weakify_, , CONTEXT, obj1, obj2) 
    rac_weakify_(2, __weak, obj3)


而metamacro_foreach_cxt2 又是一层递归，最后obj1、obj2、obj3都被替换成了:

    __weak type(obj1) obj1_weak_ = obj1;
    __weak type(obj2) obj2_weak_ = obj2;
    __weak type(obj3) obj3_weak_ = obj3;

### RAC的宏装逼过程总结

其实总结起来很简单，就2点：

1.  通过metamacro_argcount确定可变参数个数`x`
2.  根据1得到的`x`调用metamacro_foreach_cxt`x`,层层递归，对每个参数进行宏替换

本文引用自[这里](http://ziecho.com/post/ios/2016-08-04
),如有侵权，请联系本人删除！
