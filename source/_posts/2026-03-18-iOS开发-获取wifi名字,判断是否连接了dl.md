---
title: "iOS开发--获取wifi名字,判断是否连接了dl"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "iOS开发--获取wifi名字,判断是否连接了dl.md"
---

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
