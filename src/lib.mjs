// テンプレート共通のヘルパー関数

/** HTML エスケープ（設定ファイルの文字は全部これを通す） */
export const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** 内蔵 SVG アイコン（Font Awesome に無いもの） */
const SVG_ICONS = {
  x: {
    viewBox: '0 0 512 512',
    d: 'M389.2 48h70.6L305.6 224.2 487 464H345L233.6 318.1 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z',
  },
  qiita: {
    viewBox: '0 0 32 32',
    d: 'M16 26c-5.522 0-10-4.478-10-10s4.478-10 10-10 10 4.478 10 10-4.478 10-10 10zm0-24C7.163 2 0 9.163 0 18s7.163 16 16 16c3.483 0 6.702-1.11 9.356-3.003l4.636 4.636c.78.78 2.048.78 2.828 0 .78-.78.78-2.048 0-2.828l-4.526-4.526C30.655 25.132 32 21.725 32 18 32 9.163 24.837 2 16 2z',
  },
};

/**
 * 通常版用アイコン。
 *   "fa-brands fa-github" → Font Awesome
 *   "svg:x"               → 内蔵 SVG
 *   "text:VR"             → 文字アイコン
 */
export function icon(spec = '') {
  if (spec.startsWith('svg:')) {
    const svg = SVG_ICONS[spec.slice(4)];
    if (!svg) throw new Error(`未知の内蔵SVGアイコンです: ${spec}（使えるのは ${Object.keys(SVG_ICONS).join(', ')}）`);
    return `<svg class="icon-svg" viewBox="${svg.viewBox}" fill="currentColor" aria-hidden="true"><path d="${svg.d}"/></svg>`;
  }
  if (spec.startsWith('text:')) {
    return `<span class="icon-text" aria-hidden="true">${esc(spec.slice(5))}</span>`;
  }
  return `<i class="${esc(spec)}" aria-hidden="true"></i>`;
}

/** 「okodukai.dttjp.com」のようなホスト名だけを取り出す */
export function host(url) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/** 現在のモードから、別モードの同じページへの相対パス */
export function modeHref(from, to, file) {
  if (from.id === to.id) return file;
  const up = from.dir ? '../' : '';
  const down = to.dir ? `${to.dir}/` : '';
  return `${up}${down}${file}`;
}

/** スペックを「CPU: …, RAM: …」の1行にまとめる（ヴィンテージ版用） */
export const specLine = (specs) =>
  Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

/** 「2026-10-12」→「2026年10月12日」 */
export function dateJa(text = '') {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(text));
  return m ? `${m[1]}年${Number(m[2])}月${Number(m[3])}日` : String(text);
}

/** 作品の「代表URL」（primary のリンク、無ければ最初のリンク） */
export function primaryUrl(work) {
  const links = work.links ?? [];
  return (links.find((l) => l.kind === 'primary') ?? links[0])?.url;
}

/** 旧URL用の転送ページ（どのモードでも使える、素のHTML） */
export function redirectPage(target, label = 'こちら') {
  const t = esc(target);
  return `<!-- ${GENERATED_NOTE} -->
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="refresh" content="0; url=${t}">
<title>ページが移動しました</title>
</head>
<body>
<p>ページが移動しました。自動で切り替わらない場合は <a href="${t}">${esc(label)}</a> を開いてください。</p>
</body>
</html>
`;
}

export const GENERATED_NOTE =
  'このファイルは自動生成されています。直接編集せず content/ か src/ を編集してください。';
