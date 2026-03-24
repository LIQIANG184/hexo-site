博主从事iOS开发3年多,看过许多大神的博客,感觉他们文笔都很好,讲解很透彻,但是本人一直没有写过博客,今天鼓起勇气写下这个入门级的小东西--实用的进度条,想用的尽管拿去.我随手封装的东西,如果有可以改进的地方,你又愿意提点我,请留言,谢谢!如果不喜欢,请关闭本文,谢谢!
<!-- more -->
       好了,废话不多说,进入主题!

 由于目前项目中要用到进度条,但是系统的UIProgressView的高度和背景颜色不一致,想了几种办法尝试解决这个问题,但是感觉有点费劲,然后,然后,我就自己搞了一个,先用着.欢迎留言交流......

上代码:

   LQProgressLine.h

    @interface LQProgressLine : UIView
    /**
     *  背景色
     */
    @property (nonatomic,copy) NSString *backColor;
    /**
     *  已经经过的进度的颜色
     */
    @property (nonatomic,copy) NSString *didColor;
    /**
     *  进度
     */
    @property (nonatomic,assign) CGFloat progress;

    /**
     *  工厂方法
     *
     *  @param bColor 背景颜色 (例如"#ffffff")
     *  @param dColor 已经经过的进度的颜色(例如"#000000")
     *
     *  @return 对象
     */
    +(instancetype)progressLineWithBackColor:(NSString *)bColor didColor:(NSString *)dColor;

LQProgressLine.m

    #import "LQProgressLine.h"
    @interface LQProgressLine ()
    @property (nonatomic,strong) NSArray *backColorArray;
    @property (nonatomic,strong) NSArray *didColorArray;
    @end

    @implementation LQProgressLine
    +(instancetype)progressLineWithBackColor:(NSString *)bColor didColor:(NSString *)dColor{
        return [[self alloc]initWithBackColor:bColor didColor:dColor];
    }
    - (instancetype)initWithBackColor:(NSString *)bColor didColor:    (NSString *)dColor{
      if (self = [super init]) {
          self.backColor = bColor;
          self.backgroundColor = [UIColor colorWithRed:[self.backColorArray[0] floatValue] green:[self.backColorArray[1]   floatValue] blue:[self.backColorArray[2] floatValue] alpha:1];
          self.didColor = dColor;
    }
      return self;
    }
    - (void)setBackColor:(NSString *)backColor{
      _backColor = backColor;
      self.backColorArray = [self RGBFromStr:backColor];
      }
    - (void)setDidColor:(NSString *)didColor{
      _didColor = didColor;
      self.didColorArray = [self RGBFromStr:didColor];
      }
    - (void)drawRect:(CGRect)rect{
      CGContextRef context = UIGraphicsGetCurrentContext();
      CGContextSetLineWidth(context, rect.size.width);  //线宽
      CGContextSetRGBStrokeColor(context, [self.didColorArray[0] floatValue], [self.didColorArray[1] floatValue],   [self.didColorArray[2] floatValue], 1.0);  //线的颜色
      CGContextBeginPath(context);
      CGContextMoveToPoint(context, 0, 0);  //起点坐标
      CGContextAddLineToPoint(context, rect.size.width*_progress, rect.size.height);   //终点坐标
      CGContextStrokePath(context);
    }
    - (void)setProgress:(CGFloat)progress{
        _progress = progress;
       [self setNeedsDisplay];
    }

    - (NSArray *)RGBFromStr:(NSString *)hexColor{
      NSString *str = nil;
      if([hexColor rangeOfString:@"#"].length>0){
          str = [hexColor substringFromIndex:1];
      }else{
          str = hexColor;
      }
      if(str.length<=0)return nil;
      unsigned int red, green, blue;
      NSRange range;
      range.length =2;
      range.location =0;
      [[NSScanner scannerWithString:[str substringWithRange:range]]scanHexInt:&red];
      range.location =2;
      [[NSScanner scannerWithString:[str substringWithRange:range]]scanHexInt:&green];
      range.location =4;
      [[NSScanner scannerWithString:[str substringWithRange:range]]scanHexInt:&blue];
      return @[@(red/255.0),@(green/255.0),@(blue/255.0)];
      }

好了,代码贴完,用法如下:

    //创建

    LQProgressLine*progressView = [LQProgressLine progressLineWithBackColor: @"#cccccc" didColor:@"#0096e0"];
    [superView addSubview:progressView];

    //在需要设置进度的时候设置
    [progressView setProgress:0.4];
