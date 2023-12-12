# Chapter 09
## Nexe.jsのインストール
> Next.jsを使うには，[Node.js][Node.js_install](18.17.0 or later)をインストールする必要がある．

プロジェクトでNext.jsを使う時，`index.html`内で`react`と`react-dom`をスクリプトでロードする必要はない．
```diff html
<html>
    <div id="app"></div>
-    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
-    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/jsx">
        {/* ...*/}
    </script>
</html>
```
代わりに，`npm`や任意のパッケージマネージャーでパッケージをローカルにインストールできる．
1. `index.html`と同じディレクトリに，空のオブジェクト`{}`を含む`package.json`を作成する．
2. ターミナルで，プロジェクトのルートにcdし，次のコマンドを実行する
   ```shell
   npm install react@latest react-dom@latest next@latest
   ```
3. インストールが完了すると，`packages.json`にプロジェクトの依存関係リストが構築される．バージョンは下記以上であればOK．
   ```json
    {
        "dependencies": {
            "next": "^14.0.3",
            "react": "^18.2.0",
            "react-dom": "^18.2.0"
        }
    }
   ```
4. 準備完了
   
> Next.js has been installed @takuo/APP/
---
環境構築が終わったので，`index.html`は次のように書ける．
構築した環境をロードするため，はじめの一文を追加，他は削除できる．
```diff js
+import { useState } from 'react';
 
function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}
 
function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];
 
  const [likes, setLikes] = useState(0);
 
  function handleClick() {
    setLikes(likes + 1);
  }
 
  return (
    <div>
      <Header title="Develop. Preview. Ship." />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
 
      <button onClick={handleClick}>Like ({likes})</button>
    </div>
  );
}
```
ちなみにこれはもう様式がhtmlではないので，`.js`や`.jsx`に拡張子を変更してもよい．

## ページを作る
Next.jsはファイルシステムルーティングを使用するので，プログラムでアプリケーションのルートを記述する必要はないです．
ファイルルーティングシステムに従い，各ファイルを配置します．

1. `app`というディレクトリを作成し，その中に`index.js`を配置する．
2. `index.js`ファイルの名前を`page.js`に変更する．
3. 記述されたコンポーネントがページのメインコンポーネントとしてレンダリングできるよう，`<HomePage>`コンポーネントに`export default`を記述する．
  ```js:app/page.js
  import { useState } from 'react';

  function Header({ title }) {
    return <h1>{title ? title : 'Default title'}</h1>;
  }

  export default function HomePage() {
  // ...
  }
  ```
## 開発サーバの実行
開発サーバを実行して，開発中に新しいページの変更を確認できるようにする．
`"next dev"`スクリプトを`package.json`に追記する．
```diff js
  {
+    "scripts": {
+      "dev": "next dev"
+    },
    "dependencies": {
      "next": "^14.0.3",
      "react": "^18.2.0",
      "react-dom": "^18.2.0".
    }
  }
```
ターミナルで`npm run dev`を実行すると…
![err][err_fig]
1. エラー．
   これはNext.jsがReactサーバーコンポーネント(サーバー上でレンダリングできる機能)を使用しているため．サーバーコンポーネントは`useState`をサポートしていないため，クライアントコンポーネントを使用する必要がある．
   - 次の章で修正する．
     - サーバーコンポーネントとクライアントコンポーネント，多段階計算というものらしい
     - https://zenn.dev/uhyo/articles/react-server-components-multi-stage
     - ユーザーのアクションに依存しない部分はHTMLに展開してからクライアントに送信するらしい(斜め読み)
     - アプリ全体の処理をクライアントで実行するのではなく，あらかじめ展開しておいても問題ない部分はやっちゃおう，ということ？
     - サーバーからクライアントへのデータ転送量とクライアントの処理が減るらしい，確かに．
2. `app/layout.js`が生成されている．
   これがアプリケーションのメインレイアウトで，全てのページで共有されるUI要素を追加できる．



[Node.js_install]: https://nodejs.org/en/
[err_fig]: ./err.png
