# データの取得  
## Agenda  
* データ取得のアプローチ：API / ORM / SQL etc   
* バックエンドのリソースにより安全にアクセスするためのサーバーコンポーネントの役割  
* ネットワークウォーターフォールとは
* JavaScriptパターンを用いた複数データの同時取得の実現方法

## データ取得のアプローチ  
### API層  
* **API**とは   
    Application Programming Interface。一般的には、ソフトウェア同士を繋ぐインターフェースを指す。この章では、アプリ（のコード）とデータベースの間にある中間層。アプリとDB管理システムとの通信を可能にする。  
* APIを使うケース
    1. APIを提供する第三者のサービスを利用する場合。
    2. クライアントからデータを取得するときに、データベースの中身をクライアントから秘匿するためにAPIが必要。
* Next.jsでは、Route Handlers を用いてAPIエンドポイントを作成する。  

### データベースクエリ  
* フルスタックアプリケーション（フロントエンド・バックエンドの双方を一つのコードベースに含むソフトウェア）の開発においては、DBとのやりとりのロジックもコードとして書く必要がある。Postgresのようなリレーショナルデータベース（RDB, 行・列からなる表で構成され、表同士の関係も定義することでデータ管理を行う）を用いる場合は、SQLやPrismaのようなORM(Object Relational Mapping、DBをオブジェクト指向言語を用いてオブジェクトに落としこむ)で書ける。  
* データベースクエリを書くケース  
    1. APIエンドポイントの作成時
    2. Reactサーバーコンポーネントを使ってデータをサーバで取得する場合は、APIをスキップでき、直接かつ安全にデータベースに問い合わせを行うことが可能。  

### サーバーコンポーネントを使ったデータ取得  
* Next.jsアプリケーションでは、デフォルトでReactサーバーコンポーネントを用いる。サーバーを使ってデータ取得するのは比較的新しいアプローチである。  

* このアプローチの利点  
    1. 非同期タスクであるデータ取得をサーバーコンポーネントが簡素化してくれる。  
        →useEffect, useState, データフェッチングライブラリを使う代わりにasync/await構文で書ける。
    2. サーバーコンポーネントはサーバー上で実行されるので、負荷のかかるデータ取得やロジックをサーバー側ですべて処理した上で、結果のみクライアントに送信できる。
    3. サーバー上で実行されるため、追加のAPIなしで直接DBに問い合わせ可能。

### SQLの利用 
* この章で作成するプロジェクトでは、Varcel Postgres SDKとSQLを使ってDBを記述。
* なぜSQLか？  
    1. RDBに問い合わせをする時のデファクトスタンダード(業界標準)
    2. RDBの基礎を理解する
    3. 特定のデータを取得・操作できる
    4. Varcel Postgres SDKがSQLインジェクション（不正なSQLを用いたサイバー攻撃）から守ってくれる  

* /app/lib/data.tsにSQLをインポート
~~~
import { sql } from '@vercel/postgres';
 
// ...
~~~

## dashboard overviewページのデータを取得してみる
* dashboard overviewページのデータ取得をした。
~~~
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
 
export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
        {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
        {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        {/* <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}  /> */}
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
    </main>
  );
}
~~~

* async構文が用いられたページなので、データ取得のためにawait構文を使える。
* コメントアウトされているCard / RevenueChart / LatestInvoicesは、データを受け取るコンポーネント。

## RevenueChartコンポーネントのデータを取得してみる
* まず、fetchRevenue関数をインポートして、コンポーネント内で呼び出す。
~~~
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';
 
export default async function Page() {
  const revenue = await fetchRevenue();
  // ...
}
~~~

* 次にコメントアウトを外す。→ Revenueのデータが見えるようになる

## LatestInvoicesコンポーネントのデータを取得してみる
* 日付順に並べられた直近の5つのインボイスをとってくる必要がある。  
    → JavaScriptで全部のインボイスをソートすることが可能だが、データ数が増えると重くなるので代わりにSQLを用いる。

* 日付順に並べられた直近の5つのインボイスを取得するSQLが以下
~~~
// Fetch the last 5 invoices, sorted by date
const data = await sql<LatestInvoiceRaw>`
  SELECT invoices.amount, customers.name, customers.image_url, customers.email
  FROM invoices
  JOIN customers ON invoices.customer_id = customers.id
  ORDER BY invoices.date DESC
  LIMIT 5`;
~~~

* 次に、fetchLatestInvoices関数をインポートする。
~~~
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue, fetchLatestInvoices } from '@/app/lib/data';
 
export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  // ...
}
~~~

* LatestInvoicesコンポーネントのコメントアウトを外す。→ Invoicesが見えるようになる。  

注）
    1. データリクエストがお互いをブロックして「リクエストウォーターフォール」を作ってしまう。
    2. デフォルトで静的レンダリングが行われており、データが変更されてもダッシュボードに反映されない。（次回詳しくやる！）

## リクエストウォーターフォールとは
* **ウォーターフォール** : 前のリクエストが完了していないと応答できないような、ネットワークにおける一連のリクエスト。データ取得では、前のリクエストがデータを返してからでないと、次のリクエストが開始できない。

Ex. このプロジェクトでは、fetchRevenue()が実行されてからでないと、fetchLatestInvoices()が実行できない。
~~~
const revenue = await fetchRevenue();
const latestInvoices = await fetchLatestInvoices(); // wait for fetchRevenue() to finish
const {
  numberOfInvoices,
  numberOfCustomers,
  totalPaidInvoices,
  totalPendingInvoices,
} = await fetchCardData(); // wait for fetchLatestInvoices() to finish
~~~

* 次のリクエストを実行する前に条件を満たしておきたい場合など、ウォーターフォールが必要になる場合もある。（例えば、最初にユーザーIDやプロフィール情報が欲しい、などなど。）しかし、これがパフォーマンスに影響して思わぬ動作をしてしまうこともある。

## 複数データの同時取得
* 複数のデータリクエストの処理を同時に始めることでウォーターフォール状態を
回避できる。  

* JavaScriptでは、Promise.all()やPromise.allSettled()を用いて実現できる。data.tsでは、Promise.all()をfetchCardData関数の中で使用。
~~~
export async function fetchCardData() {
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;
 
    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);
    // ...
  }
}
~~~  

* 上記のJavaScriptパターンを利用するメリット  
    1. 複数のデータ取得を同時に行うことによるパフォーマンス向上
    2. JavaScriptパターンはどんなライブラリやフレームワークにも組み込める。

* ただし、このJavaScriptパターンにだけ頼っていることによりデメリットも生じうる。  
→ 例えば、1つだけめっちゃ遅いリクエストがあったらどうなる？？（次回）