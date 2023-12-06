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