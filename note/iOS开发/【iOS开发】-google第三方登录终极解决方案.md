

google第三方登录使用WKWebview组件无法登录成功，[之前魔改UA的方式已经不行了](https://www.jianshu.com/p/3ce47f1d1403),需要使用ASWebAuthenticationSession组件
<!-- more -->
示例代码如下：
```
-(void)login{
    [[ASWebAuthenticationSession alloc] initWithURL:deUrl callbackURLScheme:@"scheme" completionHandler:^(NSURL * _Nullable callbackURL, NSError * _Nullable error) {
        // 处理认证结果
        if (callbackURL) {
            // 从回调URL中获取认证授权码
            NSDictionary *dict = [callbackURL jk_parameters];
            NSString *ticket = [dict valueForKey:@"ticket"];
            NSString *login_type = [dict valueForKey:@"login_type"];
            if (ticket != nil && login_type != nil) {
                self.hasOpenLogin = NO;
                __weak typeof(self) wself = self;
                [BSNetworkManager loginWithTicket:ticket loginType:login_type success:^(BSBaseResponseModel * _Nonnull model) {
                    
                    
                }fail:^(BSBaseResponseModel * _Nonnull model) {
                    if (wself.callback) wself.callback();
                }];
                
            }
        } else {
            // 认证失败
            NSLog(@"认证失败，错误: %@", error);
        }
        
        // 清除认证会话引用
        weakSelf.loginSession = nil;
    }];
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 130000
    self.loginSession.presentationContextProvider = self;
#endif
    [self.loginSession start];
}

#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 130000
- (ASPresentationAnchor)presentationAnchorForWebAuthenticationSession:(ASWebAuthenticationSession *)session {
    return [UIApplication sharedApplication].delegate.window;
}
#endif
```
