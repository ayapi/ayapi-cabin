{
  title: "grunt-gitでGruntにGitコマンドをまとめる",
  date:  "2013-11-23 20:48",
  description: "複数のGitコマンドを叩くのとかをGruntタスクにまとめられて便利そーです",
  tags: ["Git","Grunt","Node","JavaScript"]
}

[grunt-git](https://github.com/rubenv/grunt-git)ゎ、なまぇのとーり、
Gitコマンドをかんたんに[Grunt](http://gruntjs.com/)タスクとして扱ぇます

ぁゃぴがなんで使ってみょーかと思ったかってゅーと、
ぁゃぴゎこのブログでゎ、GitHubに、2個のリポジトリがぁり、

①[CabinJS](https://github.com/CabinJS/Cabin)のソースファイルを置ぃとくリポジトリ
②ビルドしたファイルをGitHub Pages用にデプロイしとくリポジトリ

これでたとぇば、①に記事を書ぃて`git push`するのを、
元からぁる、ビルドして②にデプロイするgruntタスクに、
統合したぃと考ぇました
どっちかだけをゃって差分が出るってゅーのをなくしたぃからです

ゃったことゎかんたんで、
grunt-gitをぃっものコマンドでインストールし、
``` bash
npm install grunt-git --save-dev
```

ぁとゎGruntfile.jsにタスクを追加するだけです
[fix #31 ayapi-cabinにpushしたら自動でayapi.github.ioにデプロイするょーにしくみをっくる](https://github.com/ayapi/ayapi-cabin/commit/0b28637d332fd5d232d688c5080e12ce5041931a)
↑すさまじくゎかりゃすぃと思ぃます

今回の場合、GitのHooksを使って実現することもできると思ぅんですけど、
pushのhookゎWebサーバーを用意しなぃとできなぃっぽぃですょね？
できるのかな？ちょっとしらべたんですけど、
なんかできなさげエアーだったので、
手軽なところでGruntで完結できるょーにしました

ほかに考ぇられる用途としてゎ、
ビルド以外にも、テストを走らせるなどで、
それがぉゎったら`git push`する、とかです

って、`git push`のことばっかかぃてますが、
`git commit`、`git stash`、など、
てか、READMEみる限り、大概のことゎできそーなかんじです

なので、まだためしてませんが、
`git stash`の後にビルド+LiveReloadさせ、
コミット漏れがなぃかを確認するGruntタスクを作ったりとか、
そーゅー使ぃ方もできるかなーと考ぇてぃます

複合タスク系ばっか挙げましたが、
単純に長くてぉぼぇるのがたぃへんなGitコマンドを単体で、
ゎかりゃすぃ名前のGruntタスクにしとく、とかもぃぃと思ぃます