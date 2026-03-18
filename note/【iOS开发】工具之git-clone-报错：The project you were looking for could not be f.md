错误: remote: The project you were looking for could not be found.
fatal: repository 'http://XXXX.git/' not found

解决方法：

git clone http://username@XXXX.git/

把username 换成自己的用户名   之后会提醒你输入密码

原因：

之前登录过其他的账号，这个账号没有此路径权限
