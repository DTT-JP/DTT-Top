// ヴィンテージ版（Pre-IE4）テンプレート
// 方針: CSS も JavaScript も使わない。HTML 2.0〜3.2 で使えるタグだけで組む。
//       （Netscape Navigator 2.0 / Mosaic でも読めるように）
import { esc, host, modeHref, specLine, GENERATED_NOTE } from '../lib.mjs';

const h2u = (text) => `<h2><u>${esc(text)}</u></h2>`;

export const pages = {
  index({ mode }) {
    const paras = mode.about.map((t) => `<p>\n    ${esc(t)}\n</p>`).join('\n\n');
    return `<h2>${esc(mode.about_heading)}</h2>
${paras}
`;
  },

  projects({ projects }) {
    return projects
      .map((p) => {
        const links = (p.links ?? [])
          .map((l) => `    <li>${esc(l.label)}: <a href="${esc(l.url)}">${esc(l.url)}</a></li>`)
          .join('\n');
        return `${h2u(p.title)}
<p>
    ${esc(p.desc)}
</p>
<ul>
${links}
</ul>
`;
      })
      .join('\n');
  },

  services({ services }) {
    return services
      .map(
        (s) => `${h2u(s.title)}
<p>
    ${esc(s.desc)}
</p>
<ul>
    <li>リンク: <a href="${esc(s.url)}" target="_blank">${esc(s.url)}</a></li>
</ul>
`,
      )
      .join('\n');
  },

  devices({ categories }) {
    return categories
      .map((cat) => {
        const lis = cat.items
          .map((it) => {
            const detail = cat.kind === 'simple' ? it.desc : specLine(it.specs);
            return `    <li><b>${esc(it.name)}:</b> ${esc(detail)}</li>`;
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

  links({ page, links }) {
    const lis = links
      .map(
        (l) =>
          `    <li><b>${esc(l.label)}</b>: ${l.url ? `<a href="${esc(l.url)}" target="_blank">${esc(l.handle)}</a>` : esc(l.handle)}</li>`,
      )
      .join('\n');
    return `${h2u(page.heading_ja)}
<ul>
${lis}
</ul>
`;
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
