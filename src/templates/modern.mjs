// 通常版（現代版）テンプレート
import { esc, icon, host, primaryUrl, modeHref, GENERATED_NOTE } from '../lib.mjs';

// ---------- 小さな部品 ----------
const ext = '<i class="fa-solid fa-arrow-up-right-from-square btn-ext" aria-hidden="true"></i>';
const delay = (n) => `style="--i:${n}"`;

const iconTile = (spec, small = false) =>
  `<span class="icon-tile${small ? ' icon-tile-sm' : ''}">${icon(spec)}</span>`;

const chips = (items = []) =>
  items.length ? `<ul class="chips">${items.map((t) => `<li class="chip">${esc(t)}</li>`).join('')}</ul>` : '';

function pageHead({ eyebrow, title, lead }) {
  return `
    <header class="page-head reveal" ${delay(0)}>
      <p class="eyebrow">${esc(eyebrow)}</p>
      <h1>${esc(title)}</h1>${lead ? `\n      <p class="lead">${esc(lead)}</p>` : ''}
    </header>`;
}

/** トップのセクション（見出し + 中身） */
function block(id, sec, inner) {
  return `
    <section class="block" id="${id}" aria-labelledby="${id}-title">
      <header class="block-head reveal" ${delay(0)}>
        <p class="eyebrow">${esc(sec.ja)}</p>
        <h2 id="${id}-title">${esc(sec.title)}</h2>${sec.lead ? `\n        <p class="lead">${esc(sec.lead)}</p>` : ''}
      </header>
      ${inner}
    </section>`;
}

const avatar = () =>
  `<div class="avatar"><img src="favicon.png" alt="DTT のアイコン" width="232" height="232"></div>`;

// ---------- 各ページの中身 ----------
export const pages = {
  index({ profile, sections, skills, links, nav, mode }) {
    const ctas = nav
      .filter((n) => n.id !== 'index')
      .map(
        (n, i) =>
          `<a class="btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}" href="${esc(n.file)}"><i class="${esc(n.icon)}" aria-hidden="true"></i>${esc(n.label)}</a>`,
      )
      .join('\n          ');

    const anchors = ['about', 'skills', 'links']
      .map((id) => `<a class="anchor" href="#${id}">${esc(sections[id].title)}</a>`)
      .join('');

    const aboutInner = `
      <div class="card prose reveal" ${delay(1)}>
        ${profile.about.map((t) => `<p>${esc(t)}</p>`).join('\n        ')}
        ${mode.message ? `<p class="note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>${esc(mode.message)}</span></p>` : ''}
      </div>`;

    const skillsInner = `
      <div class="skill-grid">${skills
        .map(
          (c, i) => `
        <article class="card skill reveal" ${delay(i + 1)}>
          <div class="skill-head">
            ${iconTile(c.icon, true)}
            <div><h3>${esc(c.title)}</h3><p class="skill-en">${esc(c.en)}</p></div>
          </div>
          ${chips(c.items)}
        </article>`,
        )
        .join('')}
      </div>`;

    const linksInner = `
      <ul class="link-list">${links
        .map((l, i) => {
          const body = `
            ${iconTile(l.icon)}
            <span class="link-text">
              <span class="link-label">${esc(l.label)}</span>
              <span class="link-handle">${esc(l.handle)}</span>
            </span>`;
          return l.url
            ? `
        <li class="reveal" ${delay(i + 1)}>
          <a class="link-item" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${body}
            <i class="fa-solid fa-arrow-up-right-from-square link-go" aria-hidden="true"></i>
          </a>
        </li>`
            : `
        <li class="reveal" ${delay(i + 1)}>
          <button type="button" class="link-item" data-copy="${esc(l.handle)}" aria-label="${esc(l.label)} のIDをコピー">${body}
            <i class="fa-regular fa-copy link-go" aria-hidden="true"></i>
          </button>
        </li>`;
        })
        .join('')}
      </ul>`;

    return `
    <section class="hero">
      <div class="hero-text">
        <p class="eyebrow reveal" ${delay(0)}><span class="dot" aria-hidden="true"></span>${esc(profile.subtitle)}</p>
        <h1 class="hero-title reveal" ${delay(1)}>${esc(profile.name)}</h1>
        <p class="hero-lead reveal" ${delay(2)}>${esc(profile.intro)}</p>
        <div class="hero-actions reveal" ${delay(3)}>
          ${ctas}
        </div>
      </div>
      <div class="hero-visual reveal" ${delay(2)}>
        ${avatar()}
      </div>
    </section>

    <nav class="anchors reveal" aria-label="ページ内リンク" ${delay(3)}>${anchors}</nav>
    ${block('about', sections.about, aboutInner)}
    ${block('skills', sections.skills, skillsInner)}
    ${block('links', sections.links, linksInner)}`;
  },

  works({ page, works, coming_soon }) {
    const cards = works
      .map((w, i) => {
        const url = primaryUrl(w);
        const actions = (w.links ?? [])
          .map(
            (l) =>
              `<a class="btn btn-${l.kind === 'primary' ? 'primary' : 'ghost'}" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${l.icon ? `<i class="${esc(l.icon)}" aria-hidden="true"></i>` : ''}${esc(l.label)}${l.icon ? '' : ext}</a>`,
          )
          .join('\n          ');
        return `
      <article class="card item reveal" ${delay(i + 1)}>
        <div class="item-head">
          ${iconTile(w.icon)}
          <div>
            <h3>${esc(w.title)}</h3>${url ? `\n            <p class="item-meta"><span class="item-host">${esc(host(url))}</span></p>` : ''}
          </div>
        </div>
        <p class="item-desc">${esc(w.desc)}</p>
        ${chips(w.tech)}
        ${w.background ? `<details class="more"><summary>背景・仕組み</summary><p>${esc(w.background)}</p></details>` : ''}
        <div class="item-actions">
          ${actions}
        </div>
      </article>`;
      })
      .join('');

    const soon = coming_soon
      ? `
      <article class="card card-dashed reveal" ${delay(works.length + 1)}>
        ${iconTile('fa-solid fa-plus')}
        <h3>${esc(coming_soon.title)}</h3>
        <p class="item-desc">${esc(coming_soon.desc)}</p>
      </article>`
      : '';

    return `${pageHead({ eyebrow: page.label, title: page.title, lead: page.lead })}
    <div class="card-grid">${cards}${soon}
    </div>`;
  },

  devices({ page, categories }) {
    const sections = categories
      .map((cat, ci) => {
        const items = cat.items
          .map((it) => {
            const head = `
            <div class="device-head">
              <h3>${esc(it.name)}</h3>${it.role ? `\n              <p class="device-role">${esc(it.role)}</p>` : ''}${it.desc ? `\n              <p class="device-desc">${esc(it.desc)}</p>` : ''}
            </div>`;
            const specs = it.specs
              ? `<dl class="specs">${Object.entries(it.specs)
                  .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
                  .join('')}</dl>`
              : '';
            return `
          <article class="card device${it.specs ? '' : ' device-plain'}">${head}
            ${specs}
          </article>`;
          })
          .join('');
        return `
      <section class="device-cat reveal" ${delay(ci + 1)}>
        <h2 class="cat-title">${iconTile(cat.icon, true)}${esc(cat.title)}<span class="count">${cat.items.length}</span></h2>
        <div class="card-grid${cat.kind === 'simple' ? ' card-grid-sm' : ''}">${items}
        </div>
      </section>`;
      })
      .join('');
    return `${pageHead({ eyebrow: page.label, title: page.title, lead: page.lead })}
    <div class="device-list">${sections}
    </div>`;
  },
};

// ---------- 共通レイアウト ----------
export function layout(ctx, content) {
  const { site, nav, page, modes, mode } = ctx;
  const title = page.id === 'index' ? site.title : `${page.title} - ${site.name}${site.tld}`;

  const navHtml = nav
    .map(
      (n) =>
        `<a class="nav-link" href="${esc(n.file)}"${n.id === page.id ? ' aria-current="page"' : ''}><i class="${esc(n.icon)}" aria-hidden="true"></i><span>${esc(n.label)}</span></a>`,
    )
    .join('\n        ');

  const modeLinks = modes
    .map((m) => {
      const inner = `${esc(m.label)} <small>${esc(m.period)}</small>`;
      return m.id === mode.id
        ? `<span class="seg is-active" aria-current="true">${inner}</span>`
        : `<a class="seg" href="${esc(modeHref(mode, m, page.file))}">${inner}</a>`;
    })
    .join('\n          ');

  return `<!DOCTYPE html>
<!-- ${GENERATED_NOTE} -->
<html lang="ja" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(site.description)}">
  <meta name="theme-color" content="#080c13">
  <link rel="icon" type="image/png" href="${esc(site.favicon)}">
  <script>
    // 初回描画前にテーマとプリローダー状態を決める（ちらつき防止）
    (function () {
      var d = document.documentElement, t = null;
      d.classList.add('js');
      try { t = localStorage.getItem('theme'); } catch (e) {}
      if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      d.setAttribute('data-theme', t);
      try {
        var n = performance.getEntriesByType('navigation')[0];
        if (sessionStorage.getItem('site_entered') && !(n && n.type === 'reload')) d.classList.add('skip-preloader');
      } catch (e) {}
      setTimeout(function () { d.classList.add('loaded'); }, 3000); // main.js が読めなかった時の保険
    })();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Sans+JP:wght@400;500;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="preloader" aria-hidden="true">
    <div class="loader-logo">${esc(site.name)}<span>${esc(site.tld)}</span></div>
  </div>
  <div class="bg-deco" aria-hidden="true"></div>

  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="index.html">${esc(site.name)}<span>${esc(site.tld)}</span></a>
      <nav class="nav" aria-label="メインメニュー">
        ${navHtml}
      </nav>
      <button type="button" id="theme-toggle" class="icon-btn" aria-label="ライト / ダークを切り替え">
        <i class="fa-solid fa-moon icon-for-dark" aria-hidden="true"></i>
        <i class="fa-solid fa-sun icon-for-light" aria-hidden="true"></i>
      </button>
    </div>
  </header>

  <main class="page">${content}
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <p>&copy; ${esc(site.copyright_year)} ${esc(site.name)}${esc(site.tld)}</p>
      <div class="mode-switch">
        <span>Display Mode</span>
        <div class="segmented" role="group" aria-label="表示モード">
          ${modeLinks}
        </div>
      </div>
    </div>
  </footer>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <script src="main.js" defer></script>
</body>
</html>
`;
}
