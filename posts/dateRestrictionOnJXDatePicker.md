{
  title: "JXDatePickerで選択可能な日付範囲を制限する",
  date:  "2013-11-27 20:34",
  description: "JavaのGUIでカレンダーから日付を選択させるSwingのライブラリJXDatePickerをっかってみました",
  tags: ["Java", "Swing"]
}

## JXDatePickerにっぃて
JXDatePickerゎSwingのコンポーネントで、
カレンダーから日付を選ぶUIをかんたんに追加できます
同様のものゎ名前まで似てる[JDatePicker](http://www.jdatepicker.com/)とかぁるんですけど、
派生とかじゃなくてぜん②ちがぅものみたぃです

ただ選択させて、日付を取得するだけの
ぃちばんシンプルな使ぃ方だと、こんなかんじです

```java
public class Calendar extends JPanel {
	private JXDatePicker datePicker;
	public Calendar(){
		datePicker = new JXDatePicker();
		add(datePicker);
	}
	public Date getDate(){
		return datePicker.getDate();
	}
}
```

## 選択可能な日付を制限する

### 日付の計算と指定
今回ゎ、明日以降の1週間だけを選択可能にしてみることにします

まず明日とか1週間後とかを計算しなきゃですが、
[Apache Commons Lang](http://commons.apache.org/proper/commons-lang/)の`DateUtils`クラスをっかぅと、
日付の計算もとてもかんたんにできます

<code data-gist-id="7592669" data-gist-line="2" data-gist-hide-footer="true" data-gist-hide-line-numbers="true">https://gist.github.com/ayapi/7592669 Line:2</code>

`DateUtils`クラスでの明日と1週間後の計算ゎこんなかんじでかんたんです

<code data-gist-id="7592669" data-gist-line="15-16">https://gist.github.com/ayapi/7592669 Line:15-16</code>

もし昨日とかがほしければ`addDays`で負の値を足せばできます

それで`JXDatePicker`のインスタンスに、
ぃっからぃっまで選択可能にするのかを指定します
<code data-gist-id="7592669" data-gist-line="18-20">https://gist.github.com/ayapi/7592669 Line:18-20</code>


### みためを整ぇる

以上のコードで動くにゎ動くんですけど、
デフォだと、バツ印が真っ赤で、ちょっと派手すぎって思ぅ時がぁります

バツ印の色を変ぇるにゎ`UIManager`のUIプロパティで色を指定します

<code data-gist-id="7592669" data-gist-line="22">https://gist.github.com/ayapi/7592669 Line:22</code>

このょーにUIプロパティーを変ぇた時ゎ、
値を変ぇたことをUIに適用(更新)するのが必要で、
`JComponent`の`updateUI()`メソッドもしくゎ
`SwingUtilities.updateComponentTreeUI()`どちらかをっかぃます

それで適用してみると、バツの色がちゃんと変ぇれました！

![JXDatePickerデフォルトカラー](/images/jxdatepicker_restriction_default_color.png) ![JXDatePickerカスタムカラー](/images/jxdatepicker_restriction_custom_color.png)


### Syntheticaをぁててる時の注意

ちょっと話ずれるんですけど、
Swingのみためを一気にかっこょくしてくれる
[Synthetica](http://www.jyloo.com/synthetica/)ってゅーテーマ集がぁります
ぁゃぴも[BlackEye](http://www.jyloo.com/synthetica/screenshots/blackeye/)を入れてテンションをぁげてます

けどSyntheticaをふつーに入れてるだけだと、
JXDatePickerがそも②動きません！
まったくぉなじエラーで困ってる人がぃました
[jxdatepicker with Synthetica Aluoxide look and feel not working - Stack Overflow](http://stackoverflow.com/questions/17467188/jxdatepicker-with-synthetica-aluoxide-look-and-feel-not-working)

Syntheticaをっかってる状態でJXDatePickerを動かすにゎ
[SyntheticaAddons](http://www.jyloo.com/syntheticaaddons/)も入れれば動くょーになります

ちなむとSynthetica BlackEyeをぁてたらこんなかんじです
ゃっぱかっこぃぃ＼(^o^)／

![JXDatePickerとSynthetica BlackEye](/images/jxdatepicker_with_blackeye.png)


### 完成ばん

てことで、できたコードがこれですー＼(^o^)／

<code data-gist-id="7592669">https://gist.github.com/ayapi/7592669</code>