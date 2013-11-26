{
  title: "階調反転フィルターCSS Microsoft編",
  date:  "2013-11-26 1:14",
  description: "Internet Explorerで階調反転をするCSSフィルターにっぃてしらべました",
  tags: ["CSS"]
}

## Microsoft編… filter: DXImageTransform

CSSネタでゎまじだるぃIEなんですけど、
フィルター関係でゎDirectXをっかった独自実装の
`filter: progid:DXImageTransform.Microsoft`が、ぁりました
「ぁりました」って過去形なのゎ、IE9の時点で非推奨とされ、
IE10からゎ完全に非対応となったからです

とりぁぇずIE10以降のことゎぉぃとぃて、
`DXImageTransform`をっかった階調反転CSSを、
教科書どーりなかんじでかくと、以下のとーりです

```scss
.invert{
  filter: progid:DXImageTransform.Microsoft.BasicImage(invert=1);
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(invert=1)";
}
```

けど実ゎ、`invert`のみを適用する今回のょーな場合ゎ、
この長ぃ記述ゎまったく必要がなく、フィルター名だけで指定できます

```scss
.invert{
  filter: invert(1);
  -ms-filter: invert(1);
}
```

Webkitと同じかんじでかけるってことですね！
けどWebkitでゎパーセンテージ指定とかができますが
こっちでゎ0か1かしかだめなので気をっける必要がぁります

IETester v0.5.2をっかって、
IE7から9でこのCSSを適用したのが以下です

![IETester](/images/invert_old_ie.png)

㊧から順番に、IE9、8、7です
7とかさすがにもぅ古すぎだし、ょくなぃ？
ってぁゃぴゎ思ってるんですけど、せっかく表示できたから載せます
非推奨となってるIE9でも、ちゃんと反転してます！

ただIE特有のブラウザモードとかドキュメントモードとか
ぁとWindows7なのか8なのか、とかでも
ちがってくるかもしれなぃです…


## Microsoft編… outline-color: invert

IE10-11でゎ、SVGフィルターゎぁるみたぃなんですけど、
Mozillaでできるょーな、
HTML要素にCSSからSVGフィルターを適用することゎ、できなぃみたぃです
ぁくまでSVGに対してしかSVGフィルターが適用できなぃです

じゃーなにSVGにすればぃーゎけ？って思ぅんですけど、
SVGの㊥でHTMLを扱ぅための`foreignObject`も非対応みたぃです

なのでfilterってゅー概念自体をぁきらめて、
かなりひどぃハックをゃらざるをぇません

かぃてみたんですけど、もぅまじむかっくんで、とりぁぇずみてくださぃ

```scss
@media screen and (min-width:0\0) {
  _::-ms-reveal,
  .invert:before{
    content: "";
    width: 0; height: 0;
    position: absolute;
    top: 50%; left: 50%;
    z-index: 9999;
    outline: 2000px solid invert;
  }
  _::-ms-reveal,
  .invert{
    position: relative;
    overflow: hidden;
  }
}
```

自分でかぃてぉきながらですが、なんなんでしょーかこれゎ
まず最初のメディアクエリー`@media screen and (min-width:0\0)`ゎ、
IE9以降だけに適用されるハックらしくて、
そして`_::-ms-reveal,`ゎ、
IE7とIE10以降とWebkitらへんで適用されるハックみたぃです
この2個を組み合ゎせて、
IEの10以降のみに適用されるょーになってるみたぃです

ブラウザハックにっぃてとても詳しぃ、
↓GitHubのこのリポジトリで載ってました
[4ae9b8/browserhacks #39 New hacks](https://github.com/4ae9b8/browserhacks/issues/39#issuecomment-27563945)

で、実際に階調反転をしてるのゎ、
疑似要素に指定する`outline`プロパティです
`outline`のカラーでしか、階調反転できるょーなものがなさげなんですね
それでゃたらと太くして、㊤に重ねてるってゎけです

この`outline`を使ぅってアイデア自体ゎ元々、
以下のページで提唱されたものです
[Invert a whole webpage with CSS only](http://lea.verou.me/2011/04/invert-a-whole-webpage-with-css-only/)
けどこれゎ画面全体を階調反転するのを目的としたもので、
しかもChromeと干渉したりするから、
ぁゃぴがちょっと手を加ぇたってかんじです

それでWin8のIE10で適用したのが以下です

![IE10](/images/invert_newer_ie.png)

borderに適用されなぃのゎ、まぁしょーがなぃかなってゅーか
もっとテンションぁがる系の手法がぁれば、ぉしぇてほしぃです