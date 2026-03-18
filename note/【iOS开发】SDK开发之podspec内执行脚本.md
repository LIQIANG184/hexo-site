  本系列是SDK打包的实践，主要解决一下3个问题，本篇是第三篇。
[【iOS开发】SDK开发之编译c/c++](https://www.jianshu.com/p/64a7757d3fae?v=1734334386926)
[【iOS开发】SDK开发之podspec编写](https://www.jianshu.com/p/daeaf5728100?v=1742283697172)
[【iOS开发】SDK开发之podspec内执行脚本](https://www.jianshu.com/p/99ca9803cb48?v=1742283732210)


上篇文章podsec内的framework是cmake编译出来的，到目前为止app内使用pod引入sdk需要两步：
```
1 使用cmake编译sdk
2 cd 到podfile所在目录
   添加pod依赖
   pod install
```
有没有可能把两步合并呢？👇🏻向下看

# 打包脚本合并到podspec中

```
system <<-SCRIPT
mkdir build && cd build
cmake -G Xcode .. -B .
env="Release"
xcodebuild -target MobilePoseAlign -configuration "$env"
SCRIPT
# 如果执行 xcodebuild 失败, 直接报错, 终止打包流程
raise "xcodebuild failed!" unless $?.success?
   
Pod::Spec.new do |s|
  s.name             = 'sdkName'
  s.version         = "1.0.0"
  s.summary          = '***'
  s.description      = "***."
  s.homepage         = "**"
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'lq' => '**' }
  s.source           = { :git => "****", :tag => s.name.to_s + "-" + s.version.to_s }
  s.frameworks = "AVFoundation", "Foundation", "Metal", "CoreMedia"
  s.libraries = "c++","z"
  s.preserve_paths = "ios/build/Debug-iphoneos/**/*", "ios/algorithms/**/data/**/*", "3rd/iOS/lib/**/*.framework/**/*", "3rd/iOS/lib/*.framework/**/*", "3rd/iOS/dependence/png/*"
  s.resource_bundle = { 'sdkName' => "ios/algorithms/**/data/*" }
  s.public_header_files = "3rd/iOS/dependence/png/*.h"
  s.ios.deployment_target = '9.0'
 s.vendored_frameworks = "ios/Debug-iphoneos/Release/*.framework","ios/build/Debug-iphoneos/Release/*.framework", "3rd/iOS/lib/**/*.framework", "3rd/iOS/lib/*.framework"
end
```
