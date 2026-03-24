

场景重现:在UITextField的键盘处于显示状态的时候,点击一个按钮,首先取消UITextField的第一响应者,弹出UIAlertView,然后点击UIAlertView上的"取消"或者"确定"后,键盘会有弹出然后消失的动画.
<!-- more -->
代码如下:
	
	//按钮的点击事件
    -(void)buttonClick:(UIButton *)button{
       [self.textField resignFirstResponder];
       UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"这是一个alert" message:@"测试用的" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"确定", nil];
       [alert show];
    }
	//alertView的代理方法
	-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
       if (buttonIndex == 0) {
        
       } else{
        
       }
	}

一  这里先把最终解决的办法写在这:

1 第一种解决办法,在弹出取消UITextField的第一响应者代码之后做一个延迟处理,代码如下:
	
	//按钮的点击事件
    -(void)buttonClick:(UIButton *)button{
      [self.textField resignFirstResponder];
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), 
       dispatch_get_main_queue(), ^{
       UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"这是一个alert" message:@"测试用的" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"确定", nil];
       [alert show];
      });
    }
2 用最新的(UIAlertController)弹窗方式

	-(void)buttonClick:(UIButton *)button{
      [self.textField resignFirstResponder];
 	if([[[UIDevice currentDevice] systemVersion] compare:@"8.0"] == NSOrderedDescending){
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"这是一个alert" message:@"测试用的" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"确定", nil];
        [alert show];
    } else{
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"这是一个alert" message:@"测试用的" preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *actionOK = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
           
        }];
        UIAlertAction *actionCancel = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            
        }];
        [alertController addAction:actionOK];
        [alertController addAction:actionCancel];
        
        [self presentViewController:alertController animated:YES completion:nil];
    }
}


二 探索 

1 既然点击UIAlertView的"取消"或者"确定"后键盘弹出了,我想是不是取消UITextField第一响应者失败了,然后我在alertView的代理方法里边加上了取消第一响应者方法,代码如下:

	//alertView的代理方法
	-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
		[self.textField resignFirstResponder];
       if (buttonIndex == 0) {
        
       } else{
        
       }
	}
满怀希望的运行了一下,失败了!

2 换一个地方试试

	//alertView的代理方法
	-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
		
       if (buttonIndex == 0) {
        [self.textField resignFirstResponder];
       } else{
        [self.textField resignFirstResponder];
       }
	}
运行,失败!

3 经过1,2步的试验,看来在alertView的代理方法里加代码是解决不了问题的,我往上一步看,是在弹出alertView的方法(即按钮的点击方法)的问题,然后我先注释了弹出alertView的代码:

	//按钮的点击事件
    -(void)buttonClick:(UIButton *)button{
       [self.textField resignFirstResponder];
       //UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"这是一个alert" message:@"测试用的" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"确定", nil];
       //[alert show];
    }
   运行,发现键盘正常退回!  
   
   猜想:[alert show]的时候会有一个蒙层,苹果为了保证美观性,暂时强制隐藏键盘,从而导致resignFirstResponder 的键盘消失动画延迟,当点击alertView上边的"取消"和"确定"之后处理了键盘消失动画.
   
   换一种说法就是:当runLoop接收到UITextField结束第一响应者的消息后,放在了调用队列中,不会马上执行键盘收起,这个时候又接收到了[alert show]的消息,系统会优先处理[alert show]的消息,挂起[UITextField resignFirstResponder];当处理完alertView的时候,再继续执行resignFirstResponder的键盘动画;
 
4 由第3步的猜想,有了一个解决办法,延迟弹出alertView,具体代码如下:

    //按钮的点击事件
    -(void)buttonClick:(UIButton *)button{
       [self.textField resignFirstResponder];
       dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
       UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"这是一个alert" message:@"测试用的" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"确定", nil];
       [alert show];
    }
    });
5 大家应该知道的是,UIAlertView在iOS9.0就被废弃了,改用UIAlertController;那么苹果是否考虑到这个问题了呢?下边是我的测试代码:

	//按钮的点击事件
    -(void)buttonClick:(UIButton *)button{
 	if([[[UIDevice currentDevice] systemVersion] compare:@"9.0"] == NSOrderedDescending){
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"这是一个alert" message:@"测试用的" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"确定", nil];
        [alert show];
    } else{
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"这是一个alert" message:@"测试用的" preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *actionOK = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            
        }];
        UIAlertAction *actionCancel = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            
        }];
        [alertController addAction:actionOK];
        [alertController addAction:actionCancel];
        
        [self presentViewController:alertController animated:YES completion:nil];
    }
运行,也是可以的!

好了,到此本次探索结束!

三 总结猜想:

此问题的原因猜想是:
[alert show]的时候会有一个蒙层,苹果为了保证美观性,暂时强制隐藏键盘,从而导致resignFirstResponder 的键盘消失动画延迟,当点击alertView上边的"取消"和"确定"之后处理了键盘消失动画.
   
   换一种说法就是:当runLoop接收到UITextField结束第一响应者的消息后,放在了调用队列中,不会马上执行键盘收起,这个时候又接收到了[alert show]的消息,系统会优先处理[alert show]的消息,挂起[UITextField resignFirstResponder];当处理完alertView的时候,再继续执行resignFirstResponder的键盘动画;

解决此问题的方法有两个:文章开头已经写明,本人推荐第二种用新的API的Fi方法

四 番外篇 

	UIAlertController的常用的API:

	//快速初始化方法
	+ (instancetype)alertControllerWithTitle:(nullable NSString *)title message:(nullable NSString *)message preferredStyle:(UIAlertControllerStyle)preferredStyle;
	//添加按钮
	- (void)addAction:(UIAlertAction *)action;
	其他
	@property (nonatomic, readonly) NSArray<UIAlertAction *> *actions;
	@property (nonatomic, strong, nullable) UIAlertAction *preferredAction NS_AVAILABLE_IOS(9_0);
	- (void)addTextFieldWithConfigurationHandler:(void (^ __nullable)(UITextField *textField))configurationHandler;
	@property (nullable, nonatomic, readonly) 	NSArray<UITextField *> *textFields;
	@property (nullable, nonatomic, copy) NSString *title;
	@property (nullable, nonatomic, copy) NSString *message;
	@property (nonatomic, readonly) UIAlertControllerStyle preferredStyle;
	
	UIAlertAction常用的API:
	//快速初始化方法
	+ (instancetype)actionWithTitle:(nullable NSString *)title style:(UIAlertActionStyle)style handler:(void (^ __nullable)(UIAlertAction *action))handler;
	其他
	@property (nullable, nonatomic, readonly) NSString *title;
	@property (nonatomic, readonly) UIAlertActionStyle style;
	@property (nonatomic, getter=isEnabled) BOOL enabled;
