   崩溃的截图：
  ![image.png](/images/note/15f69cd324ef0ffbea5444bb70ba5875.webp)

  ![image.png](/images/note/8c0e06b090bda15a2631fb0dbff35734.webp)  

 最近项目中有一个dispatch_group相关的巨坑（此问题解决方法很简单，难点是定位问题），特此记录下来并分享，希望帮助到有需要的人！

   本文涉及的知识面较广，有一定的逻辑性，如果想真正明白各种原理，请细细读来，如时间紧迫，可记住正确使用方法亦可！

   阅读本文需要的知识点：

     1 熟悉AFNetworking
     2 熟练使用dispatch_group
     3 了解接口的含义
     4 熟悉block工作原理
     5 熟悉地址引用含义
   先把crash场景和解决方案放在开头：

   crash场景：

    1 有一组多个接口地址
    2 利用  dispatch_group并发请求到数据后，统一回调（必要：利用AF进行网络请求）
    3 频繁调用2（必要）
    4 每次调用2中的请求是同一组接口地址（必要）
    注：频繁的意思是一秒调用3次或3次以上

问题核心： 

    对dispatch_group进行了额外的leave操作

问题代码：

    -(void)request{
        dispatch_group_t group = dispatch_group_create();
        self.group = group;

       enter代码....
      [request  requestGetUrl:url success:^(id responds) {
        leave代码....
      }];     
    } 
修正后代码：

    -(void)request{
      if(self.group == nil){
        dispatch_group_t group = dispatch_group_create();
        self.group = group;
      }
       enter代码....
      [request  requestGetUrl:url success:^(id responds) {
        leave代码....
      }];     
    } 
 我想你肯定在疑惑加一个if判断就解决了问题了，那这个坑应该不大，分分钟搞定，请往下看




产生此问题的原因：概括的说是dispatch_group的原理和AFNetworking网络请求回调block的缓存回调原理的协作问题

举例详细说明，流程图如下：
![image.png](/images/note/1ae39c1ded50e2853db32d8e2b8afde7.webp)

    正常情况下：执行步骤1 的间隔时间充分长，或者只执行一次，此逻辑没有问题，不会crash；
    非正常情况：开头所说的crash出现场景下，即频繁执行上图中步骤1到步骤3
   因为网络请求的耗时和异步特性，这时候会发生一种情况

    1 第一次在步骤1创建了一个新的group1，这时网络请求n1到n4请求未返回，也就是b1到b4
       还未调用；
    2 此时又执行了一次步骤一创建了一个新的group，命名为group2（这是一个新的，代码见上图），
      并且赋值给了self.group，又执行步骤二，对group2进行enter，发送网络请求;
    3 此时若是1中的网络请求返回了，b1到b4就会调用，会对步骤2中创建的新的group2进行
      leave操作，当2中的网络请求返回，进行回调时，会发生对group2进行额外的leave操作，
      从而造成crash；
    注：b1到b4因为leave的需要，会对group进行地址引用
   
作者受[此文](http://satanwoo.github.io/2017/01/07/DispatchGroupCrash/)启发，虽场景不同，但原理一致！
 ***
---2018-03-14更新错误代码实例 --start
附1：
错误代码实例（崩溃截图见代码下边）：

     - (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    dispatch_group_t group = dispatch_group_create();
    self.group = group;
    dispatch_group_enter(self.group);
    dispatch_group_enter(self.group);
    dispatch_group_enter(self.group);
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
        dispatch_group_leave(self.group);
        sleep(2);
        dispatch_group_leave(self.group);
         dispatch_group_leave(self.group);
    });
    dispatch_group_notify(self.group, dispatch_get_main_queue(), ^{
        NSLog(@"1234567");
    });   
    }
![崩溃截图](/images/note/b097bbe5cf702d7e5b1e07e3a6757f6d.webp)



 修正后代码：

    - (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    if(self.group == nil){
        dispatch_group_t group = dispatch_group_create();
        self.group = group;
    }
    dispatch_group_enter(self.group);
    dispatch_group_enter(self.group);
    dispatch_group_enter(self.group);
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
        dispatch_group_leave(self.group);
        sleep(2);
        dispatch_group_leave(self.group);
        dispatch_group_leave(self.group);
    });
    
    dispatch_group_notify(self.group, dispatch_get_main_queue(), ^{
        NSLog(@"1234567");
    });    
    }
---2018-03-14更新错误代码实例 --end
***

