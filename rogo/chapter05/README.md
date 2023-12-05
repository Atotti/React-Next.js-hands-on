#コンポーネントを使用してUIを構築する
##Reactの中心的な概念
- [x] コンポーネント
- [ ] props
- [ ] state

次の章でこれらを詳しく学び，その後Next.jsをインストールし，新しいReactの機能の勉強に移る．

##コンポーネント
UIはコンポーネントと呼ばれる小さな構成要素に分割できる．
コンポーネントを使用すると，再利用可能な小さなブロックを構築できる．レゴブロックのようにこれらを組み合わせて，より大きな構造を形成できる．
アプリケーションの関係ないところに触れずにコンポーネントを簡単に追加，更新，削除ができきるため，コードの成長に合わせてメンテナンスが容易．

###コンポーネントの作成
Reactではコンポーネントは**UI要素を返す関数**．
- 関数名を大文字にする
- < />で囲んで使用する

```html
<script type="text/jsx">
  const app = document.getElementById("app")
  function header() {
    return (<h1>Develop. Preview. Ship. 🚀</h1>)
  }
  ReactDOM.render(<Header />, app)
</script>
```

###コンポーネントのネスト

```Javascript
function Header() {
  return <h1>Develop. Preview. Ship. 🚀</h1>;
}
function HomePage() {
  return (
    <div>
    //Headerの返り値の要素がdivタグの中に入る
    <Header />
    </div>
  );
}
ReactDOM.render(<HomePage />, app);
```
###コンポーネントツリー
Reactのコンポーネントをネストし続けるとコンポーネントツリーが形成される．
例えば，ヘッダーコンポーネントはロゴ，タイトル，ナビゲーションコンポーネントを含むことができる．
このモジュール形式により，アプリ内でコンポーネントを再利用することができる．
![component-tree](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Flearn-component-tree.png&w=1920&q=75&dpl=dpl_B5e9zup6wfnXzBVECwDyccHrr5NV)




