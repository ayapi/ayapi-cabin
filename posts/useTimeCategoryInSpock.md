{
  title: "Spockで@Use(TimeCategory)で時間のSpec",
  date:  "2013-11-20 19:43",
  description: "SpockでTimeCategoryを使って期間のspecを書ぃてみました",
  tags: ["Spock", "Groovy"]
}

## Spockにっぃて
Spockゎ、JavaとGroovyのテストフレームワークで、最近はじめてみました
と言ってもぁゃぴゎ、Spockどころか、
JavaもGroovyも最近はじめたばかりの初心者なんですけど

Spockで感激するのゎ、テストデータをとてもみゃすくかけるところです
今回ゎ、期間(時刻でゎなくて、間隔ってこと)の算出をするコードで、
そのみゃすさをとても実感したので、ゃりかたをかぃてみます

## @Useアノテーション

Spockでゎ、`@Use`アノテーションを使ぅと、
Groovyの`use(Category){}`ができるそーです

><cite>[yamakazu/spock-workshop - docs / 06_advanced.md](https://github.com/yamkazu/spock-workshop/blob/master/docs/06_advanced.md#use)</cite>
>`@Use`をフィーチャメソッドに付与すると、フィーチャメソッド内がuseブロックのスコープとなる。
>
> ```groovy
>class UseSpec extends Specification {
>    @Use(IntegerCategory)
>    def "カテゴリークラスを使う"() {
>        expect:
>        7.square() == 49
>    }
>}
>
>@Category(Integer)
>class IntegerCategory {
>    Integer square() { this * this }
>}
> ```

けど、同じょーにまねしてゃってみたら、
フィーチャーメソッドに`@Use`してもエラーになってしまぃ、
ぅまく動きませんでした

```groovy
// ※動かなぃ例
import groovy.time.Duration
import groovy.time.TimeCategory
import spock.lang.Specification
import spock.lang.Unroll
import spock.util.mop.Use

class CalculatorSpec extends Specification {
	@Unroll
	@Use(TimeCategory)
	def "平均期間を算出する"() {
		given:
		def calc = new Calculator();

		when:
		def msecs = intervals.collect({
			(it as Duration).toMilliseconds();
		});
		def average = calc.calculateAverageInterval(msecs);

		then:
		average.equals((result as Duration).toMilliseconds());

		where:
		intervals                            | result
		[1.hours, 30.minutes, 45.minutes]    | 45.minutes
		[10.seconds, 20.seconds, 30.seconds] | 20.seconds
	}
}
```

```bash
groovy.lang.MissingPropertyException: No such property: hours for class: java.lang.Integer
	at CalculatorSpec.平均期間を算出する(CalculatorSpec.groovy:22)
```

`where:`ブロックで、`1.hours`とか
ぃかにもTimeCategoryってかんじの書き方をしてるのを
ゎかってもらぇてなぃかんじのエラーです

以下のょーに、Specのクラス全体に`@use`を適用するかんじだと、動きました！

```groovy
// ※動く例
import groovy.time.//...省略...//

@Use(TimeCategory) //←こーした
class CalculatorSpec extends Specification {
	@Unroll
	def "平均期間を算出する"() {
		given:
		def calc = new Calculator();

		when:
		def msecs = intervals.collect({
			(it as Duration).toMilliseconds();
		});
		def average = calc.calculateAverageInterval(msecs);

		then:
		average.equals((result as Duration).toMilliseconds());

		where:
		intervals                            | result
		[1.hours, 30.minutes, 45.minutes]    | 45.minutes
		[10.seconds, 20.seconds, 30.seconds] | 20.seconds
	}
}
```

Spockのしくみがぁんまりまだゎかってなぃので、
最初のゃりかたで`where:`で`@use`が効かなかったのが
Spockの仕様なのか、それとも`TimeCategory`の仕様なのか
ょくゎかんなぃんですけど、

とにかくこんなふーに、時間がとてもみゃすくかけるのが、
ぁゃぴ的にゎ気に入ってます

このテストデータがもしぜんぶミリ秒とかだったら、
なにがなんだかパッと見でゎゎかんなぃと思ぃます