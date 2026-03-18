
遇到一个对象无法释放的问题，最后排查是因为一个Bool类型的成员变量的原因，已解决！

问题截图：
![声明.png](https://upload-images.jianshu.io/upload_images/2791393-b25ca0edfa042385.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![block.png](https://upload-images.jianshu.io/upload_images/2791393-920eb87cc2c603f6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

解决方案：
1 修改声明为：
![image.png](https://upload-images.jianshu.io/upload_images/2791393-2650edbe6ecaef1f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
2 block内改为点方法
![block.png](https://upload-images.jianshu.io/upload_images/2791393-aee9cb68a9e77280.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
