# chapter18 (Next/8th)
## 静的レンダリングと動的レンダリング

これまでのチャプターでは，ダッシュボードの概要ページに必要なデータを取得しました．前の章でも触れましたが，現在の実装では次の2点の制約があります．
1. データリクエストが無意識的にwaterfallを形成している
2. ダッシュボードは静的で，データが更新されてもアプリケーション上の表示は変化しない

これを踏まえて，この章では
- 静的レンダリングとは何か，パフォーマンス向上につながる理由
- 動的レンダリングとは何か，いつ用いるべきか
- dashboardを動的なものにする他のアプローチ
- データ取得の遅延とその影響

を学びます．

## 静的レンダリングとは
静的レンダリングを用いる場合，データの取得とレンダリングはサーバー上でのビルド時(デプロイ時)や[データを再検証するタイミング][link:reValidation]に行われます．データの取得結果は[CDN(Content Delivery Network)][link:CDN]上に配布され，キャッシュされます．

![img:cache_data]

ユーザがアプリケーションを訪れたときは，キャッシュされたコンテンツが表示されます．

静的レンダリングの利点をまとめると次のようになります．

- アプリの高速化
  - プリレンダリングされたコンテンツはキャッシュされ，グローバルに配布されます．このおかげで，世界中の人間がアプリを見れるし．読み込みが速くなる．
- サーバの応答回数を減らす
  - コンテンツがキャッシュされているので，サーバーはユーザのリクエスト毎に直接コンテンツを生成する必要がなくなる．
- SEO
  - あらかじめレンダリングされたコンテンツはページ読み込み時にはすでに利用可能となっているため，検索エンジンのcrawlerがインデックス付けしやすく，検索結果の上位にひょじされやすくなります．

静的レンダリングは**データがない**若しくは**ユーザ間で共通のデータ**を扱うUIにとっては便利です．しかし今回のdashboardのような日常的に更新されうるようなユーザ個人との結びつきの強いデータを扱うケースにとっては不向きです．

静的レンダリングの対になるのが動的レンダリングです．

## 動的レンダリングとは
動的レンダリングを用いると，コンテンツはサーバー上で**ユーザがページを訪れた瞬間**にレンダリングされます．動的レンダリングを用いることの利点は次のようです．
- リアルタイムのデータ
  - 動的レンダリングではリアルタイムであったり，頻繁に変化するようなデータを表示することがてきます．頻繁にデータが更新されるようなアプリケーションでは，動的レンダリングを採用するのが最適です．
- ユーザー固有のコンテンツ
  - dashboardsやユーザプロファイルなど，ユーザ個人と紐づいたデータを提供したり．ユーザのインタラクションに応じてデータを更新したりすることが容易になります．
- リクエスト時の情報
  - 動的レンダリングはcookiesやURLの検索パラメータなど，ユーザがページを訪れたときにしか取得できないような情報を利用することができます．

## dashboardページを動的にするアプローチ
デフォルトでは`@vercel/postgres`はそれ自身のきゃしんぐセマンティクスを設定していません．このため，フレームワークは独自の静的及び動的動作を設定できるようになります．

Nezxt.jsの`unstable_noStore`APIを使用することで，サーバーコンポーネントやデータ取得関数内で静的なレンダリングを無効にすることができます．

> `unstable_noStore`は開発段階で，今後変更される可能性があります．

`app/lib/data.ts`内で`next/cache/unstable_noStore`をインポートし，データ取得を行う関数の頭で呼び出します．
```diff ts
    // ...
+   import { unstable_noStore as noStore } from 'next/cache';
    
    export async function fetchRevenue() {
    // Add noStore() here to prevent the response from being cached.
    // This is equivalent to in fetch(..., {cache: 'no-store'}).
+   noStore();
    
    // ...
    }
    
    export async function fetchLatestInvoices() {
+   noStore();
    // ...
    }
    
    export async function fetchCardData() {
+   noStore();
    // ...
    }
    
    export async function fetchFilteredInvoices(
    query: string,
    currentPage: number,
    ) {
+   noStore();
    // ...
    }
    
    export async function fetchInvoicesPages(query: string) {
+   noStore();
    // ...
    }
    
    export async function fetchFilteredCustomers(query: string) {
+   noStore();
    // ...
    }
    
    export async function fetchInvoiceById(query: string) {
+   noStore();
    // ...
    }
```
## データ取得が遅延した場合をシミュレーションする
ダッシュボードを動的レンダリングするようにしました．が，前の章で問題になった，ある1つのデータ取得が他のものより遅かった場合を考えてみます．

`/app/lib/data.ts`にて，コメントアウトを解除して疑似的にデータ取得の遅延を生じさせます．

```diff ts
    export async function fetchRevenue() {
    try {
        // We artificially delay a response for demo purposes.
        // Don't do this in production :)
+       console.log('Fetching revenue data...');
+       await new Promise((resolve) => setTimeout(resolve, 3000));
    
        const data = await sql<Revenue>`SELECT * FROM revenue`;
    
+       console.log('Data fetch completed after 3 seconds.');
    
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
    }
    }
```
実際にdashboardページに飛んでみると，3秒後に画面が更新されます．このように，動的レンダリングを用いた場合，アプリケーションの動作速度は**最も遅いデータ取得に依存**します．


[link:reValidation]: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data

[link:CDN]: https://developer.mozilla.org/ja/docs/Glossary/CDN

[img:cache_data]: ./static_render.png
