## コンポーネント
JSX中に`DOM`を戻り値に取るJavaScriptの関数を作る(大文字始まりで)
と、あら不思議コンポーネントが出来上がる。
関数を作成するメリットは再利用可能なこと。同様にコンポーネントにすれば
`DOM`を再利用可能になる。

```html
<html>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/jsx">
 
        const app = document.getElementById("app")
       
        function Header() {
           return (<h1>Develop. Preview. Ship. 🚀</h1>)
        }
        function HomePage() {
            return (
                <div>
                    {/* Nesting the Header component */}
                    <Header />
                </div>
            );
        }
       
       
         ReactDOM.render(<HomePage />, app)
      </script>
  </body>
</html>
```

自分で使う分にも便利だけど`DOM`UIフレームワークを使うと革命が起きる！