reset与revert的区别

自己的理解：
git revert  XXX ：意思是将XXX版本的改动放弃，并且版本号+1；
git reset XXX：意思是将代码重置到XXX版本，版本号不会变；

# 引用：
    git revert是用一次新的commit来回滚之前的commit，git reset是直接删除指定的commit。
    在回滚这一操作上看，效果差不多。但是在日后继续merge以前的老版本时有区别。因为git revert是用一次逆向的commit“中和”之前的提交，因此日后合并老的branch时，导致这部分改变不会再次出现，但是git reset是之间把某些commit在某个branch上删除，因而和老的branch再次merge时，这些被回滚的commit应该还会被引入。
    git reset 是把HEAD向后移动了一下，而git revert是HEAD继续前进，只是新的commit的内容和要revert的内容正好相反，能够抵消要被revert的内容。

作者：流着万条永远的河
链接：https://www.jianshu.com/p/0e1fe709dd97
来源：简书
