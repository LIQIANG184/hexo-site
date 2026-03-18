最近项目需要用到UICollectionView显示网络图片，在写demo时遇到一个BUG我想要这个效果（最后一个是加号，点击进入相册）
![image.png](/images/note/cd4a420a2b6b2e892cd4e6dda4b6c277.webp)
这个很简单，很快写完，运行如下图：
![image.png](/images/note/3035784dad5bd14dff64b1242844f74e.webp)
怎么回事？为什么加号没有显示？

有此BUG的代码在这里，有想挑战一下的可以去[下载](https://github.com/CoderLi-Q/CollectionviewBUG)
,解决完了，记得回来看看。

显示加号的逻辑很简单，在cellForItemAtIndexPath：数据源方法里判断一下：

        CollectionCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"CollectionCell" forIndexPath:indexPath];
     if (indexPath.item == self.dataSourses.count) {
        //显示加号,隐藏叉号：
        cell.image = [UIImage imageNamed:@"123"];
        cell.deleteButton.hidden = YES;
    } else {
       //显示图片
       cell.model = self.dataSourses[indexPath.item];
    }

CollectionCell.m

    - (void)setMedia:(Model *)media {
         _media = media;
        [self.imageV sd_setImageWithURL:[NSURL URLWithString:media.imagUrl]];
    }


赋值图片的时候,很简单的用了SD，不应该有问题啊,通过观察可知，貌似是因为复用的问题。

   在此先给出此问题的解决方法：

解法1：在reload的时候不要加异步主线程（此方法不推荐）
   
        //dispatch_async(dispatch_get_main_queue(), ^{
        [self.collectionView reloadData];
      // });
解法2：在赋值dataSourses地方加延迟
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    
        collectionV.dataSources = @[
                                    @"http://pic32.nipic.com/20130823/13339320_183302468194_2.jpg",
                                    @"http://pic40.nipic.com/20140412/18428321_144447597175_2.jpg",
                                    @"http://k.zol-img.com.cn/sjbbs/7692/a7691515_s.jpg"];
    });
解法3：让reloadData方法在SD的线程安全宏里执行

     dispatch_main_async_safe(^{
        [self.collectionView reloadData];
    );
解法4：cellForItemAtIndexPath里的代码加一行代码

    CollectionCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"CollectionCell" forIndexPath:indexPath];
     if (indexPath.item == self.dataSourses.count) {
        cell.imageV sd_cancelCurrentImageLoad]；//加上此行代码
        //显示加号,隐藏叉号：
        cell.image = [UIImage imageNamed:@"123"];
        cell.deleteButton.hidden = YES;
    } else {
       //显示图片
       cell.model = self.dataSourses[indexPath.item];
    }

分析过程：
   1  在cellForItemAtIndexPath方法里的打断点：
 ![image.png](/images/note/4a12a878565b0f1f7314125b82a69e60.webp)
发现执行过程没有太大问题，有个小问题是方法走了 2*4=8次；也就是说有两次reloadData的过程。
2 在reload方法里打个断点，发现只执行了一次，那为什么执行两遍数据源方法呢？
   ![image.png](/images/note/47b297baeebbe9839aad2c044a51ebec.webp)
3 得出结论系统会隐式调用一遍数据源方法
4 到这里还是没有找打问题的原因，既然imageview有问题，那我就看一下imageview的setImage方法执行的细节，我把cell中的imageV换成了继承与UIImageView的LQImageView，重写了setImage方法:
![image.png](/images/note/cd3a4560b7169194689ae183bbfa8bd1.webp)
打印结果：
![image.png](/images/note/35069bb07579727d5704e62c9c17da5b.webp)
经过分析得出结论：

    两次reload的 加号的那个cell有问题，reload2 覆盖了reload1 的所有图片，除了reload2
    的加号，因为reload2的加号cell是直接setImage了，随后SD异步图片回来了，又赋值一次，
    这个图片是reload1的异步图片
