---
title: 用 Hexo 搭建个人博客
date: 2026-03-18 12:00:00
tags:
  - Hexo
  - 教程
categories:
  - 站务
---

本站使用 [Hexo](https://hexo.io/docs/) 生成静态页面，依赖 **Node.js 20.19+**，通过 Markdown 写作。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run server` | 本地预览 |
| `npm run build` | 生成 `public/` |
| `npm run deploy` | 一键部署（需先配置 `_config.yml` 的 `deploy`） |

## 新建文章

```bash
npx hexo new "文章标题"
```

在 `source/_posts/` 下会生成带 Front-matter 的 `.md` 文件，编辑后重新生成或刷新本地服务即可。
