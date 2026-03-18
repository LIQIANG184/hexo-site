OC中枚举类型有两种, 普通枚举和按位枚举

1 普通枚举

    typedef NS_ENUM(NSInteger, UIControlContentHorizontalAlignment) {
    UIControlContentHorizontalAlignmentCenter = 0,
    UIControlContentHorizontalAlignmentLeft   = 1,
    UIControlContentHorizontalAlignmentRight  = 2,
    UIControlContentHorizontalAlignmentFill   = 3,
};
2 按位枚举

    typedef NS_OPTIONS(NSUInteger, UIControlState) {
    UIControlStateNormal       = 0,
    UIControlStateHighlighted  = 1 << 0,                  // used when UIControl isHighlighted is set
    UIControlStateDisabled     = 1 << 1,
    UIControlStateSelected     = 1 << 2,                  // flag usable by app (see below)
    UIControlStateFocused NS_ENUM_AVAILABLE_IOS(9_0) = 1 << 3, // Applicable only when the screen supports focus
    UIControlStateApplication  = 0x00FF0000,              // additional flags available for application use
    UIControlStateReserved     = 0xFF000000               // flags reserved for internal framework use
};
3 这个例子可以看出,两种枚举在声明的时候的区别
  普通枚举格式

    typedef NS_ENUM(枚举值类型, 枚举的名称) {
       枚举值1,//命名规范 枚举的名称+区别词 = 1 << 0或者其他
       枚举值2,
        ...
   }
  按位枚举格式

    typedef NS_OPTIONS(枚举值类型, 枚举的名称) {
     枚举值1,//命名规范 枚举的名称+区别词 = 0或者其他
     枚举值2,
        ...
     }
4 按位枚举的用法  
   
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2791393-7095a86116226658.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
