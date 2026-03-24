当项目打包比较频繁的时候，打包的工作会占用不小的工作量，这个时候自动化打包工具就成为了必要。开发人员只需要关心代码，不必关心打包过程。
<!-- more -->
下面进行Jenkins实时自动打包演练过程：

1 安装 Jenkins，这里使用brew安装：

>brew install jenkins

提示有脚本需要sudo权限,按照提示添加sudo执行 错误提示中的命令行，继续执行brew install jenkins。

2 查找jenkins.war

>mdfind -name jenkins.war

结果：
>bogon:~ mdfind -name jenkins.war
/usr/local/Cellar/jenkins/2.220/libexec/jenkins.war

3 绑定jenkins.war 端口号
 >java -jar /usr/local/Cellar/jenkins/2.220/libexec/jenkins.war --httpPort=8080

报错：

> 9月 27, 2020 11:40:54 上午 Main verifyJavaVersion
严重: Running with Java class version 57 which is not in the list of supported versions: [52, 55]. Run with the --enable-future-java flag to enable such behavior. See https://jenkins.io/redirect/java-support/
java.lang.UnsupportedClassVersionError: 57.0
	at Main.verifyJavaVersion(Main.java:174)
	at Main.main(Main.java:142)
Jenkins requires Java versions [8, 11] but you are running with Java 13 from /Library/Java/JavaVirtualMachines/jdk-13.jdk/Contents/Home
java.lang.UnsupportedClassVersionError: 57.0
	at Main.verifyJavaVersion(Main.java:174)
	at Main.main(Main.java:142)

原因:java版本和jenkins要求不一致
解决办法：更新java版本
解决之后再次执行： 
>java -jar /usr/local/Cellar/jenkins/2.220/libexec/jenkins.war --httpPort=8080
