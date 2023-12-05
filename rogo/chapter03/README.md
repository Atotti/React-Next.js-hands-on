#JavaSrciptでUIを更新する

JavaScriptでdivタグの中にh1タグを作ってテキストを表示する

```html
<html>
  <body>
    // 名前(id)が一意のdivタグを作る
    <div id="app"></div>
    <script type="text/javascript">
      // idがappの要素を見つける
      const app = document.getElementById('app');
 
      // 新しいh1タグを作る
      const header = document.createElement('h1');
 
      // Create a new text node for the H1 element
      // h1タグの中身である新しいテキスト要素を作る
      const text = 'Develop. Preview. Ship. 🚀';
      const headerContent = document.createTextNode(text);
 
      // h1タグの中身にテキストを入れる
      header.appendChild(headerContent);
 
      // divタグの中にh1タグを入れる
      app.appendChild(header);
    </script>
  </body>
</html>
```

上記のコードは命令型．
UI構築では宣言型が好まれる．

開発者がUIを構築するのに役立つ人気な宣言型ライブラリがReact．

