#iOS WKWebview需要去掉UA中“ OS”   

```
 [webView evaluateJavaScript:@"navigator.userAgent" completionHandler:^(NSString * _Nullable UA, NSError * _Nullable error){
     NSLog(@"UA-%@",UA);
     webView.customUserAgent = [UA stringByReplacingOccurrencesOfString:@" OS" withString:@""];
}];
```
#android 需要去掉UA中的“wv”
