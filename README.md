# hexo-site

基于 [Hexo](https://hexo.io/) 的个人博客源码。

- **线上站点**：<https://liqiang184.github.io/hexo-site/>
- **仓库**：<https://github.com/LIQIANG184/hexo-site>

## 常用命令

```bash
npm install          # 安装依赖
npm run sync-notes   # 将 note/ 下笔记同步为文章（发布前执行）
npm run server       # 本地预览
npm run build        # 生成 public/
npm run deploy       # 部署到 gh-pages（使用 SSH，需本机已配置 GitHub 公钥）
```

部署前请在 GitHub 仓库 **Settings → Pages** 中选择分支 **`gh-pages`**。
