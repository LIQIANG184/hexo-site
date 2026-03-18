---
title: "iOS开发--BUG定位,符号化crash地址"
date: 2026-03-18 18:30:13
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: "iOS开发--BUG定位,符号化crash地址.md"
---

在umeng或者其他的BUG收集的第三方里边大多数的BUG是能够通过crash前的调用信息,定位到具体的方法,从而想办法解决,但是有些BUG信息量很少,只有一个内存地址:

例如: 

      appname                            0x97525 appname + 615717 

下面本文将介绍通过内存地址,定位BUG文件,调用方法

步骤:

1 检查log中的dSYM UUID与本地的dYSM文件是否匹配
方法: 打开终端(不知道终端的请略过此文),输入命令

     $1 cd /Users/username/Library/Developer/Xcode/Archives/ xx.xcarchive/dSYMs  
     $2 dwarfdump --uuid appname.app.dSYM  
注:  $1里cd 后的地址是打包时生成的xcode自动生成的本地文件的地址
找到此地址的方法打开: xcode->Window->Organizer,然后找到对应的release包,右键 Show in Finder

![Paste_Image.png](/images/note/74d27b004018698c9cfa5f0d94a8f5d9.webp)

会看到扩展名为.xcarchive的文件,这个文件路径(最好用拖文件的方式获取文件路径)后边拼接dSYMs即为这个地址.

![Paste_Image.png](/images/note/617702c4e8b31be8ad6170e096752139.webp)

$2里dwarfdump --uuid appname.app.dSYM的 appname 替换为你的app的包名就行,别的不用动
输出结果: 
UUID: 9F0AEFA6-4349-30AF-8420-BCEE739DA0B4 (armv7) appname.app.dSYM/Contents/Resources/DWARF/appname  
UUID: 365EF56E-D598-3B94-AD36-BFA13772A4E3 (armv7s) appname.app.dSYM/Contents/Resources/DWARF/appname  
这两个匹配后继续第二步

2  继续在终端输入命令 
dwarfdump --arch=armv7 --lookup 0x97525  /Users/username/Library/Developer/Xcode/Archives/2013-08-30/appname\xx.xcarchive/dSYMs/appname.app.dSYM/Contents/Resources/DWARF/appname  
注: 在$1步的路径后继续拼接 /appname.app.dSYM/Contents/Resources/DWARF/appname 
就可以 其中的 appname 替换成自己的包名(也可以自己找到DWARF下的appname文件拖到终端)
输出结果为:


    Looking up address: 0x0000000000097525 in .debug_info... found!  
  
    0x00359c67: Compile Unit: length = 0x000066f1  version =     0x0002  abbr_offset = 0x00000000  addr_size = 0x04  (next CU at 0x0036035c)  
  
    0x00359c72: TAG_compile_unit [1] *  
         AT_producer( "Apple LLVM version 4.2 (clang-425.0.28) (based on LLVM 3.2svn)" )  
         AT_language( DW_LANG_ObjC )  
         AT_name( "xxx/EGOImageView.m" )  
         AT_low_pc( 0x0009710c )  
         AT_stmt_list( 0x000655c1 )  
         AT_comp_dir( "xxx" )  
         AT_APPLE_optimized( 0x01 )  
         AT_APPLE_major_runtime_vers( 0x02 )  
  
    0x00359e57:     TAG_subprogram [10] *  
             AT_name( "-[EGOImageView imageLoaderDidFailToLoad:]" )  
             AT_decl_file( "xxx/EGOImageView.m" )  
             AT_decl_line( 96 )  
             AT_prototyped( 0x01 )  
             AT_APPLE_isa( 0x01 )  
             AT_low_pc( 0x00097490 )  
             AT_high_pc( 0x00097572 )  
             AT_frame_base( r7 )  
             AT_object_pointer( {0x00359e6e} )  
    Line table dir : 'xxx'  
    Line table file: 'EGOImageView.m' line 99, column 2 with start address 0x00000000000974fe  
  
    Looking up address: 0x0000000000097525 in .debug_frame... found!  
  
    0x0000c620: FDE  
    length: 0x0000000c  
    CIE_pointer: 0x00000000  
    start_addr: 0x00097490 -[EGOImageView imageLoaderDidFailToLoad:]  
    range_size: 0x000000e2 (end_addr = 0x00097572)  
    Instructions: 0x00097490: CFA=4294967295+4294967295  
信息中的AT_name( "xxx/EGOImageView.m" )  就是crash文件,
 start_addr:就是crash方法
此文结束
