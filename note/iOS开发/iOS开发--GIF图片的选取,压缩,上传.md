之前写了一篇关于PNG/JPEG图片的选取,压缩,上传(下边统一简称前文): http://www.jianshu.com/p/011b5ef47675, 文本依赖前文的UIImage+ZipSizeAndLength分类进行图片的压缩等.
总结一下: 用原生的 UIImagePickerController 选取图片; 用原生的UIImageJPEGRepresentation()和图形上下文对图片进行压缩; 用AFN进行上传操作.
好了,总结完之后进入今天的主题-----GIF图片的选取,压缩,上传;
<!-- more -->
------
目录: 
一 前言
二 选取图片(重点)
三 获取GIF图片的原始完整二进制数据(重点)
四 压缩图片(重点)
五 上传图片

----
 
一 前言

      有的同学会疑惑,难道gif图片不能用前文说的PNG/JPEG图片的方法进行选取,压缩和上传吗?
 我可以肯定的给你回答---不能(自己亲身敲代码做的test,如有疑问,欢迎留言)
原因如下:
       1 前文说的选取图片的代码如下:
     - (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info
    {
      UIImage *image = [info objectForKey:@"UIImagePickerControllerEditedImage"];
    }
对于GIF图片只能选取到第一帧,无法取到所有帧.
    2 无法取到GIF所有帧,就不能对图片进行压缩
    3 无法取到GIF所有帧,也不能将图片转化成二进制数据
    4 没有二进制数据就无法进行上传操作
所以需要换另外一个方法,具体如下.

-----

二 选取图片
首先判断是不是GIF图片,如果是才需要走GIF的逻辑,判断方法有如下两种:

第一种(比较取巧):
    - (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info
    {      
       NSString *assetString = [[info objectForKey:UIImagePickerControllerReferenceURL] absoluteString];
       if([assetString hasSuffix:@"GIF"]){
           //这个图片是GIF图片
        } else {
       }
    }
第二种:利用iOS9.0以后出的 Photos/Photos.h 里边的API进行判断,代码如下:

    NSURL *url = [info objectForKey:UIImagePickerControllerReferenceURL];
    PHFetchOptions *options = [[PHFetchOptions alloc]init];
    PHFetchResult *set = [PHAsset fetchAssetsWithALAssetURLs:@[url] options:options];
     //转化NSData
    PHCachingImageManager *imageManager = [[PHCachingImageManager alloc] init];
    PHImageRequestOptions *option = [PHImageRequestOptions new];
    option.resizeMode = PHImageRequestOptionsResizeModeFast;
    option.synchronous = YES;
    PHAsset *asset = set.firstObject;//本文只是选取一张
    [imageManager requestImageDataForAsset:asset
                   options:option
             resultHandler:^(NSData * _Nullable imageData, NSString * _Nullable dataUTI, UIImageOrientation orientation, NSDictionary * _Nullable info) {
                     if ([dataUTI isEqualToString:(__bridge NSString *)kUTTypeGIF]) {
                          //这个图片是GIF图片
                          }else if([dataUTI isEqualToString:(__bridge NSString *)kUTTypePNG]){
                                NSLog(@"PNG图片");
                          }else if([dataUTI isEqualToString:(__bridge NSString *)kUTTypeJPEG]){
                                NSLog(@"JPEG图片");
                          }else if([dataUTI isEqualToString:(__bridge NSString *)kUTTypeJPEG2000]){
                                NSLog(@"JPEG2000图片");
                          }else {
                          }
    }];
本文用的是第一种(比较简单,效率高)

-----

三 获取GIF图片的原始完整二进制数据(所有帧)
代码如下:

    - (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info
    {      
       NSString *assetString = [[info objectForKey:UIImagePickerControllerReferenceURL] absoluteString];
       if([assetString hasSuffix:@"GIF"]){
           //这个图片是GIF图片
           ALAssetsLibrary *assetLibrary = [[ALAssetsLibrary alloc]init];
           [assetLibrary assetForURL:[info objectForKey:UIImagePickerControllerReferenceURL] resultBlock:^(ALAsset *asset) {
            ALAssetRepresentation *re = [asset representationForUTI:(__bridge NSString *)kUTTypeGIF];;
            NSUInteger size = (NSUInteger)re.size;
            uint8_t *buffer = malloc(size);
            NSError *error;
            NSUInteger bytes = [re getBytes:buffer fromOffset:0 length:size error:&error];
            NSData *data = [NSData dataWithBytes:buffer length:bytes];//这个就是选取的GIF图片的原二进制数据
            free(buffer);
            } failureBlock:^(NSError *error) {
            
        }];
        } else {
       }
    }
   
-----

四 压缩图片

利用CoreGraphics/CoreGraphics.h API转换GIF图片并再次转成符合要求的图片的二进制文件:
封装方法如下:
    + (NSData *)zipGIFWithData:(NSData *)data {
        if (!data) {
            return nil;
        }
        CGImageSourceRef source = CGImageSourceCreateWithData((__bridge CFDataRef)data, NULL);
        size_t count = CGImageSourceGetCount(source);
        UIImage *animatedImage = nil;
        NSMutableArray *images = [NSMutableArray array];
        NSTimeInterval duration = 0.0f;
        for (size_t i = 0; i < count; i++) {
            CGImageRef image = CGImageSourceCreateImageAtIndex(source, i, NULL);
            duration += [self frameDurationAtIndex:i source:source];
            UIImage *ima = [UIImage imageWithCGImage:image scale:[UIScreen mainScreen].scale orientation:UIImageOrientationUp];
            ima = [ima zip];
            [images addObject:ima];
            CGImageRelease(image);
        if (!duration) {
            duration = (1.0f / 10.0f) * count;
        }
        animatedImage = [UIImage animatedImageWithImages:images duration:duration];
     }
     CFRelease(source);
     return UIImagePNGRepresentation(animatedImage);
    }
将三种得到的gif图片的二进制数据精心压缩:
   代码如下:

     ....
    NSData *data = [NSData dataWithBytes:buffer length:bytes];//这个就是选取的GIF图片的原二进制数据
    data = [self zipGIFWithData:data];
    //上传二进制数据

-----

五 上传图片,与前文上传图片一样
