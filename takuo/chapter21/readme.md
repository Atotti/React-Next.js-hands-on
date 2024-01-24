# chapter21 (Next/11th)
## 検索とページネーションの追加
これまでの章では，ストリーミングを用いてdashboardページの読み込みを高速化しました．ここからは`/invoices`ページに焦点を移します．

- Next.jsのAPIの使い方
  - `searchParams`, `usePathname`, `useRouter`
- URL検索パラメータを用いた，検索とページネーションの実装

### はじめに
`/dashboard/invoices/page.tsx`を次のようにします．
```tsx
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
 
export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      {/*  <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> */}
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
```
このコードが何をしているかというと…
1. `<Search/>`コンポーネントで特定の請求書の検索機能を提供しています．
2. `<Pagination/>`で請求書一覧のページ送りができます．
3. `<Table/>`で請求書を表示します．

検索機能は機能的にサーバーとクライアントにまたがっています．というのも，クライアントで請求書を検索したとき，URLパラメータが更新され，サーバー上でデータがフェッチされて表が再レンダリングされます．

### なぜURL検索パラメータを使用するのか
先述の通り，検索状態を管理するためにURL検索パラメータを使用します．クライアント側の状態を使用する方法もありますが，URLパラメータを使用した検索を実装することには次のような利点があります．
- URLはブックマークと共有が可能である
  - 検索パラメータがURL内にあるので，検索クエリやフィルターの情報を含めたアプリケーションの状態をブックマークで保存できます．これはアプリケーションを後々参照し直したり，共有したりするときに嬉しいです．
- サーバーサイドレンダリングと初期ロード
  - URLパラメータはサーバー上での初期レンダリングに直接使用されるため，サーバー上でのレンダリング処理が簡単になります．
- 分析と追跡
  - クエリとフィルターが直接URLに含まれているため，追加のクライアントサイド処理を必要とせずともユーザーの振る舞いを追跡しやすくなります．

### 検索機能の追加
検索機能の実装に使うNext.js client hooksは次の3つです．
- `useSearchParams`
  現在のURLのパラメータを取得するために使用します．たとえば，URLが`/dashboard/invoices?page=1&query=pending`のとき，`{page: '1', query:'pending'}`が返ってきます．
- `usePathname`
  URLのパス名を返します．例えば，routeが`/dashboard/invoices`なら，`/dashboard/invoices`が返されます．
- `useRouter`
  クライアントコンポーネント内でのroute遷移を可能にします．[複数のメソッド][link:useRouterMethods]があります．

実装の方針は次のようです．
1. ユーザーの入力を取得する
2. 検索パラメータに応じてURLを変更する
3. URLを検索窓と同期させる
4. 検索クエリに応じてテーブルを変更する

#### 1. ユーザーの入力を取得する
`/app/ui/search.tsx`をみると，`<Search>`コンポーネントについて次のことが分かります．
- `"use client"`でクライアントコンポーネントに指定されているため，event listenersとhooksを使えます．
- `<input>`で検索窓を作っています．

新たに`handleSearch`関数を追加し，`<input>`要素に`onChange`リスナーを追加します．`onChange`に`handleSearch`を指定して，値が変更されたら`handleSearch`が呼び出されるようにします．

```diff tsx
    'use client';
    
    import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
    
    export default function Search({ placeholder }: { placeholder: string }) {
+   function handleSearch(term: string) {
+       console.log(term);
+   }
    
    return (
        <div className="relative flex flex-1 flex-shrink-0">
        <label htmlFor="search" className="sr-only">
            Search
        </label>
        <input
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            placeholder={placeholder}
+           onChange={(e) => {
+           handleSearch(e.target.value);
+           }}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
    );
    }
```
ブラウザの開発者ツールからコンソールを開くと，フィールドの値の変更が取得できていることがわかります．

#### 2. 検索パラメータに応じてURLを変更する
検索窓の内容は取得できたので，これをURLに埋め込みます．
`nest/navigation`から`useSearchParams`hookをインポートし，変数に割り当てます．

@`/app/ui/search.tsx`
```diff tsx
    'use client';
    
    import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
+   import { useSearchParams } from 'next/navigation';
    
    export default function Search() {
+   const searchParams = useSearchParams();
    
    function handleSearch(term: string) {
        console.log(term);
    }
    // ...
    }
```

`handleSearch()`の中で，[URLSearchParams][link:URLSearchParams]を，`searchParams`を使ってインスタンス化します．
```diff tsx
'use client';
 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
 
export default function Search() {
  const searchParams = useSearchParams();
 
  function handleSearch(term: string) {
+    const params = new URLSearchParams(searchParams);
  }
  // ...
}
```
`URLSearchParams`はURLクエリパラメータを操作するためのWebAPIです．複雑な文字列リテラルではなく，`?page=1&query=a`といったパラメータ文字列を取得できます．

ユーザの入力に基づいたパラメータ文字列を`URLSearchParams`インスタンスに`set`します．空欄であれば`delete`してパラメータを空にします．
```diff tsx
'use client';
 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
 
export default function Search() {
  const searchParams = useSearchParams();
 
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
+    if (term) {
+      params.set('query', term);
+    } else {
+      params.delete('query');
+    }
  }
  // ...
}
```
クエリ文字列が取得できました．

つぎはNext.jsの`useRouter`と`usePathname`hooksを使って，URLを更新します．
`next/navigation`から`useRouter`と`usePathname`をインポートし，`useRouter`のreplaceメソッドを使用します．
```diff tsx
'use client';
 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
+import { useSearchParams, usePathname, useRouter } from 'next/navigation';
 
export default function Search() {
  const searchParams = useSearchParams();
+  const pathname = usePathname();
+  const { replace } = useRouter();
 
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
+    replace(`${pathname}?${params.toString()}`);
  }
}
```

何が起きているかというと，
- `${pathname}`は現在のパスを意味します，ここでは`"/dashboard/invoices"`．
- ユーザーが検索窓に文字を打つと，`params.tpString()`が入力をURL向けのフォーマットに変換します．
- `replace(${pathname}?${params.toString()})`でURLをアップデートします．クエリ窓に`Lee`と打ち込んだら，URLは`/dashboard/invoices?query=lee`になります．
- Next.jsのクライアントサイドナビゲーションのおかげで，URLはページをリロードしなくても変更されます．

#### 3. URLを検索窓と同期させる
URLをブックマークして後からアプリケーションに訪れたり，リンクを共有したりした際，URLにはクエリパラメータが含まれているが，`<input>`の枠は空白になってしまう．そのため`searchParams`でURLクエリパラメータを取得し，`defaultValue`に指定しておく．

@`/app/ui/search.tsx`
```diff tsx
<input
  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
  placeholder={placeholder}
  onChange={(e) => {
    handleSearch(e.target.value);
  }}
+ defaultValue={searchParams.get('query')?.toString()}
/>
```
#### 4. テーブルの更新
検索結果を表に反映させます．

ページコンポーネントは[`searchParams`propを受け入れる][link:acceptParams]ため，現在のURLパラメータを`<Table>`コンポーネントに渡すことができます．ついでに，検索結果が得られるまでの間はスケルトンが表示されるように，Suspenseを設定しておきます．
```diff tsx
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
 
+export default async function Page({
+  searchParams,
+}: {
+  searchParams?: {
+    query?: string;
+    page?: string;
+  };
+}) {
+  const query = searchParams?.query || '';
+  const currentPage = Number(searchParams?.page) || 1;
 
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
+      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
+        <Table query={query} currentPage={currentPage} />
+      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
```
`/app/ui/invoices/table.tsx`で`<Table>`コンポーネントの実装を見ると，`query`と`currentPage`の2つのpropをとることがわかります．また，これらは`fetchFilteredInvoices()`に渡され，クエリに一致する請求書を取得しています．
```tsx
// ...
export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);
  // ...
}
```
> `useSearchParams()` hook と`searchParams` propの使い分けはどうすればいい？
>
> invoicesページのページコンポーネントは`searchParamas` propを使っていて，その中で呼び出されている(子要素)コンポーネントである`<Search>`はわざわざ`useSearchParams()`を用いてsearchParamsを取得している．親子関係であれば親コンポーネントのpropは子供でも参照できるはずだが…
>
> どちらを使うべきかは，クライアントコンポーネントなのか，サーバーコンポーネントなのかに依る．
> - `<Search>`はクライアントコンポーネントなので，パラメータにアクセスするには`useSearchParams()`を用いる必要がある．
> - `<Table>`はサーバーコンポーネントで，自身のデータを取得することができるので，`searchParams`プロパティを渡すことができます．
>
> 一般的には，クライアントからパラメータを読み取りたい場合は`useSearchParams()`フックを使用すればよいです．

#### ついでに: デバウンス
ちょっと最適化を行います．
現状では検索窓が一文字でも変わったらその都度検索が実行されていて，もったいないです．このアプリケーションの規模であれば問題ないですが，大きなデータベースにとなるとそうはいきません．

デバウンスとは，関数が実行できる頻度を制限することができる機能です．ここでは，ユーザのタイピングがストップしたら検索を開始すればいいです．

デバウンスの実装方法はいくつかあり，自分で作るのもアリです．今回は[`use-debouce`][link:useDebounce]というライブラリをインストールして使用します．
```shell
npm i use-debounce
```
でインストールし，`<Search>`コンポーネントで`useDebouncedCallback`関数をインポートします．

@`/app/ui/search.tsx`
```diff tsx
// ...
+import { useDebouncedCallback } from 'use-debounce';
 
// Inside the Search Component...
+const handleSearch = useDebouncedCallback((term) => {
  console.log(`Searching... ${term}`);
 
  const params = new URLSearchParams(searchParams);
  if (term) {
    params.set('query', term);
  } else {
    params.delete('query');
  }
  replace(`${pathname}?${params.toString()}`);
+}, 300);
```
この関数は`handleSearch`の内容をラップし，入力が変化しなくなってから300ms後に検索を行います．

### ページネーションの追加
検索結果の複数ページ送りを実装します．

現状では`fetchFilteredInvoices()`は最大で6個の結果しか返しませんが，これをもっと複数表示させたいです．ただ．全ての結果を一列にまとめられては困るので，複数ページに区切って表示します．

`/app/ui/invoices/pagenation.tsx`をみると，`<Pagenation/>`コンポーネントがクライアントコンポーネントであることが分かります．当然ここ(`<Pagenation/>`コンポーネント内で)でデータ取得を行うとDBが晒されてしまうので，秘匿性を高めるため，サーバーコンポーネントでデータを取得して，結果をpropとしてコンポーネントに渡すことにします．

`/dashboard/invoices/page.tsx`で，`fetchInvoicesPages`をインポートし，`searchParams`の`query`をpropとして渡すようにします．
```diff tsx
// ...
+import { fetchInvoicesPages } from '@/app/lib/data';
 
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string,
    page?: string,
  },
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
 
+  const totalPages = await fetchInvoicesPages(query);
 
  return (
    // ...
  );
}
```
`fetchInvoicesPages`は検索結果のページング数を返します．

次に`totalPages`propを  `<Pagination/>`コンポーネントに渡します．
```diff tsx
// ...
 
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
 
  const totalPages = await fetchInvoicesPages(query);
 
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
+       <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
```

`<Pagination/>`コンポーネントでは，`usePathname`と`useSearchParams`hooksを使って，現在のページを取得します．また，`createPageURL`関数を作り，現在のページ数をURLに埋め込みます．
```diff tsx
'use client';
 
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
+import { usePathname, useSearchParams } from 'next/navigation';
 
export default function Pagination({ totalPages }: { totalPages: number }) {
+  const pathname = usePathname();
+  const searchParams = useSearchParams();
+  const currentPage = Number(searchParams.get('page')) || 1;
 
+  const createPageURL = (pageNumber: number | string) => {
+    const params = new URLSearchParams(searchParams);
+    params.set('page', pageNumber.toString());
+    return `${pathname}?${params.toString()}`;
+  };
  // ...
}
```
何をしているかというと，
- `createPageURL`で現在の検索パラメータのインスタンスを作成します
- "page"パラメータを受けとったページ数で更新します
- URL文字列が生成され，検索パラメータを更新するようになります

最後に，新しい検索クエリを打ち込んだ時に閲覧ページが1に戻ってほしいので，`<Search>`コンポーネント内の`handleSearch`関数を呼び出したら初めのページに戻るようにします．
```diff tsx
'use client';
 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
 
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
 
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
+   params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
```

### この章のまとめ
- 検索とページネーションを，client stateではなくURL検索パラメータで制御しました
- サーバーからデータを取得しました
- `useRouter`hookを使用して，クライアントサイドのページ遷移を行いました




[link:useRouterMethods]: https://nextjs.org/docs/app/api-reference/functions/use-router#userouter

[link:URLSearchParams]: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

[link:acceptParams]: https://nextjs.org/docs/app/api-reference/file-conventions/page

[link:useDebounce]: https://www.npmjs.com/package/use-debounce
