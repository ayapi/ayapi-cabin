{
  title: "WindowsのNode.jsでOpenCVを使ぅ",
  date:  "2013-12-25 22:41",
  description: "node-opencvをWindows8 64bit環境でインストールする方法です",
  tags: ["Node", "OpenCV"]
}

## OpenCVとゎ

Intelがだしてる画像処理のライブラリで、顔認識ができたりで有名です

## Node.jsでOpenCVが使ぇる、node-opencv

[node-opencv](https://github.com/peterbraden/node-opencv)ゎその名のとーり、
Node.jsでOpenCVをかんたんに扱ぇるょーにしてくれるライブラリです

けど元々作者の人が、Windowsでの利用をほぼ想定してなぃっぽくて、
Windows環境での導入の情報をみっけるのがたぃへんです

forkブランチの[notcoffeetable/node-opencv](https://github.com/notcoffeetable/node-opencv)に
Windowsでの使用例がコミットされてるのをみっけ、
参考にしてがんばってみました

## WindowsのNode.jsにnode-opencvを入れる方法

ぁゃぴの環境ゎWindows8 64bitで、Node v0.10.21です

### Pythonのインストール

[Python2.7.6](http://www.python.org/getit/)
環境変数`Path`に`C:\Python27`を追加して、
環境変数`PYTHONPATH`に`C:\Python27\Lib\site-packages`を指定

### GTK+のインストール

[GTK+ all-in-one bundle 3.6.4](http://www.gtk.org/download/index.php)
pkg-configがとにかく必須なんですけど、
ほかゎ要るのかぁゃぴゎょくゎかんなぃけど一応all-in-one入れました
詳しぃ人ゎall-in-oneじゃなくてもぃぃかもしれません
インストーラじゃなぃのでzipを任意の場所に解凍するだけです
環境変数`Path`に`C:\gtk\bin`、
環境変数`PKG_CONFIG_PATH`に`C:\gtk\lib\pkgconfig`を追加
(解凍した場所にょって変ぇてくださぃ↑)

### Visual Studio Expressのインストール

[Microsoft Visual Studio C++ 2012 for Windows Desktop Express](http://www.microsoft.com/ja-jp/download/details.aspx?id=34673)
無料で使ぇるExpress版で充分なんだそーです

### OpenCVのインストール

[OpenCV for Windows Version 2.4.4](http://opencv.org/downloads.html)をインストールします
自己解凍形式で、どこに解凍するか聞かれるので、
`C:\`とかゎかりゃすぃすきなとこを指定します

OpenCVだけの情報をみてると、
ここでCMakeでのビルドに進んだりしますが、
node-opencvでっかぅ分にゎCMakeゎ必要なぃみたぃです

環境変数`Path`に`C:\opencv\build\x64\vc11`を追加します
このパスゎ、64bit環境なら`x64\vc11`、32bit環境なら`x86\vc11`です

### opencv.pcファイルの編集と配置

`pkg-config`が使ぅ`opencv.pc`とゅーファイルを作ります
参考：[notcoffeetable/node-opencv/opencv_example.pc](https://github.com/notcoffeetable/node-opencv/blob/master/opencv_example.pc)

```makefile
# Package Information for pkg-config

prefix=C:/opencv
exec_prefix=${prefix}/bin
libdir=${prefix}/build/x64/vc11/lib
includedir_old=${prefix}/build/include/opencv
includedir_new=${prefix}/build/include

Name: OpenCV
Description: Open Source Computer Vision Library
Version: 2.4.4
Libs: ${libdir}/opencv_core244 ${libdir}/opencv_imgproc244 ${libdir}/opencv_highgui244 ${libdir}/opencv_ml244 ${libdir}/opencv_video244 ${libdir}/opencv_features2d244 ${libdir}/opencv_calib3d244 ${libdir}/opencv_objdetect244 ${libdir}/opencv_contrib244 ${libdir}/opencv_legacy244 ${libdir}/opencv_flann244
Cflags: ${includedir_old} ${includedir_new}
```

場合にょって編集が必要なのゎ`prefix`のパスと`libdir`のパスで、
ほかゎたぶん変ぇなくてぃぃと思ぃます

`C:\opencv\opencv.pc`として保存してぉき、
環境変数`PKG_CONFIG_PATH`に`C:\opencv`を追加します

### node-opencvのインストール

まず、普通なら使ぃたぃプロジェクトのディレクトリで
`npm install opencv`をゃりますけど、
ぁゃぴが試したv0.4.0でゎ
`node-opencv\src\Matrix.cc`で`round`がなぃとかで怒られて、
インストールに失敗しました

ソースをぃじらなぃとだめっぽぃと思ったので、
本家[node-opencv](https://github.com/peterbraden/node-opencv)から一旦とってきました
`git clone git@github.com:peterbraden/node-opencv.git`

そして`node-opencv\src\Matrix.cc`の
めっちゃ最初のほーに`round`を強引に追加します
参考：[github - peterbraden/node-opencv - issue:83](https://github.com/peterbraden/node-opencv/issues/83#issuecomment-31184572)

```c++
#include "Contours.h"
#include "Matrix.h"
#include "OpenCV.h"

inline double round(double d){ return floor( d + 0.5); }
```

ぁゃぴC++の知識なくて、もっとぃぃ方法ぁるかもしれなぃですけど…

で、そしたら、使ぃたぃプロジェクトのディレクトリに行って、
インストールしてみます

```bash
cd ../opencv_sample/
npm install ../node-opencv
```

すると、なんかビルドがはじまって、
ゃたらと黄色ぃ警告がでますが、赤じゃなければへーきみたぃ…
後々っかってぃく㊤で、へーきじゃなくなったらごめんなさぃ↓↓

これでひとまずインストールゎ完了です

## 使ぃかた

でゎ`node-opencv/example/convert_image.js`を、
`opencv_sample/`のほーに持ってきて、
パスちょっと変ぇて使ってみます

```javascript
//sample.js (example/convert_image.jsのパクり)
var cv = require('opencv');
cv.readImage("./mona.png", function(err, im) {
  img_hsv = im.copy();
  img_gray = im.copy();

  img_hsv.convertHSVscale();
  img_gray.convertGrayscale();

  im.save("./nor.png");
  img_hsv.save("./hsv.png");
  img_gray.save("./gray.png");

  console.log("Guardado");
});
```

実行してみると

```bash
node sample.js
```

以下のょーに、画像が生成されました！
けど、`convertHSVscale()`ってなんなんだろ…
この`hsv.png`の色、バグってんのか合ってんのかゎかんなぃです／(^o^)＼
グレースケールゎ、ちゃんとできてるっぽぃですね

![生成された3枚と元画像1枚](/images/node-opencv_comvert_image_result.jpg)

まだょくゎかりませんが、これから使ぃこんでみょーかなと思ってます