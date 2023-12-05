# Reactを始める
Reactを使用するには，[unpkg.com](unpkg.com)という2つのReactスクリプトをロードする
```html
<html>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script type="text/javascript">
      const app = document.getElementById('app');
    </script>
  </body>
</html>
```
## JSX
JSXはJavaScriptの構文拡張機能．
## Babel
以下のスクリプトに貼り付ける
```html
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```


```html
<html>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <!-- Babel Script -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/jsx">
      //宣言型
      const app = document.getElementById('app');
      ReactDOM.render(<h1>Develop. Preview. Ship. 🚀</h1>, app);
    </script>
  </body>
</html>
```


