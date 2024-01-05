# chapter 15 (Next 5th)
## ページ間のナビゲーション
これまでのチャプターではdashboad layoutとpageを作成しました．この章ではユーザがダッシュボードのルート間を移動できるようにするためにいくつかのリンクを追加します．
- `next/link`コンポーネントの使用方法
- `usePathname()`hookを使用してアクティブリンクを表示する方法
- ナビゲーションがNext.jsでどのように作用するか学ぶ

### なぜナビゲーションを最適化するのか
ページ間のリンクを張るには，古典的にはHTMLの`<a>` elementを使います．現時点ではサイドバーのリンクは`<a>` elementですが，これではページの遷移を行った際に毎回ページ全体を読み込み直す挙動になってしまいます．

左側のサイドバーは読み込み直す必要が無いので，不要な処理を行ってしまっているという点で，イマイチです．

> 現時点ではサイドバーのリンクは`<a>` element

->[`/app/ui/dashboard/nav-links.tsx`][link:nav-links]参照

### `<Link>`コンポーネント
Next.jsでは，`<Link />`コンポーネントを使用することでアプリケーション内でのページ間リンクを作成できます．`<Link>`を使用すると，JavaScriptによる[クライアントサイドナビゲーション][link:client-sideNavigation]を実行できます．

> [client-side navigation][link:client-sideNavigation]: サーバ上ではアプリケーションのコードはルートのセグメントごとに分割されている．Next.jsがこれらをあらかじめキャッシュしておくことで，ブラウザはページを再読み込みすることなく，変更されたルートセグメントのみが再レンダリングされるようになる(**自動コード分割とプリフェッチ**で詳しく後述)

`Link`コンポーネントを使用するには，`app/ui/dashboard/nav-links.tsx`を編集します．`next/link`からLinkコンポーネントをインポートし，`<a>`タグを`<Link>`タグに置き換えます．
```diff tsx
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
+import Link from 'next/link';
 
// ...
 
export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
+          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
+          </Link>
        );
      })}
    </>
  );
}
```
`Link`コンポーネントの記法は`<a>`タグのそれととてもよく似ています．`Link`コンポーネントを使いたいときは，`<a href="...">`と書く代わりに`<Link href="...">`と書けばよいです．

ブラウザでアプリを起動し，開発者ツールでDOMの変化を確認すると，ページ全体ではなくダッシュボード以外の部分だけが再レンダリングされていることが分かります．

### 自動コード分割とプリフェッチ
上記のように「ページ遷移によって変更が生じる部分だけ」が再レンダリングされるのは，自動コード分割とプリフェッチによるものです．

Next.jsでは，アプリケーションのコードをルートセグメントごとに自動的に分割します．これは，ブラウザが最初の読み込み時にアプリケーションのコードをすべて読み込むという点で，従来のReact [SPA][link:spa]と異なっています．

コードをルートごとに分割するということは，各ページ単位が独立することを意味します．したがって，あるページでエラーが生じても，アプリケーション内の他のページや機能は正常に動作します．

さらに，運用環境においては，`<Link>`コンポーネントがブラウザのビューポートに現れたとき，Next.jsは自動的にリンク先のルートのコードをバックグラウンドで**プリフェッチ**します．ユーザがリンクをクリックするまでには遷移先のページのコードを読み込み終わっているので，ページ遷移がほぼ一瞬で完了します．

---

### アクティブリンクを可視化する
一般的なUIでは，ユーザが現在どのページに居るのかを示すようなスタイリングを行います．これを行うために，URLからユーザの現在のパスを取得する必要があります．
> どのページに居るのかを示すようなスタイリング: 今見ているページへ遷移するボタンに色がつく，みたいなやつ

Next.jsでは，パスを確認してこのようなパターンを実装できる[`usePathname()`][link:usePathname] hookが提供されています．

`usePathname()`はhookなので，これを使った機能を実装する`nav-links.tsx`をクライアントコンポーネントに変更する必要があります．`"use client"`ディレクティブをファイルの頭に追記し，`next/navigation`から`usePathname()`をインポートします．
```diff tsx
+'use client';
 
 import {
   UserGroupIcon,
   HomeIcon,
   InboxIcon,
 } from '@heroicons/react/24/outline';
 import Link from 'next/link';
+import { usePathname } from 'next/navigation';
 
 // ...
```

次に，`NavLinks`コンポーネント内にパスを格納するための変数`pathname`を定義します．

```diff tsx
 export default function NavLinks() {
+  const pathname = usePathname();
   // ...
 }
```

また，`cslx`ライブラリを使用すると，リンクがアクティブなときにクラス名を適用するような条件分岐を設定できます．
`pathname == link.href`のとき，リンクのテキストが青くなり，背景が水色のままになります．
```diff tsx
 'use client';
  
 import {
   UserGroupIcon,
   HomeIcon,
   DocumentDuplicateIcon,
 } from '@heroicons/react/24/outline';
 import Link from 'next/link';
 import { usePathname } from 'next/navigation';
+import clsx from 'clsx';
 
 // ...
 
 export default function NavLinks() {
   const pathname = usePathname();
  
   return (
     <>
       {links.map((link) => {
         const LinkIcon = link.icon;
         return (
           <Link
             key={link.name}
             href={link.href}
+            className={clsx(
+              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
+              {
+                'bg-sky-100 text-blue-600': pathname === link.href,
+              },
+            )}
           >
             <LinkIcon className="w-6" />
             <p className="hidden md:block">{link.name}</p>
           </Link>
         );
       })}
     </>
   );
 }
```


[link:nav-links]: https://github.com/tenk-9/nextjs-studyApp/blob/master/app/ui/dashboard/nav-links.tsx

[link:client-sideNavigation]: https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works

[link:spa]: https://developer.mozilla.org/en-US/docs/Glossary/SPA

[link:usePathname]: https://nextjs.org/docs/app/api-reference/functions/use-pathname