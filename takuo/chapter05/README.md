# Chapter 05
第2週目，Chapter4までだと思ってた，ごめんなさい．
## コンポーネントを使用してUIを構築する
### Reactのコアコンセプト
Reactの中心的な概念3つ
- Component
- Props
- State
### Component
UIは，Componentとよばれる小要素に分割できる．コンポーネントを使用すると，再利用可能なブロックを構築でき，ブロックを組み合わせて大きな構造を作成できる．
UIの一部を更新するときは，特定のコンポーネントやブロックを更新すればよい．
#### コンポーネントの作成
Reactでは，コンポーネントは**UIを返す関数**，`script`タグ内記述する．
関数のreturnステートメント内にJSXを記述できる．
**実装するにあたって**
- 関数名の頭文字は大文字でなければならない(キャメルケース)
- `<{関数名} />`で呼び出す

`html`
```html
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

        ReactDOM.render(<Header />, app);
    </script>
</html>
```
`DOM`をみると，`<div>`の中に`<h1>Develop. Preview. Ship.</h1>`が構成されていることがわかる．
```html
<div id="app">
    <h1>Develop. Preview. Ship.</h1>
</div>
```

#### コンポーネントのネスト
通常のHTML要素と同じようにコンポーネントをネストできる(木構造を構築できる)．
次の例では，`HomePage()`で`<div>`の中に`Header()`のコンポーネントを配置している．
`html`
```html
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
                    {/*divの中にHeaderをネストしている．*/}
                    <Header />
                </div>
            );
        }

        ReactDOM.render(<HomePage />, app);
    </script>
</html>
```
`DOM`より，1段階`<div>`下にネストされているのがわかる．
```html
<div id="app">
    <div>
        <h1>Develop. Preview. Ship.</h1>
    </div>
</div>
```
ネストを繰り返して，下図のような木構造を作ることができる．
![fig:components_tree]
この図のようにすれば，`ReactDOM.render()`に`HomePage`だけ渡せば他のようそもまとめてDOMの要素として構築できる．

[fig:components_tree]: ./components_tree.png