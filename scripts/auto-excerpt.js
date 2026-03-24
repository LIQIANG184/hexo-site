/**
 * 无 <!-- more -->、无 front-matter excerpt 时，从正文生成纯文本摘要供列表页使用。
 * 单篇文章仍用完整 post.content 渲染（主题 index=false 时走全文）。
 */
/* global hexo */

const { stripHTML, escapeHTML } = require('hexo-util');

var MAX_LEN = 200;

hexo.extend.filter.register(
  'after_post_render',
  function (data) {
    var ex = data.excerpt;
    if (ex != null && String(ex).trim() !== '') return data;
    var content = data.content || '';
    if (!content) return data;
    var plain = stripHTML(content).trim().replace(/\s+/g, ' ');
    if (!plain) return data;
    var text =
      plain.length > MAX_LEN ? plain.slice(0, MAX_LEN) + '…' : plain;
    data.excerpt =
      '<p class="article-excerpt-auto">' + escapeHTML(text) + '</p>';
    return data;
  },
  20
);
