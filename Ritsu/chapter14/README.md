# レイアウトとページの作成

## ダッシュボードページの作成

入れ子構造の`page.tsx`は`/`を用いることで表示することが可能。
Next.js では`page`という名前をつけ、
```
export default function Page() {
  return <p></p>;
}
```
とすることでUIコンポーネントを同じ場所に配置することができる。

## ダッシュボードレイアウトの作成
Next.jsでは`layout.tsx`ファイルを使用して、複数のページ間で共有されるUIを作成することができる。以下その内容。

```
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

- `<SideNav />`コンポーネントをレイアウトにインポート。
- `<Layout />`コンポーネントは`children`プロパティを受け取り、ページまたは別のレイアウトのいずれかになる。

## ルートレイアウト
`/app/layout.tsx`はルートレイアウトと呼ばれ、ここで追加したUIはアプリケーション内のすべてのページで共有される。