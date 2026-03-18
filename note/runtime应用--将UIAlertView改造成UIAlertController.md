本文旨在将UIAlertView改造,使UIAlertView的用法类似UIAlertController,使得代码逻辑更加清晰化,方便阅读和维护.

---
目录
一 UIAlertView和UIAlertController的简介
二 具体代码实现
三 使用范例
四 适用范围

----

#一  UIAlertView和UIAlertController的简介
1   UIAlertView简介
1.1 UIAlertView 主要接口简介

    /**
     UIAlertView的默认初始化方法

     @param title 标题
     @param message 提示语
     @param delegate 代理<UIAlertViewDelegate>
     @param cancelButtonTitle 取消按钮的文字
     @param otherButtonTitles 其他按钮的文字
     @return UIAlertView 实例
     */
    - (instancetype)initWithTitle:(nullable NSString *)title message:(nullable NSString *)message delegate:(nullable id /*<UIAlertViewDelegate>*/)delegate cancelButtonTitle:(nullable NSString *)cancelButtonTitle otherButtonTitles:(nullable NSString *)otherButtonTitles, ... ;
    // Alert view style - defaults to UIAlertViewStyleDefault
    @property(nonatomic,assign) UIAlertViewStyle alertViewStyle
1.2 UIAlertViewDelegate接口:

    // Called when a button is clicked. The view will be automatically dismissed after this call returns
    - (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex NS_DEPRECATED_IOS(2_0, 9_0);
1.3 用法示例:

    //显示alert
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"选取头像" message:@"" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"从相册中选取",@"照相", nil];
    [alert show];
    //监听点击按钮的代理方法
    - (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
        switch (buttonIndex) {
            case 0:
                NSLog(@"点击了取消");
                break;
            case 1:
                NSLog(@"点击了从相册中选取");
                break;
            case 2:
                NSLog(@"点击了照相");
                break;
            default:
                break;
        }
    }
注意: buttonIndex为0 一定对应"取消"按钮, buttonIndex然后按照otherButtonTitles的顺序从1开始 依次+1;

2 UIAlertController简介
2.1 UIAlertController主要接口介绍

    /**
     默认初始化方法

     @param title 标题
     @param message 提示信息
     @param preferredStyle 弹出方式
     @return UIAlertController实例
     */
    + (instancetype)alertControllerWithTitle:(nullable NSString *)title message:(nullable NSString *)message preferredStyle:(UIAlertControllerStyle)preferredStyle;
    /*
       向alert添加按钮和事件
    */
    - (void)addAction:(UIAlertAction *)action;
2.2 UIAlertAction接口介绍
    
    /**
     UIAlertAction默认初始化方法
     
     @param title 按钮显示文字
     @param style 按钮的类型
     @param handler 点击按钮触发的事件Block
     @return UIAlertAction实例
     */
    + (instancetype)actionWithTitle:(nullable NSString *)title style:(UIAlertActionStyle)style handler:(void (^ __nullable)(UIAlertAction *action))handler;
2.3 用法示例

        
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"标题" message:@"提示信息" preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *action1 = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        NSLog(@"点击了确定后干什么写在这里");
    }];
    
    UIAlertAction *action2 = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        NSLog(@"点击了取消后干什么写在这里,会默认关闭alert");
    }];
    
    [alert addAction:action1];
    [alert addAction:action2];
    [self presentViewController:alert animated:YES completion:nil];
#二  代码实现:
接下来是本文的重点,简单说明就是用UIAlertController的方式使用UIAlertView.
3.1 依赖类:LQAlertAction----功能类似UIAlertAction代码如下:

LQAlertAction.h
    #import <UIKit/UIKit.h>
    
    typedef NS_ENUM(NSInteger, LQAlertActionStyle) {
        LQAlertActionStyleDefault = 0,
        LQAlertActionStyleCancel,
        LQAlertActionStyleDestructive
    };
    @class LQAlertAction;
    typedef void(^LQAlertActionHandler)(LQAlertAction *action);

    @interface LQAlertAction : NSObject
    /**
     LQAlertAction默认初始化方法

     @param title 标题
     @param style 样式(目前没有作用,留作后用)
     @param handler 事件block
     @return LQAlertAction实例
     */
    + (instancetype)alertActionWithTitle:(nullable NSString *)title style:(LQAlertActionStyle)style handler:(nullable LQAlertActionHandler)handler;

    @property (nullable ,copy) LQAlertActionHandler handler;
    @property (nullable, nonatomic, readonly) NSString *title;
    @property (nonatomic, readonly) LQAlertActionStyle style;
    @property (nonatomic, getter=isEnabled) BOOL enabled;

    @end
LQAlertAction.m

    #import "LQAlertAction.h"

    @interface LQAlertAction ()
    @property (nonatomic, copy) NSString *title;
    @property (nonatomic, assign) LQAlertActionStyle style;
    @end

    @implementation LQAlertAction
    +(instancetype)alertActionWithTitle:(NSString *)title style:(LQAlertActionStyle)style handler:(void (^)(LQAlertAction *))handler{
        LQAlertAction *action = [[LQAlertAction alloc]init];
        action.handler = handler;
        action.title = title;
        action.style = style;
        return action;
    }
    - (NSString *)title{
        if (_title == nil) {
            return @"";
        }
        return _title;
    }
    - (LQAlertActionStyle)style{
        return _style;
    }
    @end
3.2 给UIAlertView增加一个分类:
UIAlertView+Extention.h
    #import <UIKit/UIKit.h>
    #import "LQAlertAction.h"
    @interface UIAlertView (Extention)
    @property (nonatomic, strong) NSArray *actions;

    /**
     UIAlertView初始化方法

     @param actions LQAlertAction的数组,默认会有一个取消按钮
     @param title 标题
     @param message 提示信息
     */
    +(void)showAlertWithActions:(NSArray *)actions title:(NSString *)title message:(NSString *)message;
    @end
UIAlertView+Extention.m
    #import "UIAlertView+Extention.h"
    #import <objc/runtime.h>
    @interface UIAlertView ()<UIAlertViewDelegate>

    @end

    @implementation UIAlertView (Extention)
    static NSArray *_actions = nil;

    +(void)showAlertWithActions:(NSArray *)actions title:(NSString *)title message:(NSString *)message{
        return [[self alloc] showAlertWithActions:actions title:title message:message];
    }

    -(void)showAlertWithActions:(NSArray *)actions title:(NSString *)title message:(NSString *)message{
        
        NSMutableArray *otherButtonTitle = [[NSMutableArray alloc]init];
        
        NSMutableArray *tempActionArray = [[NSMutableArray alloc] init];//整理action的顺序 0对应的是取消按钮
        LQAlertAction *cancel = [self cancelActionWithTitle:@"取消"];
        [tempActionArray addObject:cancel];
        for (LQAlertAction *action in actions) {
            if (action.style == LQAlertActionStyleCancel) {
                //            cancelButtonTitle = action.title;
                cancel = [self cancelActionWithTitle:action.title];
                break;
            } else {
                [otherButtonTitle addObject:action.title];
                [tempActionArray addObject:action];
            }
            
        }
        
        self.actions = tempActionArray.copy;
        UIAlertView *alert = [self initWithTitle:title message:message delegate:self cancelButtonTitle:cancel.title otherButtonTitles:nil];
        for (NSString *str in otherButtonTitle) {
            [alert addButtonWithTitle:str];
        }
        
        [alert show];
    }
    - (LQAlertAction *)cancelActionWithTitle:(NSString *)title{
        LQAlertAction *action = [LQAlertAction alertActionWithTitle:title style:LQAlertActionStyleCancel handler:^(LQAlertAction *action) {
            
        }];
        return action;
    }


    - (void)setActions:(NSArray *)actions{
        objc_setAssociatedObject(self, &_actions, actions, OBJC_ASSOCIATION_RETAIN);
    }
    - (NSArray *)actions{
        
        return objc_getAssociatedObject(self, &_actions);
    }
    - (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
        if (buttonIndex>self.actions.count-1) {
            return;
        }
        if (self.actions[buttonIndex]) {
            LQAlertAction *action = self.actions[buttonIndex];
            if (action.handler) {
                action.handler(action);
            }
        }
    }
    -(void)setAlertViewStyle:(UIAlertViewStyle)alertViewStyle{
        
    }

#三 使用范例

代码如下:

    LQAlertAction *action1 = [LQAlertAction alertActionWithTitle:@"从相册选取" style:LQAlertActionStyleDefault handler:^(LQAlertAction *action) {
        NSLog(@"打开相册");
    }];
    
    LQAlertAction *action2 = [LQAlertAction alertActionWithTitle:@"照相" style:LQAlertActionStyleDefault handler:^(LQAlertAction *action) {
        NSLog(@"打开相机");
    }];
    
    LQAlertAction *cancle = [LQAlertAction alertActionWithTitle:@"取消" style:LQAlertActionStyleCancel handler:nil];
    [UIAlertView showAlertWithActions:@[action1,action2,cancle] title:@"选取头像" message:@"信息内容"];

#四  使用范围
目前仅支持UIAlertViewStyle = UIAlertViewStyleDefault的情况,后续视情况增加新的支持
