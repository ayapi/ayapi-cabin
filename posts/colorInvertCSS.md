{
  title: "階調反転フィルター",
  date:  "2013-11-26 1:02",
  description: "階調反転(ネガポジ反転)のフィルターをcssでゃってみます",
  tags: ["CSS", "JavaScript"]
}

## 階調反転にっぃて

### ぃったぃなにか
ここでゅー階調反転ゎ、ょくネガポジ反転とも言ゎれるゃっです

![階調反転の例](/images/invert_eyecatch.jpg)

単純に、RとGとBの各チャンネルの入力それぞれを
最大値から減算(っまり反転)したものを出力することです
もし1を最大値とするなら、以下のょーにすることです
\\(
R'=1-R \\\\
G'=1-G \\\\
B'=1-B
\\)

このょーにとても単純で、また、ょくしられたフィルターです

### ぃっ、っかぅか

ぁゃぴゎとりぁぇず、ダークカラーのUIがすきです
そのため、ライトカラーの既存サービスとかを、
てっとり早くダークにするために、階調反転をかけたぃ時がぁります

また、ただかっこぃぃからってだけじゃなく、
ぁかるぃ色の画面ゎ、ずっとみてると目がぃたくなっちゃぃます
だから階調反転ゎ、なにげ需要ぁるっぽくなぃ？って思ぃます

注意としてゎ、フィルターをかけるってことゎ
描画に余計な負荷がかかるので、場面ゎ選ぶべきと思ぃます

## WebブラウザのHTML+CSSでの階調反転

### クロスブラウザでCSS3 filterができるライブラリPolyfilter
フィルターに特化してクロスブラウザを実現するPolyfillとして
jsで動く[Polyfilter](https://github.com/Schepp/CSS-Filters-Polyfill)とゅーライブラリがぁります
CSS3での`filter`プロパティをかくだけで
Webkit, Mozilla, Microsoftのブラウザの
たくさんのバージョンで動くょーにしてくれます
[Polyfilterのデモと対応ブラウザ一覧](http://schepp.github.io/CSS-Filters-Polyfill/examples/)
階調反転のCSS`filter:invert()`もこれでできます
けど、IE10以降にゎ非対応です

こまかぃことにゎこだゎらずにフィルターを使ぅにゎ、
これゎとてもぃぃと思ぃます

### 階調反転に限ってCSSを究めると
ぁゃぴゎ今回、階調反転に限って、むだに究めょーとしたので、
もしPolyfilterをっかぅとしても、
ちょっとしたTipsがぃろ②でてきました
なので、ぁぇてPolyfilterをっかゎなぃで、CSSだけでかぃてみました
それがこれです

<code data-gist-id="7644528" data-gist-file="invert.css">https://gist.github.com/ayapi/7644528#file-invert-css</code>

ぃったぃなにをゃってるのかってことと、
Webkit, Mozilla, Microsoftそれぞれにぉぃて
少し踏み込んだ内容をかきます

[階調反転フィルターCSS Webkit編](/posts/colorinvertcssonwebkit)
[階調反転フィルターCSS Mozilla編](/posts/colorinvertcssonmozilla)
[階調反転フィルターCSS Microsoft編](/posts/colorinvertcssonmicrosoft)