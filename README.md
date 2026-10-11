# DTTJP.com ポートフォリオサイト (dtt-top)

高校生 DTT のポートフォリオサイトです。
サービス・デバイス・SNS などの内容を `content/*.yml`（設定ファイル）に書くだけで、**3つの表示モード × 5ページ = 15枚の HTML** を自動生成します。

| モード | 出力先 | 見た目 |
| --- | --- | --- |
| 通常版 (Modern) | `/` | ダーク/ライト両対応のモダンなデザイン。スマホでは下部タブバー |
| レトロ版 (IE4+) | `/s/` | Windows 98 + Internet Explorer 4 風。table レイアウト + CSS1 のみ |
| ヴィンテージ版 (Pre-IE4) | `/ss/` | CSS なし・素の HTML のみ（Netscape 2.0 世代向け） |

## 1. 何が変わったか（従来との違い）

- これまでは 15 枚の HTML を手書きしていたため、サービスを 1 つ増やすたびに 3 モード分を直す必要がありました。今は **設定ファイル 1 か所を直すだけ** です。
- 通常版: M3 風の寄せ集めをやめ、統一したデザイントークン（色・角丸・影）で作り直しました。サービスごとのアイコン、スマホ用の下部ナビ、キーボード操作・動きを減らす設定への対応を追加しています。
- レトロ版: 紺背景に青文字で読みにくかった配色をやめ、「白背景に黒文字」の Windows 98 風ウィンドウにしました。
- 出力される HTML のファイル名・URL は従来と同じです（`index.html`, `s/devices.html` など）。

## 2. ファイル構成

```
dtt-top/
├─ content/                 ← ★普段編集するのはここだけ
│  ├─ site.yml              サイト名・ナビ・各モードの文言
│  ├─ projects.yml          プロジェクト一覧
│  ├─ services.yml          Web サービス一覧
│  ├─ devices.yml           デバイス一覧
│  └─ links.yml             SNS・アカウント一覧
├─ src/                     ← 見た目や仕組みを変えたい時に編集
│  ├─ build.mjs             生成スクリプト本体
│  ├─ lib.mjs               共通の小さな関数
│  ├─ templates/            モードごとの HTML の型 (modern / retro / vintage)
│  └─ assets/
│     ├─ modern/style.css, main.js   通常版の CSS / JS の元
│     └─ retro/style.css             レトロ版の CSS の元
├─ package.json / package-lock.json  依存パッケージ (js-yaml のみ)
├─ favicon.png                       アイコン兼アバター画像
│
│  ── ここから下は自動生成（直接編集しない）──
├─ index.html projects.html services.html devices.html links.html
├─ style.css main.js
├─ s/    …レトロ版 (5ページ + style.css)
└─ ss/   …ヴィンテージ版 (5ページ)
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

### サービスを 1 つ追加する（`content/services.yml`）

`services:` の下に、同じ形で追記します。

```yaml
  - title: 新サービス名
    icon: fa-solid fa-rocket
    desc: 一言の説明文
    url: https://example.dttjp.com/
```

- `icon` は Font Awesome のクラス名です。<https://fontawesome.com/icons> で Free のアイコンを探し、表示されるクラス名（例: `fa-solid fa-rocket`）を書きます。無料で使えないアイコン（Pro 限定）は表示されません。

### 各ファイルの項目

| ファイル | 主な項目 | 説明 |
| --- | --- | --- |
| `site.yml` | `site` | サイト名・ロゴ・説明文・年・favicon |
| | `profile` | 名前・肩書き・トップの一言 |
| | `nav` | ページ一覧（名前・見出し・アイコン・説明） |
| | `modes` | 各モードの出力先と、レトロ/ヴィンテージの自己紹介文 |
| `projects.yml` | `projects[].links[]` | ボタン（`kind: primary` は塗り、`secondary` は枠線） |
| | `coming_soon` | 「準備中」カード。不要なら丸ごと削除 |
| `services.yml` | `services[]` | `title` `icon` `desc` `url` |
| `devices.yml` | `categories[]` | `kind: specs` は項目名: 値の表、`kind: simple` は名前 + 説明 |
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

zip を展開したフォルダの中身を、自分の `dtt-top` フォルダ（`git clone` したもの）に **上書きコピー** します。ファイル名は従来と同じなので、削除するファイルはありません。

```bash
cd dtt-top
npm install
npm run build
git add -A
git commit -m "サイトを設定ファイルからの生成方式に変更し、デザインを刷新"
git push origin main
```

### 6-2. 普段の更新手順

```bash
# 1. content/ のファイルを編集（例: content/services.yml）
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
- レトロ版の `<marquee>` と一部の装飾は、現行ブラウザでは非推奨機能・おまけ表示です（見た目だけの演出で、読む妨げにはなりません）。
