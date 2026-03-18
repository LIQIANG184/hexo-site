---
title: "iOS--UITextField-无法输入最后一个字符"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "iOS--UITextField-无法输入最后一个字符.md"
---

  #问题描述:  
无法输入最后一个字符:比如 65443,再按一次2后,没有反应
#问题代码

    -(BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string{
    NSCharacterSet *charSet = [[NSCharacterSet characterSetWithCharactersInString:@"0123456789"] invertedSet];
    NSString *filteredStr = [[string componentsSeparatedByCharactersInSet:charSet] componentsJoinedByString:@""];
    if ([string isEqualToString:filteredStr]) {
        NSString *curStr = textField.text;
        NSString *nextStr = curStr;
        if([string isEqualToString:@""]){
            nextStr = [curStr stringByReplacingCharactersInRange:range withString:string];
        }else{
            nextStr = [curStr stringByAppendingString:string];
        }
        NSString *verStr = nextStr;
        if (verStr.length >= 6) {
            [self.textView resignFirstResponder];//这一行有问题
        }
        return YES;
    }
    return NO;
    }
#问题解决:
   >加一下延迟:

     dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self.textView resignFirstResponder];//这一行有问题
    });
#问题分析:
>1 textField只有在是FirstResponder的时候才可以使用键盘修改值
>2 这个代理的作用是返回textField是否可以修改的range的值,当输入满6个字的时候会执行resignFirstResponder,这个时候虽然返回了YES,但是textField不是第一响应者也不会修改值
>resignFirstResponder 加一下延迟,等返回YES后,textField修改了值再resignFirstResponder就可以了
