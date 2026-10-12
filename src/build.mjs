#!/usr/bin/env node
// content/*.yml と src/templates/* から、3つの表示モードの HTML を生成します。
//   npm run build   … ファイルを書き出す
//   npm run check   … 書き出さず、今あるファイルと生成結果が一致しているか確認する

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { GENERATED_NOTE, redirectPage } from './lib.mjs';
import * as modern from './templates/modern.mjs';
import * as retro from './templates/retro.mjs';
import * as vintage from './templates/vintage.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK_ONLY = process.argv.includes('--check');
const TEMPLATES = { modern, retro, vintage };

// ---------- 読み込み ----------
function loadYaml(name) {
  const path = join(ROOT, 'content', name);
  try {
    return yaml.load(readFileSync(path, 'utf8')) ?? {};
  } catch (err) {
    const where = err.mark ? `（${err.mark.line + 1} 行目付近）` : '';
    fail(`content/${name} を読み込めませんでした${where}\n  ${err.reason ?? err.message}\n  → 字下げ（スペース）やコロン「:」の後ろのスペースを確認してください。`);
  }
}

function fail(message) {
  console.error(`\n[build error] ${message}\n`);
  process.exit(1);
}

function need(cond, message) {
  if (!cond) fail(message);
}

const site = loadYaml('site.yml');
const data = {
  ...site,
  ...loadYaml('works.yml'),
  ...loadYaml('skills.yml'),
  ...loadYaml('devices.yml'),
  ...loadYaml('links.yml'),
};

// ---------- 最低限のチェック ----------
for (const key of ['site', 'profile', 'sections', 'nav', 'modes', 'works', 'skills', 'categories', 'links']) {
  need(data[key] !== undefined, `設定ファイルに「${key}:」がありません。`);
}
for (const m of data.modes) {
  need(TEMPLATES[m.id], `modes の id「${m.id}」に対応するテンプレートがありません（modern / retro / vintage のどれか）。`);
}
for (const n of data.nav) {
  for (const k of ['id', 'file', 'label', 'label_ja', 'title', 'heading_ja', 'icon']) {
    need(n[k], `nav「${n.id ?? '?'}」に「${k}」がありません。`);
  }
  need(typeof TEMPLATES.modern.pages[n.id] === 'function', `nav の id「${n.id}」に対応するページ定義がありません。`);
}

// ---------- 生成 ----------
const out = new Map(); // 相対パス → 文字列 または Buffer

for (const mode of data.modes) {
  const tpl = TEMPLATES[mode.id];
  for (const page of data.nav) {
    const ctx = { ...data, mode, page };
    out.set(join(mode.dir, page.file), tpl.layout(ctx, tpl.pages[page.id](ctx)));
  }
}

// 旧URLからの転送ページ（全モード）
for (const mode of data.modes) {
  for (const [from, to] of Object.entries(data.redirects ?? {})) {
    out.set(join(mode.dir, from), redirectPage(to));
  }
}

// 通常版の CSS / JS、レトロ版の CSS は src/assets からコピー（先頭に注意書きを付ける）
const banner = (text) => `/* ${text} */\n`;
const asset = (from) => readFileSync(join(ROOT, 'src/assets', from), 'utf8');
out.set('style.css', banner(`${GENERATED_NOTE} 元: src/assets/modern/style.css`) + asset('modern/style.css'));
out.set('main.js', banner(`${GENERATED_NOTE} 元: src/assets/modern/main.js`) + asset('modern/main.js'));
const retroDir = data.modes.find((m) => m.id === 'retro')?.dir ?? 's';
out.set(join(retroDir, 'style.css'), banner(`${GENERATED_NOTE} 元: src/assets/retro/style.css`) + asset('retro/style.css'));
// レトロ版の画像（GIF）はそのままコピー
for (const img of ['bg.gif', 'rainbow.gif']) {
  out.set(join(retroDir, img), readFileSync(join(ROOT, 'src/assets/retro', img)));
}

// ---------- 書き出し / 検査 ----------
let changed = 0;
for (const [rel, content] of out) {
  const dest = join(ROOT, rel);
  const isText = typeof content === 'string';
  const current = existsSync(dest) ? readFileSync(dest, isText ? 'utf8' : undefined) : null;
  if (current !== null && (isText ? current === content : current.equals(content))) continue;
  changed++;
  if (CHECK_ONLY) {
    console.log(`  out of date: ${rel}`);
  } else {
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, content);
    console.log(`  wrote: ${rel}`);
  }
}

if (CHECK_ONLY) {
  if (changed) {
    console.error(`\n${changed} 個のファイルが古いままです。npm run build を実行してください。`);
    process.exit(1);
  }
  console.log(`OK: ${out.size} ファイルは最新です。`);
} else {
  console.log(`\nDone. ${out.size} ファイル中 ${changed} ファイルを更新しました。`);
}
