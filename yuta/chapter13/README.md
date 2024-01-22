# Chapter 13 font, image

## fontをグローバル変更
layout.tsxで以下のように指定
```ts
<html lang="en">
  <body className={`${inter.className}` antialiased}>{children}</body>
</html>
```

## fontを部分的に適応
特定のコンポーネントの中のdivのclassNameを指定
```ts
return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">Acme</p>
    </div>
  );
```

## 画像の追加
- Imageコンポーネントを使用

```ts
<div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
    {/* Add Hero Images Here */}
    <Image
    src="/hero-desktop.png"
    width={1000}
    height={760}
    className="hidden md:block"
    alt="Screenshots of the dashboard project showing desktop version"
    />
    <Image
    src="/hero-mobile.png"
    width={560}
    height={620}
    className="block md:hidden"
    alt="Screenshot of the dashboard project showing mobile version"
    />
</div>
```