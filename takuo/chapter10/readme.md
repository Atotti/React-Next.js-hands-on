# chapter 10
## サーバー及びクライアントのコンポーネント
サーバーコンポーネントとクライアントコンポーネントの働きを理解するには，次のWeb概念を理解しておくとよい．
- コードが実行される環境は`サーバ`と`クライアント`である
- `network boundary`がサーバとクライアントのコードを分離する

### サーバとクライアント
Webアプリケーションの文脈では，**クライアント**と**サーバ**は次のように定義される．
- **クライアント**
  -  ユーザのデバイス上にあるブラウザ．
  1. アプリケーションのコードをサーバにリクエストする．
  2. サーバから受信した応答をユーザが操作できるインターフェースに変換する．
- **サーバ**
  - コンピュータ(しばしばデータセンターにある)．
  1. アプリケーションのコードを保持している．
  2. クライアントからのリクエストを受けたら，計算を行い，適切なレスポンスを返す．

各環境には独自の機能と制約がある．
たとえば，レンダリングとデータ取得をサーバ側で行うと，クライアントに送信されるコードの量が減ったり，アプリケーションのパフォーマンスが向上したりする．
が，UIをインタラクティブにするには，クライアント側のDOMを更新する必要がある．

したがって，それぞれの環境に適した処理は異なるので，クライアント用とサーバ用で書くコードは同じとは限らない．

### network boundary
ネットワーク境界，環境を区別する概念的な線．
Reactでは．サーバ//クライアントのネットワーク境界をコンポーネント木のどこに設けるか設定できる．

![partly_client]

例えばこんなコンポーネント木の場合，`LikeButton`, `Links`等のインタラクティブな要素はクライアントでレンダリングし，他の要素はサーバでレンダリングするのがよさそう．
ここでの`Links`は，ページ間で共有される`Nav`内のコンポーネントで，リンクのアクティブ状態を表示したいので，クライアント側レンダリングとしている．

裏側では，コンポーネントは**サーバモジュールグラフ**と**クライアントモジュールグラフ**の二つに分割されている．
- **サーバモジュールグラフ**
  - サーバでレンダリングされるコンポーネントをすべて含む
- **クライアントモジュールグラフ**
  - クライアントでレンダリングされるコンポーネントをすべて含む

練習の観点においては，ネットワーク境界をコンポーネント木の*葉側*に持ってくるのがよさそう(極力インタラクティブな要素だけをクライアントレンダリングとする)．というのも，クライアント側に送るコードの量を削減することでアプリケーションのパフォーマンスを向上できるので．
### クライアントコンポーネントを使ってみよう
これまで書いていたプログラムでは，サーバコンポーネントをデフォルトで使うようになっていた(エラーが出ていましたね)．
![err_sv]
> You're importing a component that needs useState. It only works in a Client Component but none of its parents are marked with "use client", so they're Server Components by default.

これは`useState`をサーバコンポーネントで使用しようとしていることに対するエラー(警告)です．
インタラクティブな要素(ここでは`LikeButton`)をクライアントコンポーネントとして実装し，エラーを解消します．

1. `/app/like-button.js`を作成します．
   ```jsx
   export default function LikeButton() {}
   ```
2. `<button>`elementと`handleClick()`を`page.js`から`LikeButton`コンポーネントに移行します(コピペ)．
   ```diff jsx
   export default function LikeButton() {
   +  function handleClick() {
   +  setLikes(likes + 1);
   +}
  
   + return <button onClick={handleClick}>Like ({likes})</button>;
   }
   ```
1. `/app/like-button.js`に`likes`Stateとimportを移します．
    ```diff jsx
    + import { useState } from 'react';
    
    export default function LikeButton() {
    +  const [likes, setLikes] = useState(0);
    
      function handleClick() {
        setLikes(likes + 1);
      }
    
      return <button onClick={handleClick}>Like ({likes})</button>;
    }
    ```
2. `LikeButton`をクライアントコンポーネントにするために，ファイルの先頭に`use client`を記述します．これによりReactがクライアントでレンダリングするべきコンポーネントであることを理解できます．
   ```diff jsx
   +'use client';
 
    import { useState } from 'react';
    
    export default function LikeButton() {
      const [likes, setLikes] = useState(0);
    
      function handleClick() {
        setLikes(likes + 1);
      }
    
      return <button onClick={handleClick}>Like ({likes})</button>;
    }
   ```
3. `/app/page.js`に`LikeButton`コンポーネントをimportします．
   ```diff jsx
   + import LikeButton from './like-button';
 
    function Header({ title }) {
      return <h1>{title ? title : 'Default title'}</h1>;
    }
    
    export default function HomePage() {
      const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];
 
    return (
      <div>
        <Header title="Develop. Preview. Ship." />
        <ul>
          {names.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
   +    <LikeButton />
      </div>
    );
   }
   ```
4. 動くかな…？
   ![worked]
   動いた！！！！
   ```html
    <div>
      <h1>Develop. Preview. Ship.</h1>
      <ul>
        <li>Ada Lovelace</li>
        <li>Grace Hopper</li>
        <li>Margaret Hamilton</li>
      </ul>
      <button>
        Like (<!-- -->0<!-- -->) <!--この数字だけが更新される-->
      </button>
    </div>
   ```

ちなみに変更を保存するとブラウザのビューが自動的に更新された，これは[Fast Reflesh][fast_reflesh]とよばれる．編集内容が即座に(自動的に)反映される機能．
- Hot Reloadでは？
  - 大体同じらしい
  - Reactのホットリロードには問題があり，改善のために作られたらしい
  - [らしい][diff_HotReload]
  - 違う点は
    - Fast Refreshの機能自体が、Reactに組み込まれている
    - Hooks付きの関数コンポーネントをサポート
    - リロードしてもStateを保持する
  - らしい(よくわからん)


---
> **追加資料**
>
> サーバー コンポーネントとクライアント コンポーネントについては、さらに学ぶべきことがたくさんあります。以下に追加のリソースをいくつか示します。
>
> - [サーバーコンポーネントのドキュメント](/docs/app/building-your-application/rendering/server-components)
> - [クライアントコンポーネントのドキュメント](/docs/app/building-your-application/rendering/client-components)
> - [構成パターン](/docs/app/building-your-application/rendering/composition-patterns)
> - [「使用クライアント」指令](https://react.dev/reference/react/use-client%3E)
> - [「使用サーバー」指令](https://react.dev/reference/react/use-server)


[partly_client]: ./partly_client.png
[err_sv]: ../chapter09/err.png
[worked]: ./worked.png
[fast_reflesh]: https://nextjs.org/docs/architecture/fast-refresh
[diff_HotReload]: https://zenn.dev/link/comments/a2c809817d10cd