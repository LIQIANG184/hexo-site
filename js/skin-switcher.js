/**
 * 皮肤切换：右下角浮钮展开可选皮肤，选择后写入 localStorage 并给 html 加 .skin-xxx
 * 新增皮肤：在 SKINS 里加一项，并在 skin.css 里增加对应 .skin-xxx 样式即可
 */
(function () {
  var STORAGE_KEY = 'hexo-skin';

  var SKINS = [
    { id: 'default', name: '浅色', icon: '☀' },
    { id: 'dark', name: '深色', icon: '🌙' },
    { id: 'sepia', name: '护眼', icon: '📜' }
  ];

  function getStored() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s && SKINS.some(function (k) { return k.id === s; })) return s;
    } catch (e) {}
    return 'default';
  }

  function apply(skinId) {
    var html = document.documentElement;
    SKINS.forEach(function (s) {
      html.classList.remove('skin-' + s.id);
    });
    html.classList.add('skin-' + skinId);
    try { localStorage.setItem(STORAGE_KEY, skinId); } catch (e) {}
  }

  function buildWidget() {
    var wrap = document.createElement('div');
    wrap.id = 'skin-switcher-wrap';
    wrap.innerHTML =
      '<button type="button" id="skin-switcher-btn" aria-label="切换皮肤" title="切换皮肤">🎨</button>' +
      '<div id="skin-switcher-panel" role="listbox" aria-label="选择皮肤" hidden>' +
      SKINS.map(function (s) {
        return '<button type="button" class="skin-opt" role="option" data-skin="' + s.id + '" title="' + s.name + '">' + s.icon + ' ' + s.name + '</button>';
      }).join('') +
      '</div>';

    var style = document.createElement('style');
    style.textContent =
      '#skin-switcher-wrap{position:fixed;bottom:24px;right:24px;z-index:9999;font-size:14px;}' +
      '#skin-switcher-btn{width:44px;height:44px;border-radius:50%;border:1px solid rgba(0,0,0,.1);background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.15);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s;}' +
      '#skin-switcher-btn:hover{transform:scale(1.05);}' +
      'html.skin-dark #skin-switcher-btn{background:#252525;border-color:#444;}' +
      'html.skin-sepia #skin-switcher-btn{background:#ebe4d4;border-color:#e0d6c2;}' +
      '#skin-switcher-panel{position:absolute;bottom:100%;right:0;margin-bottom:8px;padding:6px;background:#fff;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.15);display:flex;flex-direction:column;gap:2px;}' +
      '#skin-switcher-panel[hidden]{display:none !important;}' +
      'html.skin-dark #skin-switcher-panel{background:#252525;}' +
      'html.skin-sepia #skin-switcher-panel{background:#faf6ed;}' +
      '.skin-opt{padding:8px 12px;border:none;border-radius:6px;background:transparent;cursor:pointer;text-align:left;white-space:nowrap;color:#333;}' +
      '.skin-opt:hover{background:rgba(0,0,0,.06);}' +
      'html.skin-dark .skin-opt{color:#c9c9c9;}' +
      'html.skin-dark .skin-opt:hover{background:rgba(255,255,255,.08);}' +
      'html.skin-sepia .skin-opt{color:#5c4b37;}' +
      'html.skin-sepia .skin-opt:hover{background:rgba(0,0,0,.06);}';

    document.head.appendChild(style);
    document.body.appendChild(wrap);

    var btn = document.getElementById('skin-switcher-btn');
    var panel = document.getElementById('skin-switcher-panel');

    btn.addEventListener('click', function () {
      panel.hidden = !panel.hidden;
    });

    panel.querySelectorAll('.skin-opt').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = this.getAttribute('data-skin');
        apply(id);
        panel.hidden = true;
      });
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) panel.hidden = true;
    });
  }

  apply(getStored());
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
