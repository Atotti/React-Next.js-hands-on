# CSSスタイル
- global CSSファイルを追加する方法
- Tailwindモジュール・CSSモジュール　の設定方法
- `clsx`ユーティリティパッケージを使用して条件付きでクラス名を追加する方法

## グローバルスタイル
`/app/ui/global.css`の設定がアプリケーション内のすべてのルートに適用される．
アプリケーション内の任意のコンポーネントにインポートできる．
通常は最上位のコンポーネントに追加する．

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
は文字が青くなる．500は濃さ．

CSSスタイルはグローバルに共有されるが，各クラスは各要素に個別に適用される．
つまり，要素を追加・削除しても，別々のスタイルシートを維持したり，スタイルが衝突したり，CSS bundleのサイズが大きくなったりしなくて安心．

黒い三角形▲
```css
<div
  className="h-0 w-0 border-b-[30px] border-l-[20px]
   border-r-[20px] border-b-black
   border-l-transparent border-r-transparent"
/>
```

## CSSモジュール
一意にクラス名を自動的に作成できる　→　スタイルの衝突を心配しなくていい．
このコースでは今後もTailwindを使う．
黒い三角形をCSSで書くと以下
```CSS
.shape {
  height: 0;
  width: 0;
  border-bottom: 30px solid black;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
}
```

## ライブラリを使用して`clsx`クラス名を切り替える
ステータス{'pending', 'paid'}を受け付けるInvoiceStatusコンポーネントを作成したいとする．
'paid'：緑色
'pending'：灰色
```tsx
import clsx from 'clsx';
 
export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        //classNameの中で条件分岐してる
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
)}
```

## その他のスタイリングソリューション
- .cssファイルをインポートできるSass`.scss`
- styled-jsxなどのCSS-in-JSライブラリ


