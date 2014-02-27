{
  title: "node-retryとasync.seriesをっかって非同期逐次処理の再試行",
  date:  "2014-02-28 4:21",
  description: "複数の非同期処理を順番に実行して、途中で失敗したら最初の処理からゃり直す、ってゅーのをゃります",
  tags: ["Node", "JavaScript"]
}

Node.jsにぉぃて、非同期で取ってきたデータを基にして、
また更に非同期処理をして、成功したらまた非同期処理をして、
とかゅーのを考ぇます

## caolan/asyncで逐次処理をかぃてみる

この場合のコントロールフローとしてゎ
[caolan/async](https://github.com/caolan/async)の`series()`ゃ`waterfall()`がぃぃと思ぃます

```bash
npm install async --save
```

`async.series()`をっかってかくと、こんなふうになります

<code data-gist-id="9257773" data-gist-hide-footer="true" data-gist-hide-line-numbers="true">https://gist.github.com/ayapi/9257773</code>

サンプルなので`setTimeout()`で結果を渡すょーにしてますが、
実際にゎ、httpリクエストとかのコールバックで`done`を呼びます

`get`が1秒後に成功してから、`send`が実行されます
けど`send`でゎ1秒後に必ずエラーが発生して、
`save`ゎ実行されずにぉゎり、とゅーかんじです

出力ゎ以下のょーになります

```bash
get
send
send:failed
```

## node-retryで再試行処理を追加する

ネットワークが不安定だったりすると、リトライ処理をしたくなります
成功するまで何回もゃらせて、けどN回連続で失敗したら、
ちょっともぅぁきらめる、ってかんじのゃっです

[tim-kos/node-retry](https://github.com/tim-kos/node-retry)ゎ、
日本語の情報がほとんどなぃんですけど、
リトライ処理をかんたんにかけるライブラリです

これをっかって、さっきの`async.series()`のコードに
再試行処理を追加してみます

```bash
npm install retry --save
```

オプションで、再試行回数の上限と、
失敗してから再試行するまでにちょっと時間を空けるってゅー、
待ち時間に関する設定ができます

再試行の回数が増ぇてぃくごとに、
待ち時間を長くしてぃくょーな挙動がデフォルトみたぃです
ぁたまぃぃーって思ぃます↑

けど今回ゎ「そーゅーのぃぃから」ってなったので、なしにしてみます

<code data-gist-id="9256588" data-gist-line="2,22-26" data-gist-hide-line-numbers="true">https://gist.github.com/ayapi/9256588#file-retryseries-js-L22-L26</code>

今回のサンプルだと、`send`で失敗するまでに、
`get`で取ってこれるデータの状態が変ゎってるかもしれなぃ、
とか考ぇはじめると、`send`で失敗しちゃった時にゎ、
最初に戻ってゃり直したぃ、ってなったりします

そーゅーのゎ、`async.series()`をまるごと、
`operation.attempt()`に入れたらできます

<code data-gist-id="9256588" data-gist-line="28-40" data-gist-hide-line-numbers="true">https://gist.github.com/ayapi/9256588#file-retryseries-js-L28-L40</code>

`operation.retry(err)`ゎ、
引数`err`にエラーオブジェクトが渡された時にゎ、
再試行回数の上限をチェックして、
まだゃるなら`true`、ぁきらめるなら`false`を返します
そして`true`なら`operation.attempt()`が再び呼ばれます

引数`err`がエラーオブジェクトじゃなぃ時ゎ、
`false`を返します

っまり、`false`が返る時ゎ、
結果ゎどーぁれ、ぉゎる時、とゅーことです

`operation.mainError()`ゎ、ぃちばん多くでたエラーを返すみたぃです
`error.message`の内容にょってカウントしてるみたぃです
今回ゎ毎回`'send:failed'`なのでぁんまり意味なぃですけど、
実際にっかぅ時ゎ、
試行回数が重なればエラーの内容もちがぅ場合もぁりぇますので
こーゅー便利メソッドが用意されてるみたぃです

## 完成ばん

てことで、かけたコードゎこれです＼(^o^)／

<code data-gist-id="9256588">https://gist.github.com/ayapi/9256588</code>

出力ゎ以下のょーになります

```bash
get
send
get
send
get
send
get
send
get
send
send:failed
```