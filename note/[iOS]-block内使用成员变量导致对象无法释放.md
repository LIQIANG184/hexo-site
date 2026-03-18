
遇到一个对象无法释放的问题，最后排查是因为一个Bool类型的成员变量的原因，已解决！

问题截图：
![声明.png](/images/note/4e875b89d24aef7316ccf62de213d933.webp)

![block.png](/images/note/2c0bc623d8e427b00b6077463caae218.webp)

解决方案：
1 修改声明为：
![image.png](/images/note/84660fcf5d13905e91064536880b4ef8.webp)
2 block内改为点方法
![block.png](/images/note/c6c53e5e009bba513b74f1dc8cf4c27f.webp)
