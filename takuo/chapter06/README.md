# Chapter 06
## Propを使用したデータの表示
コンポーネントを再利用すると同じコンテンツを表示することができる↓．
```diff html:same2Component.html
<html>
    <div id="app"></div>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <!-- Babel Script -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/jsx">
        const app = document.getElementById("app");

        function Header() {
            return <h1>Develop. Preview. Ship.</h1>;
        }
        function HomePage() {
            return (
                <div>
                    {/*divの中にHeaderをネストしている．2つ同じ要素が表示される．*/}
+                    <Header />
+                    <Header />
                </div>
            );
        }

        ReactDOM.render(<HomePage />, app);
    </script>
</html>
```
が，別のテキストを渡したい場合や，外部からデータを取得しているために表示したいコンポーネントの内容が分からない場合はどうすればいいのか？
-> `props`を使う．
### props
通所のHTML要素では，要素の動作を変更する情報を渡すことのできる属性がある．
- `<img>`の`src`属性
- `<a>`の`href`属性

これらと同様に，Reactでは **`props`を介してコンポーネントに情報を渡す**ことができる．
JavaScript等の関数と同様に，コンポーネントはその動作や表示する内容を変更するカスタム変数やpropを受け入れることができる．
受け取ったpropsは子コンポーネントに渡すこともできる．Reactではトップダウン(`one-way data flow`)にデータが受け渡される.

### propsを使う
コンポーネントでは，HTML属性を渡すのと同じように，propを送ることができる．
- `HomePage`コンポーネントにおいて，`Header`コンポーネントに`title`propを渡す
```diff html
function HomePage() {
  return (
    <div>
+      <Header title="React" />
    </div>
  );
}
+function Header(props) {
  console.log(props); // { title: "React" }
  return <h1>Develop. Preview. Ship.</h1>;
}
```
`console.log()`を使うと，propがどんなオブジェクトであるか確認できる．ここでは，titleプロパティを持ち，その値が"React"であることがわかる．
propsはオブジェクトであるため，[オブジェクト分割][object_destructuring]が利用できる．これを用いると，関数の引数に明示的に名前を付けることができる↓.
```diff html
+function Header({ title }) {
  console.log(title); // "React"
  return <h1>Develop. Preview. Ship.</h1>;
}
```
受け取ったオブジェクトのうち，`title`プロパティの値を引数に渡している…？

オブジェクト分割を用いれば，引数に渡されるオブジェクト内の必要なプロパティの値を用いて，コンポーネントの要素を変更できる．
引数の`title`プロパティの値を`<h1>`の文字列にする↓．
```diff html
function Header({ title }) {
  console.log(title);
+  return <h1>title</h1>;
}
```

```html:recieveProp.html
<html>
    <div id="app"></div>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/jsx">
        const app = document.getElementById("app");

        function Header({ title }) {
            console.log(title);
            return <h1>title</h1>;
        }
        function HomePage() {
            return (
                <div>
                    {/*Header()にpropを渡す*/}
                    <Header title="React" />
                </div>
            );
        }

        ReactDOM.render(<HomePage />, app);
    </script>
</html>
```
```html:DOM
<div id="app">
    <div>
        <h1>title</h1>
    </div>
</div>
```
[object_destructuring]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment