# Chapter 15 ページ遷移

- ロードの効率をあげるためにnextjsではaタグでなくLinkコンポーネントを使用する

## 「Showing active links」の実装
- 自分の今いるページが見れるように

usePathname()フックを使用。
```ts
const pathname = usePathname()
...

className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
)}
```
