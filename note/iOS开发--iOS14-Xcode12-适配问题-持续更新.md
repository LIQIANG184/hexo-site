最近苹果推了iOS14，Xcode更新到了12，beta版本是12.2，第一时间更新了。跑一下老项目，暂时发现下列问题；

# 一 崩溃问题： 
   ## 1.1 由于代码原因导致字典转模型失败，在使用模型点方法的时候崩溃。崩溃原因是字典没有对应对象的get方法。

听云收集的崩溃错误说明如下：
     ![图片.png](https://upload-images.jianshu.io/upload_images/2791393-5ee73f76cc321990.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##相关代码：
    
###LQTextModel.h
     @interface LQTextModel : LQBaseModel
     @property (nonatomic,strong) NSMutableArray <LQItemListModel *> * rightItem;
     @end

崩溃位置代码:

>CNVLtemplateItemListModel *keyWord = [_dataModel.rightItem firstObject];
>   keyTitle = keyWord.title;//崩溃行

##分析：
LQTextModel 在字典转模型的时候模型数组rightItem 没有转成功导致 rightItem里存的是字典数组，而不是模型数组，导致取title的时候崩溃。

##解决方法：
使用MJExtension方法声明数组内的对象类名：

    +(NSDictionary *)mj_objectClassInArray{
        return @{@"rightItem":@"CNVLtemplateItemListModel"};
    }

  # 1.2 UITableViewCell 点击事件无响应
 UITableViewCell直接使用 [self addSubview:]，会导致点击事件无响应，解决方法是将 [self addSubview:] 换成 [self.contentView addSubview:];([来源](https://www.jianshu.com/p/3fb93f36026a))（2020-9-22）
# 1.3 iOS 14 UITableViewCell 长按手势 UILongPressGestureRecognizer 不生效的问题, 需要把手势添加到self.contentView
# 1.4 私有方法 KVC 不允许使用
在iOS14下设置UIPageControl的pageimage，会导致奔溃，不能再用了。([来源](https://www.jianshu.com/p/3fb93f36026a))（2020-9-22）

    [_pageControl setValue:[UIImage imageNamed:@"main_pageControl_dian"] forKeyPath:@"pageImage"];
    [_pageControl setValue:[UIImage imageNamed:@"main_pageControl_xian"] forKeyPath:@"currentPageImage"];

## 其他发现
### 1 Xcode图标变化

![Xcode12之前.png](https://upload-images.jianshu.io/upload_images/2791393-22a2ec32e3e3f2ab.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![Xcode12.png](https://upload-images.jianshu.io/upload_images/2791393-47a226305be0581e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 2 view hierarchy 出不来，显示一直加载，目前不知道怎么解决，知道的小伙伴麻烦留言告知

### 3 archive 打包生成的ipa，名字将不会使用工程名字，而会使用 Display Name（2020-9-23）
