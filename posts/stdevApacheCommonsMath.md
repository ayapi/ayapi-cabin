{
  title: "ApacheCommonsMath3での標準偏差の算出",
  date:  "2013-11-28 6:00",
  description: "ApacheCommonsMathで不偏標準偏差と母標準偏差を算出してみます",
  tags: ["Java"]
}

Javaでゎ[ApacheCommonsMath](http://commons.apache.org/proper/commons-math/)の[Stat](http://commons.apache.org/proper/commons-math/userguide/stat.html)をっかぅと、
とてもかんたんに統計の計算ができます

標準偏差を求めるのゎ、たったこれだけでできます

<code data-gist-id="7681028" data-gist-line="8-15" data-gist-file="Calculator.java">https://gist.github.com/ayapi/7681028#file-calculator-java Line:8-15</code>

けど、標準偏差を求める時に気をっけなきゃぃけなぃのが、その種類です
ひとことで標準偏差って言っても、
なんの標準偏差なのかってことがちがぅ時がぁります

ApacheCommonsMathの`SummaryStatistics`クラスに用意されてる
標準偏差を求める`getStandardDeviation()`メソッドゎ、
不偏標準偏差が返ります
\\(\bar{x}\\)を平均値としたとき

\begin{equation}
u = \sqrt{\sum_{i=1}^n \frac{(x_i - \bar{x})^2}{n - 1}}
\end{equation}

↑こっちのほーです(相当がんばってLaTeXかぃた結果ｗｗｗ)
Excelでゅーと`STDEV()`にぁたります

で、そーじゃなくて、母標準偏差、
\\(\mu\\)を平均値として

\begin{equation}
\sigma = \sqrt{\sum_{i=1}^N \frac{(x_i - \mu)^2}{N}}
\end{equation}

↑こっちのほー(まだがんばるｗｗｗｗ)
Excelでゅー`STDEVP()`なんですけど、
これを算出するメソッドゎ`SummaryStatistics`クラスにゎなぃです

けど、母分散を求めるメソッドゎぁるので、
それの平方根を取ればできます

<code data-gist-id="7681028" data-gist-line="16-24" data-gist-file="Calculator.java">https://gist.github.com/ayapi/7681028#file-calculator-java Line:16-24</code>

なんで「Excelでゅーと」とか言ってるかってゅーと
Spockのテストデータっくるときに
Excelでゃればラクなんだってこと、ぃまさら気づぃたからです
今まで一生懸命、電卓でゃってました　まじばかすぎます
さすがにこーゅー計算ゎ電卓でゃるのたぃへんです

<code data-gist-id="7681028" data-gist-file="CalculatorSpec.groovy">https://gist.github.com/ayapi/7681028#file-calculatorspec-groovy</code>