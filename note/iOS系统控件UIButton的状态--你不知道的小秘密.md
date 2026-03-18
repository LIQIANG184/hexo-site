一   偶然发现
  今天在项目中突然发现一个奇怪的问题,按钮在isSelected == YES的时候再次点击,按钮的图片变成了normal状态的图片(其实这个问题不奇怪,只是之前一直没有注意这个细节).
  
  1 源代码如下:
      
  创建代码
  
      UIButton *arrowBtn = [[UIButton alloc]initWithFrame:CGRectMake(0, 0, 900, 27)];
      [arrowBtn setImage:[UIImage imageNamed:@"jiantou1"] forState:UIControlStateNormal];
      [arrowBtn setImage:[UIImage imageNamed:@"jiantou2"] forState:UIControlStateSelected];
      [superView addSubview:arrowBtn];

      注:防止出现版权问题,其中变量的名字和图片的名字,我做了调整,但是方法是原来的方法;
点击效果如下:
![arrow.gif](http://upload-images.jianshu.io/upload_images/2791393-f36fabf051eedc58.gif?imageMogr2/auto-orient/strip)

2 解决方案(文章后边有更好的解决办法)
我自己想的最直接的办法解决这个问题是不用按钮自带的状态,直接在点击事件里动态改变按钮正常状态的图片
具体代码:

创建代码  

      UIButton *arrowBtn = [[UIButton alloc]initWithFrame:CGRectMake(0, 0, 900, 27)];
      [arrowBtn setImage:[UIImage imageNamed:@"jiantou1"] forState:UIControlStateNormal];
      [superView addSubview:arrowBtn];
      [arrowBtn addTarget:self action:@selector(arrowBtnClicked:) forControlEvents:UIControlEventTouchUpInside];

点击事件

    -(void)arrowBtnClicked:(UIButton*)btn{
        if(self.isSelected){
            self.isSelected = NO;
            [btn setImage:[UIImage imageNamed:@"上"] forState:UIControlStateNormal];
        }else{
            self.isSelected = YES;
            [btn setImage:[UIImage imageNamed:@"下"] forState:UIControlStateNormal];
        }
    }

二 探索发现

    按钮在isSelected == YES的时候再次点击,按钮的图片变成了normal状态的图片
通过这个现象我提出疑问,为什么会是这种效果,难道在isSelected == YES的时候再次点击是normal状态吗?
为了解决这个问题,我首先想到的是看一下UIButton的状态的API

    typedef NS_OPTIONS(NSUInteger, UIControlState) {
    UIControlStateNormal       = 0,
    UIControlStateHighlighted  = 1 << 0,                  // used when UIControl isHighlighted is set
    UIControlStateDisabled     = 1 << 1,
    UIControlStateSelected     = 1 << 2,                  // flag usable by app (see below)
    UIControlStateFocused NS_ENUM_AVAILABLE_IOS(9_0) = 1 << 3, // Applicable only when the screen supports focus
    UIControlStateApplication  = 0x00FF0000,              // additional flags available for application use
    UIControlStateReserved     = 0xFF000000               // flags reserved for internal framework use
    };
我发现按钮的状态是位枚举,不是普通的枚举,也就是说按钮可以有不止一个状态,那我猜想按钮在isSelected == YES时,再点击的时候状态应该不是normal状态而是其他状态.
后来我搜索了一下相关的说明.在这里
http://commandshift.co.uk/blog/2013/04/16/uibutton-control-states/
发现了相关的说明:

    So why would you care about this? Say you were implementing an edit button or 
    a selection button with text, a background image and an image. You want different 
    text and images for the selected and unselected states (e.g. Editand Done), 
    but you also want to modify the images or background images when highlighting -
    if you’re creating your own theme for the app then the default darkening or 
    dimming might not be what you want.
    So you actually need four images - normal, highlighted, selected 
    and selected + highlighted.
    This is achieved like so:

    [self.button setImage:normal     forState:UIControlStateNormal];
    [self.button setImage:highlighted forState:UIControlStateHighlighted];
    [self.button setImage:selected forState:UIControlStateSelected];
    [self.button setImage:selectedHighlighted forState:UIControlStateSelected | UIControlStateHighlighted];
也就是说按钮其实有两类,四种状态
1 在isSelected == NO的时候,有两种分别对应 UIControlStateNormal 和 UIControlStateHighlighted
2 在isSelected == YES的时候,有两种分别对应 UIControlStateSelected 和 UIControlStateSelected | UIControlStateHighlighted

由以上的说明,我猜想出现 "按钮在isSelected == YES的时候再次点击,按钮的图片变成了normal状态的图片"情况的原因就是没有设置UIControlStateSelected | UIControlStateHighlighted状态的图片,系统默认会显示UIControlStateNormal状态的图片

所以又产生了第二种解决办法,将按钮的
UIControlStateSelected | UIControlStateHighlighted状态的图片
设置成UIControlStateSelected状态的图片
代码如下:

    UIButton *arrowBtn = [[UIButton alloc]initWithFrame:CGRectMake(0, 0, 900, 27)];
    [arrowBtn setImage:[UIImage imageNamed:@"jiantou1"] forState:UIControlStateNormal];
    [arrowBtn setImage:[UIImage imageNamed:@"jiantou2"] forState:UIControlStateSelected];
    [arrowBtn setImage:[UIImage imageNamed:@"jiantou2"] forState:UIControlStateSelected | UIControlStateHighlighted];
    [superView addSubview:arrowBtn];

三 延展 
通过按钮的图片也就是image,我猜想类似的应该也适用于
    - (void)setTitle:(nullable NSString *)title forState:(UIControlState)state;                     // default is nil. title is assumed to be single line
    - (void)setTitleColor:(nullable UIColor *)color forState:(UIControlState)state UI_APPEARANCE_SELECTOR; // default if nil. use opaque white
    - (void)setTitleShadowColor:(nullable UIColor *)color forState:(UIControlState)state UI_APPEARANCE_SELECTOR; // default is nil. use 50% black
    - (void)setImage:(nullable UIImage *)image forState:(UIControlState)state;                      // default is nil. should be same size if different for different states
    - (void)setBackgroundImage:(nullable UIImage *)image forState:(UIControlState)state UI_APPEARANCE_SELECTOR; // default is nil
    - (void)setAttributedTitle:(nullable NSAttributedString *)title forState:(UIControlState)state NS_AVAILABLE_IOS(6_0); // default is nil. title is assumed to be single line
本文就不做相关测试了,有兴趣的同学可以试试!
