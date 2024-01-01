# chapter 14
## レイアウトとページを作成する
- ファイルシステムルーティングを用いて`dashboard`ルートを作る
- 新しいrouteセグメントを作成する場合の，フォルダとファイルの役割を学ぶ
- 複数のダッシュボード間で共有できる，ネストされたレイアウトと関連ファイルを作成する
- colocation, 部分レンダリング，ルートレイアウトについて理解する

### ネストされたルーティング
Next.jsはファイルシステムルーティングを使用しており，**フォルダ**を使用してネストされたルートを作成します．つまり，**URLセグメント**がアプリケーションのフォルダ構造に対応しています．
![img:nestedRouting]

`layout.tsx`や`page.tsx`を用いることで，routeに応じたUIを作成することができます．

`page.tsx`はReactコンポーネントをexportするNext.js特有のファイルで，ルートにアクセスできるようにするために必要です．ネストされたrouteを作成するために，ネストするフォルダの中に`page.tsx`を作成します．
![img:addPage.tsx]

たとえば，`/app/dashboard/page.tsx`はURLの`/dashboard`パスと対応しています．

### ダッシュボードページの作成
`/app/dashboard`を作成し，`page.tsx`を追加し，次のようにします．
```tsx
export default function Page() {
  return <p>Dashboard Page</p>;
}
```
`http://localhost:3000/dashboard`へアクセスすると，`Dashboard Page`という文字列が表示されます．
このように，Next.jsで新しいページを作成するには，フォルダによって新しいrouteセグメントを作成し，`page.tsx`を作成すればよいです．

Next.jsでは，`page`という名前の付いたファイルを含んでいるフォルダは，UIコンポーネント，テストファイル，他関連コードとを同じ場所に配置できます．また，`page`ファイルを含んでいるフォルダ内のコンテンツのみが公開されます．実際，`/ui`と`/lib`フォルダは`/app`内の`/dashboard`と同じ階層に位置していますが，`page`ファイルが含まれていないのでたとえば`http://localhost:3000/ui`にアクセスしても404となります．

### ダッシュボードレイアウトの作成
`/dashboard/layout.tsx`を作成し，次のようにします．
```tsx
import SideNav from '@/app/ui/dashboard/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
```
まず，`<SideNav />`をimportしていますが，このファイルでimportするファイルはレイアウトの一部になります．

また，`<Layout />`コンポーネントは`children`プロップを受けっとっています．この子要素はページや他のレイアウトのどちらでも引数にとることができます．ここで作るアプリでは，`/dashboard`内のページは次のように自動的に`<Layout />`コンポーネント内でネストされます．
![img:autoNest]

Next.jsでlayoutsを用いる理由の一つは，navigationにおいて，layoutは再レンダリングされず，pageコンポーネントだけが再レンダリングされることです．これは[部分レンダリング][link:partialRendering]とよばれます．
変更箇所だけをレンダリングし直すので処理負荷が減って良いですね．

### ルーティングのレイアウト
Chapter3(13)では，`/app/layout.tsx`を次のようにしました．
```tsx
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```
これは[root layout][link:rootLayout]とよばれ，必須のものです．root layoutに追加したUIはアプリケーション内の**全ての**ページで共有されます．root layoutでは`<html>`タグや`<body>`タグを編集したり，後述のメタデータを追加することもできます．

`/app/dashboard/layout.tsx`で作成したlayoutはdashboardページにのみ適用されているため，上記のroot layoutに追加のUI要素を追加する必要はありません．




[img:nestedRouting]: https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Ffolders-to-url-segments.png&w=1920&q=75&dpl=dpl_AGVpExNSxGb3dC5jrZYnL2rzPEsj

[img:addPage.tsx]: https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fdashboard-route.png&w=1920&q=75&dpl=dpl_AGVpExNSxGb3dC5jrZYnL2rzPEsj

[img:autoNest]: https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fshared-layout.png&w=1920&q=75&dpl=dpl_AGVpExNSxGb3dC5jrZYnL2rzPEsj\

[link:partialRendering]: https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#3-partial-rendering

[link:rootLayout]: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required