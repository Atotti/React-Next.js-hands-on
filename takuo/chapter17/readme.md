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
---
### request waterfallとは？
### データ取得の並列化



[link:RouteHandlers]: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

[link:relationalDB]: https://aws.amazon.com/jp/relational-database/

[link:Prisma]: https://www.prisma.io/

[link:ORM]: https://vercel.com/docs/storage/vercel-postgres/using-an-orm

[link:VercelPostgresSDK]: https://vercel.com/docs/storage/vercel-postgres/sdk

[link:SQLInjection]: https://vercel.com/docs/storage/vercel-postgres/sdk#preventing-sql-injections

[img:activatedRevenue]: ./revenue.png

[img:latestInvoices]: ./latestInvoices.png