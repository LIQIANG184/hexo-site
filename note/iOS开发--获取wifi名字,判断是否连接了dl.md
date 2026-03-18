    + (NSString *)wiFiName
    {
    NSArray *wiFiName = CFBridgingRelease(CNCopySupportedInterfaces());
    id info1 = nil;
    for (NSString *wfName in wiFiName) {
        info1 = (__bridge_transfer id)CNCopyCurrentNetworkInfo((CFStringRef) wfName);
            if (info1 && [info1 count]) {
                break;
            }
        }
        NSDictionary *dic = (NSDictionary *)info1;

        NSString *ssidName = [[dic objectForKey:@"SSID"] lowercaseString];

        return ssidName;
    }
    + (BOOL)isVPNOn
    {
       BOOL flag = NO;
       NSString *version = [UIDevice currentDevice].systemVersion;
       // need two ways to judge this.
       if (version.doubleValue >= 9.0)
       {
       NSDictionary *dict = CFBridgingRelease(CFNetworkCopySystemProxySettings());
       NSArray *keys = [dict[@"__SCOPED__"] allKeys];
       for (NSString *key in keys) {
           if ([key rangeOfString:@"tap"].location != NSNotFound ||
               [key rangeOfString:@"tun"].location != NSNotFound ||
               [key rangeOfString:@"ipsec"].location != NSNotFound ||
               [key rangeOfString:@"ppp"].location != NSNotFound){
               flag = YES;
               break;
           }
       }
       }
   
       return flag;
    }
