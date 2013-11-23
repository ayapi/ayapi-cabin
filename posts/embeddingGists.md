{
  title: "Gistをとにかくぃーかんじに貼れるgist-embed.js",
  date:  "2013-11-22 20:45",
  description: "Gistを非同期で表示してくれるgist-embed.jsをっかってみます",
  tags: ["JavaScript"]
}

[Gist](https://gist.github.com/‎)をっかってみょーと思ぃましたが、
このブログのジェネレータ[CabinJS](https://github.com/CabinJS)にゎ、
Gistを貼るための特別なプラグインなどゎ特にぁりません

なので、ふつうに`<script>`タグとかで貼ることになるんですけど、
Gist公式の`<script>`タグょりもぃーかんじのライブラリをみっけました

それが、[gist-embed.js](https://github.com/blairvanderhoof/gist-embed)です

## gist-embed.jsのすごぃとこ

### 非同期でGistのjsonを取得してくれる
Gistゎ公式に`<script>`タグを提供してくれてますが、
そのjsファイルが`document.write()`で強引にかきこむ仕様で、
だぃぶ、ぅざぃんですけど、

Gistゎなにげに、jsファイルだけでなく、jsonも提供してぃて、
gist-embed.jsゎ、非同期でそのjsonを取得してくれます
なので、ページのロードのブロッキングが発生しません

### Gistのcssをカスタムしゃすぃ
これちょっと文章で説明するとゃゃこしくなるんですけど、
Gist公式の`<script>`タグゎ、問答無用に、
その`<script>`の位置に`link`要素でcssを挿入してくるんですけど、

gist-embed.jsゎ、Gistのデフォルトのcssの`link`要素を、
ドキュメントの`head`要素の最初の子要素として挿入してくれます

これのなにがぃけてるかってゅーと、
コードカラーリングなどのスタイルをカスタムしたぃ場合に、
ふつーに`head`要素内にカスタム用cssの`link`要素を入れてても、
カスタム用cssのほうの優先度が高くなり、
ゃたらと`!important`かきまくったりする必要もほぼなぃです

ぁゃぴゎ、ふだんからエディタをmonokaiカラーにしてるので、
Gistもmonokaiになるょーにcssをぁててみました

### 表示するコードの行の範囲を柔軟に指定できる
ただファイルのコードぜんぶを一気にみせるんじゃなく、
数行だけを抜き出して表示するとかができますので、
解説とかを、てぃねぃにゎかりゃすくかけます
下にかく、動作サンプルをみてくださぃ

### 行番号、メタ情報(フッター)の表示・非表示も選択できる
これも、以下にかく動作サンプルをみてくださぃ


## 動作サンプル
以下ゎ、[gist-embed公式example](http://blairvanderhoof.com/gist-embed/)を、ただかき写しただけです

### デフォ
<code data-gist-id="5457595"></code>

### 行番号なし
<code data-gist-id="5457605" data-gist-hide-line-numbers="true"></code>

### 行番号とフッターなし
<code data-gist-id="5457629" data-gist-hide-footer="true" data-gist-hide-line-numbers="true"></code>

### 複数のファイルがぁるGist
<code data-gist-id="5457635"></code>

### 複数のファイルがぁるGistでそのぅちのひとっのファイルだけ表示
<code data-gist-id="5457644" data-gist-file="example-file2.html"></code>

### 行番号を1行だけ指定
<code data-gist-id="5457662" data-gist-line="2"></code>

### 行番号を範囲で指定
<code data-gist-id="5457652" data-gist-line="2-4"></code>

### 行番号を1行だけ指定と範囲指定の両方
<code data-gist-id="5457665" data-gist-line="1,3-4"></code>

### 行番号を1行ずっ複数指定
<code data-gist-id="5457668" data-gist-line="2,3,4"></code>


## まとめ

Gist側の仕様変更などにゎ気をっけなきゃぃけなぃと思ぃますが
機能的にゎとてもぃぃので、
ブログでGistを貼るならっかってみる価値ぁると思ぃます