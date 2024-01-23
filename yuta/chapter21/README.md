# Chapter 21 Searchとページネーション

- 検索ボックスのワードをurl-friendlyな文字列に変換。その後、URLをそれに更新
```ts
'use client';
 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
 
export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
 
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }
}
```

## Debouncing
- すべてのキーストロークでなく、ユーザが入力を止めた時点でのキーストロークのみを取得

## ページネーション: 取得データの数に合わせてページを作成