    find . | grep ".a" | grep -v ".app" | xargs grep [API] >[地址]

第一个括号替换成你要查找的私有API，

第二个括号是查找到之后写入的文件路径

例如，
查找 私有API：prefs:root= 
写入路径：/Users/zhangxiaohan/Desktop/ttt.txt

 生成的命令如下：
    find . | grep ".a" | grep -v ".app" | xargs grep prefs:root= >/Users/xx/Desktop/ttt.txt
