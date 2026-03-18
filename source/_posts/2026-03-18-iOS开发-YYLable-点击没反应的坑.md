---
title: "iOS开发--YYLable-点击没反应的坑"
date: 2026-03-18 18:30:13
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "iOS开发--YYLable-点击没反应的坑.md"
---

项目中有一个用户协议入口,是使用YYLable显示的,有高亮和点击事件,点击事件不执行,困扰很久,最后发现是手势冲突的问题:

![IMG_0150.JPG](/images/note/534df043bd1e10e2bc1ee925a1ae4d63.webp)

界面内有一个textField, 为了收起键盘,在view上添加了tap手势来隐藏键盘:

    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(keyboardHide:)];
    [self.view addGestureRecognizer:tap];


    - (void)keyboardHide:(UITapGestureRecognizer *)tap {
    [self.view endEditing:true];
    return;
    }

YYLabel添加事件方法:

     - (YYLabel *)readinglabel {
    if (!_readinglabel) {
        _readinglabel = [[YYLabel alloc] init];
        _readinglabel.numberOfLines = 2;
        NSString *concealText = LocatizedStringForKey(@"woyiyuedutongyixieyiheyinsi");
        NSRange linkTextRange1 = [concealText rangeOfString:LocatizedStringForKey(@"yonghuxieyi")];
        NSRange linkTextRange2 = [concealText rangeOfString:LocatizedStringForKey(@"yinsizhengce")];
        NSMutableAttributedString *concealAttrText = [[NSMutableAttributedString alloc]initWithString:concealText attributes:@{NSFontAttributeName : [UIFont systemFontOfSize:12],NSForegroundColorAttributeName : [UIColor colorWithRed:180/255.0 green:183/255.0 blue:199/255.0 alpha:1/1.0]}];
        
        NSMutableParagraphStyle *paragraphStyle = [NSMutableParagraphStyle new];
        paragraphStyle.minimumLineHeight = 17;
        paragraphStyle.lineSpacing = 5;
        [concealAttrText addAttributes:@{NSParagraphStyleAttributeName : paragraphStyle} range:NSMakeRange(0, concealAttrText.length)];
        
        __weak __typeof(self)weakSelf = self;
       
        [concealAttrText yy_setTextHighlightRange:linkTextRange1 color:[UIColor lj_colorWithHexString:@"3D6EFF"] backgroundColor:nil tapAction:^(UIView * _Nonnull containerView, NSAttributedString * _Nonnull text, NSRange range, CGRect rect) {
            __strong __typeof(weakSelf)strongSelf = weakSelf;
            UIViewController *vc = [LJVRSDK VRWebViewControllerWithURL:[NSString stringWithFormat:@"%@%@",[RSDAPI h5Ycy],[SharedData sharedDataSingleton].NEW_USER_AGREEMENT_HTML] ext:nil showNav:YES showBackButton:NO delegate:nil];
            [vc setHidesBottomBarWhenPushed:YES];
            [strongSelf.navigationController pushViewController:vc animated:YES];
        }];
        [concealAttrText yy_setTextHighlightRange:linkTextRange2 color:[UIColor lj_colorWithHexString:@"3D6EFF"] backgroundColor:nil tapAction:^(UIView * _Nonnull containerView, NSAttributedString * _Nonnull text, NSRange range, CGRect rect) {
            __strong __typeof(weakSelf)strongSelf = weakSelf;
            UIViewController *vc = [LJVRSDK VRWebViewControllerWithURL:[NSString stringWithFormat:@"%@%@",[RSDAPI h5Realsee],[SharedData sharedDataSingleton].NEW_PRIVACY_POLICY_HTML] ext:nil showNav:YES showBackButton:NO delegate:nil];
            [vc setHidesBottomBarWhenPushed:YES];
            [strongSelf.navigationController pushViewController:vc animated:YES];
        }];
        _readinglabel.userInteractionEnabled = YES;
        _readinglabel.attributedText = concealAttrText;
        [self.view addSubview:_readinglabel];
    }
    return _readinglabel;
    }


这个手势和YYLabel的富文本添加事件有冲突,造成在点击YYLabel时执行了tap手势方法tap.

查看 YYLabel的hitTest方法确实返回了YYLabel,但是没有执行.
通过查看YYLabel源码发现, YYLabel是通过touchBegin: touchEnd:捉对来确认点击事件,然后根据点击范围来执行对应的action

所以冲突实质是 touchend 和tap手势的冲突

以下是测试用例:

    @implementation ViewController

     - (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tap)];
    [self.view addGestureRecognizer:tap];
    
    
    }
    -(void)viewDidAppear:(BOOL)animated{
    UILabel *label = [[LQLabel alloc] initWithFrame:CGRectMake(100, 100, 100, 100)];
    label.backgroundColor = [UIColor grayColor];

    [self.view addSubview:label];
    label.userInteractionEnabled = YES;
    }
    -(void)tap{
    NSLog(@"tap");
    }
    @end


    @implementation LQLabel

    /*
    // Only override drawRect: if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    - (void)drawRect:(CGRect)rect {
    // Drawing code
    }
    */
     -(void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    NSLog(@"touch begin");
     }
     -(void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    NSLog(@"touch end");
     }

     @end


点击view的时候 执行tap:

     2021-07-07 16:01:09.557891+0800 tapWithTouch[23171:2729459] tap
点击LQLabel的时候执行: touch begin 和 tap

     2021-07-07 16:01:33.989632+0800 tapWithTouch[23171:2729459] touch begin
     2021-07-07 16:01:34.070506+0800 tapWithTouch[23171:2729459] tap






