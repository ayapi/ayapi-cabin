{
  title: "階調反転フィルターCSS Mozilla編",
  date:  "2013-11-26 1:12",
  description: "Mozilla系ブラウザで階調反転をするCSSフィルターにっぃてしらべました",
  tags: ["CSS","SVG"]
}

## Mozilla編… CSS3 filter: url(svg-url#element-id)

Firefoxにぉぃてゎ、
Webkit編でかぃた`filter: invert()`ゎ実装されてなく、
SVGでフィルターをっくってCSSに埋め込む必要がぁります
SVG自体にっぃてゎ、このページにとても詳しく載ってます
[svg要素の基本的な使い方まとめ](http://www.h2.dion.ne.jp/~defghi/svgMemo/svgMemo_11.htm)
↑非常に貴重な情報で、とてもぁりがたぃです

### ぃくっかぁる原始フィルターの書き方

SVGで輝度を変換するにゎぃくっかの方法がぁるんですけど、
以下にかくサンプルゎどれもゃってることゎ同じ、階調反転です

#### feColorMatrixでmatrix

仕様書にょると、`feColorMatrix type="matrix"`にぉぃて、
適用される変換の行列ゎ以下のとーりです

\\(
\left(
\begin{array}{c}
R' \\\\
G' \\\\
B' \\\\
A' \\\\
1  \\\\
\end{array}
\right)
=
\left(
\begin{array}{c}
a00 & a01 & a02 & a03 & a04 \\\\
a10 & a11 & a12 & a13 & a14 \\\\
a20 & a21 & a22 & a23 & a24 \\\\
a30 & a31 & a32 & a33 & a34 \\\\
  0 &   0 &   0 &   0 &   1 \\\\
\end{array}
\right)
\times
\left(
\begin{array}{c}
R \\\\
G \\\\
B \\\\
A \\\\
1  \\\\
\end{array}
\right)
\\)

さらにゎかりゃすくするためにかくと、
a00～a34の値が以下のょーに与ぇられる時、
入力と出力がまったく同じ値になります

\\(
\left|
\begin{array}{c}
1 & 0 & 0 & 0 & 0 \\\\
0 & 1 & 0 & 0 & 0 \\\\
0 & 0 & 1 & 0 & 0 \\\\
0 & 0 & 0 & 1 & 0 \\\\
\end{array}
\right|
\\)

これに従ってRGBの輝度を反転させるなら、
フィルターゎ以下のょーになります
a00～a34の値を、スペースもしくゎカンマ区切りで
`values`属性に指定して、変換を定義します
A(アルファ)ゎ関係なぃのでぃじりません

```xml
<svg xmlns="http://www.w3.org/2000/svg">
	<filter id="invert">
		<feColorMatrix
			in="SourceGraphic"
			type="matrix"
			values="-1, 0, 0, 0, 1,
					 0,-1, 0, 0, 1,
					 0, 0,-1, 0, 1,
					 0, 0, 0, 1, 0"
		 />
	</filter>
</svg>
```

#### feComponentTransferでlinear

検索してると㊤の`matrix`での手法がょくかかれてるんですけど、
今回の階調反転のょーに、各チャンネルの出力に対して
ほかのチャンネルの入力が関係しなぃ
(たとぇばR'の算出にGとBをっかゎなぃ)、
そーゅー変換でゎ、行列ょりか、
`feComponentTransfer`のほうがゎかりゃすぃかもしれません
`linear`ゎ一次関数で、
`intercept`で切片、`slope`で傾きを指定します

```xml
<svg xmlns="http://www.w3.org/2000/svg">
	<filter id="invert">
		<feComponentTransfer>
			<feFuncR type="linear" slope="-1" intercept="1" />
			<feFuncG type="linear" slope="-1" intercept="1" />
			<feFuncB type="linear" slope="-1" intercept="1" />
		</feComponentTransfer>
	</filter>
</svg>
```

#### feComponentTransferでtable

`table`ゎ、折れ線を表現できるものですが、
与ぇる値を2個だけにすれば`linear`と同じ結果になります

```xml
<svg xmlns="http://www.w3.org/2000/svg">
	<filter id="invert">
		<feComponentTransfer>
			<feFuncR type="table" tableValues="1 0" />
			<feFuncG type="table" tableValues="1 0" />
			<feFuncB type="table" tableValues="1 0" />
		</feComponentTransfer>
	</filter>
</svg>
```

### SVGフィルタをCSSで適用する

変換自体ゎ以上のとーりで、どれかすきなのをっかぇばぃぃんですけど、
CSS3の`filter: url(svg-url#element-id)`をっかって、
DataURIスキームでSVGを埋め込むと、
HTMLの要素にフィルターを適用できます

以下ゎ、DataURIスキームなのでちょっと横に長くなっちゃぃますが、
㊤でっくったフィルターのぅち`feColorMatrix`をCSSにしたものです

```scss
.invert{
  filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="invert"><feColorMatrix in="SourceGraphic" type="matrix" values="-1,0,0,0,1,0,-1,0,0,1,0,0,-1,0,1,0,0,0,1,0"/></filter></svg>#invert');
}
```

Firefox 25で適用してみると、以下のょーになりました

![Firefox 25での実行結果](/images/invert_firefox.png)

### 色空間のちがぃ

たしかに反転できてるんですけど、
Webkitでの`filter: invert();`とゎ、だぃぶ出力がちがぃます

![FirefoxとChromeのfilterの出力のちがぃ](/images/invert_diff_chrome_firefox.png)
㊧がFirefox、㊨がChromeです

これゎなぜかとゅーと、色空間がちがぅからです
SVGでの原始フィルターにゎどれにも共通で
`color-interpolation-filters`とゅー属性がぁり、
この属性でフィルターで使ゎれる色空間が決められますが、
デフォルト値ゎ仕様でなぜか`linearRGB`になってます

これに`sRGB`を指定することで、自然な出力になり、
Webkitでの出力と同じにできます

```xml
<!-- feComponentTransferでsRGBを指定する例 -->
<svg xmlns="http://www.w3.org/2000/svg">
	<filter id="invert">
		<feComponentTransfer color-interpolation-filters="sRGB">
			<feFuncR type="linear" slope="-1" intercept="1" />
			<feFuncG type="linear" slope="-1" intercept="1" />
			<feFuncB type="linear" slope="-1" intercept="1" />
		</feComponentTransfer>
	</filter>
</svg>
```

てことで、さっきの`feColorMatrix`のDataURIスキームのCSSに
`color-interpolation-filters="sRGB"`を追加してみます

```scss
.invert{
  filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="invert"><feColorMatrix color-interpolation-filters="sRGB" in="SourceGraphic" type="matrix" values="-1,0,0,0,1,0,-1,0,0,1,0,0,-1,0,1,0,0,0,1,0"/></filter></svg>#invert');
}
```

これでふたたび適用してみると、意図したとーりの出力になりました！

![Firefox 25での実行結果](/images/invert_srgb.png)