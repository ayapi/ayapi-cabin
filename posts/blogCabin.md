{
  title: "CabinとGitHub Pagesでブログを作ってみてる",
  date:  "2013-11-18",
  description: "Cabinゎ、NodeJSてかGruntで動く静的サイトジェネレーターだそーです GitHub Pagesにかんたんにデプロイできるみたぃです",
  tags: ["Cabin", "JavaScript", "Node", "EJS"]
}

## Jekyllを見送った理由

[GitHub Pages](http://pages.github.com/)でブログをはじめたくて、
最初[Jekyll Bootstrap](http://jekyllbootstrap.com/)で作ってみてたんですけど、
ちょっとなにか突っ込んだことをゃろーとすると
WindowsでのRuby系ってかなりゃばくて、エラーが多ぃってゅーか、
むしろエラーしかでなぃ、なんのコマンド打ってもエラー！ってかんじで
原因ゎぉそらくほとんど、文字エンコード周りなんですけど

さらに[Grunt](http://gruntjs.com/)との連携もLiveReload関係で謎に苦労して…
Winでも工夫してJekyll使ってる人ぃるみたぃなんですけど、
そこまでがんばれる気がしなくてゃめました
さくっと動く環境の人ゎ、ぜん②ぃぃと思ぅけどね

## Gruntで使ぅのが前提のCabin

### インストールゎかんたん
[Cabin](http://www.cabinjs.com/)ゎ、NodeJSベースで、Gruntで使ぅことが前提でできてて、
最初に生成されるGruntfileに、watchもlivereloadも元々かぃてぁり
速攻動ぃたから、ぃぃなと思って、使ってみることにしました
インストールゎとてもかんたんで、Getting startedにぁるとーり、
数回コマンドを打つだけです

### Pythonのインストール

はじめてビルドする時に、
`Cannot call method 'toString' of null`ってエラーがでて、
Rubyで疲れてたから、今度ゎNodeでまでエラー…って思って、
ショックだったんですけど、Pythonをインストールしてなぃのが原因でした
エラーの内容からゎその原因がゎかりづらぃから、最初そこだけ注意が必要です

NodeJSベースのCabinなんですけど、
シンタックスハイライト機能でだけPythonのライブラリが使ゎれてるから、
Pythonのインストールゎ必須みたぃです
けどほんとインストールするだけでょくて、
Pythonのコードを読むのが必要になることゎまったくなぃっぽぃです

### ゃたらシンプルだからカスタマイズゎたぶん必要

Jekyll Bootstrapゎもぅ最初から[DISQUS](http://disqus.com/)ゃらCategoryゃらTagゃら入ってて、
ぃきなりぃかにもブログってかんじなんですけど、
それとくらべたらCabinゎ、なんもなぃってレベルにシンプル
デザインテーマも③っだけだし

最初にできることゎ、記事がかけることと、シンタックスハイライト、
ぁと投稿日時順でのページ送り、ぐらぃで
けど一応内部でTagの実装ゎされてて、
ちょっとGruntfileでオプションをぃじれば、Tagごとのページ送りとかも作れます

### テンプレートエンジン
テンプレートゎ[Jade](http://jade-lang.com/)か[EJS](http://embeddedjs.com/)かの②択で、
ほかのエンジン使ぅ方法ゎ、まだぁんまり調べれてなぃけど、なぃかも
ぁゃぴゎ両方使ったことなくて、EJSにしてみたんですけど、
テンプレートファイルだけでなんとかしょーとすると、
だぃぶ悲惨なかんじになりました
カスタムヘルパーのjsをどこか別でかぃてぉければと思ぅんですけど、
ゃりかたがゎかんなぃです

### GitHub PagesへのデプロイもGruntタスクで
Cabinをインストールする時に、GitHub Pagesを使ぅと答ぇると、
[grunt-gh-pages](https://github.com/tschaub/grunt-gh-pages)とゅータスクが自動で入り、
GruntでGitHub Pagesにかんたんにpushできるょーになってます

まぁgitでcommitしてpushするだけなんですけど、
ここまでGruntのタスクでできちゃぅのゎなんかラクでぃぃなと思ぃます

GitHub Pagesにゎ、プロジェクト用のページと、ユーザー用のページがぁり、
ユーザーページに公開したぃ時ゎ、masterブランチにしなきゃなので、
Gruntfileでbranchを指定するオプションをかく必要がぁります

## 具体的なカスタマイズ方法
まだぁんまり情報がなぃCabinなんですけど、
ぁゃぴがゃってみたカスタマイズゎぜんぶ、
コミットログをみればゎかりますので、
もし使ってみる時ゎ参考にしてみてくださぃ
https://github.com/ayapi/ayapi-cabin/commits/master

## まとめ
ぁくまで個人ブログ作る目的でしか考ぇてなぃけど、

+ Jekyll使ぇるならそっちのがラクそー
+ Gruntに慣れててぃろ②ゃる気がぁればCabinゎょぃ
+ はてブロでぃぃと思ぅならもちろんそっちのがラクｗ

てことでしばらく使ってみます