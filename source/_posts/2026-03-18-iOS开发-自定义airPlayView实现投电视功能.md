---
title: "iOS开发--自定义airPlayView实现投电视功能"
date: 2026-03-18 18:04:06
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "iOS开发--自定义airPlayView实现投电视功能.md"
---

最近APP内需要用到投电视功能,所以做了一个小小的封装,方便使用.

>更新日志：
1  2018-04-09 KVO监听alpha的变化

苹果API有一个类叫"MPVolumeView",它是用来实现投电视的控件,但是这个控件和UISlider类似,定制性不是很好,不能用frame改变大小,并且自带一个电视的小图标,对于个性的产品来说很难满足他的需求(我们就是这样...)-----故自己封装一个用起来比较方便的view.

>本文[demo](https://github.com/CoderLi-Q/airPlayView)地址

废话不多说上~~代码:

 LQAirPlayView.h
 
     #import <UIKit/UIKit.h>

    @interface LQAirPlayView : UIView

    /**
     返回实例

     @param rect frame
     @param image 图片
     @return 实例
     */
    + (instancetype)airPlayViewWithFrame:(CGRect)rect image:(UIImage *)image;
    @end

 LQAirPlayView.m

    #import "LQAirPlayView.h"
    #import <MediaPlayer/MediaPlayer.h>
    @interface LQAirPlayView ()
    @property (nonatomic, weak) UIImageView *imageView;
    @property (nonatomic, weak) MPVolumeView *mpAirplayView;
    @end

    @implementation LQAirPlayView

    +(instancetype)airPlayViewWithFrame:(CGRect)rect image:(UIImage *)image{
        return [[self alloc] initWithFrame:rect image:image];
    }

    + (instancetype)airPlayViewWithFrame:(CGRect)rect{
        return [[self alloc] initWithFrame:rect];
    }
    - (instancetype)initWithFrame:(CGRect)frame image:(UIImage *)image
    {
        self = [self initWithFrame:frame];
        if (self) {
            self.imageView.image = image;
        }
        return self;
    }
    - (instancetype)initWithFrame:(CGRect)frame
    {
        self = [super initWithFrame:frame];
        if (self) {
            self.backgroundColor = [UIColor lightGrayColor];
            UIImageView *imgView = [[UIImageView alloc]init];
            _imageView = imgView;
            [self addSubview:imgView];
            
            MPVolumeView *mpAirplayView = [[MPVolumeView alloc] init];
            [mpAirplayView setRouteButtonImage:nil forState:UIControlStateNormal];
            [mpAirplayView setShowsVolumeSlider:NO];
            _mpAirplayView = mpAirplayView;
            [self addSubview:mpAirplayView];

            /*添加于2018-04-09*/
            for (UIButton *button in mpAirplayView.subviews) {
                if ([button isKindOfClass:[UIButton class]]) {
                    [button addObserver:self forKeyPath:@"alpha" options:NSKeyValueObservingOptionNew context:nil];
                }
            }
            /*添加于2018-04-09*/

        }
        return self;
    }
     /*添加于2018-04-09*/
    - (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
    if ([object isKindOfClass:[UIButton class]] ) {
        if([[change valueForKey:NSKeyValueChangeNewKey] intValue] == 1){
            [(UIButton *)object setBounds:CGRectMake(0, 0, self.frame.size.width, self.frame.size.height)];
        }else{
            self.mpAirplayView.hidden = NO;
            [object setAlpha:1];
        }
    }
    }
     /*添加于2018-04-09*/
    -(void)layoutSubviews{
        [super layoutSubviews];
        CGFloat scaleW = self.frame.size.width/30;
        CGFloat scaleH = self.frame.size.height/34;
        CGFloat scale = scaleH > scaleW ? scaleH : scaleW;
        self.mpAirplayView.transform = CGAffineTransformMake(scale,0, 0, scale, self.frame.size.width/2, self.frame.size.height/2);
        self.imageView.frame = self.bounds;
        
    }

    @end

用法:

    LQAirPlayView *airView = [LQAirPlayView airPlayViewWithFrame:CGRectMake(100, 100, w, w) image:[UIImage imageNamed:@"icon]];
    [self.view addSubview:airView];

最后附上本文[demo](https://github.com/CoderLi-Q/airPlayView)地址！

            ————[半缘魔君](https://www.jianshu.com/u/5bf6c3f1b289)出品——————

AirPlay的API：
 
    @property (nonatomic) BOOL showsVolumeSlider MP_API(ios(4.2)); // Default is YES.
    @property (nonatomic) BOOL showsRouteButton MP_API(ios(4.2));  // Default is YES.

    // Returns YES if wireless routes (AirPlay, Bluetooth, etc) are available for user selection.
    // Note that the view must be in present in a window hierarchy in order to discover some types of wireless routes.
    @property (nonatomic, readonly, getter=areWirelessRoutesAvailable) BOOL wirelessRoutesAvailable MP_API(ios(7.0));

    // Returns YES if a wireless route is active.
    @property (nonatomic, readonly, getter=isWirelessRouteActive) BOOL wirelessRouteActive MP_API(ios(7.0));

    // Volume slider customization

    - (void)setMinimumVolumeSliderImage:(nullable UIImage *)image forState:(UIControlState)state MP_API(ios(6.0));
    - (void)setMaximumVolumeSliderImage:(nullable UIImage *)image forState:(UIControlState)state MP_API(ios(6.0));
    - (void)setVolumeThumbImage:(nullable UIImage *)image forState:(UIControlState)state MP_API(ios(6.0));

    - (nullable UIImage *)minimumVolumeSliderImageForState:(UIControlState)state MP_API(ios(6.0));
    - (nullable UIImage *)maximumVolumeSliderImageForState:(UIControlState)state MP_API(ios(6.0));
    - (nullable UIImage *)volumeThumbImageForState:(UIControlState)state MP_API(ios(6.0));

    // Sets the image for the EU volume limit. When appropriate, this image will be displayed on top of the
    // maximumVolumeSliderImage. It must be visually distinct from the maximumVolumeSliderImage, and use
    // a color similar to the default, to convey a sense of warning to the user. The same image is used for
    // all control states. For debugging purposes, switch on the "EU Volume Limit" setting in the Developer
    // menu of the Settings application to always enable the volume limit.
    @property (nonatomic, strong, nullable) UIImage *volumeWarningSliderImage MP_API(ios(7.0));

    - (CGRect)volumeSliderRectForBounds:(CGRect)bounds MP_API(ios(6.0));
    - (CGRect)volumeThumbRectForBounds:(CGRect)bounds volumeSliderRect:(CGRect)rect value:(float)value MP_API(ios(6.0));

    // Route button customization

    - (void)setRouteButtonImage:(nullable UIImage *)image forState:(UIControlState)state MP_API(ios(6.0));
    - (nullable UIImage *)routeButtonImageForState:(UIControlState)state MP_API(ios(6.0));

    - (CGRect)routeButtonRectForBounds:(CGRect)bounds MP_API(ios(6.0));
