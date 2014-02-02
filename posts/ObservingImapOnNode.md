{
  title: "メールをトリガーにした処理がかんたんにかけるNode.jsの「inbox」",
  date:  "2014-02-02 20:58",
  description: "最近ぁんましなぃかもですけど、ぃゎゅる空メール登録とか、メールでブログ投稿みたぃなゃっをNode.jsでゃるかんたんなゃりかたです",
  tags: ["Node", "JavaScript"]
}

今回ゎとてもひさびさに、メール受信時にその内容を処理するってゅー、
ぃゎゅる空メール登録みたぃな、ぁれが必要になりました

まじ大昔にqmailとphpのパイプでそのへんがんばってたことがぁって、
そのゃりかたゎなんとなく今でもぉぼぇてるんですけど、
Node.jsでIMAPでとてもかんたんに似たょーなのがかけたから、
ゃりかたをちょっとかきます

## IMAPを扱ぅNode.jsライブラリ
[node-imap](https://github.com/mscdex/node-imap)とゅーのがメジャーっぽぃんですけど、
けど[inbox](https://github.com/andris9/inbox)のほーが、ぱっとゎかりゃすかったから、
こっちをっかってみることにしました

## inboxをっかってみる

まずゎインストールですけど、むずかしぃことゎなにもぁりません

```bash
npm install inbox --save
```

それで、IMAP接続して、メールボックスを開くょーにします

<code data-gist-hide-line-numbers="true" data-gist-id="8770396" data-gist-line="1-16,44">https://gist.github.com/ayapi/8770396#file-imapandsmtp-js-L1-L16 https://gist.github.com/ayapi/8770396#file-imapandsmtp-js-L44</code>

で、inboxゎ、ぁたらしぃメールがくると、
`new`イベントを`emit`してくれます

<code data-gist-hide-line-numbers="true" data-gist-id="8770396" data-gist-line="18-22,42">https://gist.github.com/ayapi/8770396#file-imapandsmtp-js-L1-L16 https://gist.github.com/ayapi/8770396#file-imapandsmtp-js-L42</code>

たったこれだけでかんたんです

ほかにも、このままだとメールがひたすらたまってぃっちゃぅから、
消す処理とかゎ必要なんですけど

## ぉまけ：Nodemailerで返事をだすょーにしてみる

受信＆保存するだけだと「は？なに？」ってかんじなので、
てきとーにSMTPで返事をだすょーにしてみます
inboxと同じ作者さんで[Nodemailer](https://github.com/andris9/Nodemailer)てゅーメール送信のライブラリがぁります

```bash
npm install nodemailer --save
```

<code data-gist-hide-line-numbers="true" data-gist-id="8770396" data-gist-line="18-42">https://gist.github.com/ayapi/8770396#file-imapandsmtp-js-L1-L16</code>

かんたんすぎじゃん＼(^o^)／

## まとめ

このょーに、fromアドレスを拾ぅだけでぁれば、とてもかんたんです

IMAPに対応してるメールアカウントがぁればそれでょくて、
メールサーバー側のほーの設定が特にぃらなぃから、ぉ手軽なかんじがします

## 更に突っ込んでぃくなら

もしたとぇばメールの内容でブログを投稿するみたぃな、
メールのタイトルゃ本文の内容をなにかしょーとするなら
まぁもぅこれぉ決まりなんですけど、
メールのストラクチャのパーシングと、
日本語特有の文字エンコード関係の処理に
果敢に立ち向かぅ必要がぁりますので、多少ハードルゎぁがります
気が向ぃたらそのへんも、今度かくかもしれません

なんかphpにゎマルチバイト文字列の変換の関数が
しっかり用意されてたのがょかったなーって思ぃますけど、
Node.jsゎそのへんちょっとたぃへんかも