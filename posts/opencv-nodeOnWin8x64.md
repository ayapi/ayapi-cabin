{
  title: "WindowsのNode.jsでOpenCV opencv-node編",
  date:  "2013-12-29 7:58",
  description: "opencv-nodeをWindows8 64bit環境でインストールする方法です",
  tags: ["Node", "OpenCV"]
}

## OpenCVとゎ

Intelがだしてる画像処理のライブラリで、顔認識ができたりで有名です

## Node.jsでOpenCVが使ぇる、opencv-node

[opencv-node](https://github.com/codeboost/opencv-node)ゎその名のとーり、
Node.jsでOpenCVをかんたんに扱ぇるょーにしてくれるライブラリです

…ここまで、前回の記事とほとんど同じなんですけど
前回記事：[WindowsのNode.jsでOpenCV node-opencv編](/posts/node-opencvonwin8x64)

## node-opencvとopencv-nodeのちがぃ

node-opencvとopencv-nodeゎ、名前ゎ似ててもまったく別物です
なんでopencv-nodeをっかぉーと思ったかとゅーと

node-opencvゎ、人気で、GitHubも活発ですが
「まじかんたんに顔認識できた！ぁげー↑↑」
みたぃなノリ一発なかんじで、
かんたんさを売りにしてるかんじです
けど、まじめにOpenCVのリファレンスなどをみたりしながら
OpenCVのコードをC++版ゃPython版と同じょーに書ぃてみょぅ、
とゅー使ぃ方にゎ向ぃてなぃとかんじました
ょーするに、ちょっとチャラすぎるだろと

opencv-nodeゎ、ぜん②人気なぃっぽぃんですけど、
かなり忠実なラッパーとゅー印象です
それでも完全でゎなぃんですけど、
でも本家OpenCVにぁるメソッドをそのままNodeでかけるょーに
カバーしょぅとぃぅ姿勢がちゃんとぁるかんじです
ぁゃぴゎ、こっちがメインストリームでぁるべきだと思ぅんですけど

## WindowsのNode.jsにopencv-nodeを入れる方法

opencv-nodeゎ一応Windowsでのテストもされてるみたぃですが
そのテスト環境がたぶんちょっと古ぃかんじで、
最近のVisual Studioのバージョンでビルドが通らなぃから、
今回ゎそこを解決する方法をまとめてみました

ぁゃぴの環境ゎWindows8 64bitです

### Pythonのインストール

[Python2.7.6](http://www.python.org/getit/)
環境変数`Path`に`C:\Python27`を追加して、
環境変数`PYTHONPATH`に`C:\Python27\Lib\site-packages`を指定

### Visual Studio Expressのインストール

[Microsoft Visual Studio C++ 2012 for Windows Desktop Express](http://www.microsoft.com/ja-jp/download/details.aspx?id=34673)
もしくゎ
[Microsoft Visual Studio C++ 2013 for Windows Desktop Express](http://www.microsoft.com/ja-jp/download/details.aspx?id=40787)

どーもnode-gyp界隈で2012ゎ非推奨エアーになってきてるみたぃです
参考：[github - TooTallNate/node-gyp - issue:154](https://github.com/TooTallNate/node-gyp/issues/154#issuecomment-30200499)

ただし2013をっかぅ場合ゎ、
現状最新のOpenCVでも2013用のPrebuiltを配布してなぃので、
CMakeとVisual Studioをっかって、
自分でOpenCVをビルドをする必要がぁります

ぁゃぴゎ2012も2013もどっちもためしました

### OpenCVのインストール

[OpenCV for Windows](http://opencv.org/downloads.html)をインストールします
Visual Studio 2012用だったらv2.4.4以降のどれか
v2.4.3以前だと2012用のPrebuiltが入ってなぃです
Visual Studio 2013用だったら最新(現在v2.4.7)をとってきます

自己解凍形式で、どこに解凍するか聞かれるので、
`C:\`とかゎかりゃすぃすきなとこを指定します

環境変数`OPENCV_ROOT`に`C:/opencv`を追加します

### OpenCVのビルド

㊤までの説明での「Prebuiltがなぃ」場面でゎ
以下のページの手順に従ってビルドをします
[OpenCVをスタティックリンクライブラリでビルドする方法 - イメージングソリューション](http://imagingsolution.net/program/opencv/build_opencv231_static_library/)

CMakeでVisual Studioのバージョンを選択する場面でゎ
VS2013ならVS12、VS2012ならVS11を選択します(ゃゃこしぃ)

Visual Studioでのビルドをするまでをゃればょくて、
後半からの使用方法の部分ゎ関係ぁりません

たとぇばこの手順でVS2013向けにビルドした場合ゎ
ぁらたに生成された`C:/opencv/userbuild/install/x64/vc12`
をっかぅことになります

### node、npm、node-gypのバージョンを確認

node v0.10.23以降 & npm 1.3.17以降にします
その㊤で、node-gypを最新にします

### opencv-nodeのインストール

まず、普通なら使ぃたぃプロジェクトのディレクトリで
`npm install -g opencv-node`をゃるんですけど、
ぁゃぴが試したv0.2.6でゎ
赤文字が大量に出て、インストールに失敗しました

ソースをぃじらなぃとだめっぽぃと思ったので、forkしちゃぃました
[github - ayapi/opencv-node - branch:msvs2012-2013](https://github.com/ayapi/opencv-node/tree/msvs2012-2013)

ぁゃぴfork版をっかぅ時ゎ、
いったんとってきて、ブランチを切り替ぇてくださぃ

```bash
git clone git@github.com:ayapi/opencv-node.git
cd opencv-node
git checkout msvs2012-2013
```

そしたらnode-gyp用の設定ファイル`binding.gyp`を
環境にぁゎせて編集してくださぃ

`/build/x64/vc11/staticlib`となってる部分ゎ、
これゎVS2012用のPrebuiltのパスになってます
自分でOpenCVをビルドした場合ゎ
さっきの例だと`/userbuild/install/x64/vc12/staticlib`とかにします
`x64/vc12`の部分ゎ
VS2013なら`x64/vc12`、VS2012なら`x64/vc11`にします(ゃゃこしぃ)

`libraries`で指定されてるファイルたちゎ、
ファイル名の末尾が`244.lib`でぉゎってるものゎ
OpenCVのバージョンにょって変ゎってくるので
たとぇばOpenCV v2.4.7なら`247.lib`にぜんぶreplaceしてくださぃ

で、そしたらインストールしてみます

```bash
npm install -g ./
```

すると、ビルドがはじまって、
ゃたら黄色ぃ警告がでますが、赤じゃなければへーきです

これでひとまずインストールゎ完了です

## っかぃかた

exampleがまたょくゎかんなぃのばっかなので、
ゎかりゃすぃかんたんなコードをかぃてみました

<code data-gist-id="8161498"></code>

これを実行してみると

```bash
node opencv-node_invertColorTest.js
```
![opencv-node_invertColorTest.js実行結果](/images/opencv-node_bitwise_not_result.jpg)

レナがちゃんとでました！

## 現状ゎかってるバグ

今回のサンプルのょーにウィンドウを表示する系でっかぅ、
`cv.closeOnEsc()`が効かなくて、終了ができません
コマンドプロンプトと画像のウィンドウを自分で閉じるしかなぃ
これちょっとぅざぃので、原因さぐり㊥です

ほかにもみっけたらissueにぁげてコミットしてぃきます