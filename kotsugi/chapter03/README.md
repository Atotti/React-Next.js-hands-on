# JavaScriptによるDOM操作
## とりあえず触ってみる
- JavaScriptを用いてDOMを動的に操作できる
  - createElement, appendChild, etc...
- このような書き方は「どのようにUIを記述するか」というアプローチ
  - 「何を記述するか」というアプローチもある
    - そっちのほうがわかりやすい

## 宣言的なアプローチ
### 命令型プログラミングと宣言型プログラミング
- 目的となる処理を「どのように書くか」を主眼においたプログラミング
- 以下の例：配列の各要素を2乗するpythonプログラム
  - map関数：配列の各要素を取り出して，ラムダ文により処理を実行し，新たな配列を返す
```python
# 命令的アプローチ
ls = [1, 2, 3, 4, 5]
ls2 = []
for l int ls
  ls2.append(l * l)

# 宣言的アプローチ
ls = [1, 2, 3, 4, 5]
ls2 = map(lambda l: l * l, ls)
```
- もう一個の例：配列の合計値を取得するJavaScriptプログラム
  - reduce関数：
    - 第一引数：配列の各要素に対して実行する無名関数．関数の第一引数`summing`は，それまでの値，第二引数`current`は今の要素の値
    - 第二引数：初期値．最初はこの値が即時関数の第一引数`summing`に入る．
    - summingに値が足されていっているイメージ
```js
// 命令的アプローチ
let arr = [1, 2, 3, 4, 5];
let sum = 0;
for (let i = 0; i < arr.length; i++) {
  sum += arr[i];
}

// 宣言的アプローチ
let arr = [1, 2, 3, 4, 5];
let sum = arr.reduce((suming, current) => suming + current, 0);
```
- 命令的アプローチでは，for文を使って「どのように実装するか」を記述している
- 対して，宣言的アプローチでは，for文を使わずに「何を実装するか」が明確である

## Reactは？
- Reactは宣言型UIライブラリ
- 宣言型はデータの流れを読むのがわかりやすい
  - UIにぴったり