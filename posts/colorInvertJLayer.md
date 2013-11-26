{
  title: "階調反転フィルターJava Swing/JLayer",
  date:  "2013-11-27 7:27",
  description: "SwingのJLayerでコンポーネントの階調反転をゃってみます",
  tags: ["Java", "Swing"]
}

## Swingにっぃて

Swingゎ、JavaのGUIツールキットでとても有名なゃっです
JavaのGUIゎ、最近ゎJavaFX2とかもぁります
けど、ぁゃぴゎぃまメインでさゎってるSDKがSwingベースだから、
部分的にJavaFX2をっかってみたりしてゎぃるものの、
Swingの勉強もだぃぶ必要です

## SwingのJLayer

Swingにぉぃてゎ、JLayerクラス(JXLayerの派生)をっかって、
フィルターをっくることができ、
Oracle公式サイトに、とてもゎかりゃすぃ解説ページがぁります
[JLayerを使用したコンポーネントのデコレート方法 - Oracle](http://www.oracle.com/technetwork/jp/articles/java/jlayer-439461-ja.html)
今回ゎこの解説にでてくるBlurエフェクトのサンプルを特に参考にします

ぁとRGB変換でゎ以下のサンプルが参考になります
[JLayerを使ってJProgressBarの色相を変更する - Java Swing Tips - てんぷらメモ](http://terai.xrea.jp/Swing/ColorChannelSwapFilter.html)
↑ぃっぱぃSwingのサンプルが載ってて、すばらしぃです

## JLayerで階調反転

てゎけでさっそく、階調反転をSwingのJLayerでゃってみます

### LayerUIサブクラス

#### 最小構成
まず、`LayerUI`のサブクラスをかきます

> [JLayerを使用したコンポーネントのデコレート方法 - Oracle](http://www.oracle.com/technetwork/jp/articles/java/jlayer-439461-ja.html)
> LayerUIクラスのpaint()メソッドを使用すると、コンポーネントの描画方法を完全にコントロールできます。

たとぇばまったくなにもぃじらなぃ`paint`メソッドゎこぅです

```java
public class InvertColorLayerUI extends LayerUI<JComponent> {
	@Override
	public void paint(Graphics g, JComponent c) {
		super.paint(g, c);
	}
}
```

#### オフスクリーンイメージの追加

Oracle公式のBlurサンプルでも、てんぷらメモの色相サンプルでも、
オフスクリーンイメージがっかゎれてます
みぇなぃ画像に先にレンダリングしとぃて、ぁとから一気に表示する、
ってゃりかたで、これゎべっにJavaにゎ限らず、
グラフィック系でゎどこででもでてくるゃりかたです

まだフィルターゎなにもかけなぃで、
オフスクリーンイメージのしくみだけ追加するとこーなります

```java
public class InvertColorLayerUI extends LayerUI<JComponent> {
	private BufferedImage bufferedImage;
	@Override
	public void paint(Graphics g, JComponent c) {
		int w = c.getWidth();
		int h = c.getHeight();
		if (w == 0 || h == 0) return;

		//オフスクリーンイメージがなかったり大きさがちがってたら生成する
		if (bufferedImage == null
				|| bufferedImage.getWidth() != w
				|| bufferedImage.getHeight() != h) {
			bufferedImage = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);
		}

		//オフスクリーンイメージにコンポーネントをレンダリングする
		Graphics2D g2 = bufferedImage.createGraphics();
		g2.setClip(g.getClip());
		super.paint(g2, c);
		g2.dispose();

		//オフスクリーンイメージをそのまま画面に描画する
		Image image = c.createImage(bufferedImage.getSource());
		g.drawImage(image, 0, 0, c);
	}
}
```

#### フィルタークラスの追加

それで、オフスクリーンイメージをそのまま画面に描画するんじゃなく、
オフスクリーンイメージに対してフィルターをかけるんですけど、
フィルターゎ`RGBImageFilter`を継承してっくるのがぃぃそぅです
ゃっとここで、階調反転そのものをかきます

<code data-gist-id="7660869" data-gist-line="33-40">https://gist.github.com/ayapi/7660869 Line:33-40</code>

このビット演算ゎ、Aゎ関係なぃので取り出してそのままの値で、
RGBゎ取り出して反転して、
AとRGBをまたぁゎせて返しましょぅ、とゅー内容です
このへんゎSwingだからって特別なとこゎなにもなぃです／(^o^)＼

#### paintメソッド内でフィルターを適用

それで`LayerUI`サブクラスの`paint`メソッドの最後の描画の前で
このフィルタークラスを適用するょーにします

<code data-gist-id="7660869" data-gist-line="25-30">https://gist.github.com/ayapi/7660869 Line:25-30</code>

これで`LayerUI`サブクラスゎ完成です＼(^o^)／

### JLayerにコンポーネントとLayerUIを指定する

たとぇばパネルをソースにしてフィルターをかけるとすれば、
こーゅーふうに指定します
(実際にっかぅ時ゎ空のパネルじゃなくてぃろ②追加するんですけど)

<code data-gist-id="7660869" data-gist-line="48-50">https://gist.github.com/ayapi/7660869 Line:48-50</code>

そして`layer`だけを親のフレームとかに`add`します
`panel`ゃ`layerUI`ゎもぅ`add`しなぃです

### 完成ばん

とゅーゎけで、できたコードがこれですー！

<code data-gist-id="7660869">https://gist.github.com/ayapi/7660869</code>