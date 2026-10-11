/* このファイルは自動生成されています。直接編集せず content/ か src/ を編集してください。 元: src/assets/modern/main.js */
// 通常版の動き: テーマ切り替え / プリローダー / IDのコピー
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- テーマ ----------
  // 初期テーマは <head> のインラインスクリプトで設定済み。ここでは切り替えだけ行う。
  var osDark = matchMedia('(prefers-color-scheme: dark)');
  var meta = document.querySelector('meta[name="theme-color"]');

  function readSaved() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  function applyTheme(theme, save) {
    root.setAttribute('data-theme', theme);
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#080c13' : '#f4f6fb');
    if (save) {
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }
  }

  applyTheme(root.getAttribute('data-theme') || 'dark', false);

  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  }

  // 保存された設定が無いときだけ、OSの設定変更に追従する
  osDark.addEventListener('change', function (e) {
    if (!readSaved()) applyTheme(e.matches ? 'dark' : 'light', false);
  });

  // ---------- プリローダー / 登場アニメ ----------
  var preloader = document.getElementById('preloader');
  var started = false;

  function start() {
    if (started) return;
    started = true;
    var skip = root.classList.contains('skip-preloader') || !preloader || reduceMotion;
    if (skip) {
      if (preloader) preloader.style.display = 'none';
      root.classList.add('loaded');
    } else {
      setTimeout(function () {
        preloader.classList.add('fade-out');
        root.classList.add('loaded');
        setTimeout(function () { preloader.style.display = 'none'; }, 800);
      }, 500);
    }
    try { sessionStorage.setItem('site_entered', 'true'); } catch (e) {}
  }

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
  setTimeout(start, 2000); // 読み込みが遅い時の保険

  // ---------- ID のコピー（data-copy を持つボタン） ----------
  var toast = document.getElementById('toast');
  var toastTimer;

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var value = btn.getAttribute('data-copy');
    copyText(value).then(
      function () { showToast(value + ' をコピーしました'); },
      function () { showToast('ID: ' + value); }
    );
  });
})();
