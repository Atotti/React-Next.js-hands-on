# Chapter 03
## JavascriptでUIを更新する
HTML(クライアントがサーバから受け取った初期状態)から，スクリプトでDOMを変更する．

- 初期状態のHTML
  ```html
  <html>
  <body>
      <div id="app"></div>
      <script type="text/javascript">
          // id="app"のdiv要素を選択
          const app = document.getElementById("app");

          // h1の要素を作成
          const header = document.createElement("h1");

          // h1につけるtext nodeを定義
          const text = "Develop. Preview. Ship. 🚀";
          const headerContent = document.createTextNode(text);

          // headerにtext nodeをappend
          header.appendChild(headerContent);
          
          // app(初期HTMLのdivノード)にheader nodeをappend
          app.appendChild(header);
      </script>
  </body>
  </html>
  ```

- 変更されたDOM
  ![fig_dom]

DOMを見ると，初期状態には何も要素が無かった`<div>`セクションに`<h1>`とその文章が追加されている．
DOMがスクリプトによって変更されたことが確認出来る．

---
今回は生のJavaScriptでDOMの更新をしたが，これは結構冗長(実際，h1タグの一行を記述するのにかなりの**手続きを踏んでいる**)．

## React: 宣言型UIライブラリ
先の例ではh1タグを追加するための**手続きを記述した**．つまり，どのように動作するかを指示した．いくつかの手続きを記述した結果は`<h1>`タグの一行のみで，スマートでない．

本質的にやりたいのは`<div>`に`<h1>Develop. Preview. Ship. 🚀</h1>`を追加すること．
プログラムによって
「〇と△をしてください！(その結果欲しいものが得られる)」
を記述するのではなく，
「これをここに追加したいです！(細かい処理は任せますよ)」
と記述したほうが簡潔で便利ですよね？
これを実現したのが**React**．JavaScriptは前者．


[fig_html]: ./html.png
[fig_dom]: ./dom.png