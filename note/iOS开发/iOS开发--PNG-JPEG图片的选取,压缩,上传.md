前段时间项目中有一个上传头像的需求,对图片有一些要求: 图片不能超过2M,宽高最大为200 并且相等,支持JPG/GIF/PNG格式图片,本文先写JPG/PNG,后续会再发GIF图片的选取,压缩,上传.
<!-- more -->
--
思考的步骤:
- 1 从相册选取图片
- 2 把图片的二进制数据准备好
- 3 封装上传图片的方法
- 4 上传图片

下面详细讲解如何实现每一步:
1 从相册选取图片,我这里是用的原生API,上代码:

    //这部分代码是用来打开相册的
    UIImagePickerControllerSourceType sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
    UIImagePickerController *picker = [[UIImagePickerController alloc] init];
    picker.delegate = self;
    picker.allowsEditing = YES;//是否允许编辑
    picker.sourceType = sourceType;
    [self presentViewController:picker animated:YES completion:nil];
下面是选取图片后代理方法内的代码:

    - (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info
     {
      __block UIImage *image = [info objectForKey:@"UIImagePickerControllerEditedImage"];
      [self dismissViewControllerAnimated:YES completion:nil];
      NSString *assetString = [[info objectForKey:UIImagePickerControllerReferenceURL] absoluteString];
      __block NSData *data = [NSData data];
      if([assetString hasSuffix:@"GIF"]){
      //这个图片是GIF图,这一部分后续文章会出怎么处理
      } else {
        //准备图片的二进制数据
        //上传图片
      }
    }
2 准备图片的二进制数据:
   根据要求对图片的处理分为两步,第一步压缩体积,减小尺寸,第二步转化成二进制数据
2.1 对PNG和JPEG格式图片的处理
2.1.1 对图片进行压缩
我的做法是利用图形上下文减小尺寸,利用UIImageJPEGRepresentation()压缩体积,上代码(我做了一个分类,方便调用):

UIImage+ZipSizeAndLength.h

    #import <UIKit/UIKit.h>
    @interface UIImage (ZipSizeAndLength)
    - (UIImage *)compressToByte:(NSUInteger)maxLength;
    //直接调用这个方法进行压缩体积,减小大小
    - (UIImage *)zip;
    @end

   UIImage+ZipSizeAndLength.m

    @implementation UIImage (ZipSizeAndLength)
    - (UIImage *)compressToByte:(NSUInteger)maxLength {
    // Compress by quality
    CGFloat compression = 1;
    NSData *data = UIImageJPEGRepresentation(self, compression);
    if (data.length < maxLength) return self;
    
    CGFloat max = 1;
    CGFloat min = 0;
    for (int i = 0; i < 6; ++i) {
        compression = (max + min) / 2;
        data = UIImageJPEGRepresentation(self, compression);
        if (data.length < maxLength * 0.9) {
            min = compression;
        } else if (data.length > maxLength) {
            max = compression;
        } else {
            break;
        }
    }
    UIImage *resultImage = [UIImage imageWithData:data];
    if (data.length < maxLength) return resultImage;
    
    // Compress by size
    NSUInteger lastDataLength = 0;
    while (data.length > maxLength && data.length != lastDataLength) {
        lastDataLength = data.length;

        CGSize size = CGSizeMake(200, 200);
        UIGraphicsBeginImageContext(size);
        [resultImage drawInRect:CGRectMake(0, 0, size.width, size.height)];
        resultImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        data = UIImageJPEGRepresentation(resultImage, compression);
    }
    resultImage = [UIImage imageWithData:data];
    return resultImage;
    }
    - (UIImage *)zipSize{
    if (self.size.width < 200) {
        return self;
    }
    CGSize size = CGSizeMake(200, 200);
    UIGraphicsBeginImageContext(size);
    [self drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return  image;
    }

    - (UIImage *)zip{
    UIImage *image = [self compressToByte:2*1024*1024];
    return  [image zipSize];
    }
2.1.2  图片压缩完成之后,需要转成二进制数据,对于PNG和JPEG格式的图片转二进制数据很简单,苹果提供了非常简单实用的API:

    // return image as PNG. May return nil if image has no CGImageRef or invalid bitmap format
    UIKIT_EXTERN  NSData * __nullable UIImagePNGRepresentation(UIImage * __nonnull image);    
    // return image as JPEG. May return nil if image has no CGImageRef or invalid bitmap format. compression is 0(most)..1(least)                           
    UIKIT_EXTERN  NSData * __nullable UIImageJPEGRepresentation(UIImage * __nonnull image, CGFloat compressionQuality);  
所以,上文中的准备图片的二进制数据,代码为:

        //准备图片的二进制数据
        image = [image zip];
        data = UIImagePNGRepresentation(image);
        //上传图片

3 上传文件的方法:
我用AFN做的上传,代码如下:

    +(void)requestUrl:(NSString*)urlString paras:(id)paras datas:(NSArray *)datas 
    success:(SuccessBlock)successBlock failure:(FailureBlock)failureBlock{
       NSURLSessionDataTask *datatask = [sessionManager POST:urlString 
                                                  parameters:paras 
                                   constructingBodyWithBlock:^(id<AFMultipartFormData>  _Nonnull formData) {
                for (int i = 0 ; i < datas.count ; i++){
                    NSData *data = datas[i];
                    [formData appendPartWithFileData:data name:@"facefile" fileName:@"facefile" mimeType:@"image/gif"];
                }
                
            } progress:^(NSProgress * _Nonnull uploadProgress) {
                NSLog(@"-----%@",uploadProgress);
            } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
                NSLog(@"上传成功--%@",responseObject);
            } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
                NSLog(@"上传失败%@",error);
         }];
     }
这里需要注意的一点是: 数据流的name和faileName mimeType 不能为空; 并且name是跟后台约定好的.
所以上文中的上传图片部分的代码为:
        
    //上传图片
    [self uploadImageWithData:data];
uploadImageWithData方法实现为:
    - (void)uploadImageWithData:(NSData *)data{
    NSMutableDictionary *dic = [[NSMutableDictionary alloc]init];
    [dic setValue:@"xx" forKey:@"xxx"];
    [dic setValue:@"xx" forKey:@"yyy"];
    [dic setValue:@"xx" forKey:@"zzz"];
    NSString *str = @"http://xx.xx.com";
    requestUrl:(NSString*)urlString paras:(id)paras datas:(NSArray *)datas 
    [Request requestUrl:str paras:dic datas:@[data]  success:^(id responds) {
          //成功回调
    } failure:^(NSError *error) {
          //失败回调
    }];
    }
