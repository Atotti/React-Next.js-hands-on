# chapter19 (Next/9th)
## ストリーミング
前の章でdashboardページを動的な実装にしましたが，あるデータの取得が遅延した場合，画面はそれが完了するまで更新されないため，パフォーマンスに大きな影響があることがわかりました．

この章では，低速なデータ取得に対応し，パフォーマンスの向上を行います．
- ストリーミングとは何か，用いると良いケースについて
- `loading.tsx`と`Suspense`を使用したストリーミングの実装
- `loading skelton`について
- `route group`とは何か，使いどころはどこか
- Suspenseの境界をどこに設定するべきか

### ストリーミングとは何か
ストリーミングは，routeをより小さなチャンクに分割して，可能になり次第段階的に取得を行う転送技術です．

ストリーミングを用いることで，データ取得の遅延がページ全体をブロックすることを回避できます．すなわち，`全データの読み込み完了→UIの表示`の流れを待たずして，ユーザはページの一部を見れたり，操作したりできるようになります．チャンクごとにデータの取得とレンダリングが並列して行われるので，フェッチングが遅延している箇所以外は先に表示されるようになります．

Reactのコンポーネントモデルにおいては，コンポーネントを1つのチャンクとみなすことができるため，ストリーミングはこれにうまくハマります．

### `loading.tsx`と`Suspense`を使用したストリーミングの実装
Next.jsでストリーミングを実装するには，次の2つです．
1. `loading.tsx`ファイルでページのレベルを設定する
2. `<Suspense>`を使ってコンポーネント単位のストリーミングを設定する

#### `loading.tsx`を使用してページ全体をストリーミングする
`/app/dashboard/loading.tsx`を作成し，次のようにします．
```tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```
このファイルを追加したことで，データの取得が完了するまでは`Loading...`という文字列が表示されるようになりました．
- `loading.tsx`はSuspense上に存在する特殊なNext.jsファイルで，ページコンテンツの読み込み中に表示するフォールバックUIを作成できます．
- `<SizeNav>`コンポーネントは静的であるため，すぐに表示されます．ユーザーは動的なコンテンツの読み込みを待つ間，`<SideNav>`を操作できます．
- ユーザーはページの更新を待たずとも，別のページに移動できます(これを中断可能なナビゲーションといいます)．

ストリーミングの実装ができました！ただ，`Loading...`の文字列のみの表示は味気ないですよね…？

### loading skeltonについて
読み込みスケルトンとは，UIの簡略化バージョンが影のように表示されるものです．多くのWebサイトでは，コンテンツが読み込み途中であることをユーザに示すプレースホルダー(またはフォールバック)としてこれを使用します．

`loading.tsx`で呼び出したUIは静的ファイルの一部として埋め込まれ，はじめにクライアントに送信されます．残りの動的なコンテンツはストリーミングを経てサーバーからクライアントへ送られます．

`app/dashboard/loading.tsx`で`<DashboardSkelton>`をインポート・呼び出します．
```diff tsx
+   import DashboardSkeleton from '@/app/ui/skeletons';
    
    export default function Loading() {
+   return <DashboardSkeleton />;
    }
```
灰色の簡略化されたUIが表示されるようになりました．これがスケルトンです．ただ，これではページ内のコンテンツ全体がスケルトンになってしまっています．理想的には，データ取得が遅延しているコンポーネントのみスケルトン化したいですね．

### route groupsを設定してスケルトンの適用範囲を調整
現時点では，スケルトンはinvoicesとcustomersのページにも適用されます．これは`loading.tsx`のレベルが`/invoices/page.tsx`と`/customers/page.tsx`より高いためです．

[`Route Groups`][link:RouteGroups]を用いてこれを修正します．`(overview)`フォルダを`/app/dashboard/`に作成し，`loading.tsx`と`page.tsx`をここに移動します．このようにすることで，`loading.tsx`ファイルの内容はダッシュボードの概要ページにのみ表示されるようになります．

Route Groupsを使用すると，URLパスに影響することなく，ファイルを論理グループとしてまとめることができます．`()`で囲まれたディレクトリは，URLに現れないようになります．アプリ本体のディレクトリ構造は`/dashboard/(overview)/page.tsx`なので，ダッシュボードの概要ページのURLは`/dashboard/(overview)`となりそうですが，実際は`/dashboard`で概要のページにアクセスできます．

### コンポーネント単位のストリーミング
これまでの実装では，ページ全体をストリーミングしています．そのため，revenueのデータ取得のみが遅いのに，動的なコンポーネントが全てスケルトン表示され，revenueのデータ取得が終ってから全体がレンダリングされています．

Suspenseを使用することで，何らかの条件(データがロードされる等)が満たされるまでレンダリングを遅延させることができます．動的なコンポーネントをSuspenseでラップして，ロード中に表示するコンポーネントを渡すと，ロード中は渡したコンポーネントを表示し，データが取得できたら，ラップした中のコンポーネントを表示します．

これをダッシュボードの概要ページのコンポーネントに適用すれば，コンポーネント単位でデータ取得とレンダリングが並列化できます．

- `/app/dashboard/(overview)/page.tsx`にて，行っているrevenueデータの取得(遅い)を，`RevenueChart`コンポーネント内で行うようにします．
- `/app/dashboard/(overview)/page.tsx`内の`RevenueChart`コンポーネントの呼び出しを，`<Suspense>`でラップします．

diff:
- `/app/dashboard/(overview)/page.tsx`
    ```diff tsx
    import { Card } from '@/app/ui/dashboard/cards';
    import RevenueChart from '@/app/ui/dashboard/revenue-chart';
    import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
    import { lusitana } from '@/app/ui/fonts';
   -import { fetchRevenue, fetchLatestInvoices, fetchCardData } from '@/app/lib/data';
   +import { fetchLatestInvoices, fetchCardData } from '@/app/lib/data'; // remove fetchRevenue
   +import { Suspense } from 'react';
   +import { RevenueChartSkelton } from '@/app/ui/skelton';
    
    export default async function Page() {
        -const revenue = await fetchRevenue
        const latestInvoices = await fetchLatestInvoices();
        const {
            numberOfInvoices,
            numberOfCustomers,
            totalPaidInvoices,
            totalPendingInvoices,
        } = await fetchCardData();
        
        return (
            <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card title="Collected" value={totalPaidInvoices} type="collected" />
                <Card title="Pending" value={totalPendingInvoices} type="pending" />
                <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
                <Card
                title="Total Customers"
                value={numberOfCustomers}
                type="customers"
                />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
    +        <Suspense fallback={<RevenueChartSkeleton />}>
    -           <RevenueChart revenue={revenue} />
    +           <RevenueChart />
    +        </Suspense>
                <LatestInvoices latestInvoices={latestInvoices} />
            </div>
            </main>
        );
    }
    ```
    - `/app/ui/dashboard/revenue-chart.tsx`
    ```diff tsx
    import { generateYAxis } from '@/app/lib/utils';
    import { CalendarIcon } from '@heroicons/react/24/outline';
    import { lusitana } from '@/app/ui/fonts';
   +import { fetchRevenue } from '@/app/lib/data';
    
    // ...
    -export default async function RevenueChart({ revenue, }: { revenue: Revenue[]; })
    +export default async function RevenueChart() { // Make component async, remove the props
    +   const revenue = await fetchRevenue(); // Fetch data inside the component
        
        const chartHeight = 350;
        const { yAxisLabels, topLabel } = generateYAxis(revenue);
        
        if (!revenue || revenue.length === 0) {
            return <p className="mt-4 text-gray-400">No data available.</p>;
        }
        
        return (
            // ...
        );
    }
    ```
同様に，`LatestInvoices`もSuspenseでラップします．

### コンポーネントのグループ化
次は`<Card>`コンポーネントをSuspenseでラップします．それぞれのカードごとにデータを取得してもいいのですが，ここまでストリーミングの単位が小さいと，カードごとにポコポコとUIが更新され，若干煩いです．

ここでは，複数の`Card`コンポーネントを1つのコンポーネントにラップすることでこれを解決します．
こうすることで，ダッシュボードの概要ページは，静的な`<SideNav/>`が真っ先に表示され，`Cards`，`revenueChart`，`latestInvoices`がデータの取得が完了し次第表示されるようになります．

`page.tsx`にて，次のように実装をします．
- `<Card>`コンポーネントを消す
- `fetchCardData()`を消す
- 新しいwrapper`<CardWrapper />`をインポート
- 新しいスケルトン`<CardsSkelton/>`をインポート
- Suspenseで`<CardWrapper />`をラップ

- `/app/dashboard/page.tsx`
    ```diff tsx
    +   import CardWrapper from '@/app/ui/dashboard/cards';
        // ...
        import {
        RevenueChartSkeleton,
        LatestInvoicesSkeleton,
    +   CardsSkeleton,
        } from '@/app/ui/skeletons';
        
        export default async function Page() {
        return (
            <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    +           <Suspense fallback={<CardsSkeleton />}>
    +           <CardWrapper />
    +           </Suspense>
            </div>
            // ...
            </main>
        );
        }
    ```
- `/app/ui/dashboard/cards.tsx`
    ```diff tsx
        // ...
    +   import { fetchCardData } from '@/app/lib/data';
        
        // ...
        
        export default async function CardWrapper() {
    +   const {
    +       numberOfInvoices,
    +       numberOfCustomers,
    +       totalPaidInvoices,
    +       totalPendingInvoices,
    +   } = await fetchCardData();
        
        return (
            <>
            <Card title="Collected" value={totalPaidInvoices} type="collected" />
            <Card title="Pending" value={totalPendingInvoices} type="pending" />
            <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
            <Card
                title="Total Customers"
                value={numberOfCustomers}
                type="customers"
            />
            </>
        );
        }
    ```

### Suspense境界をどこに設定するべきか
今回の例では，CardコンポーネントごとにSuspenseを設定せず，Cardのラッパーに対してSuspenseを設定しました．
どのレベルでSuspenseを分離するかは次のような基準で決めると良いです．
1. ストリーミング中，ユーザーにどのような体験を提供したいか
2. どのコンテンツを優先したいか
3. コンポーネントがデータの取得に依存している場合

ダッシュボードページの実装を振り返ると…
- 当初`loading.tsx`が行っていたように，ページ全体をストリーミングの単位とすることもできます．これは単純ではありますが，データ取得が遅延した際にロード時間が長くなってしまいます．
- 全部のコンポーネント1つ1つをストリーミングの単位とすることもできます．これはデータ取得の遅延に伴うロード時間の遅延は最小限ですが，更新単位が小さすぎて煩くなりがちです．
- 更新の煩雑さを軽減するために，ページのセクションをストリーミング単位にすることもできます．煩雑さを軽減することはできますが，セクション内のコンポーネントをラッピングするコンポーネントを新たに作成する必要があります．

Suspenseの単位をどのようにするか，というのは実際に作るアプリケーションに大きく依存します．実際にアプリケーションを作る際は，ここで実践したような，データ取得をコンポーネント内に落とし込んだり，いくつかのコンポーネントをラッピングしたり，といった手法は使いどころがあるかもしれません．

[link:RouteGroups]: https://nextjs.org/docs/app/building-your-application/routing/route-groups