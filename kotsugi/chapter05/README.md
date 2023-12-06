# コンポーネントを使ったUIの作成
## コンポーネント
- 機能やUIを再利用可能な単位でまとめたもの
- ReactにおけるUIの基本的な構成要素
  - Chapter03のようなUIの作成方法では，機能に切り出しての再利用が難しい

## 関数コンポーネント
- ReactではコンポーネントをJSXを戻り値にとる関数としている
```js
function Header() {
  return <h1>Hello, World</h1>;
}

function Homepage() {
  return (
    <div>
      <Header/>
    </div>
  )
}

ReactDOM.render(<HomePage/>, app);
```
- 上記のコードでは，`Header()`と`Homepage()`がコンポーネントである