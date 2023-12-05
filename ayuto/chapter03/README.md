# JavaScriptでUIを更新する
### 今後も使うこと
- `const`はJavaScriptの宣言子

### 今後は使わなそうなこと
- `getElementById()`はJavaScriptのDOMメソッドの一つ
    `id`を指定して特定のDOM(エレメント)を取得出来る。取得したDOMに対して`appendChild`等のDOM操作が出来る。
- `document`はブラウザが現在読み込んでいるウェブページのオブジェクトでHTML文書全体を表す


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


このように素のJavaSciptでUIを操作するのは冗長で長い -> **UIは宣言型プログラミングが最高！**

