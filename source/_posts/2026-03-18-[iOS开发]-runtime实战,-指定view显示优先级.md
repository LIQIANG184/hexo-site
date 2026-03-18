---
title: "[iOS开发]-runtime实战,-指定view显示优先级"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "[iOS开发]-runtime实战,-指定view显示优先级.md"
---

#背景
   项目中某些页面视图层级过多,视图显示前后顺序不容易控制,想办法简单控制视图的显示层级.
#预期
优先级高的视图,无论在什么时候添加到父视图上,都要显示在优先级低的视图上方
#实现思路
给UIView添加属性 level, 用runTime hook UIView 的addSubview:方法,根据level值的大小决定视图的层级

-----有兴趣的同学可以自己考虑实现,然后对比我的实现,欢迎评论交流-----



代码:
   
UIView+AddSubview.h

     @interface UIView (AddSubview)
     @property (nonatomic, assign) int level;
     @end

UIView+AddSubview.m

     #import "UIView+AddSubview.h"
     #import <objc/runtime.h>

     static const char *kLevelKey = "level";
     @implementation UIView (AddSubview)

     + (void)load {
    // is this the best solution?
    method_exchangeImplementations(class_getInstanceMethod(self.class, NSSelectorFromString(@"addSubview:")),
                                   class_getInstanceMethod(self.class, @selector(sort_addSubview:)));
     }

     -(void)sort_addSubview:(UIView *)subView{    
    if (self.subviews.count == 0) {
        [self sort_addSubview:subView];
    }else{
        for (UIView *view in self.subviews.reverseObjectEnumerator) {
            if (subView.level >= view.level) {//放在小于subView的level的view的上面
                [self insertSubview:subView aboveSubview:view];
                break;
            }
        }
        if (subView.superview == nil) {//都比subview的level大,放在最底部
            [self insertSubview:subView atIndex:0];
        }
    }
    }


    - (void)setLevel:(int)level{
    objc_setAssociatedObject(self,kLevelKey, [NSNumber numberWithInt:level],OBJC_ASSOCIATION_ASSIGN);
    }

    - (int)level{
    id le = objc_getAssociatedObject(self, kLevelKey);
    return [le intValue];
    }
     @end

#思考题-欢迎留言交流:
>1 sort_addSubview:第4行为啥遍历子视图数组要使用self.subviews.reverseObjectEnumerator 而不是 self.subviews
2 sort_addSubview: 第23-25行是用来干啥的?可以去掉吗?
3 还有更优雅的方式实现试图优先级吗?
