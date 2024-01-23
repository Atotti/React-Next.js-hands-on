# Chapter 14 ルーティング

- nextjsのルーティングはファイル構造で行う
- 1つのページごとに、layout.tsx(必須じゃない?)とpage.tsxファイルを配置する

## layout.tsx
- 以下のようにlayout.tsxを配置するとネストされたファイルすべてに以下のレイアウトが適応される。
dashboard/layout.tsx
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

