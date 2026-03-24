---
title: "SVN常见错误-svn-server-sent-unexpected-return-value-405-method-not-allowed"
date: 2026-03-24 15:00:16
tags:
  - 笔记
categories:
  - "知识分享"
from_note: true
source_note: "知识分享/SVN常见错误-svn-server-sent-unexpected-return-value-405-method-not-allowed.md"
---

错误: 
===
svn:server sent unexpected return value 405 method not allowed
<!-- more -->
全部信息:
=====
Description : An error occurred while contacting the repository.
 Suggestion : The server may be unreachable or the URL may be incorrect.
 
Technical Information

  Error : V4CommunicationError
  Exception : ZSVNCommunicationException

Causal Information


Description : Commit failed (details follow):
     Status : 175002
       File : subversion/libsvn_client/commit.c, 867

Description : Server sent unexpected return value (405 Method Not Allowed) in response to MKCOL request for 'XXX'
     Status : 175002
       File : subversion/libsvn_ra_neon/util.c, 563

报错原因:
=======
    服务器有与'XXX'同名的文件或者文件夹
解决办法:
===
    打开服务端,将同名文件删除,然后再commit
