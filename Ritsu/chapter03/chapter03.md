# JavaScropt と DOM
HTML内にJavaScriptを記述しDOMメソッドを利用する場合、それは冗長なものになってしまう。例として以下のコードでは、`<h1>`要素とテキストを追加することしか行っていない。
```
<script type="text/javascript">
  const app = document.getElementById('app');
  const header = document.createElement('h1');
  const text = 'Develop. Preview. Ship. 🚀';
  const headerContent = document.createTextNode(text);
  header.appendChild(headerContent);
  app.appendChild(header);
</script>
```

## 命令型プログラミングと宣言型プログラミング
- 命令型プログラミング
    上記のようなコード。段階的な指示をするため、コードが冗長になってしまう。
- 宣言型プログラミング
    開発者が表示したい”何か”を宣言するだけでよく、UIの構築に関して開発プロセスをスピードアップすることができる。
    Reactはこのタイプ