# chapter 16
## データベースの設定
ダッシュボードの機能を完成させるには，いくつかデータが必要です．この章では`@vercel/postgres`を用いてPostgureSQLを設定します．
- アプリをGithubにPushする
- Vercelアカウントを作成し，GitHub repoに連携する(デプロイのため)
- Postogres databaseを作成し，作成中のWebアプリと連携する
- データベースにデータを流し込む

### GitHubリポジトリの作成
やります，やりました．

### Vercelアカウントの作成
やります，やりました．

### Vercelへプロジェクトを接続し，デプロイする
やります，やりました．

GitHubリポジトリをVercelに接続すると，**main**ブランチが変更された際に自動的に再デプロイされます(すごいね)．また，プルリクをOpenするとそのプルリクに対するInstant Previewが展開されるので，デプロイのエラー等を本番環境へのデプロイ前に発見でき，プレビューを開発者間で共有しやすくなります．

### Postgresデータベースを作成する
Vercelにて，
1. ダッシュボードに移動
2. `Storage`タブを選択
3. `Connect store`
4. `Create New`
5. `Postgres`
6. `Continue`

をたどり，データベースの設定をします．

データベースのregionはWashington D.C.(iad1)にします．iad1はVercelプロジェクトのデフォルトregionで，今回のアプリケーションもここで動いています．アプリケーションとデータベースを同じregionに配置することで，データのリクエストにかかる時間を減らすことができます．

接続できたら，`.env.local`タブを選択し，**Show secret**を選択し，**Copy Snippet**でコピーします．
![img:env_local]

vsCodeに戻り，アプリの`/.env.example`を`/.env`に書き換え，コピーした内容を貼り付けます．このとき，**`.env`ファイルが`.gitignore`で追跡対象外となっているか確認**してください．

最後に，
```shell
npm i @vercel/postgres
```
を実行し，[Vercel Postgres SDK][link:PsostgresSDK]をインストールします．

### データの流し込み
Dashboard機能を作るために必要なデータを流し込みます．

プロジェクトの`/scripts/seed.js`には，流し込み用の関数が用意されており，それを用いて`invoices`, `customers`, `user`, `revenue`テーブルを初期化します．

> `seed.js`では，テーブルの初期化とデータの流し込みをしています．
> `/app/lib/placeholder-data.js`にデータベースの中身に相当するものがあるので，これを読んでINSERTしています．
> 
> placeholderを読んで，f-stringライク(テンプレートリテラル?)に変数を埋め込んだSQLを実行している．
> ユーザーのパスワードをハッシュ化してからDBに入れていて，いいですね！

次に`/package.json`に次を追加し，`npm run seed`でデータの流し込みを開始できるようにします．
```diff json
 "scripts": {
   "build": "next build",
   "dev": "next dev",
   "start": "next start",
+  "seed": "node -r dotenv/config ./scripts/seed.js"
 },
```
流し込みが完了した旨のログが出力され，流し込みの処理の進捗が確認できます．
```
Created "users" table
Seeded 1 users
Created "customers" table
Seeded 10 customers
Created "invoices" table
Seeded 15 invoices
Created "revenue" table
Seeded 12 revenue
```

### データベースの中身を見てみる
Vercelのコンパネに戻り，データベースの中身を見てみます．
#### Browse
Vercelページの`Data`セクションで，テーブルを指定して中身を見ることができます．
![img:browse]

#### Query
`Data`セクションの`Query`タブを押すと，クエリを実行できます．
![img:query]



[img:env_local]: ./env_local.png

[link:PsostgresSDK]: https://vercel.com/docs/storage/vercel-postgres/sdk

[img:browse]: ./browse.png

[img:query]: ./query.png

