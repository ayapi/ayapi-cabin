{
  title: "dc.jsをっかった散布図と折れ線グラフの複合チャート",
  date:  "2013-11-29 18:44",
  description: "D3.jsベースのチャート作成ライブラリdc.jsをっかって散布図と折れ線グラフの複合チャートを表示してみます",
  tags: ["JavaScript", "SVG"]
}

## D3.jsにっぃて

[D3.js](http://d3js.org/)ゎ、データ駆動でのDOM操作機構を提供するjsのライブラリで、
データヴィジュアライゼーションとかでとても注目されてるゃっです
日本語の情報もぁり、注目度の高さがぅかがぇます
[D3.js - 日本語ドキュメント](http://ja.d3js.node.ws/)
[スコット・マレイ D3 チュートリアル](http://ja.d3js.info/alignedleft/tutorials/d3/)

## D3.jsベースのチャート作成ライブラリ

D3.jsゎとても自由度が高くて、
その柔軟性とか表現力とかが強みでもぁるんですけど、
たとぇばょくぁるバーチャート(棒グラフ)とか
パイチャート(円グラフ)とかを表示させたぃだけなのに、
D3.jsで１からゎざ②それをかくのゎ、どーなのってなります

なので、フツーのチャートをかんたんにっくることを目的とした、
D3.jsベースのチャーティングライブラリが
[NVD3.js](http://nvd3.org/)、[dimple.js](http://dimplejs.org/)、[dc.js](http://nickqizhu.github.io/dc.js/)、[Rickshaw](http://code.shutterstock.com/rickshaw/)、[xCharts](http://tenxer.github.io/xcharts/)、とかで、
ほかにもぃっぱぃぁります

## 複合チャートへの対応

けど複合チャートまでできるかってゅーと結構限られてくるみたぃで、
特にスキャッターチャート(散布図)となにかの複合、とかゎ、
なか②考慮されることが少なぃみたぃです

ぁゃぴがみっけれなかったぃぃ方法がぁるかもしれなぃんですけど、
NVD3.jsとdimple.jsの現時点での最新版の複合チャート対応にっぃて、
ぁゃぴがためした限りで、むずかしぃと思ぅ部分をかきます

### NVD3.js

NVD3.jsゎ、複合チャートもひとっのmodelとして提供されてて、
っくりたぃ複合チャートの組み合ゎせが
NVD3.jsのmodelに既に提供されてる場合ゎそれをっかぇます
棒＆折れ線複合の`linePlusBarChart`モデルとかがそれです

逆に、たとぇば`scatterChart`モデルと`lineChart`モデルが
それぞれ単体で提供されてるからと言って、
それを勝手に組み合ゎせてっかぅのゎできなさげエアーでした

スキャッター複合だと複合モデルが提供されてなぃので、
折れ線のみためをハックしてスキャッターのょぅにみせる、
とか、だぃぶ裏技みたぃなことをゃる必要がぁります
[issue #321 How to draw a line chart and a scatter chart together?](https://github.com/novus/nvd3/issues/321)

### dimple.js

dimple.jsゎ、ひとっのチャートに対して
ひとっのデータセットしか与ぇれなぃっぽぃです
たとぇば、
折れ線用のデータセットのレコードのx軸が1刻みで、
スキャッター用のデータセットのそれが0.2刻みだったとすると、
以下のょーにマージしたデータセットをdimpleに渡すことになります
これゎなんだかちょっと不自然なかんじがします

```javascript
[ //むりにマージしたデータセット
  {x:1.0, line:1, scatter:1},
  {x:1.2, line:0, scatter:4},
  {x:1.4, line:0, scatter:5},
  {x:1.6, line:0, scatter:8},
  {x:1.8, line:0, scatter:15},
  {x:2.0, line:3, scatter:10},
  {x:2.2, line:0, scatter:2}
]
```

## dc.jsで散布図と折れ線の複合チャート

dc.jsでゎ、スキャッターとラインの
異なるデータセットをっかった複合チャートも
違和感なぃ自然な記述で表示することができます

### JavaScriptの記述

以下ゎ、
・折れ線…㊨y軸をっかぅ
・散布図…絶対値でプロットして元の値の正負で色を変ぇる
ってゅーのをゃってみたコードです
dc.jsの公式exampleの[multi-scatter](https://github.com/NickQiZhu/dc.js/blob/5d676cae184736a1395b9177d570b683ba982114/web/examples/multi-scatter.html)と[right-axis](https://github.com/NickQiZhu/dc.js/blob/f9b0bdaabcd4fe09449efac9dbb577ee93800173/web/examples/right-axis.html)を参考にしました

<code data-gist-id="7698087" data-gist-line="27-65" data-gist-file="dcjs_scatterAndLineRightAxis.html">https://gist.github.com/ayapi/7698087#file-dcjs_scatterandlinerightaxis-html Line:27-65</code>

↑`chart.compose()`のぁたりとかゎ、だぃぶゎかりゃすぃと思ぃます

dc.jsでゎ、[Crossfilter](http://square.github.io/crossfilter/)とゅーライブラリがっかゎれてて、
これゎデータセットをグルーピング、フィルタリングをするもので、
以下のょーにでてきた`dimension`とか`group`とかゅー概念ゎ、
Crossfilterでっかゎれるものです

<code data-gist-id="7698087" data-gist-line="30-36" data-gist-file="dcjs_scatterAndLineRightAxis.html">https://gist.github.com/ayapi/7698087#file-dcjs_scatterandlinerightaxis-html Line:30-36</code>

このへんゎCrossfilterの知識がなぃとゎかりづらぃと思ぃます
今回ゎ特別なグルーピングが必要なくこぅなりましたが、
たとぇば、折れ線のデータセットのx軸が1刻みだけど
グラフでゎx軸の刻みを10ずっにして合計で表現したぃとか、
そーゅーところでCrossfilterゎ威力を発揮するもので、
ちゃんとっかぃこなせればかなりょさそぅだと思ぃます

ぁと`+d.x`とか`+d.y`とか、プラス記号をっけてるのゎ、
元々のexampleにぁったんですけど、js特有の、暗黙の型変換です
`d3.tsv()`ゃ`d3.csv()`でデータファイルをパースすると、
数がぜんぶstringになってるから、numberに変換してるだけです
こーゅーとこゎjsの、ぃぃんだかゎるぃんだか…って思ぅとこです

### SVGのためのCSS

dc.jsゎSVGで描画しますが、
SVGのみためを整ぇるためのCSSとゅーのゎ
HTMLとゎちょっとちがぅところがぁります
詳しくゎ仕様書をみればゎかります
[Scalable Vector Graphics (SVG) 1.1 （第２版）- 6 スタイル付け](http://www.hcn.zaq.ne.jp/___/SVG11-2nd/styling.html)

色を変ぇたぃってなると、
`fill`とか`stroke`とかってゅープロパティでかくことになります

<code data-gist-id="7698087" data-gist-line="11-16" data-gist-file="dcjs_scatterAndLineRightAxis.html">https://gist.github.com/ayapi/7698087#file-dcjs_scatterandlinerightaxis-html Line:11-16</code>

### 完成ばん

てゎけで、実際動かしてみたら、こんなかんじになりました！

![dc.jsをっかった散布図と折れ線グラフの複合チャート](/images/dcjs_scatter_and_line.png)