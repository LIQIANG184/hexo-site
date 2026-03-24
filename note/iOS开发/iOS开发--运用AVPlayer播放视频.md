
AVPlayer是可以高度定制性的播放器
利用AVPlayer播放的简单实现见下文:
<!-- more -->
    NSURL *url = [NSURL URLWithString:@"http://******"];
    playerItem  = [[AVPlayerItem alloc]initWithURL:url];
    //创建player
    player = [[AVPlayer alloc]initWithPlayerItem:playerItem];
    //生成layer层
    AVPlayerLayer *layer = [AVPlayerLayer playerLayerWithPlayer:player];
    self.playLayer = player;
    //设置坐标
    layer.frame = CGRectMake(0, 0, 480, 480);
    //把layer层假如到self.view.layer中
    [self.view.layer addSublayer:layer];
    //进行播放
    [player play];
如想了解AVPlayer的更多用法可以参考
