# chapter 12/ Next.ch2
## CSSスタイリング
このチャプターでは
- global CSSファイルをアプリケーションに追加する方法
- 2つのスタイリングの方法: TailwindとCSSモジュール
- `clsx`ユーティリティパッケージを用いて，条件付きでクラス名を追加する方法

を学びますよ！

### グローバルスタイル
`/app/ui`をみると，`global.css`があります．このファイルでスタイルを記述すると，そのCSSルールがCSS reset rulesや，リンク等のサイト全般にかかるHTML要素等，アプリケーション内**全ての**routeに適用されます．

アプリ内のどのコンポーネントでも`global.css`はimportできますが，[root layout][link_rootLayout]の考えに則ってトップレベルのコンポーネントでインポートするのが良いでしょう(一行目)．
```ts
import '@/app/ui/global.css';

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
反映結果を見てみると，
![fig:styled_view]

わお！きれい．
でも，色を青くしたり，文字列を左側に寄せたり，そういった処理は`global.css`には書いてないですね…？

これは，`@tailwind`で記述されたセクションにカラクリがあります．
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Tailwind
[Tailwind][link:tailwind]はCSSフレームワークで，[utility classes][link:utility_classes]をTSXマークアップに記述するだけで迅速に開発ができるようになります．
Tailwindでは，クラス名を追加して要素をスタイル設定します．例えば，classに`text-blue-500`を追加することで，`<h1>`の文字が青くなります．
```html
<h1 className="text-blue-500">BLEU?</h1>
```

CSSスタイルはグローバルに共有されていますが ，それぞれのclassはそれぞれの要素に個別に適用されます．そのため，要素を追加したり削除したりしても，そのたびにスタイルシートを変更する必要はなく，スタイルの衝突やCSSバンドルのサイズの増大等の心配する必要はありません．

`create-next-app`コマンドを使用して新しいプロジェクトを作成すると，Next.jsはTailwindを使用するか尋ねてきます(そんな気もする)．`yes`を選択すると，Next.jsが必要なパッケージをインストールし，Tailwindを構成してくれます(ありがとう)．

`/app/page.tsx`をみると，Tailwindクラスが使用されていることがわかります．
```tsx
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
 
export default function Page() {
  return (
    // These are Tailwind classes:
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
    // ...
  )
}
```
ちょっと変えて遊んでみる．
下のコードを`/app/page.tsx`の`<p>`要素に貼り付けてみると…

なんか△でてきた！
```html
<div
  className="h-0 w-0 border-b-[30px] border-l-[20px] border-r-[20px] border-b-black border-l-transparent border-r-transparent"
/>
```

![fig:changed]

### CSSモジュール
CSSモジュールを使用すると，一意のクラス名を自動的に作成することでCSSのスコープをコンポーネントに設定できるので，スタイルの衝突についても心配ご無用．
上で現れた三角をCSSで再現するには，次のようにします．
```css
.shape {
  height: 0;
  width: 0;
  border-bottom: 30px solid black;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
}
```
これを`/app/ui/home.module.css`に記述します．
`/app/page.tsx`でインポートすると…
```jsx
import styles from '@/app/ui/home.module.css';
 
//...
<div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
    <div className={styles.shape}></div>; //changed here
// ...
```



[link_rootLayout]: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
[fig:styled_view]: ./styledView.png
[link:tailwind]: https://tailwindcss.com/
[link:utility_classes]: https://tailwindcss.com/docs/utility-first
[fig:changed]: ./changed.png