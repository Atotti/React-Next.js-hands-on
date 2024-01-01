# データの取得
## Next.jsでのデータの取得には2つの方法がある
### API
- クライアントから直接データを取得した場合
- Twitter APIなど外部サービスのAPIを使いたい場合
### データベースクエリ
- APIを実装するとき
- React Server Componentsを使用するとき

に使う。

## React Server Components
プロミスのサポート： サーバーコンポーネントはプロミスをサポートしており、データ取得のような非同期タスクのためのよりシンプルな解決策を提供します。useEffectやuseState、データ取得ライブラリに頼ることなくasync/await構文を使用できます。

サーバー上での実行： サーバーコンポーネントはサーバー上で実行されるため、高コストのデータ取得やロジックをサーバー側で処理し、結果のみをクライアントに送信することができます。これにより、クライアント側の負荷が軽減され、全体のパフォーマンスが向上します。

APIレイヤーなしでの直接クエリ： 前述したように、サーバーコンポーネントはサーバー上で実行されるため、追加のAPIレイヤーなしに直接データベースをクエリすることが可能です。これにより、中間層を省略してデータベースとの直接的な対話が可能になり、開発が簡素化されます。

## 用語
- デプロイ
- データベース
- クエリ
- API

このチュートリアルではORMを利用せずに
モデルを定義して
```ts
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};
```
直接SQLを叩く関数を実装して
```ts
export async function fetchRevenue() {
  try {
    const data = await sql<Revenue>`SELECT * FROM revenue`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}
```
page中で呼び出している
```tsx
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';

export default async function Page() {
  const revenue = await fetchRevenue();
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue}  />
      </div>
    </main>
  );
}
```