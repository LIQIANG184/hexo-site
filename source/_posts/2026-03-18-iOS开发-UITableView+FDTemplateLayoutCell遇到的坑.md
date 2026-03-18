---
title: "iOS开发-UITableView+FDTemplateLayoutCell遇到的坑"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "iOS开发-UITableView+FDTemplateLayoutCell遇到的坑.md"
---

最近项目进入重构代码阶段，其中一个重构的方向是：把项目中的手动计算cell高度的逻辑，替换为使用UITableView+FDTemplateLayoutCell进行高度缓存。代码写起来很流畅，刚开始用起来很爽，直接写好约束，在heightForRow方法里调用
      
      - (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
      return [tableView fd_heightForCellWithIdentifier:@"" configuration:^(UITableViewCell *cell) {
            cell.epgModel = epgModel;//cell设置数据，更新数据
        }];
      }
对FD不熟的小伙伴可以去github搜索学习，这里不再赘述。

#先说明踩坑经验：FD框架对影响横向布局的控件的hidden很敏感，会影响cell高度的计算准确度。建议对需要隐藏的控件做宽度布局修改为零。


有兴趣了解”踩坑到出坑“过程的同学可以继续读下去，没兴趣的可以忙别的去了。

----
##应用场景如下
先来看下cell样式：
![image.png](https://upload-images.jianshu.io/upload_images/2791393-d753db3b05fa9d2f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>简单说明：1 cell分为3种状态, 回看/播放中/预约

#遇到的问题
有的时候cell高度计算不对，导致label无法全部展示。
![错误](https://upload-images.jianshu.io/upload_images/2791393-f2692a196505e5ce.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![正确](https://upload-images.jianshu.io/upload_images/2791393-eb949cd80b304ec2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##错误说明：
”环球综艺秀-2020-23“一行显示不下，需要折行展示；

##上错误代码：
cell的setEpgModel方法内部代码是给cell控件赋值,同时刷新布局；

    -(void)setEpgModel:(CNLiveEPGModel *)epgModel{
     ....

    self.livingAnimationView.hidden = YES;
    switch (type) {
            case Live_Playing:
        {
            
            self.livingAnimationView.hidden = NO;
      break;
    .....

      }

##修改后代码

    -(void)setEpgModel:(CNLiveEPGModel *)epgModel{
       ....
       [self.livingAnimationView mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.right.equalTo(self.typeButton.mas_left).with.offset(-6);
        make.centerY.equalTo(self.typeButton);
        make.height.mas_equalTo(14);
        make.width.mas_equalTo(0);
    }];
    //self.livingAnimationView.hidden = YES;
    switch (type) {
            case Live_Playing:
        {
       //self.livingAnimationView.hidden = NO;
            [self.livingAnimationView mas_remakeConstraints:^(MASConstraintMaker *make) {
                make.right.equalTo(self.typeButton.mas_left).with.offset(-6);
                make.centerY.equalTo(self.typeButton);
                make.height.mas_equalTo(14);
                make.width.mas_equalTo(15);
            }];
      break;
    .....
      }

  ----
#定位问题过程（前方高能）
1 看到label显示不全，怀疑是约束的问题，较劲脑汁换约束方法（不管用）
2 怀疑是行高cache的问题，打开fd的log，根据错误行高数据查找cache读取/存储过程，发现行高方法会执行很多次，有的计算是对的，最后一次总会错误，错误行高有一个规律--只有正直播的数据会错误。
3 本着怀疑一切的态度，首先去掉了正直播的数据行高cache
> -(CGFloat)fd_heightForCellWithIdentifier:(NSString *)identifier cacheByIndexPath:(NSIndexPath *)indexPath configuration:(void (^)(id cell))configuration;

改为：
>-(CGFloat)fd_heightForCellWithIdentifier:(NSString *)identifier configuration:(void (^)(id cell))configuration; （不管用）

4 怀疑是正直播的行高计算问题，单步调试，发现一个问题
在cell高度计算不正确的时候，不执行 return [self fd_systemFittingHeightForConfiguratedCell:templateLayoutCell];
只会执行到if (configuration) { configuration(templateLayoutCell); }怀疑是这个block的问题

   >-(CGFloat)fd_heightForCellWithIdentifier:(NSString *)identifier configuration:(void (^)(id cell))configuration {
    if (!identifier) {
        return 0;
    }
    UITableViewCell *templateLayoutCell = [self fd_templateCellForReuseIdentifier:identifier];
    // Manually calls to ensure consistent behavior with actual cells. (that are displayed on screen)
    [templateLayoutCell prepareForReuse];
    // Customize and provide content for our template cell.
    if (configuration) {
        configuration(templateLayoutCell);
    }
    return [self fd_systemFittingHeightForConfiguratedCell:templateLayoutCell];
    }

5 把这个block内的代码去掉，发现所有的cell高度均会错误，只能放开block内的代码。

        - (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
      return [tableView fd_heightForCellWithIdentifier:@"" configuration:^(UITableViewCell *cell) {
            //cell.epgModel = epgModel;//cell设置数据，更新数据
        }];
      }
6  既然cell的设置数据有问题，那就需要定位到设置数据方法内具体哪些代码影响了cell高度计算。运用二分大法，最后定位到了是self.livingAnimationView.hidden=YES的问题。
7 修改self.livingAnimationView.hidden的方案，最后修改为约束宽度为0来代替隐藏控件
