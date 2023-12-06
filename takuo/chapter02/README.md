# Chapter 02
## ユーザー インターフェイス (UI) のレンダリング
HTMLからUIが出来上がるまでの流れ．
1. ユーザがWebページにアクセスする
2. サーバがHTML(とその関連ファイル)を返す
3. ブラウザがHTMLを解釈，**DOM(Dovument Object Model)** を生成する．
4. DOMをもとに，ブラウザがUIを構築，表示する
5. ユーザが表示を観測

## What: DOM?
[Document Object Model][whats_dom]．HTML要素のオブジェクト表現，木likeな構造を持つ．
コード(HTML and JS etc)とUI間のブリッジとして機能する．
### DOMは操作できる
DOMメソッドやJavaScriptを使って，ユーザのアクションを取得し，DOMを変更できる．
- 要素の選択，追加，削除，更新，など
- スタイルやコンテンツを変更できる．
#### Chromeの開発者ツールでDOMが見れる
[ChromeのF12で出てくるやつ][f12]は，DOM．正確にはDOMをHTML形式で書き直したもの．
Webページ上の要素をクリックしたりすると，Elementの内容が書き変わる
- アクションによってDOMが変更されたため．
##### DOMの解釈(個人の感想です)
UI表示の最終段階，みたいな感じ，多分．コンパイル型言語における実行ファイルみたいな．

- (React, Next.jsにおいては)サーバーはユーザにHTML(とその関連ファイル)を送るだけ．
  - 基本的にいつも同じ物を送る．
  - ユーザのアクションに応じて表示を変更する，とかは全部スクリプトで記述されていて，UIの変更はブラウザがやる．
  - 最終的に表示される形態はクライアント側で出来上がる．
- ブラウザ(ユーザ)は送られてきたHTMLを基にDOMを構成する．
  - 素のHTMLならそれに書いてある要素がそのままDOMになる
  - スクリプトへの参照があったらそこで木の構築を中断，[スクリプトの中身を読み，それに応じたDOMを中断した葉を根として構築する][build_domtree]．
    
    ![fig2]
- ユーザのアクション等に応じてDOMを変更する
  - 開発者ツールを開いた状態で，ページの要素をクリックしたりするとその内容が変わるのはコレ．
  - 最新の状態のDOMをHTML形式に書き直した物がF12のElement．

基本的な流れはこんな感じ？
1. サーバから初期状態のHTMLとその関連ファイルが送られてくる．
2. クライアントはそれを解析してDOMを構築する．
3. ユーザのアクション等に応じてDOMを変更する．
4. DOMに基づいて，UIを表示
5. 3,4を繰り返す

[fig2]: ./HTML2DOM.png
[whats_dom]: https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model/Introduction
[f12]: https://developer.chrome.com/docs/devtools/dom?hl=ja
[build_domtree]: https://developer.chrome.com/docs/devtools/dom?hl=ja#appendix