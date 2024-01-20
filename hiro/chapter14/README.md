### ルーティング
フォルダ構造がURLのルーティングに使用される．
![Alt text](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Ffolders-to-url-segments.png&w=3840&q=75&dpl=dpl_8JB59CDvJpwEWGDiYLtFnX2X3v3a)

それぞれのフォルダに`page.tsx`や`layout.tsx`を配置してページを作っていく．
![Alt text](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fdashboard-route.png&w=3840&q=75&dpl=dpl_8JB59CDvJpwEWGDiYLtFnX2X3v3a)

### Dashboardの作成
- `/app/dashboard/page.tsx`を作成してダッシュボードページを作る．
```
.
├── dashboard
│   └── page.tsx
```

- 適当なコンポーネントを返すようにすると`localhost:3000/dashboard`にアクセスできるようになる
```TypeScript
export default function Page() {
  return <p>Dashboard Page</p>;
}
```
![Alt text](images/image.png)

- `page.tsx`という名前のファイルのみがルーティングされるので，UIコンポーネント`/app`以下の好きなところに配置できる．
```
.
├── dashboard
│   └── page.tsx
├── layout.tsx
├── page.tsx
└── ui
    ├── acme-logo.tsx
    ├── button.tsx
    ├── customers
    │   └── table.tsx

```

#### CustomerページとInvoiceページの作成
```
.
├── dashboard
│   ├── customers
│   │   └── page.tsx
│   ├── invoices
│   │   └── page.tsx
│   └── page.tsx
```
中身は適当なコンポーネントを返しておく．チュートリアル参照

### Dashboardのレイアウト
- `/app/dashboard/layout.tsx`でレイアウトを書く
```TypeScript
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
![Alt text](images/image-1.png)

- `children`プロパティを受け取っている．JSXにおくとそこに`page.tsx`の中身が入るようになる．
- 子ディレクトリにあたるCustomersページやInvoicesページにも適用される．
- `/app/ui/dashboard/sidenav.tsx`にある`Sidenav`コンポーネントを呼び出している．
- レイアウトを使用することで，ページ遷移のときに**コンポーネントが再利用される**ようになり，不要な再レンダリングを減らすことができる．partial renderingと呼ばれる．

### ルートレイアウト
`/app/layout.tsx`はルートレイアウトと呼ばれ，アプリケーション内のすべてのページに適用される．UIの他にメタデータも記述する．