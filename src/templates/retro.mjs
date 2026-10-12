// レトロ版テンプレート
// 方針: 2000年前後の「個人ホームページ」を再現する。
//   ・背景タイル / 表(table)レイアウト / <font> と bgcolor 属性で色を付ける
//   ・左メニュー + 本文の2カラム、虹色の罫線、流れる文字(marquee)、ページ内リンク
//   ・flex / grid / CSS変数 / JavaScript は使わない
//   ・ただし CSS を使わない「ヴィンテージ版」ほど素のままではなく、装飾は多少あり
import { esc, dateJa, modeHref, GENERATED_NOTE } from '../lib.mjs';

// ---------- 配色 ----------
const NAVY = '#003399';
const BLUE = '#336699';
const PALE = '#E6F0FF';
const LINE = '#99BBDD';
const TEAL = '#006699'; // 小見出し用
const RAINBOW = ['#FFFF00', '#FFFFFF', '#66FFFF', '#FF99FF', '#99FF66', '#FFCC66'];

// ---------- 部品 ----------
/** タイトルを1文字ずつ色違いにする（昔のページの定番） */
const colorful = (text) =>
  [...text].map((ch, i) => `<font color="${RAINBOW[i % RAINBOW.length]}">${esc(ch)}</font>`).join('');

const rainbow = '<img src="rainbow.gif" width="100%" height="4" alt="" border="0">';

/** 紺色の見出しバー */
const head = (text, anchor, color = NAVY) =>
  `${anchor ? `<a name="${esc(anchor)}"></a>` : ''}<table width="100%" border="0" cellspacing="0" cellpadding="3"><tr><td bgcolor="${color}"><h2 class="hd"><font color="#FFFFFF">◆ ${esc(text)}</font></h2></td></tr></table>`;

/** 「項目名 | 内容」の表。rows は [ラベル(文字列), 内容(HTML文字列)] */
const kv = (rows, labelWidth = 110) =>
  `<table width="100%" border="1" bordercolor="${LINE}" cellspacing="0" cellpadding="5">${rows
    .map(
      ([k, v]) =>
        `<tr><td width="${labelWidth}" bgcolor="${PALE}" valign="top" nowrap><b>${esc(k)}</b></td><td bgcolor="#FFFFFF" valign="top">${v}</td></tr>`,
    )
    .join('')}</table>`;

/** ヘッダ行つきの枠（作品・デバイス用） */
const box = (title, sub, inner) => `
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr><td bgcolor="${BLUE}"><table width="100%" border="0" cellspacing="0" cellpadding="4"><tr><td><font color="#FFFFFF"><b>${esc(title)}</b></font>${sub ? ` <font size="2" color="#FFFF99">${esc(sub)}</font>` : ''}</td></tr></table></td></tr>
  <tr><td>${inner}</td></tr>
</table>
<br>`;

const extLink = (url, text) => `<a href="${esc(url)}" target="_blank">${esc(text ?? url)}</a>`;

// ---------- 各ページの中身 ----------
export const pages = {
  index({ profile, sections, skills, links, mode }) {
    const notice = mode.message
      ? `<table width="100%" border="2" bordercolor="#FF9900" cellspacing="0" cellpadding="6" bgcolor="#FFFFCC"><tr><td><font color="#CC3300"><b>◆お知らせ</b></font><br>${esc(mode.message)}</td></tr></table><br>`
      : '';

    const pageMenu = ['about', 'skills', 'links']
      .map((id) => `<a href="#${id}">${esc(sections[id].ja)}</a>`)
      .join(' | ');

    const skillRows = skills.map((c) => [c.title, c.items.map(esc).join(' ・ ')]);
    const linkRows = links.map((l) => [
      l.label,
      l.url ? extLink(l.url, l.handle) : `${esc(l.handle)} <font size="2">(ID)</font>`,
    ]);

    return `
      ${notice}
      <p align="center"><font size="2">[ ${pageMenu} ]</font></p>

      ${head(sections.about.ja, 'about')}
      <br>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td width="96" valign="top"><img src="../favicon.png" width="80" height="80" border="2" alt="${esc(profile.name)} のアイコン"></td>
          <td valign="top">
            <p><font size="4"><b>${esc(profile.name)}</b></font><br><font size="2" color="#666666">${esc(profile.subtitle)}</font></p>
            <p>${esc(profile.intro)}</p>
          </td>
        </tr>
      </table>
      ${profile.about.map((t) => `<p>${esc(t)}</p>`).join('\n      ')}
      ${rainbow}
      <br>

      ${head(sections.skills.ja, 'skills')}
      <br>
      <p><font size="2">${esc(sections.skills.lead ?? '')}</font></p>
      ${kv(skillRows, 130)}
      <br>
      ${rainbow}
      <br>

      ${head(sections.links.ja, 'links')}
      <br>
      ${kv(linkRows, 150)}
      <p align="right"><font size="2"><a href="#top">▲ページの先頭へ</a></font></p>`;
  },

  works({ page, works, coming_soon }) {
    const boxes = works
      .map((w, i) => {
        const links = (w.links ?? []).map((l) => `${esc(l.label)}: ${extLink(l.url)}`).join('<br>');
        const rows = [['概要', esc(w.desc)]];
        if (w.tech?.length) rows.push(['使用技術', w.tech.map(esc).join(' / ')]);
        if (w.background) rows.push(['背景・仕組み', esc(w.background)]);
        if (links) rows.push(['リンク', links]);
        return box(`No.${i + 1}　${w.title}`, '', kv(rows, 110));
      })
      .join('');

    const soon = coming_soon
      ? `<table width="100%" border="2" bordercolor="#FF9900" cellspacing="0" cellpadding="8" bgcolor="#FFFFCC"><tr><td><font color="#CC3300"><b>UNDER CONSTRUCTION</b></font><br>${esc(coming_soon.desc)}</td></tr></table>`
      : '';

    return `
      ${head(page.heading_ja)}
      <br>
      <p>${esc(page.lead ?? '')}</p>
      ${boxes}
      ${soon}`;
  },

  devices({ page, categories }) {
    const sections = categories
      .map((cat) => {
        let inner;
        if (cat.kind === 'simple') {
          inner = kv(cat.items.map((it) => [it.name, esc(it.desc)]), 170);
        } else {
          inner = cat.items
            .map((it) => {
              const rows = [];
              if (it.desc) rows.push(['用途', esc(it.desc)]);
              for (const [k, v] of Object.entries(it.specs ?? {})) rows.push([k, esc(v)]);
              return box(it.name, it.role ? `[${it.role}]` : '', kv(rows, 110));
            })
            .join('');
        }
        return `${head(cat.title_ja, undefined, TEAL)}<br>${inner}${cat.kind === 'simple' ? '<br>' : ''}`;
      })
      .join('');
    return `
      ${head(page.heading_ja)}
      <br>
      <p>${esc(page.lead ?? '')}</p>
      ${sections}`;
  },
};

// ---------- 共通レイアウト ----------
export function layout(ctx, content) {
  const { site, nav, page, modes, mode } = ctx;
  const domain = `${site.name}${site.tld}`;

  const menu = nav
    .map((n) =>
      n.id === page.id
        ? `<b>▶ ${esc(n.label_ja)}</b><br><font size="1" color="#666666">&nbsp;&nbsp;&nbsp;${esc(n.label.toUpperCase())}</font>`
        : `■ <a href="${esc(n.file)}">${esc(n.label_ja)}</a><br><font size="1" color="#666666">&nbsp;&nbsp;&nbsp;${esc(n.label.toUpperCase())}</font>`,
    )
    .join('<br>\n          ');

  const modeMenu = modes
    .map((m) =>
      m.id === mode.id
        ? `<b>● ${esc(m.label_ja)}</b>`
        : `○ <a href="${esc(modeHref(mode, m, page.file))}">${esc(m.label_ja)}</a>`,
    )
    .join('<br>\n          ');

  const marquee = mode.marquee
    ? `<marquee class="marq" bgcolor="#000000" scrollamount="3" scrolldelay="60"><font color="#00FF00">${esc(mode.marquee)}</font></marquee>`
    : '';

  return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<!-- ${GENERATED_NOTE} -->
<html lang="ja">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(domain)} - ${esc(page.label_ja)}</title>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body background="bg.gif" bgcolor="#CCE5FF" text="#000000" link="#0000CC" vlink="#663399" alink="#FF0000">
<a name="top"></a>
<center>
<table class="wrap" width="720" border="0" cellspacing="0" cellpadding="0">
<tr><td>

  <!-- ===== タイトル ===== -->
  <table width="100%" border="4" bordercolor="${NAVY}" cellspacing="0" cellpadding="10" bgcolor="${NAVY}">
    <tr>
      <td align="center">
        <font size="7"><b>${colorful(domain)}</b></font><br>
        <font size="2" color="#FFFFFF">- ${esc(ctx.profile.subtitle)} -</font>
      </td>
    </tr>
  </table>
  ${marquee}
  <br>

  <!-- ===== 左メニュー + 本文 ===== -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td width="150" valign="top">

        <table width="100%" border="2" bordercolor="${BLUE}" cellspacing="0" cellpadding="6" bgcolor="${PALE}">
          <tr><td bgcolor="${BLUE}"><font size="2" color="#FFFFFF"><b>MENU</b></font></td></tr>
          <tr><td>
          ${menu}
          </td></tr>
        </table>
        <br>
        <table width="100%" border="2" bordercolor="${BLUE}" cellspacing="0" cellpadding="6" bgcolor="${PALE}">
          <tr><td bgcolor="${BLUE}"><font size="2" color="#FFFFFF"><b>DISPLAY MODE</b></font></td></tr>
          <tr><td><font size="2">
          ${modeMenu}
          </font></td></tr>
        </table>
        <br>
        <table width="100%" border="2" bordercolor="${BLUE}" cellspacing="0" cellpadding="6" bgcolor="#FFFFFF">
          <tr><td align="center"><font size="2">最終更新日<br><b>${esc(dateJa(site.updated))}</b></font></td></tr>
        </table>

      </td>
      <td width="12">&nbsp;</td>
      <td valign="top">

        <table width="100%" border="3" bordercolor="${BLUE}" cellspacing="0" cellpadding="12" bgcolor="#FFFFFF">
          <tr><td valign="top">${content}
          </td></tr>
        </table>

      </td>
    </tr>
  </table>

  <br>
  <p align="center"><font size="2" color="#003366">Copyright (C) ${esc(site.copyright_year)} ${esc(domain)} All Rights Reserved.<br>800x600 以上の画面でご覧ください</font></p>

</td></tr>
</table>
</center>
</body>
</html>
`;
}
