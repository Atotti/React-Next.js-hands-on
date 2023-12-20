# CSSスタイル
- global CSSファイルを追加する方法
- Tailwindモジュール・CSSモジュール　の設定方法
- `clsx`ユーティリティパッケージを使用して条件付きでクラス名を追加する方法

## グローバルスタイル
`/app/ui/global.css`の設定がアプリケーション内のすべてのルートに適用される．
アプリケーション内の任意のコンポーネントにインポートできる．
通常は最上位のコンポーネントに追加する

`/app/layout.tsx`でインポートすることでグローバススタイルを使える．
```tsx
import '@/app/ui/global.css';//
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`/app/ui/global.css`内を見ると
```CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
...
```
となっている．

## Tailwind
- CSSフレームワーク
- tsxマークアップに直接ユーティリティ・クラスを記述できる
- クラス名を追加してスタイルを適用する
```css
<h1 className="text-blue-500">I'm blue!</h1>
```



