# 静的レンダリング・動的レンダリング  
## ~ 前回の復習 ~  
* 前章では、Dashboard Overview のページのデータを取得した。しかし、現在の設定には2つの制約があった。  
    1. データリクエストが予期せぬウォーターフォールを作り出してしまうこと。  
    2. ダッシュボードが静的なのでデータのアップデートがアプリに反映されないこと。  

## Agenda
* 静的レンダリングによるアプリケーションパフォーマンス改善  
* 動的レンダリングを使うケース  
* ダッシュボードを動的するためのアプローチ法  
* スローデータフェッチのシミュレーション  

## 静的レンダリングとは  
* 静的レンダリングを用いると、データフェッチとレンダリングはビルド時（デプロイ時）か再検証の間にサーバーサイドで発生し、その結果はCDN(Content Delivery Network,数多くのキャッシュサーバなどで構成されたプラットフォームを用い、Web上のコンテンツを迅速にユーザに届けるための仕組み)で取得・配布される。  
* ユーザーがアプリを訪れたときはいつでも、取得されたデータが与えられる。
* 静的レンダリングの利点  
    1. より速いWebサイト: あらかじめレンダリングされたコンテンツはキャッシュされ、グローバルに配布されるので、世界中のユーザーがWebサイトのコンテンツにより早く確実にアクセスできる。
    2. サーバーロードの減少: コンテンツはキャッシュされているので、サーバーは動的に各ユーザーリクエストに対するコンテンツを生成する必要がない。  
    3. SEO(Search Engine Optimization, 検索エンジン最適化): あらかじめレンダリングされたコンテンツは、ページがロードされた時点で入手できるので、検索エンジンクローラーがインデックスを作るのが簡単である。その結果、検索結果のランキングの精度が上がる。  
* 静的レンダリングは、データを持たない、もしくはユーザーに広く共有されたデータ（静的なブログやプロダクトページetc）を持つUIに対して有用。パーソナライズされたダッシュボードで、定期的にアップデートされるようなものに対してはあまり向かないかも。  

## 動的レンダリングとは
* 静的レンダリングの対義語。  
* 動的レンダリングを用いると、レンダリングはリクエスト時、つまりユーザーが訪れたときに発生する。  
* 動的レンダリングの利点  
    1. リアルタイムデータの取得: 動的レンダリングを用いると、頻繁にアップデートされるデータをリアルタイムでディスプレイに反映できるので、データが頻繁にアップデートされるアプリにとっては理想的。  
    2. 特定のユーザーに対するコンテンツの提供: ダッシュボードやプロフィールのような、パーソナライズされたコンテンツを提供したり、ユーザーとのインタラクションに基づいてアップデートするのが簡単である。  
    3. リクエスト時の情報: cookiesやURLパラメータのような、リクエスト時にしか知り得ない情報にアクセスできるようになる。

## ダッシュボードを動的にする  
* vercel/postgres は、デフォルトで自身のキャッシュセマンティクスを設定しないようになっているので、フレームワークによって動的にも静的にも動作するように設定することができる。unstable_noStoreというNext.jsのAPIをサーバーコンポーネントやデータ取得関数の中で使うと、静的レンダリングをしなくなる。  
* data.tsにunstable_noStoreをnext/cacheからインポートし、データ取得関数の一番上で呼び出す。  
~~~ 
// ...
import { unstable_noStore as noStore } from 'next/cache';
 
export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
 
  // ...
}
 
export async function fetchLatestInvoices() {
  noStore();
  // ...
}
 
export async function fetchCardData() {
  noStore();
  // ...
}
 
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  // ...
}
 
export async function fetchInvoicesPages(query: string) {
  noStore();
  // ...
}
 
export async function fetchFilteredCustomers(query: string) {
  noStore();
  // ...
}
 
export async function fetchInvoiceById(query: string) {
  noStore();
  // ...
}
~~~  
## スローデータフェッチのシミュレーション  
* 1つのデータリクエストが他のすべてのデータリクエストより遅かったらどうなるか？の問題は、ダッシュボードを動的にするだけでは解決できない。そこで、スローデータフェッチをシミュレーションする。data.tsファイルで、fetchRevenue()関数の中のconsole.logとsetTimeoutのコメントを外す。
~~~
export async function fetchRevenue() {
  try {
    // We artificially delay a response for demo purposes.
    // Don't do this in production :)
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
 
    const data = await sql<Revenue>`SELECT * FROM revenue`;
 
    console.log('Data fetch completed after 3 seconds.');
 
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}  
~~~  
* ダッシュボードを実際に開くと、ページをロードするのにより長い時間がかかる。ターミナルを開くと、  
    Fetching revenue data...  
    Data fetch completed after 3 seconds.  
のメッセージが見える。ここでは、スローデータフェッチのシミュレーションのために3秒の遅延を人工的に付加している。結果として、データフェッチが行われている間はページ全体がブロックされている状態。  
* つまり、動的レンダリングを用いると、最も遅いデータフェッチに合わせた速度でしかアプリは動作しない！！

