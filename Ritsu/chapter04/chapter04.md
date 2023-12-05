# React を始める
プロジェクトでReactを使用するには、unpkg.com から二つのReactスクリプトをロードする必要あり。
- react
- react-dom

## JSXとは
JavaScript の構文拡張機能で、HTML のような構文で UI を記述することができる。
しかし、そのままではブラウザはJSXを理解できないため、Babelなどのコンパイラツールを用いてJSXコードをJavaScriptに変換する。

### Babel
JavaScriptにはECMAScriptというバージョンがあるため、上位・下位バージョンとの互換性が課題になってしまう。新しいバージョンの記法で描いたJavaScriptコードを下位バージョンのJavaScriptで動くようにする変換するツールが必要であり、これが「Babel」である。ちなみにこの変換のことをトランスパイルと呼ぶ。