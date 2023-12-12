# Chapter 07
## Stateによる対話性の追加
`State`と`event handlers`によるインタラクティブな動きを見る．

`HomePage`コンポーネントに"Like"ボタンを追加↓．
```diff html
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
+      <button onClick={}>Like</button>
    </div>
  );
}
```
`onClick`イベントがボタンをクリックされたときに呼ばれる．
クリックされた時の処理は`onClick`に書けばよい．
- `onChange`: for input fields
- `onSubmit`: for forms

### イベントハンドリング
イベントが発生したときに呼び出す関数を定義しておいて，`onClick={handlefunc*}`とすれば処理を呼び出せる．
```diff html
function HomePage() {
  // 	...
+  function handleClick() {
+    console.log('increment like count');
+  }
 
  return (
    <div>
      {/* ... */}
+      <button onClick={handleClick}>Like</button>
    </div>
  );
}
```

### stateとhooks
Reactには[hooks][hooks]と呼ばれる関数群がある．これを使うと，**state**などの追加ロジックをコンポーネントに追加できる．
- state: 時間の経過と共に変化するUI内の情報，通常はユーザーインタラクションによって引き起こされる．
stateを使うと，Likeボタンのクリック回数や，チェックボックスの状態などを保存できる．

stateを定義するためのhookは`useState()`，返り値は**state**と**stateを更新するための関数**．`[state, updateFunc]`の形式で返される．`useState()`の引数でstateの初期値を指定できる．
値変更のための関数は`set{Var}`のように命名するのが一般的．
```diff html
function HomePage() {
  // ...
+  const [likes, setLikes] = React.useState(0);
 
+  function handleClick() {
+    setLikes(likes + 1);
+  }
 
  return (
    <div>
      {/* ... */}
+      <button onClick={handleClick}>Likes ({likes})</button>
    </div>
  );
}
```
state名は`likes`，更新関数名は`setLikes`．
`handleClick()`で`likes`に1を足す処理を定義し，これがbuttonのクリックで実行される．

- ボタンが押された回数がタイトルになる↓
```html
<html>
    <div id="app"></div>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/jsx">
        const app = document.getElementById("app");

        function Header({ title }) {
            console.log(title);
            return <h1>{title}</h1>;
        }
        function HomePage() {
            const [likes, setLikes] = React.useState(0);

            function handleClick() {
                setLikes(likes + 1);
            }

            return (
                <div>
                    <Header title="Button Counter!!" />
                    <Header title={likes} />
                    <button onClick={handleClick}>
                        LIKE ME!
                    </button>

                </div>
            );
        }

        ReactDOM.render(<HomePage />, app);
    </script>
</html>
```
- DOM
```html
<div id="app">
    <div>
        <h1>Button Counter!!</h1>
        <h1>0</h1> <!--ボタンを押すと更新される．-->
        <button>LIKE ME!</button>
    </div>
</div>
```

[hooks]: https://react.dev/learn