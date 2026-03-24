/**
 * 向全站注入：皮肤样式、布局增强样式、皮肤切换脚本（head_end / body_end）
 * 资源路径使用 config.root，兼容子路径部署（如 /hexo-site/）
 */
/* global hexo */

var root = hexo.config.root || '/';
if (root !== '/' && !root.endsWith('/')) root += '/';

hexo.extend.injector.register('head_end', function () {
  return (
    '<link rel="stylesheet" href="' + root + 'css/skin.css">' +
    '<link rel="stylesheet" href="' + root + 'css/layout.css">'
  );
}, 'default');

hexo.extend.injector.register('body_end', function () {
  return '<script src="' + root + 'js/skin-switcher.js"></script>';
}, 'default');
