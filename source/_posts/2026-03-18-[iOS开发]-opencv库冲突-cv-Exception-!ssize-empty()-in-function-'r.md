---
title: "[iOS开发]-opencv库冲突-cv--Exception-!ssize-empty()-in-function-'resize''"
date: 2026-03-18 18:30:13
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "[iOS开发]-opencv库冲突-cv--Exception-!ssize-empty()-in-function-'resize''.md"
---

项目中有引用insta360SDK采集图片,使用opencv库进行图像处理,但是发现图片无法读取,导致后续处理crash

##读取图片代码:

```
cv::imread(@"var/image.png")
cv::resize(123)
```
##crash 截图如下:
![resize crash.png](/images/note/77d1ecf8c9cfc95530b33226841653f6.png)

##问题原因:
>opencv库和insta360SDK冲突

##解决办法:修改link顺序
- 1 如果是直接拖入工程引用
修改Build Phases 中 link Binary With Libraries 调整opencv库和insta360SDK顺序
- 2 如果是pod引入(我就是这样的),需要在podfile里写脚本修改
Pods-XXX.debug.xcconfig 中的OTHER_LDFLAGS value中framework顺序,脚本奉上

```
post_install do |installer|
  puts "Updating "
    installer.pods_project.targets.each do |target|
      puts "Updating "
        if target.name == "Pods-CaptureSDKDemo"
            puts "Updating #{target.name} OTHER_LDFLAGS"
            target.build_configurations.each do |config|
                xcconfig_path = config.base_configuration_reference.real_path

                # read from xcconfig to build_settings dictionary
                build_settings = Hash[*File.read(xcconfig_path).lines.map{|x| x.split(/\s*=\s*/, 2)}.flatten]

                # modify OTHER_LDFLAGS
                vlc_flag = ' -framework "INSCoreMedia"'
                build_settings['OTHER_LDFLAGS'].gsub!(vlc_flag, "")
                build_settings['OTHER_LDFLAGS'].gsub!("\n", "")
                build_settings['OTHER_LDFLAGS'] += vlc_flag + "\n"

                # write build_settings dictionary to xcconfig
                File.open(xcconfig_path, "w") do |file|
                  build_settings.each do |key,value|
                    file.write(key + " = " + value)
                  end
                end
            end
        end
    end
end
```
修改.xcconfig详细见[链接](https://stackoverflow.com/questions/30244675/how-can-i-modify-other-ldflags-via-cocoapods-post-install-hook)
