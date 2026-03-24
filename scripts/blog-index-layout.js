/**
 * 博客文章列表页（首页 + page/2 等分页）：为 body 添加 class，配合 layout.css
 * 隐藏列表卡片上的标签、侧栏的标签/标签云/归档（其它页面不受影响）
 */
/* global hexo */

function isBlogIndexPage(page) {
  if (!page) return false;
  var path = page.path || '';
  if (path === 'index.html' || path === '') return true;
  if (/^page\/\d+\/index\.html$/.test(path)) return true;
  return false;
}

hexo.extend.filter.register('after_render:html', function (html, data) {
  if (typeof html !== 'string' || html.indexOf('<body') === -1) return html;
  if (html.indexOf('id="sidebar"') === -1) return html;
  if (!isBlogIndexPage(data.page)) return html;
  return html.replace('<body>', '<body class="is-blog-index">');
});
