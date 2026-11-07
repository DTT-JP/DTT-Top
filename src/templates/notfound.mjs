// 404 ページ（Cloudflare Pages が「存在しない URL」に対して返す）
//
// Cloudflare Pages は「アクセスされた URL に一番近い階層の 404.html」を使います。
//   /example.txt, /a/b/c   → /404.html      （通常版）
//   /s/xxx, /s/a/b         → /s/404.html    （レトロ版）
//   /ss/xxx, /ss/a/b       → /ss/404.html   （ヴィンテージ版）
//
// 重要: 404.html は「どんな深さの URL でも」同じファイルが表示されます。
// そのため CSS・画像・リンクはすべて「/ から始まる絶対パス」で書いています
// （相対パスだと、深い URL で CSS や画像が読めず表示が崩れます）。

import { esc } from '../lib.mjs';

// ---------- 通常版（CSS は埋め込み。外部ファイルに依存しない） ----------
export function modern({ site }) {
  const title = `404 Not Found | ${site.name}${site.tld}`;
  return `<!DOCTYPE html>
<!-- このファイルは自動生成されています。直接編集せず content/ か src/ を編集してください。 -->
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="robots" content="noindex">
  <meta name="color-scheme" content="light dark">
  <link rel="icon" type="image/png" href="/${esc(site.favicon)}">
  <style>
    :root { --bg:#f4f6fb; --text:#0e1626; --muted:#566178; --accent:#1d5fe8; --accent-ink:#fff; --line:#c6d0e0; }
    @media (prefers-color-scheme: dark) {
      :root { --bg:#080c13; --text:#e7ebf3; --muted:#93a0b6; --accent:#6aa2ff; --accent-ink:#06142e; --line:rgba(148,163,184,.3); }
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; }
    body {
      display: flex; align-items: center; justify-content: center; padding: 24px;
      background: var(--bg); color: var(--text); text-align: center;
      font-family: 'Inter','Noto Sans JP','Hiragino Sans','Yu Gothic UI',Meiryo,system-ui,sans-serif;
      line-height: 1.7;
    }
    main { max-width: 480px; }
    .code { margin: 0; font-size: clamp(64px, 20vw, 112px); font-weight: 800; letter-spacing: .02em; color: var(--accent); line-height: 1.1; }
    h1 { margin: 8px 0 12px; font-size: 20px; }
    p { margin: 0 0 24px; color: var(--muted); }
    a.btn { display: inline-block; padding: 10px 22px; border-radius: 999px; background: var(--accent); color: var(--accent-ink); font-weight: 600; text-decoration: none; }
    a.btn:focus-visible { outline: 2px solid var(--text); outline-offset: 3px; }
    .brand { margin-top: 32px; font-size: 13px; color: var(--muted); border-top: 1px solid var(--line); padding-top: 16px; }
  </style>
</head>
<body>
  <main>
    <p class="code">404</p>
    <h1>ページが見つかりません</h1>
    <p>お探しのページは存在しないか、移動した可能性があります。</p>
    <a class="btn" href="/">トップページへ戻る</a>
    <div class="brand">${esc(site.name)}${esc(site.tld)}</div>
  </main>
</body>
</html>
`;
}

// ---------- レトロ版（table + 属性 + 最小限の CSS。flex/grid/JS は使わない） ----------
export function retro({ site, modes }) {
  const dir = '/' + (modes.find((m) => m.id === 'retro')?.dir ?? 's');
  const vdir = '/' + (modes.find((m) => m.id === 'vintage')?.dir ?? 'ss');
  return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<!-- このファイルは自動生成されています。直接編集せず content/ か src/ を編集してください。 -->
<html lang="ja">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>404 Not Found - ${esc(site.name)}${esc(site.tld)}</title>
<link rel="stylesheet" type="text/css" href="${dir}/style.css">
</head>
<body background="${dir}/bg.gif" bgcolor="#CCE5FF" text="#000000" link="#0000CC" vlink="#663399" alink="#FF0000">
<center>
<table class="wrap" width="560" border="0" cellspacing="0" cellpadding="0">
<tr><td>
  <table width="100%" border="4" bordercolor="#003399" cellspacing="0" cellpadding="10" bgcolor="#003399">
    <tr><td align="center"><font size="7"><b><font color="#FFFF00">4</font><font color="#FFFFFF">0</font><font color="#66FFFF">4</font></b></font><br><font size="2" color="#FFFFFF">- Not Found -</font></td></tr>
  </table>
  <br>
  <table width="100%" border="2" bordercolor="#FF9900" cellspacing="0" cellpadding="8" bgcolor="#FFFFCC">
    <tr><td><font color="#CC3300"><b>◆ページが見つかりません</b></font><br>
    お探しのページは存在しないか、移動した可能性があります。<br>
    アドレスをもう一度お確かめください。</td></tr>
  </table>
  <br>
  <img src="${dir}/rainbow.gif" width="100%" height="4" alt="" border="0">
  <br>
  <p align="center">
    ■ <a href="${dir}/index.html">トップページへ戻る</a><br>
    ○ <a href="/">現代版</a> ／ <a href="${vdir}/index.html">ヴィンテージ版</a>
  </p>
  <p align="center"><font size="2" color="#666666">${esc(site.name)}${esc(site.tld)}</font></p>
</td></tr>
</table>
</center>
</body>
</html>
`;
}

// ---------- ヴィンテージ版（CSS・画像・JS なし。古いタグだけ） ----------
export function vintage({ site, modes }) {
  const dir = '/' + (modes.find((m) => m.id === 'vintage')?.dir ?? 'ss');
  const rdir = '/' + (modes.find((m) => m.id === 'retro')?.dir ?? 's');
  return `<!-- このファイルは自動生成されています。直接編集せず content/ か src/ を編集してください。 -->
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>404 Not Found - ${esc(site.name)}${esc(site.tld)}</title>
</head>
<body bgcolor="#C0C0C0" text="#000000" link="#0000FF" vlink="#800080" alink="#FF0000">

<center>
    <h1>404 Not Found</h1>
    <hr size="4" width="80%">
    <p>
        ページが見つかりません。<br>
        お探しのページは存在しないか、移動した可能性があります。
    </p>
    <p>
        <a href="${dir}/index.html">トップページへ戻る</a>
    </p>
    <hr size="4" width="80%">
    <p>
        <a href="/">現代版</a> | <a href="${rdir}/index.html">レトロ版</a>
    </p>
    <p>
        <font size="2">${esc(site.name)}${esc(site.tld)}</font>
    </p>
</center>

</body>
</html>
`;
}
