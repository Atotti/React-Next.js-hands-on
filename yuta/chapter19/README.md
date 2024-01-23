# Chapter 19 Streaming
- データを分けて配信することで部分部分ごとに順番に表示できる。

- 実装方法
  - ページレベル：loading.tsxファイルの利用
  - コンポーネントレベル：Suspenseの利用

## loading.tsxの利用

- 実装したいページのpage.tsxと同じ階層にloading.tsxを配置、中の内容がダイナミックコンテンツの表示中に表示される

- customersページにも適用されてしまうのを防ぐために、ルートグループというのを使う。
  - page.tsxと同じ階層に()で囲むフォルダを作成し、そこに反映させたくないloading.tsxとpages.tsxを配置


## Suspenseの利用
- 以下のように記述
```tsx
<Suspense fallback={<CardsSkeleton />}>
    <CardWrapper />
</Suspense>
```


