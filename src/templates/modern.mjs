// 通常版（現代版）テンプレート
import { esc, icon, host, modeHref, GENERATED_NOTE } from '../lib.mjs';

// ---------- 小さな部品 ----------
const ext = '<i class="fa-solid fa-arrow-up-right-from-square btn-ext" aria-hidden="true"></i>';
const delay = (n) => `style="--i:${n}"`;

const iconTile = (spec, small = false) =>
  `<span class="icon-tile${small ? ' icon-tile-sm' : ''}">${icon(spec)}</span>`;

function pageHead({ eyebrow, title, lead }) {
  return `
    <header class="page-head reveal" ${delay(0)}>
      <p class="eyebrow">${esc(eyebrow)}</p>
      <h1>${esc(title)}</h1>${lead ? `\n      <p class="lead">${esc(lead)}</p>` : ''}
    </header>`;
}

function comingSoon(card, n) {
  if (!card) return '';
  return `
      <article class="card card-dashed reveal" ${delay(n)}>
        ${iconTile('fa-solid fa-plus')}
        <h3>${esc(card.title)}</h3>
        <p class="item-desc">${esc(card.desc)}</p>
      </article>`;
}

function socialButton(link) {
  const label = esc(link.label);
  if (link.url) {
    return `<li><a class="social-btn" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer" aria-label="${label}" data-tip="${label}">${icon(link.icon)}</a></li>`;
  }
  const handle = esc(link.handle);
  return `<li><button type="button" class="social-btn" data-copy="${handle}" aria-label="${label}: ${handle}（クリックでコピー）" data-tip="${label}: ${handle}">${icon(link.icon)}</button></li>`;
}

const avatar = (cls = '') =>
  `<div class="avatar ${cls}"><img src="favicon.png" alt="DTT のアイコン" width="232" height="232"></div>`;

// ---------- 各ページの中身 ----------
export const pages = {
  index({ profile, links, nav }) {
    const explore = nav
      .filter((n) => n.id !== 'index')
      .map(
        (n, i) => `
        <a class="card tile reveal" href="${esc(n.file)}" ${delay(i + 3)}>
          ${iconTile(n.icon)}
          <span class="tile-title">${esc(n.label)}</span>
          <span class="tile-desc">${esc(n.desc)}</span>
          <i class="fa-solid fa-arrow-right tile-go" aria-hidden="true"></i>
        </a>`,
      )
      .join('');

    return `
    <section class="hero">
      <div class="hero-text">
        <p class="eyebrow reveal" ${delay(0)}><span class="dot" aria-hidden="true"></span>${esc(profile.subtitle)}</p>
        <h1 class="hero-title reveal" ${delay(1)}>${esc(profile.name)}</h1>
        <p class="hero-lead reveal" ${delay(2)}>${esc(profile.intro)}</p>
        <ul class="social reveal" ${delay(3)}>
          ${links.map(socialButton).join('\n          ')}
        </ul>
      </div>
      <div class="hero-visual reveal" ${delay(2)}>
        ${avatar()}
      </div>
    </section>

    <section class="explore" aria-labelledby="explore-title">
      <h2 class="section-label reveal" id="explore-title" ${delay(2)}>Explore</h2>
      <div class="tile-grid">${explore}
      </div>
    </section>`;
  },

  projects({ page, projects, coming_soon }) {
    const cards = projects
      .map((p, i) => {
        const actions = (p.links ?? [])
          .map(
            (l) =>
              `<a class="btn btn-${l.kind === 'primary' ? 'primary' : 'ghost'}" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${l.icon ? `<i class="${esc(l.icon)}" aria-hidden="true"></i>` : ''}${esc(l.label)}${l.icon ? '' : ext}</a>`,
          )
          .join('\n            ');
        return `
      <article class="card item reveal" ${delay(i + 1)}>
        <div class="item-head">
          ${iconTile(p.icon)}
          <h3>${esc(p.title)}</h3>
        </div>
        <p class="item-desc">${esc(p.desc)}</p>
        <div class="item-actions">
          ${actions}
        </div>
      </article>`;
      })
      .join('');
    return `${pageHead({ eyebrow: page.label, title: page.title, lead: page.lead })}
    <div class="card-grid">${cards}${comingSoon(coming_soon, projects.length + 1)}
    </div>`;
  },

  services({ page, services, coming_soon }) {
    const cards = services
      .map(
        (s, i) => `
      <article class="card item reveal" ${delay(i + 1)}>
        <div class="item-head">
          ${iconTile(s.icon)}
          <div>
            <h3>${esc(s.title)}</h3>
            <p class="item-host">${esc(host(s.url))}</p>
          </div>
        </div>
        <p class="item-desc">${esc(s.desc)}</p>
        <div class="item-actions">
          <a class="btn btn-primary" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">Go to Service${ext}</a>
        </div>
      </article>`,
      )
      .join('');
    return `${pageHead({ eyebrow: page.label, title: page.title, lead: page.lead })}
    <div class="card-grid">${cards}${comingSoon(coming_soon, services.length + 1)}
    </div>`;
  },

  devices({ page, categories }) {
    const sections = categories
      .map((cat, ci) => {
        const items = cat.items
          .map((it) => {
            if (cat.kind === 'simple') {
              return `
          <article class="card device">
            <h3>${esc(it.name)}</h3>
            <p class="device-desc">${esc(it.desc)}</p>
          </article>`;
            }
            const rows = Object.entries(it.specs)
              .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
              .join('');
            return `
          <article class="card device">
            <h3>${esc(it.name)}</h3>
            <dl class="specs">${rows}</dl>
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

  links({ profile, links }) {
    const items = links
      .map((l, i) => {
        const body = `
            ${iconTile(l.icon)}
            <span class="link-text">
              <span class="link-label">${esc(l.label)}</span>
              <span class="link-handle">${esc(l.handle)}</span>
            </span>`;
        if (l.url) {
          return `
          <li class="reveal" ${delay(i + 1)}>
            <a class="link-item" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${body}
              <i class="fa-solid fa-arrow-up-right-from-square link-go" aria-hidden="true"></i>
            </a>
          </li>`;
        }
        return `
          <li class="reveal" ${delay(i + 1)}>
            <button type="button" class="link-item" data-copy="${esc(l.handle)}" aria-label="${esc(l.label)} のIDをコピー">${body}
              <i class="fa-regular fa-copy link-go" aria-hidden="true"></i>
            </button>
          </li>`;
      })
      .join('');
    return `
    <section class="link-page">
      <div class="profile-head reveal" ${delay(0)}>
        ${avatar('avatar-sm')}
        <h1>${esc(profile.name)}</h1>
        <p class="subtitle">${esc(profile.subtitle)}</p>
      </div>
      <ul class="link-list">${items}
      </ul>
    </section>`;
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
