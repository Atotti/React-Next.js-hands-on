# props
親コンポーネントから子コンポーネントへ値（引数）を渡す仕組み。読み取り専用の情報である。

HTMLにおける
-`<img>`の`sec`属性
-`<a>`の`href`属性
のように、Reactでも要素の動作を変更する情報を渡すことができ、これをpropsと呼ぶ。

```
function HomePage() {
  return (
    <div>
      <Header title="React" />
    </div>
  );
}
```

上記の例では、子コンポーネント`Header`を呼び出す際に、`title`プロパティを追加している。

## 子コンポーネントの書式

```
function Header({ title }) {
  console.log(title);
  return <h1>{title}</h1>;
}
```

子コンポーネントは、受け取ったプロパティをパラメータとして受け入れる。
注意点として、コンポーネント内では中かっこ`{}`を使用しないと、ただの文字列として認識されてしまう。これはJSXの構文であり、JSXマークアップ内に直接通常の JavaScript を記載することができる。

この中かっこ内の書き方はいくつかある。
- 1.ドット表記を使用したオブジェクトプロパティ
```
function Header(props) {
  return <h1>{props.title}</h1>;
}
```
- 2.テンプレートリテラル
```
function Header({ title }) {
  return <h1>{`Cool ${title}`}</h1>;
}
```
- 3.関数の戻り値
```
function createTitle(title) {
  if (title) {
    return title;
  } else {
    return 'Default title';
  }
}
 
function Header({ title }) {
  return <h1>{createTitle(title)}</h1>;
}
```
- 4.三項演算子
```
function Header({ title }) {
  return <h1>{title ? title : 'Default Title'}</h1>;
}
```

三項演算子では、コンポーネントでデフォルトのケースを考慮しているため、引数を指定しなくてもよい。

```
function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}
 
function HomePage() {
  return (
    <div>
      <Header />
    </div>
  );
}
```

## 配列の反復処理
配列メソッドを利用してデータを操作し、スタイルは同じだが情報が違うUIを生成できる。

```
function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];
 
  return (
    <div>
      <Header title="Develop. Preview. Ship." />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
```

`map()`メソッドを使用して配列を反復処理している。

### keyプロパティ
key は、どの要素が変更、追加もしくは削除されたのかをReactが識別するのに役立つ。毎回追加しておいたほうがいい?