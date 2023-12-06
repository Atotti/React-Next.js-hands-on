# Reactを始める
- Reactを始めるには2つのパッケージが必要
  - react: コアライブラリ
  - react-dom: DOMでReactを使えるようにするためのDOM固有のメソッドを提供

## unpkgとは
- HTML内でReactを使いたいときに呼ばれるこの「おまじない」は何なのだろうか
- `src`属性をみると，`unpkg.com`にアクセスしている
- `unpkg.com`はnpmで公開されているパッケージを配信しているサイト
  - npm(Node Package Manager): node.jsのパッケージマネージャー
- このような仕組みをCDN(Contents Delivery Network)という
  - わざわざローカルにパッケージをインストールしなくてもいいため，ちょっと試すときに便利

## JSXとは
- JSXは，JavaScriptをHTML構文のように扱える言語
- その実態は，`React.createElement()`の糖衣構文
- そのため，生のJavaScriptではインタプリタできず，BabelのようなJavaScriptトランスパイラが必要
```js
const jsx = <h1>Hello World</h1>;
const jsx_sugar = React.createElement(
  'h1', // タグ
  null, // 属性
  'Hello World' // 子要素
);
```

### JavaScriptトランスパイル
- 昔のJavaScriptはとても癖が強かった
  - 変数のスコープがグローバル
  - 型がない
  - モジュール機構がない
  - 定数がない
  - nullやundefinedの仕様
- このため，使いやすい開発用言語で開発し，それをJavaScriptにコンパイル（翻訳っぽいのでトランスパイルとも呼ばれる）する方式が取られた
  - 現在主流のTypeScriptや上述のJSXも同じ考え方
  - まだ標準化されていない機能を使いたいときなどにも使われる

#### 参考
- https://zenn.dev/ken505/articles/9a2bb8dc766f5e

# JavaScript再履修
## 関数とアロー関数
- JavaScriptでの関数は**第一級オブジェクト**
  - 第一級オブジェクト：あるプログラミング言語において、たとえば生成、代入、演算、（引数・戻り値としての）受け渡しといったその言語における基本的な操作を制限なしに使用できる対象のこと（from Wikipedia）
  - 他にも変数など
  - つまり，関数を変数に代入できたり，関数を戻り値にとれたり，関数の中に関数を宣言できる
- 関数の一例
  - JavaScriptは，関数を`function`キーワードで宣言できる
```js
function add(a, b) {
  return a + b;
}
add(1,2); // 3
```
### 無名関数
- 名前のない関数を宣言できる
```js
const add = function (a, b) {
  return a + b;
}
add(1,2); // 3
```
- ここで，addは，無名関数を代入した変数

### アロー関数
- アロー演算子を用いた関数
  - `function`を用いた関数とは`this`の示す先が異なるなど，ちょっと違う
    - とはいえ，代替表現として捉えて良い
```js
const add = (a, b) => {
  return a + b;
}
add(1,2) // 3
```
- `return`は省略できる
```js
const add = (a, b) => a + b;
```

- 括弧でくくってもよい
```js
const add = (a, b) => (
  a + b
);
```

### 関数を引数に取る
- 以下の例をみる
```js
function calc(f, a, b) {
  return f(a,b)
}

function add(a, b) {
  return a + b;
}

function times(a, b) {
  return a * b;
}

calc(add, 1, 2); // 3
calc(times, 2, 3); // 6
```
- 無名関数を使ってこんなこともできる
```js
function calc(f, a, b) {
  return f(a, b);
}
calc((a, b) => (a + b), 1, 2); // 3
```
### 内部関数
- 関数の中に宣言される関数
```js
function calc(a, b) {
  function add(a, b) {
    return a + b;
  }

  return add(a, b);
}
calc(1, 2) // 3
```
- 関数を戻り値にとることでこんなこともできる
```js
function outer(val1) {
  function inner(val2) {
    return val1 * val2;
  }
  return inner;
}

outer(3)(4); // 12
```
## オブジェクト
- 「クラスとオブジェクト」のオブジェクトとは全くの別物
- keyとvalueからなるデータの集合
  - Cでいえば構造体，Pythonでいえば辞書型，RubyでいえばHash型のこと

### オブジェクトの宣言
```js
const vendingItem = {
  name: 'Juice',
  price: 300,
}
```
- 最後のカンマはなくても良いが，つけたほうがGitの差分管理とかで有利
- キーと同名の変数を格納するときはvalueを省略できる
```js
const name = 'taro';
const age = 21;

const user = {
  name,
  age,
}
```
### オブジェクトの呼び出し
- 2通りある
```js
console.log(vendingItem.name);
console.log(vendingItem['name'])
```
- 前者はドット記法 
  - 一番ポピュラー（な気がする）
- 後者はブラケット記法
  - ブラケット記法は，キー指定に変数を取れる
```js
const key = 'name';
console.log(vendingItem[name]);
```

### オブジェクトと定数
- オブジェクトを定数として宣言できるが，valueの変更ができてしまう
  - オブジェクトの実体はアドレスであるため
  - 再代入はできない
- 代入はシャローコピー
```js
const obj1 = {
  name: 'taro',
};
const obj2 = obj1; // シャローコピー
obj2.name = 'kotaro'; // 可能

// これはできない
obj2 = {
  name: 'suzuki',
}
```

### オブジェクトの等価性
- 上述の通り，オブジェクトの実体はアドレスであるため，valueを変えても等価判定はできない
```js
const obj1 = {
  name: 'taro'
};
const obj2 = obj1;

obj2.name = 'kotaro';
console.log(obj1 == obj2); // true
```
- valueを含めた判定には，Object.jsといったライブラリを用いるのがよい

### オブジェクトと関数
- 関数の引数にオブジェクトを使うことで，名前付き引数を実現できる
```js
function greeting(greetingProps) {
  const name = greetingProps.name;
  return 'Hello, ' + name + '!!';
}

greeting({ name: 'Taro' });
```

## 配列と配列操作関数
- 配列はオブジェクトの特殊な形
- 基本的には上述のオブジェクトと同様な性質を持つ
  - 等価判定は難しい
  - 代入はシャローコピー
```js
const arr = [1, 2, 3 ];
a[0] // 1
```
### さまざまな配列
- オブジェクトの配列を作ることができる
```js
const users = [
  { name: 'Taro', age: 20, gender: 'male' },
  { name: 'Lisa', age: 19, gender: 'female' },
  { name: 'Kojiro', age: 21, gender: 'male' },
]
```
- 配列に関数を代入できる
  - JavaScriptの配列は複数の型を混在できる
```js
const add = (a, b) => a + b;
const sub = (a, b) => a - b;
const times = (a, b) => a * b;
const divide = (a, b) => a / b;

const calcs = [
  add,
  sub,
  times,
  divide,
];
```
### 関数型プログラミングに便利な関数群
#### map関数
- 配列の各要素に対して然るべき処理を与え，新たな配列を返す関数
- 以下は配列の各要素を2乗する処理
```js
const arr = [ 1, 2, 3 ];
const square = arr.map((a) => a * a);
```
- map関数はReactでよく用いる
  - JSX内のfor文のかわりなど
#### filter関数
- 配列の各要素に対して，条件文にマッチする要素のみの新たな配列を返す関数
```js
const arr = [1, 2, 3, 4, 5];
const over3 = arr.filter(a => a >= 3);
```
#### reduce関数
- 配列の各要素から，新たな値を出力する関数
```js
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce((summing, a) => summing + a, 0);
```
- 無名関数の第一引数には，最新の値が入る
  - ここでは，足し合わせている過程である
- 第二引数には，配列の要素それぞれが入る
- reduce関数の第二引数は初期値である．

## 分割代入
- オブジェクトからの宣言で，キーをそのまま取り出すことができる
  - 呼び出す順番は任意
  - キー名を指定する必要
    - 別名の利用もできる
```js
const obj = {
  name: 'Taro',
  age: 40,
}

const { age, name } = obj;
const { age: taroAge, name: taroName } = obj;
console.log(name, age); // Taro, 40
console.log(taroName, taroAge); // Taro, 40
```
- これを関数宣言に応用できる
```js
function greeting({ name }) {
  return 'Hello, ' + name + '!!';
}
greeting({ name: 'Taro' });
```
- 配列でも同様
  - ただし，順番が意識される
  - 別名で呼び出せる
```js
const add = (a, b) => a + b;
const sub = (a, b) => a - b;
const times = (a, b) => a * b;
const divide = (a, b) => a / b;

const calcs = [
  add,
  sub,
  times,
  divide,
];

const [ addnew, subnew ] = cals;
```

### スプレッド構文
- 3つのドットを用いた記法
- オブジェクトや配列の中身を展開する
- いろんな使い方ができる
#### 配列の結合
```js
const progLang = [ "C", "Ruby", "JavaScript", "Java" ];
const naturalLang = [ "Japanese", "English", "Chinese" ];
const lang = [ ...progLang, ...naturalLang ];
```
#### ディープコピー
```js
const obj = {
  name: 'Taro',
  age: 20,
};

const obj_copy = { ...obj };
```

#### 残余引数
```js
const progLang = [ "C", "Ruby", "JavaScript", "Java" ];

const [ first, ...others ] = progLang;

console.log(other.join(', ')); // Ruby, JavaScript, Java
```

## テンプレート文字列
- 変数を埋め込むことのできる文字列
```js
const name = 'Taro';
const greeting = `Hello, ${name}!`;
console.log(greeting); // Hello, Taro!
```

## 三項演算子
- みんな大好き三項演算子
- `条件文 ? 正のときの値 : 負のときの値`で与えられる
- Reactではif文のかわりとして多用する

## ESモジュール