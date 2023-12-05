`const`はJavaScriptの宣言子

`.getElementById()`はJavaScriptのDOMメソッドの一つ


### HTMLで普通に書くとこうなる
```html
<html>
    <body>
        <div id="neko">
            <h1>ねこねこねこ</h1>
        </div>
    </body>
</html>
```

### DOM操作で`<div id=neko></div>`の中を書くとこうなる
```html
<html>
    <body>
        <div id="neko"></div>
        <script type="text/javascript">
            const neko = document.getElementById('neko');

            // createElement()メソッドで空のh1要素を作成
            const header = document.createElement('h1');

            // ただの文字列を作成
            const text = 'ねこねこねこ';
            // createTextNode()メソッドでテキストノードを作成
            const headerContent = document.createTextNode(text);
            // 作ったテキストノードをh1要素(7行目で作ったheader)の中身に追加
            header.appendChild(headerContent);

            // 作ったh1要素をdiv要素(3行目で作ったneko)に追加
            neko.appendChild(header);
        </script>
    </body>
</html>
```
冗長で長い -> *UIは宣言型プログラミングしか勝たん*
