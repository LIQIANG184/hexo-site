---
title: "OC算法实现--Dijkstra算法"
date: 2026-03-24 15:00:02
tags:
  - 笔记
categories:
  - "知识分享"
from_note: true
source_note: "知识分享/OC算法实现--Dijkstra算法.md"
---

本文使用OC语言实现了Dijkstra算法，并实现了构图界面化，demo下载地址：[github](https://github.com/CoderLi-Q/LQDijkstra)
<!-- more -->

效果图如下：
![image.png](/images/note/301a3260fb6adc4868813a96b6171fd2.webp)

#算法说明
 迪杰斯特拉算法(Dijkstra)是由荷兰计算机科学家[狄克斯特拉](https://baike.baidu.com/item/%E7%8B%84%E5%85%8B%E6%96%AF%E7%89%B9%E6%8B%89/2828872)于1959 年提出的，因此又叫[狄克斯特拉算法](https://baike.baidu.com/item/%E7%8B%84%E5%85%8B%E6%96%AF%E7%89%B9%E6%8B%89%E7%AE%97%E6%B3%95/6764865)。是从一个顶点到其余各顶点的[最短路径](https://baike.baidu.com/item/%E6%9C%80%E7%9F%AD%E8%B7%AF%E5%BE%84)算法，解决的是有权图中最短路径问题。迪杰斯特拉算法主要特点是从起始点开始，采用[贪心算法](https://baike.baidu.com/item/%E8%B4%AA%E5%BF%83%E7%AE%97%E6%B3%95/5411800)的策略，每次遍历到始点距离最近且未访问过的顶点的邻接节点，直到扩展到终点为止。算法详细可以参看[https://www.jianshu.com/p/f38857a26be1](https://www.jianshu.com/p/f38857a26be1)

#功能说明
[demo](https://github.com/CoderLi-Q/LQDijkstra)代码实现了界面化输入有权图，由Dijkstra算法计算出最短路径，并且使用NSKeyedArchiver存储历史记录

##详细功能

### 1 根据有权图节点个数，创建节点（目前是代码写死，后续界面化可更改）
###2 添加路径
   - 点击“添加连接”，手动连接节点，创建路径
   - 待所有路径连接完毕，点击 ”连接完成“
### 3 修改权重，步骤2中路径默认生成“15”的权重
- 点击“15”，弹出键盘，输入对应权重
### 4 编辑位置
- 点击“编辑位置”
- 拖动对应节点
### 5 检查节点，路径，权重是否准确
### 6 点击准备好了
  
##优化点
- 创建路径时判断了起点和终点必须在节点内，否则视为无效
- 只有在点击了“添加连接”之后才可以创建路径
##技术点
- UIBezierPath：创建路径
- 判断点是否在view内：判断路径是否有效
- 键盘状态监听：编辑权重
- UITextField相关：权重显示
- NSKeyedArchiver：历史记录
##待改进
- 节点个数界面灵活配置
- 算法起点，终点界面灵活配置
