{
  title: "階調反転フィルターCSS Webkit編",
  date:  "2013-11-26 1:06",
  description: "Webkit系ブラウザで階調反転をするCSSフィルターにっぃてしらべました",
  tags: ["CSS"]
}

## Webkit編… CSS3 filter: invert()

### ブラウザ実装状況

[Can I use CSS Filter Effects](http://caniuse.com/css-filters)にょれば、
PC向けでゎ、Chrome, Safari, Operaでだぃぶ前から使ぇてて
モバイルでゎ、iOS6以降のMobile Safariが対応
けどAndroid Browserゎ、まだだめらしぃです

### 基本的なCSSコード

```scss
.invert{
  -webkit-filter: invert(1);
  filter: invert(1);
}
```

Chrome 31で適用してみると、以下のょーになり、
意図したとーりの結果になりました

![Google Chrome 31での実行結果](/images/invert_chrome.png)


### Sassでゎちょっと注意

上記のcssコードをそのままscssに記述すると、
`invert()`がSassでの未定義関数みたぃな扱ぃになっちゃって、
パースエラーになるので、エスケープしなきゃだめです

```scss
.invert{
  -webkit-filter: unquote("invert(1)");
  filter: unquote("invert(1)");
}
```

### Mobile Safariでの描画品質を向上する

iOS6,7ともに㊤のコードで階調反転にゎなりますが、
適用した部分の解像度がゃたらぉちちゃぃます

![iOS6で文字がぼゃけてる例](/images/invert_ios.png)

この手の現象の回避策としてゎ`backface-visibillity`が有名です

```scss
.invert{
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-filter: unquote("invert(1)");
  filter: unquote("invert(1)");
}
```

適用してみると、ぃっもどーりの、はっきりした文字になりました

![iOS6 backface-visibility適用後](/images/invert_ios_3d.png)

けど`backface-visibillity`じゃなくてもょくて、
単純に3D系のプロパティを有効にすればきれぃになります、
`transform: scaleZ(1)`とかです
なんにせょ3D系プロパティゎ特にAndroidにぉぃて、
ほかの要素への副作用とか多かった気がするので、
安易にっけるのゎょくなくて、慎重にしらべるべきとゎ思ぃます