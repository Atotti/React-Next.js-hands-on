# chapter01
## はじめに
### 新規プロジェクト作成
Next.jsアプリケーションを作成するには，アプリを保存するディレクトリにcdし，
```bash
npx create-next-app@latest nextjs-dashboard --use-npm --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example"
```
を実行します．
> My app now created at `/takuo/APP_Next`.

このコマンドでは，Next.jsアプリケーションをセットアップするコマンドラインインターフェースである[`create-next-app`][create_next_app]を使用します．さらに，`--example`フラグでこのコースの[example app][ex_app]を読み込んでいます．

### プロジェクトを見てみる
大体のコードは書いてくれている(ありがとう)ので，アプリケーションのコードを書かずにNext.jsの学習に集中できます(ありがとう)．

`cd APP_Next/nextjs-dashboard/`します．
#### フォルダ構造
Nextフレームワークが提供するディレクトリ構造は下のよう．

![dirstruct]
- `/app`: アプリケーションのルート(Route)，コンポーネント，ロジック(機能実装みたいな)が含まれる
  - `/app/lib`: アプリケーション内で呼び出されうる小関数(reusable utility functions)や，データ取得関数などが格納される．
  - `/app/ui`: cards, tables, forms等の，アプリケーションのUIコンポーネントを格納する．今回は事前に実装済み(ありがとう)．
- `/public`: 画像などの静的アセットを格納する．
- `/scripts`: データベース設定のために用いるseedingスクリプトを格納する．
- configs: `create-next-app`コマンドを使用すると，自動で作ってくれる．適宜修正したりする．

今後はこのフレームワークに従って作業をします．
#### プレースホルダーデータ
UIを構築する上で，プレースホルダーデータがあると役立ちます．というのも，データベースやAPIが利用できない段階では，以下のことが可能なためです．
- プレースホルダーデータをJSON形式またはJavaScriptオブジェクトとして使用できる．
- [mockAPI][mock_api]等のサードパーティーサービスを利用できる．

このプロジェクトでは，事前に`app/lib/placeholder-data.js`にプレースホルダーデータが用意されています(ありがとう)．このファイルのJSオブジェクトはデータベース内のテーブルを表しており，後の章でデータベースを設定するまではデータベースの代わりとしてこれを用います．データベースへデータを流し込み際にも使用します．

#### TypeScript
既に雛形に含まれている`.ts`や`.tsx`ファイルについて，これらはTypeScriptによって記述されたものです．モダンなWeb開発環境を反映して，このプロジェクトは TypeScriptで作成されています(ありがとう)．

`app/lib/defenitions.ts`を見てみると，データベースから返されると想定される値の型が宣言されています．型を定義しておけば，コンポーネントやデータベースに間違った型の値を渡す事故を回避できます．
```ts
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};
```
> **If you're a TypeScript developer:**
> 
> - We're manually declaring the data types, but for better type-safety, we recommend [Prisma](https://www.prisma.io/), which automatically generates types based on your database schema.
> 
> - Next.js detects if your project uses TypeScript and automatically installs the necessary packages and configuration. Next.js also comes with a [TypeScript plugin](https://nextjs.org/docs/app/building-your-application/configuring/typescript#typescript-plugin) for your code editor, to help with auto-completion and type-safety.

### 開発サーバを走らせる
```shell
npm i
```
を実行してプロジェクトのパッケージをインストールし，
```shell
npm run dev
```
を実行してNext.jsの開発サーバを起動します．ポート`3000`で起動するので，[`http://localhost:3000`](http://localhost:3000)にアクセスして見てみます．

![first_NextApp]
なんかクソデカ矢印がいますね．

[create_next_app]: https://nextjs.org/docs/app/api-reference/create-next-app
[ex_app]: https://github.com/vercel/next-learn/tree/main/dashboard/starter-example
[dirstruct]: ./dir_structure.png
[mock_api]: https://mockapi.io/
[first_NextApp]: ./firstView.png