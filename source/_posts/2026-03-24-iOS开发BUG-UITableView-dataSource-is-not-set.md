---
title: "iOS开发BUG---UITableView-dataSource-is-not-set"
date: 2026-03-24 14:59:24
tags:
  - 笔记
categories:
  - "iOS开发"
from_note: true
source_note: "iOS开发/iOS开发BUG---UITableView-dataSource-is-not-set.md"
---

最近项目发现有一个BUG,百思不得其解:

    reason: UITableView dataSource is not set
<!-- more -->
原因是: 
 
     在UITableView执行数据源代理方法cellForRowAtIndexPath的时候,数据源释放了;
出现情况:

    此问题出现概率较小,通常是在定时刷新UITableView的时候出现

解决方法:
   
    方法一: 降低刷新频率(不建议)
    此方法不能完全解决闪退问题,只能降低崩溃概率
    方法二: 定时刷新tableView的时候,也就是调用reload的时候保证在主线程执行(建议用此方法,能完全解决此问题):

    *代码*
     dispatch_async(dispatch_get_main_queue(), ^{ 
                    [tableView reloadData];
      });
