// レトロ版（IE4+）テンプレート
// 方針: Windows 98 / IE4 時代の見た目。table レイアウト + CSS1 の範囲だけを使う。
//       （flex / grid / CSS変数は使わない）
import { esc, host, modeHref, GENERATED_NOTE } from '../lib.mjs';

const btn = (href, label, extra = '') =>
  `<a href="${esc(href)}" class="btn98${extra}">${label}</a>`;

const extBtn = (href, label) =>
  `<a href="${esc(href)}" target="_blank" class="btn98">${esc(label)}</a>`;

/** 見出しバー（紺地に白文字） */
const bar = (text) => `<h2 class="bar">${esc(text)}</h2>`;

/** 「ヘッダー行 + 本文行」の枠（プロジェクト/サービス/デバイスで共通） */
const item = (title, body) => `
<table class="item" width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr><td class="item-h"><b>${esc(title)}</b></td></tr>
  <tr><td class="item-b">${body}</td></tr>
</table>
<div class="gap"></div>`;

export const pages = {
  index({ mode, profile }) {
    const paras = mode.about.map((t) => `<p>${esc(t)}</p>`).join('\n      ');
    return `
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td width="84" valign="top"><img src="../favicon.png" width="72" height="72" border="0" alt="${esc(profile.name)} のアイコン" class="sunk-img"></td>
          <td valign="top">
            <h1 class="pagetitle">${esc(mode.about_heading)}</h1>
            <p><b>${esc(profile.name)}</b> - ${esc(profile.subtitle)}</p>
          </td>
        </tr>
      </table>
      ${paras}`;
  },

  projects({ page, projects }) {
    const body = projects
      .map((p) =>
        item(
          p.title,
          `<p>${esc(p.desc)}</p>
    <p>${(p.links ?? []).map((l) => extBtn(l.url, l.label)).join(' ')}</p>
    <p class="small">${(p.links ?? []).map((l) => `${esc(l.label)}: <a href="${esc(l.url)}" target="_blank">${esc(l.url)}</a>`).join('<br>')}</p>`,
        ),
      )
      .join('');
    return `<h1 class="pagetitle">${esc(page.heading_ja)}</h1>${body}`;
  },

  services({ page, services }) {
    const body = services
      .map((s) =>
        item(
          s.title,
          `<p>${esc(s.desc)}</p>
    <p>${extBtn(s.url, 'サービスを開く')} <span class="small">&nbsp;<a href="${esc(s.url)}" target="_blank">${esc(host(s.url))}</a></span></p>`,
        ),
      )
      .join('');
    return `<h1 class="pagetitle">${esc(page.heading_ja)}</h1>${body}`;
  },

  devices({ page, categories }) {
    const sections = categories
      .map((cat) => {
        let inner;
        if (cat.kind === 'simple') {
          const rows = cat.items
            .map((it) => `<tr><td class="k" width="170"><b>${esc(it.name)}</b></td><td class="v">${esc(it.desc)}</td></tr>`)
            .join('\n          ');
          inner = `
      <table class="grid" width="100%" border="0" cellspacing="0" cellpadding="6">
        <tr><td class="th">名前</td><td class="th">内容</td></tr>
          ${rows}
      </table>
      <div class="gap"></div>`;
        } else {
          inner = cat.items
            .map((it) => {
              const rows = Object.entries(it.specs)
                .map(([k, v]) => `<tr><td class="k" width="110">${esc(k)}</td><td class="v">${esc(v)}</td></tr>`)
                .join('\n          ');
              return item(
                it.name,
                `<table class="grid" width="100%" border="0" cellspacing="0" cellpadding="4">
          ${rows}
        </table>`,
              );
            })
            .join('');
        }
        return `${bar(cat.title_ja)}${inner}`;
      })
      .join('');
    return `<h1 class="pagetitle">${esc(page.heading_ja)}</h1>${sections}`;
  },

  links({ page, links }) {
    const rows = links
      .map(
        (l) =>
          `<tr><td class="k" width="150"><b>${esc(l.label)}</b></td><td class="v">${
            l.url ? `<a href="${esc(l.url)}" target="_blank">${esc(l.handle)}</a>` : `${esc(l.handle)} <span class="small">(ID)</span>`
          }</td></tr>`,
      )
      .join('\n          ');
    return `<h1 class="pagetitle">${esc(page.heading_ja)}</h1>
      <table class="grid" width="100%" border="0" cellspacing="0" cellpadding="8">
          ${rows}
      </table>`;
  },
};

export function layout(ctx, content) {
  const { site, nav, page, modes, mode } = ctx;
  const domain = `${site.name}${site.tld}`;
  const url = `http://${domain.toLowerCase()}/${mode.dir}/${page.file}`;

  const navHtml = nav
    .map((n) => btn(n.file, esc(`${n.label.toUpperCase()} (${n.label_ja})`), n.id === page.id ? ' btn98-on' : ''))
    .join('\n          ');

  const modeButtons = modes
    .map((m) =>
      m.id === mode.id
        ? `<span class="btn98 btn98-on">${esc(m.label_ja)}</span>`
        : btn(modeHref(mode, m, page.file), esc(m.label_ja)),
    )
    .join(' ');

  const marquee = page.id === 'index' && mode.marquee
    ? `\n      <marquee class="marq" scrollamount="3" scrolldelay="60">${esc(mode.marquee)}</marquee>`
    : '';

  return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<!-- ${GENERATED_NOTE} -->
<html lang="ja">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(domain)} - ${esc(page.label_ja)} (${esc(mode.period)})</title>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body bgcolor="#008080" text="#000000" link="#0000FF" vlink="#800080" alink="#FF0000">
<center>

<!-- ===== ウィンドウ ===== -->
<table class="win" width="760" border="0" cellspacing="0" cellpadding="0">
<tr><td class="win-in">

  <!-- タイトルバー -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td class="titlebar" width="100%"><img src="../${esc(site.favicon)}" width="16" height="16" border="0" align="absmiddle" alt=""> ${esc(domain)} - ${esc(page.label_ja)} - ${esc(mode.window_title ?? '')}</td>
      <td class="titlebar" nowrap align="right"><span class="tbtn">_</span><span class="tbtn">&#9633;</span><span class="tbtn">&times;</span></td>
    </tr>
  </table>

  <!-- ツールバー（ナビゲーション） -->
  <table class="bar98" width="100%" border="0" cellspacing="0" cellpadding="4">
    <tr>
      <td nowrap>
          ${navHtml}
      </td>
    </tr>
  </table>

  <!-- アドレスバー -->
  <table class="bar98" width="100%" border="0" cellspacing="0" cellpadding="3">
    <tr>
      <td nowrap class="addr-label">アドレス(<u>D</u>)</td>
      <td width="100%"><div class="addr">${esc(url)}</div></td>
    </tr>
  </table>

  <!-- ページ本体 -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td class="content">${marquee}
      ${content}

      <hr size="2">
      <p align="center" class="small">[ 表示モード切り替え ]</p>
      <p align="center">${modeButtons}</p>
      </td>
    </tr>
  </table>

  <!-- ステータスバー -->
  <table width="100%" border="0" cellspacing="2" cellpadding="0">
    <tr>
      <td class="status" width="100%">&nbsp;ページが表示されました</td>
      <td class="status" nowrap>&nbsp;インターネット&nbsp;</td>
    </tr>
  </table>

</td></tr>
</table>

<p class="foot">Copyright (C) ${esc(site.copyright_year)} ${esc(domain)}<br>Best viewed with Internet Explorer 4.0 or higher - 800x600</p>

</center>
</body>
</html>
`;
}
