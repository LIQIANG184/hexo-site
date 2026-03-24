---
title: "[shell-mac]脚本初识-iOS开发使用xcode自动打包framework"
date: 2026-03-24 14:49:48
tags:
  - 笔记
categories:
  - "MAC知识"
from_note: true
source_note: "MAC知识/[shell-mac]脚本初识-iOS开发使用xcode自动打包framework.md"
---


最近有需求需要我们打包很多`framework`(大概10多个,另外还有5个bundle),一直手动打包费时费力,还有可能会出错, 想到可以使用`shell`脚本来打包.
<!-- more -->
[toc]

#本文知识点:
## 变量定义,查看变量内容
```
path="/Users/xxx/Library/Developer/Xcode/DerivedData"
echo "打包开始: $path"
```
## 删除文件夹
```
rm -rf "$path"
```
## 杀掉进程
```
#杀掉 Xcode
pkill Xcode
```
## 读取函数入参
```
packaging(){
#工程名称(Project的名字) 
#$1 表示第一个参数CaptureSDK
ProjectName=$1
#scheme名字 -
#$2 表示第二个参数CaptureSDKScheme
Scheme=$2
}
packaging "CaptureSDK" "CaptureSDKScheme"
```
## 查找文件

```
#其中“**”是通配符, 下边代码代表“CaptureSDK-”开头的文件
find $path -name "CaptureSDK-*"

#-maxdepth 1 代表查找深度1也就是在path目录下找文件,不在下一级目录查找
find $path -name "CaptureSDK-*" -maxdepth 1
```
## for循环遍历

```
typeArray="all
all_framework
all_bundle
phone
gimbal
galois
camera
phone_bundle
gimbal_bundle
galois_bundle
camera_bundle"


for i in ${typeArray[@]}
do
    echo '$i'
done
```
## if 语句  
```
#if [ condition ];then,condition所有两边和中括号之前必须有空格
c=1
    if [ $c == 0 ];then
        echo "不支持的参数"
        return
    fi
```
## 等待用户输入
```
read -p "请输入:" CURRENTTYPE
echo "输入了: $CURRENTTYPE"
```
## 获取系统时间 年月日时分秒
```
nowDate=$(date "+%Y-%m-%d %H:%M:%S")
echo "nowData:$nowDate"
```
## 监听control+c中止
```
#control+c 中止后当前函数返回
trap return INT
```
## 文件复制
```
cp $sourecepath $toPath
```
## 文件夹复制
```
cp -r $sourecepath $toPath
```
## 播放音频文件
   brew 安装 SoX
   
```
#终端命令
brew install SoX

#播放,在脚本里写, 播放当前目录下success.mp3
play success.mp3
```
***
以上为脚本内使用到的`知识点`,想深入学习的自己查资料吧

#目标
 - 打包framework
 
#方法
使用xcodebuild build
```
xcodebuild build \
-workspace "$XXX.xcworkspace" \
-scheme "$XXX" \
-configuration "$XXX"
```

好,大功告成! **别急这是只是1%....**

#优化
1. xcode有的时候缓存会出现奇怪的问题,所以我们要clean一下
```
xcodebuild clean \
-workspace "$XXX.xcworkspace" \
-scheme "$XXX" \
-configuration "$XXX"
```
2. framework工程使用cocopods依赖了第三方SDK,要pod update
```
pod update
```
3. 打包完毕之后,需要把framework挪动到一个文件夹,方便分发
```
cp $sourecepath $toPath
```

4. 打包完毕播放提示音
```
play success.mp3
```

1. 打包参数,打包部分framework

```
allType="
all:                    all framework and bundle;
all_framework:          all framework;
all_bundle:             all bundle;
"
typeArray="all
all_framework
all_bundle"

read -p "请输入打包文件,可选值有: $allType" CURRENTTYPE

#echo "输入了: $CURRENTTYPE"

c=0

for j in ${CURRENTTYPE[@]}

do

    for i in ${typeArray[@]}
    do
        if [ $i == $j ]; then
        c=1
        break
        fi
    done
    if [ $c == 0 ];then
        echo "不支持的参数 $j"
        return
    fi
done
```

6.  输出时间

```
nowDate=$(date "+%Y-%m-%d %H:%M:%S")
echo "nowData:$nowDate"
```
7. 打包过程中control+C中断之后停止

```
trap return INT
```
