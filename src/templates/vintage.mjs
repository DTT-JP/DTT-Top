// ヴィンテージ版（Pre-IE4）テンプレート
// 方針: CSS も JavaScript も使わない。HTML 2.0〜3.2 で使えるタグだけで組む。
//       （Netscape Navigator 2.0 / Mosaic でも読めるように）
import { esc, modeHref, GENERATED_NOTE } from '../lib.mjs';

const h2u = (text, anchor) =>
  `${anchor ? `<a name="${esc(anchor)}"></a>` : ''}<h2><u>${esc(text)}</u></h2>`;

export const pages = {
  index({ profile, sections, skills, links, mode }) {
    const menu = ['about', 'skills', 'links']
      .map((id) => `<a href="#${id}">${esc(sections[id].ja)}</a>`)
      .join(' | ');

    const skillLis = skills
      .map((c) => `    <li><b>${esc(c.title)}:</b> ${c.items.map(esc).join(', ')}</li>`)
      .join('\n');

    const linkLis = links
      .map(
        (l) =>
          `    <li><b>${esc(l.label)}</b>: ${l.url ? `<a href="${esc(l.url)}" target="_blank">${esc(l.handle)}</a>` : esc(l.handle)}</li>`,
      )
      .join('\n');

    return `<p align="center"><font size="2">[ ${menu} ]</font></p>

${h2u(sections.about.ja, 'about')}
<p>
    <b>${esc(profile.name)}</b> - ${esc(profile.subtitle)}
</p>
<p>
    ${esc(profile.intro)}
</p>
${profile.about.map((t) => `<p>\n    ${esc(t)}\n</p>`).join('\n')}
${mode.message ? `<p>\n    <i>${esc(mode.message)}</i>\n</p>` : ''}

${h2u(sections.skills.ja, 'skills')}
<p>
    ${esc(sections.skills.lead ?? '')}
</p>
<ul>
${skillLis}
</ul>

${h2u(sections.links.ja, 'links')}
<ul>
${linkLis}
</ul>
`;
  },

  works({ works, coming_soon }) {
    const body = works
      .map((w) => {
        const items = [];
        if (w.tech?.length) items.push(`    <li>使用技術: ${w.tech.map(esc).join(', ')}</li>`);
        if (w.background) items.push(`    <li>背景・仕組み: ${esc(w.background)}</li>`);
        for (const l of w.links ?? []) {
          items.push(`    <li>${esc(l.label)}: <a href="${esc(l.url)}" target="_blank">${esc(l.url)}</a></li>`);
        }
        return `${h2u(w.title)}
<p>
    ${esc(w.desc)}
</p>
<ul>
${items.join('\n')}
</ul>
`;
      })
      .join('\n');
    const soon = coming_soon ? `\n<hr>\n<p>\n    <b>${esc(coming_soon.title)}</b> - ${esc(coming_soon.desc)}\n</p>\n` : '';
    return body + soon;
  },

  devices({ categories }) {
    return categories
      .map((cat) => {
        const lis = cat.items
          .map((it) => {
            if (cat.kind === 'simple') return `    <li><b>${esc(it.name)}:</b> ${esc(it.desc)}</li>`;
            const spec = Object.entries(it.specs ?? {})
              .map(([k, v]) => `${esc(k)}: ${esc(v)}`)
              .join(', ');
            return `    <li><b>${esc(it.name)}</b>${it.role ? ` - ${esc(it.role)}` : ''}${it.desc ? `<br>\n        ${esc(it.desc)}` : ''}${spec ? `<br>\n        <font size="2">${spec}</font>` : ''}</li>`;
          })
          .join('\n');
        return `${h2u(cat.title_ja)}
<ul>
${lis}
</ul>
`;
      })
      .join('\n');
  },
};

export function layout(ctx, content) {
  const { site, nav, page, modes, mode } = ctx;
  const domain = `${site.name}${site.tld}`;
  const isIndex = page.id === 'index';

  const navHtml = nav
    .map((n) => `        <a href="${esc(n.file)}">${esc(n.label_ja)}</a>`)
    .join(' | \n');

  const modeHtml = modes
    .map((m) =>
      m.id === mode.id
        ? `        <b>${esc(m.label_ja)}</b>`
        : `        <a href="${esc(modeHref(mode, m, page.file))}">${esc(m.label_ja)}</a>`,
    )
    .join(' | \n');

  const head = isIndex
    ? `    <h1>${esc(domain)}</h1>\n    <h3>${esc(mode.welcome ?? '')}</h3>`
    : `    <h1>${esc(page.heading_ja)}</h1>`;

  return `<!-- ${GENERATED_NOTE} -->
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>${esc(domain)} - ${esc(page.label_ja)} (${esc(mode.label)}版)</title>
</head>
<body bgcolor="#C0C0C0" text="#000000" link="#0000FF" vlink="#800080" alink="#FF0000">

<center>
${head}
    <hr size="4" width="80%">

    <p>
${navHtml}
    </p>
    <hr size="2" width="80%">
</center>

${content}
<hr>
<center>
    <font size="2">
        [ 表示モード切り替え ]<br>
${modeHtml}
    </font>
</center>

</body>
</html>
`;
}
