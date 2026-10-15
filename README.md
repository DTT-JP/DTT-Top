# DTTJP.com ポートフォリオサイト (dtt-top)

高校生 DTT のポートフォリオサイトです。
制作物・デバイス・SNS などの内容を `content/*.yml`（設定ファイル）に書くだけで、**3つの表示モード × 4ページ = 12枚の HTML** を自動生成します。

| モード | 出力先 | 見た目 |
| --- | --- | --- |
| 通常版 (Modern) | `/` | ダーク/ライト両対応のモダンなデザイン。スマホでは下部タブバー |
| レトロ版 | `/s/` | 2000 年前後の個人ホームページ風。table レイアウト + 画像（GIF）+ 最小限の CSS |
| ヴィンテージ版 (Pre-IE4) | `/ss/` | CSS なし・素の HTML のみ（Netscape 2.0 世代向け） |

## 1. 何が変わったか

- これまでは 15 枚の HTML を手書きしていたため、サービスを 1 つ増やすたびに 3 モード分を直す必要がありました。今は **設定ファイル 1 か所を直すだけ** です。
- ページ構成を整理しました: **About（自己紹介 + 使える技術 + SNS リンク）／ Works（制作物）／ Devices／ Partners（相互リンク）**。旧 `projects.html` `services.html` `links.html` は、新しいページへ自動で飛ぶ転送ページとして残してあります（古いリンクが 404 にならないため）。
- 自己紹介文は 3 モード共通です（`content/site.yml` の `profile`）。モードごとに書き分けるのは「そのモードならではの一言」（`modes[].message`）だけです。
- 制作物ごとに「使用技術」と「背景・仕組み」を持たせました。通常版では技術がチップで並び、背景は折りたたみ表示。レトロ版・ヴィンテージ版では本文にそのまま出ます。
- デバイスごとに「用途」を持たせました。
- 通常版: M3 風の寄せ集めをやめ、統一したデザイントークン（色・角丸・影）で作り直しました。スマホでは下部タブバーになります。
- レトロ版: 「IE の窓」の再現をやめ、**2000 年前後の個人ホームページ**（背景タイル・左メニュー・虹色の罫線・流れる文字・ページ内リンク）の再現にしました。

## 2. ファイル構成

```
dtt-top/
├─ content/                 ← ★普段編集するのはここだけ
│  ├─ site.yml              サイト名・共通の自己紹介・ナビ・各モードの一言・旧URL転送
│  ├─ skills.yml            使える技術スタック
│  ├─ works.yml             制作物（作ったもの全部）
│  ├─ devices.yml           デバイス一覧（用途つき）
│  ├─ links.yml             SNS・アカウント一覧
│  └─ partners.yml          相互リンク（外部サイト）の一覧
├─ src/                     ← 見た目や仕組みを変えたい時に編集
│  ├─ build.mjs             生成スクリプト本体
│  ├─ lib.mjs               共通の小さな関数
│  ├─ templates/            モードごとの HTML の型 (modern / retro / vintage)
│  └─ assets/
│     ├─ modern/style.css, main.js   通常版の CSS / JS の元
│     └─ retro/style.css, bg.gif, rainbow.gif   レトロ版の CSS と画像の元
├─ package.json / package-lock.json  依存パッケージ (js-yaml のみ)
├─ favicon.png                       アイコン兼アバター画像
│
│  ── ここから下は自動生成（直接編集しない）──
├─ index.html works.html devices.html partners.html
├─ projects.html services.html links.html   （旧URL → 新ページへの転送）
├─ style.css main.js
├─ s/    …レトロ版（4ページ + 転送 + style.css + 画像）
└─ ss/   …ヴィンテージ版（4ページ + 転送）
```

> 自動生成されるファイルを直接編集しても、次のビルドで上書きされます。必ず `content/` か `src/` を編集してください。

## 3. 必要な環境とインストール

ビルドは自分のパソコンで行うため、必ず必要です。**このサイトは「手元でビルドして、生成された HTML も一緒に push する」運用です。GitHub 側ではビルドされません**（GitHub Actions は使いません）。

- Node.js 20 以上（`package.json` の `engines` で指定）
- Git

```bash
# Node.js のバージョン確認（v20 以上ならOK）
node -v

# リポジトリを取得（初回のみ）
git clone https://github.com/DTT-JP/dtt-top.git
cd dtt-top

# 依存パッケージのインストール
npm install
```

Node.js が入っていない場合は、公式サイト <https://nodejs.org/> から LTS 版をインストールしてください（画面の表示は変わることがあるため、最新の案内に従ってください）。

## 4. 設定ファイルの書き方

このプロジェクトには `.env` や API キーは **ありません**。外部サービスの登録も不要です。
編集するのは `content/` の YAML ファイルだけです。

### YAML の注意点（初めての人向け）

- 字下げは **半角スペース**（タブ不可）。同じ階層は同じ数のスペースに揃えます。
- `項目名: 値` の **コロンの後ろに半角スペース** が必要です。
- 値の中に `: `（コロン+スペース）や `#` が入る場合は、全体を `"..."` で囲みます。
  例: `desc: "AQUOS wish 3 (通称: Gomios)"`
- 間違えるとビルドが「何行目付近が悪いか」を表示して止まります。

### 制作物を 1 つ追加する（`content/works.yml`）

`works:` の下に、同じ形で追記します。

```yaml
  - title: 新しい作品名
    icon: fa-solid fa-rocket
    desc: 一言の説明文
    tech: [HTML, CSS, JavaScript]
    background: 作りや背景の説明（任意）
    links:
      - label: Open
        url: https://example.dttjp.com/
        kind: primary
```

- `icon` は Font Awesome のクラス名です。<https://fontawesome.com/icons> で Free のアイコンを探し、表示されるクラス名（例: `fa-solid fa-rocket`）を書きます。無料で使えないアイコン（Pro 限定）は表示されません。
- `tech` と `background` は省略できます。

### 技術を追加する（`content/skills.yml`）

該当カテゴリの `items:` の `[ ]` の中に、`, ` 区切りで追記します。

### デバイスの用途を変える（`content/devices.yml`）

各デバイスの `role`（一言）と `desc`（説明）を書き換えます。

### 相互リンクを 1 つ追加する（`content/partners.yml`）

`partners:` の下に、同じ形で追記します（初期状態は `partners: []`＝0 件なので、最初の 1 件を書くときは `[]` を消して、次のように書き換えます）。

```yaml
partners:
  - name: 相手のサイト名
    url: https://example.com/
    desc: 一言の説明（省略できます）
    icon: fa-solid fa-globe   # 省略すると fa-solid fa-link
```

- `name` と `url` は必須です。`url` は `https://` か `http://` で始めてください（違うとビルドが止まります）。
- 相互リンク先は外部サイトなので、**全モードで新しいタブで開きます**（通常版は `rel="noopener noreferrer"` 付き）。
- 一覧は書いた順に表示されます。
- `partners_note` に文章を書くと一覧の下に表示されます（相互リンクの募集案内など。空なら非表示）。
- `partners_empty` は、登録が 0 件のときに表示する文章です。
- メニューの名前・ページ見出し・説明文は `content/site.yml` の `nav`（`id: partners`）で変えられます。

### 各ファイルの項目

| ファイル | 主な項目 | 説明 |
| --- | --- | --- |
| `site.yml` | `site` | サイト名・ロゴ・説明文・年・最終更新日（レトロ版に表示）・favicon |
| | `profile` | 名前・肩書き・一言（`intro`）・自己紹介の段落（`about`）。**3 モード共通** |
| | `sections` | About ページ内の見出し（About / Tech Stack / Links） |
| | `nav` | ページ一覧（名前・見出し・アイコン） |
| | `redirects` | 旧ファイル名 → 転送先 |
| | `modes` | 各モードの出力先と、そのモードならではの一言（`message`） |
| `skills.yml` | `skills[]` | カテゴリ（`title` `en` `icon`）と `items` |
| `works.yml` | `works[]` | `title` `icon` `desc` `tech` `background` `links[]` |
| | `coming_soon` | 「準備中」カード（不要なら削除） |
| `devices.yml` | `categories[]` | `kind: specs` は用途 + スペック表、`kind: simple` は名前 + 説明 |
| `partners.yml` | `partners[]` | 相互リンク先（`name` `url` `desc` `icon`） |
| | `partners_note` / `partners_empty` | 一覧下の案内文 / 0 件のときの文章 |
| `links.yml` | `links[]` | `url` を省略すると ID のみ表示（通常版ではクリックでコピー） |

`links.yml` の `icon` には Font Awesome のクラス名のほか、`svg:x` / `svg:qiita`（内蔵 SVG）、`text:VR`（文字アイコン）が使えます。

## 5. ローカルでの使い方

```bash
npm run build   # content/ と src/ から HTML を生成（上書き）
npm run check   # 書き出さずに「生成物が最新か」だけ確認
```

ブラウザで確認するには、生成された `index.html` をダブルクリックで開くだけです（サーバー不要）。
外部のフォントとアイコン（Google Fonts / Font Awesome）はインターネット接続が必要です。

## 6. GitHub へのアップロード（デプロイ）

**必ず「ビルドしてから」push します。** 生成された HTML（`index.html`、`s/`、`ss/` など）も commit に含めることで、公開先にそのまま反映されます。

### 6-1. 今回の変更を最初に反映する

zip を展開したフォルダの中身を、自分の `dtt-top` フォルダ（`git clone` したもの）に **上書きコピー** します。旧 `projects.html` `services.html` `links.html` は転送ページとして上書きされるため、HTML 側で削除するファイルはありません。

> 前回の zip（`content/projects.yml` と `content/services.yml` が入っていたもの）を適用済みの場合だけ、この 2 ファイルを削除してください（残っていても動作には影響しませんが、使われません）。

```bash
cd dtt-top
npm install
npm run build
git add -A
git commit -m "サイトを設定ファイルからの生成方式に変更し、構成とデザインを刷新"
git push origin main
```

### 6-2. 普段の更新手順

```bash
# 1. content/ のファイルを編集（例: content/works.yml）
# 2. ビルド
npm run build
# 3. 生成物の最新確認（任意。"OK" と出ればよい）
npm run check
# 4. commit と push
git add -A
git commit -m "サービスを追加"
git push origin main
```

- `git status` で `content/` と一緒に `index.html` や `s/`・`ss/` も変更されていれば正常です。
- **ビルドを忘れて push すると、サイトは更新されません**（設定ファイルだけが変わった状態になります）。迷ったら `npm run check` を実行し、「古いままです」と出たら `npm run build` をやり直してください。

## 7. 外部サービス側で必要な設定

- このプロジェクトに必要な外部サービスの設定は **ありません**（GitHub Actions も使いません）。
- 生成した HTML をリポジトリにそのまま commit する方式なので、**現在の公開設定を変える必要はありません**。
- このリポジトリには `CNAME` ファイルなどが無く、公開先が GitHub Pages かどうかをリポジトリの内容だけでは判断できませんでした（**要確認**）。どの公開先でも「リポジトリ直下のファイルをそのまま配信する」設定のままで動きます。

## 8. トラブルシュート

| 症状 | 原因と対処 |
| --- | --- |
| `[build error] content/xxx.yml を読み込めませんでした` | YAML の字下げやコロンの書き方のミス。表示された行番号付近を確認 |
| アイコンが四角（空白）になる | Font Awesome の Free に無いアイコン名、またはクラス名の綴りミス |
| 編集したのにサイトが変わらない | `npm run build` を忘れていないか確認（`npm run check` で判定可能）。ブラウザのキャッシュも疑う |
| `npm: command not found` / `node: command not found` | Node.js が未インストール。3 を参照 |

## 9. 動作の前提

- 通常版は新しいブラウザ向けです（`backdrop-filter`・CSS 変数などを使用）。古い環境向けには `/s/` と `/ss/` を用意しています。
- レトロ版の `<marquee>`（流れる文字）や IE 専用の色付きスクロールバーは、現行ブラウザでは非推奨・無視される機能です。見た目だけの演出で、読む妨げにはなりません。
