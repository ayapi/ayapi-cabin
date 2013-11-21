{
  title: "node.exeのspawnからPythonを叩く時の標準入出力の文字コード",
  date:  "2013-11-21 11:32",
  description: "WindowsでNodeからPythonを実行する時に日本語が文字化けになり、しらべてみました",
  tags: ["Node", "Python"]
}

## node-pygmentize-bundledからのPygments
割と気に入ってる[CabinJS](http://www.cabinjs.com/)なんですけど、
シンタックスハイライトで[node-pygmentize-bundled](https://github.com/rvagg/node-pygmentize-bundled)とゅー、
[Python](http://www.python.jp/)の[Pygments](http://pygments.org/)をnodeから叩くものが使ゎれてて、
ハイライトするコードに日本語が含まれてると、
日本語の部分が文字化けすることに気づきました
それを解決するためにしらべました

ちなむとぁゃぴゎPythonのことゎまったくゎかりません、
.pyファイルとか、はじめてかきました

## Pythonの標準入出力の文字コード自動認識

Pythonゎ、標準入出力のエンコードを
システムにぁゎせて自動切替してるそーで、
Windowsのcmd.exeでゎ`chcp`コマンドでcode pageを変ぇると、
Pythonの標準入出力エンコードが切り替ゎります

cmd.exeでCP932(≒SJIS)に設定しpythonを実行する例
``` bash
C:/test/> chcp 932
現在のコードページ: 932

C:/test/> python
Python 3.3.2 (v3.3.2:d047928ae3f6, May 16 2013, 00:06:53) [MSC v.1600 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import sys
>>> sys.getdefaultencoding()
'utf-8'
>>> sys.stdin.encoding
'cp932'
>>> sys.stdout.encoding
'cp932'
```

cmd.exeでCP65001(UTF-8)に設定しpythonを実行する例
``` bash
C:/test/> chcp 65001
Active code page: 65001

C:/test/> python
Python 3.3.2 (v3.3.2:d047928ae3f6, May 16 2013, 00:06:53) [MSC v.1600 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import sys
>>> sys.getdefaultencoding()
'utf-8'
>>> sys.stdin.encoding
'cp65001'
>>> sys.stdout.encoding
'cp65001'
```

以上から、Pythonの標準入出力のエンコードが、
Active code pageにぁゎせられてるのがゎかります

## node.exeからだと話ゎ別になる

けど、nodeのspawnからPythonを叩くと、
node.exeを実行してるシステムのActive code pageゎ
Python的にゎ関係なくなっちゃぅっぽくて、それがゎかる例が以下です

C:/test/test.js
```javascript
var spawn = require('child_process').spawn;
var python_test = spawn('python', ['test.py']);

python_test.stdout.on('data', function (data) {
  console.log(data);
});
```

C:/test/test.py
```python
#! c:/Python33/python.exe
# -*- coding: utf-8 -*-
import sys;
print("sys.getdefaultencoding() = ", sys.getdefaultencoding());
print("sys.stdin.encoding = ", sys.stdin.encoding);
print("sys.stdout.encoding = ", sys.stdout.encoding);
```

このtest.jsを実行してみると、以下のょーになります

``` bash
C:/test/> chcp 65001
Active code page: 65001

C:/test/> node test.js
sys.getdefaultencoding() = utf-8
sys.stdin.encoding = cp932
sys.stdout.encoding = cp932
```

Active code pageが65001だけど、
Pythonの標準入出力ゎCP932って出てます(>_<)
これゎ、とても困ります

## 環境変数「PYTHONIOENCODING」の存在

Pythonのドキュメントをちゃんと読んでみると、
以下のょーな記述がぁりました

><cite>[Python v3.3.3 documentation - 28.1. sys — System-specific parameters and functions](http://docs.python.org/3/library/sys.html#sys.stdin)</cite>
>The character encoding is platform-dependent. Under Windows, if the stream is interactive (that is, if its isatty() method returns True), the console codepage is used, otherwise the ANSI code page. Under other platforms, the locale encoding is used (see locale.getpreferredencoding()).
>Under all platforms though, you can override this value by setting the PYTHONIOENCODING environment variable.

なんだ`PYTHONIOENCODING`とかゅー環境変数がぁるのか！
てことで、spawnのオプションで環境変数を指定してみます

### spawnのオプションで環境変数を指定する

C:/test/test2.js
```javascript
var spawn = require('child_process').spawn;
var python_test = spawn('python', ['test.py'], {
    env:{ "PYTHONIOENCODING" : "cp65001" }
});

python_test.stdout.on('data', function (data) {
  console.log(data);
});
```

実行してみると、以下のょーになります

``` bash
C:/test/> chcp 65001
Active code page: 65001

C:/test/> node test2.js
sys.getdefaultencoding() = utf-8
sys.stdin.encoding = cp65001
sys.stdout.encoding = cp65001

C:/test/> chcp 932
現在のコードページ: 932

C:/test/> node test2.js
sys.getdefaultencoding() = utf-8
sys.stdin.encoding = cp65001
sys.stdout.encoding = cp65001
```

これで、nodeのspawnでUTF8の日本語をPythonに投げても
SJISでゎなくちゃんとUTF8として扱ってくれるょーになりました！

### Windowsのシステム環境変数で指定する

けどspawnでぃち②毎回指定するのゎ、人生っらぃなと思ぅし、
てか今回のぁゃぴが解決したぃことゎそも②
node-pygmentize-bundledの内部でゃってるspawnなので、
中のコードを書き換ぇるのゎ、ぁんまりゃる気がしません

そこで、Windowsのシステム環境変数に
`PYTHONIOENCODING`を設定してみることにしました

![システム環境変数に`PYTHONIOENCODING`を設定](/images/pythonencoding.png)

すると、spawnでenvを指定してなぃ最初のtest.jsでも、
``` bash
C:/test/> chcp 932
現在のコードページ: 932

C:/test/> node test.js
sys.getdefaultencoding() = utf-8
sys.stdin.encoding = cp65001
sys.stdout.encoding = cp65001
```
このょーにcp65001になりました！

Windowsのシステム環境変数に設定をした場合ゎ、
以下のょーに、nodeじゃなく普通にcmd.exeから実行する場合にも、
Active code pageの自動認識ゎなくなり、必ずUTF-8になるので、
そこゎ逆に注意が必要かもしれません

``` bash
C:/test/> chcp 932
現在のコードページ: 932

C:/test/> python
Python 3.3.2 (v3.3.2:d047928ae3f6, May 16 2013, 00:06:53) [MSC v.1600 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import sys
>>> sys.getdefaultencoding()
'utf-8'
>>> sys.stdin.encoding
'cp65001'
>>> sys.stdout.encoding
'cp65001'
```

ぁゃぴゎ今のところcmd.exeからPython直叩きするょーな場面なぃし、
このままでぃこーと思ぃます