# chapter 17 (Next/7th)
## データの取得
16章でデータベースを構築したので，データの取得方法について学びながら，Dashboardページを完成させます．
- データを取得する方法(API, ORM, SQL, ...)について学ぶ
- サーバコンポーネントがバックエンドのリソースに安全にアクセスするためにどのように役立つか学ぶ
- network waterfallについて
- JavaScriptを用いたデータ取得の並列化実装

### データの取得方法を選択する
#### APIを使う
APIはアプリケーションコードとデータベースの中間層にあたります．次のようなケースでは，APIを使うことが多いです．
- APIを提供するサードパーティーのサービスを使用する
- クライアントに対するデータベースの秘匿性を高めたいとき
  
Next.jsでは，[Route Handlers][link:RouteHandlers]を用いることでAPIエンドポイントを作成することができます．
#### データベースクエリを用いる
フルスタックなアプリケーションを作成する場合，データベースとのやり取りのロジックを記述する必要があります．Postgresのような[リレーショナルデータベース][link:relationalDB]ではSQLや[Prisma][link:Prisma]のような[ORM][link:ORM]で記述することができます．

次のような場合はクエリを用いてデータ取得を行うとよいでしょう．
- APIエンドポイントを作成する際に，データベースとのやり取りをするプログラムを書く場合
- `React Server Components`を用いてサーバからデータを取得する場合
  - APIを介さなくとも，秘匿性を担保したまま直接データベースに対してクエリを実行できます(後述)
#### `React Server Components`によるデータ取得
デフォルトではNext.jsアプリケーションは`React Server Components`を使用します(9,10章で触れましたね)．サーバコンポーネントを用いたデータ取得は比較的新しいアプローチで，次のような利点があります．
- サーバコンポーネントは，データ取得のような非同期タスクが`promise`によりサポートされます．
  - `useEffect`や`useState`等のライブラリを用いることなく`async/await`構文を使用できます．
- サーバコンポーネントはサーバ上で実行され，取得結果のみがクライアントに送信されます．
  - DB内の情報やデータ取得ロジックをクライアントから秘匿できます．
  - データベースに対して直接(APIを介さずに)クエリを実行できます．

#### SQLを使う
この学習コースでは，次のような理由から，[Vercel Postgres SDK][link:VercelPostgresSDK]とSQLを用いてクエリを記述します．
- SQLはリレーショナルデータベースを検索するための一般的な手法であるため
- SQLを学ぶことでリレーショナルデータベースの基本を理解でき，他のツールに知識を応用できるようになるため．
- SQLではその多用途さにより，特定のデータを取得・操作できるため．
- Vercel Postgres SDKは[SQL injection][link:SQLInjection]に対する保護機能が備わっているため．

`/app/lib/data.ts`をみると，`@vercel/postgres`から`sql`をインポートしていることがわかります．
```ts
import { sql } from '@vercel/postgres';
 
// ...
```
サーバコンポーネントではSQLを呼び出せますが，`data.ts`で定義されているクエリを用いるとより簡単にコンポーネントをインポートできます．

### DashboardのOverviewページのためのデータ取得
`/app/dashboard/page.tsx`を次のようにします．
- Pageは**async**コンポーネントなので，データ取得に`await`を用いることができます．
- データを受け取るコンポーネントが3つあり，現在はコメントアウトされています．
  - `<Card>`, `<RevenueChart>`, `<LatestInvoices>`
```tsx
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
```

#### `<RevenueChart/>`のデータ取得
`<RevenueChart/>`に用いるデータを取得します．`/app/data/lib/data.ts`から`fetchRevenue`関数をインポートし，呼び出します．
```diff tsx
 import { Card } from '@/app/ui/dashboard/cards';
 import RevenueChart from '@/app/ui/dashboard/revenue-chart';
 import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
 import { lusitana } from '@/app/ui/fonts';
+import { fetchRevenue } from '@/app/lib/data';
 
 export default async function Page() {
+  const revenue = await fetchRevenue();
   // ...
 }
```
機能を有効化するために，コメントアウトを解除していきます．
- `/app/dashboard/page.tsx`
  - `<RevenueChart/>`のコメントアウトを解除します．
- `/app/ui/dashboard/revenue-chart.tsx`
  - ファイル内のコメントアウトを解除します．

devのdashboardページを見ると，棒グラフが表示されるようになりました．
![img:activatedRevenue]

#### `<LatestInvoices/>`のデータ取得
`<LatestInvoices/>`コンポーネントのため，直近5件の請求書(invoice)データを取得します．

全ての請求書データを取得し，JavaScript上で発行時刻順にソートするのが簡単ですが，データ数が多くなると処理に時間がかかってしまうため，微妙です．したがって，ここでは**SQLクエリを工夫**して最新5件の請求書データを取得することとします．

`/app/lib/data.ts`には次のようなクエリが用意されています．
```ts
export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;
// ...
  }
}
```
> customer idが一致するようにテーブルを結合し，invoices.dateを降順でソートしています

`/app/dashboard/page.tsx`にて，`fetchLatestInvoices`関数をインポートし，`<LatestInvoices />`のコメントアウトを解除します．
```diff tsx
    import { Card } from '@/app/ui/dashboard/cards';
    import RevenueChart from '@/app/ui/dashboard/revenue-chart';
    import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
    import { lusitana } from '@/app/ui/fonts';
+   import { fetchRevenue, fetchLatestInvoices } from '@/app/lib/data';
    
    export default async function Page() {
    const revenue = await fetchRevenue();
+   const latestInvoices = await fetchLatestInvoices();
    return (
        <main>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Dashboard
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Cards commented out here */}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
            <RevenueChart revenue={revenue}  />
+           <LatestInvoices latestInvoices={latestInvoices} />
        </div>
        </main>
    );
    }
```
`LatestInvoices`コンポーネントは`/app/ui/dashboard/latest-invoices.tsx`で実装されているので，そのコメントアウトも解除しておきます．

直近の請求書たちが表示されるようになりました．
![img:latestInvoices]

#### `<Card/>`のデータ取得
`<Card>`コンポーネントに必要なデータを取得します．このコンポーネントは次に示すデータを表示します．
- 処理済みの請求書の枚数
- 処理中の請求書の枚数
- 請求書の総数
- 顧客の総数

容易に思いつく実装としては，全ての請求書と顧客のデータを取得し，JavaScriptで`Allay.length`を用いて請求書や顧客の総数を求めることができそうです．

しかしSQLを使うならば，全てのデータを引っ張ってくる必要はなく，必要なデータだけを取得することができます(データ数が増えてきた場合，全部取得するのは愚かですね)．例えば請求書と顧客の総数を取得するとき，JavaScriptによる実装とSQLによる実装例は下のようになります．
```diff
// total invoices count
- const totalInvoices = allInvoices.length;
+ const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
// total customers count
- const totalCustomers = allCustomers.length;
+ const customerCountPromise = sql`SELECT COUNT(*) FROMcustomers`;
```
データ取得用の関数は`fetchCardData`として`/app/lib/data.ts`に用意されています．

最後に，`Card`コンポーネントに必要な値が何であるか確認し，`fetchCardData`関数を用いてデータを取得するプログラムを`/app/dashboard/page.tsx`に記述します．

```diff tsx
  import { Card } from '@/app/ui/dashboard/cards';
  import RevenueChart from '@/app/ui/dashboard/revenue-chart';
  import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
  import { lusitana } from '@/app/ui/fonts';
  import {
    fetchRevenue,
    fetchLatestInvoices,
+   fetchCardData
  } from '@/app/lib/data';
  
  export default async function Page() {
    const revenue = await fetchRevenue();
    const latestInvoices = await fetchLatestInvoices();
+   const {
+     numberOfInvoices,
+     numberOfCustomers,
+     totalPaidInvoices,
+     totalPendingInvoices,
+   } = await fetchCardData();
    return (
      <main>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Dashboard
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
+         <Card title="Collected" value={totalPaidInvoices} type="collected" />
+         <Card title="Pending" value={totalPendingInvoices} type="pending" />
+         <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
+         <Card
+           title="Total Customers"
+           value={numberOfCustomers}
+           type="customers"
+         />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
          <RevenueChart revenue={revenue}  />
          <LatestInvoices latestInvoices={latestInvoices} />
        </div>
      </main>
    );
  }
```
- `fetchCardData`関数を用いてデータを取得するので，これをインポートします．
- `fetchCardData()`の返り値を受け取ります．返り値は下の4つなので，これに適合するようにします．
  - numberOfCustomers
  - numberOfInvoices
  - totalPaidInvoices
  - totalPendingInvoices
- `Card`コンポーネント関連のコメントアウトを解除します．

要約カードが現れましたね．

ここで注意すべきことが2点あります．
1. データのリクエストは意図せず互いを相互にブロックし，**リクエストウォーターフォール**を作成します．
2. デフォルトでは，Next.jsはパフォーマンス向上のためにルートを事前レンダリングし，これは**静的レンダリング**と呼ばれます．静的なので，*データが更新されてもダッシュボードに表示される内容は変化しません*．

注意点1については後述し，2については次の章で解説します．

---
### request waterfallとは？
`waterfall`とは滝のこで，前のリクエストが完了すると次のリクエストが実行されるような一連のリクエストを指します．データ取得の場合，各リクエストは前のリクエストがデータを返した後に処理が開始されます．
> ウォーターフォール型開発の`ウォーターフォール`はこれと同じです．

![img:waterFall]

たとえば`/app/dashboard/page.tsx`で呼び出しているリクエストについては，`fetchRevenue()`の処理が完了してから`fetchLatestInvoices()`が実行され，それが完了してから`fetchCardData()`が呼び出されます．

このように逐次的にリクエストが実行されることは必ずしも悪いわけではなく，リクエストを実行するためには前のリクエストで得た条件が必要な場合などは逐次的な処理でないといけません．

> ユーザIDとプロファイルをはじめに取得し，そのIDを用いてフレンドリストを取得する場合などは，逐次的に処理を行う必要があります．

逐次処理が必ずしも必要でない場面であっても逐次的にリクエストが処理されてしまうため，リクエスト数が多かったり時間のかかるリクエストがある場合はパフォーマンスに影響が出る場合があります．
### データ取得の並列化
ウォーターフォールによるパフォーマンスの低下を回避するには，リクエストの処理を並列化すればよいです．

JavaScriptでは，[`Promise.all()`][link:PrimiseAll]や[`Promise.allSettled()`][link:PromiseAllSettled]を用いることで，引数に取ったPromiseを同時に開始することができます．例えば`/app/lib/data.ts`では，`fetchData()`の中で`Promise.all()`を用いています．
```ts
export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
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

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
```
このようにして処理を並列化することで，次のような利点があります．
- 実行の開始待ちをしていた分だけ処理時間が減り，パフォーマンスが向上します．
- 生のJavaScriptを使っているので，任意のライブラリやフレームワークを使用できます．

> しかしこの処理には欠点があり，もし**ある1つのリクエストが他よりもはるかに遅い**場合，そのリクエスト処理が終了するまで次の処理を開始できません．
> 
> リクエスト処理の開始は同時にできますが，次の処理(`const data`配列を分解する処理)への移行は一番処理時間が長いリクエストの処理に引っ張られてしまいます．

[link:RouteHandlers]: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

[link:relationalDB]: https://aws.amazon.com/jp/relational-database/

[link:Prisma]: https://www.prisma.io/

[link:ORM]: https://vercel.com/docs/storage/vercel-postgres/using-an-orm

[link:VercelPostgresSDK]: https://vercel.com/docs/storage/vercel-postgres/sdk

[link:SQLInjection]: https://vercel.com/docs/storage/vercel-postgres/sdk#preventing-sql-injections

[img:activatedRevenue]: ./revenue.png

[img:latestInvoices]: ./latestInvoices.png

[img:waterFall]: ./waterFall.png

[link:PrimiseAll]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

[link:PromiseAllSettled]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled