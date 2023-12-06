# Chapter 04
## React を始める
Reactを書くぞー！
Reactを使うには，`unpkg.com`というサイトからスクリプトをロードする必要がある．
- pythonでいうimportみたいなもん
```html
<html>
<body>
    <div id="app"></div>
    <script src="https://unpkg.com/react@17/umd/react.development.js">
        // react.developmentはReactライブラリのコア
    </script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js">
        // act-domはDOMでReactを使用できるようにするメソッド群
    </script>
    <script type="text/javascript">
    const app = document.getElementById('app');
    </script>
</body>
</html>
```

Reactのコード(**宣言型**)とJavaScript(**命令型**)を比較してみる．
- React
```html
<script type="text/jsx">
  const app = document.getElementById("app")
  ReactDOM.render(<h1>Develop. Preview. Ship. 🚀</h1>, app)
</script>
```
- JS
```html
<script type="text/javascript">
  const app = document.getElementById('app');
  const header = document.createElement('h1');
  const text = 'Develop. Preview. Ship. 🚀';
  const headerContent = document.createTextNode(text);
  header.appendChild(headerContent);
  app.appendChild(header);
</script>
```

少ない宣言で，やりたいことがわかりやすい！

---
Reactで重要なJavaScript関数，見ておきたい．
- [Functions](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions) and [Arrow Functions](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [Objects](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [Arrays and array methods](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [Destructuring](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [Template literals](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)
- [Ternary Operators](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
- [ES Modules and Import / Export Syntax](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)
