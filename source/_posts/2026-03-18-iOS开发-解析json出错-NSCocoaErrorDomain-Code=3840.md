---
title: "iOS开发---解析json出错-NSCocoaErrorDomain-Code=3840"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "iOS开发---解析json出错-NSCocoaErrorDomain-Code=3840.md"
---

  最近线上版本发现一个页面无法正常显示数据，经过排查，定位到是接口返回的json有问题，导致无法正确解析。

  解决办法：

    先正常解析，之后，判断是否出错，如果出错，删除特殊字符后，再次解析
  
1 问题描述：
    返回json事例：

    {"title":"123","its":"1232  324534  sdfsd "}
2 错误代码以及复原
   解析json的方法：

    NSError *err;
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                        options:NSJSONReadingMutableContainers
                                                          error:&err];
报错：Error Domain=NSCocoaErrorDomain Code=3840 "Unescaped control character around character XXX."
3 解决方法,在解析一次之后，判断是否出错，如果出错，删除特殊字符后，再次解析

    if(err) {
        NSLog(@"%@",err);
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        jsonString = [self removeUnescapedCharacter:jsonString];
        jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
        err = nil;
        dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                              options:NSJSONReadingMutableContainers
                                                error:&err];
    }

    -(NSString *)removeUnescapedCharacter:(NSString *)inputStr
    {
     NSCharacterSet *controlChars = [NSCharacterSet controlCharacterSet];//获取那些特殊字符
    NSRange range = [inputStr rangeOfCharacterFromSet:controlChars];//寻找字符串中有没有这些特殊字符
    if (range.location != NSNotFound)
    {
        NSMutableString *mutable = [NSMutableString stringWithString:inputStr];
        while (range.location != NSNotFound)
        {
            [mutable deleteCharactersInRange:range];//去掉这些特殊字符
            range = [mutable rangeOfCharacterFromSet:controlChars];
        }
        return mutable;
    }
    return inputStr;
    }
本文借鉴其他人的处理方法，仅作为记录使用，如有侵权，请联系本人删除！
