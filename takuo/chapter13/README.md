# chapter 13
## フォントと画像の最適化

ここで学ぶこと
- `next/font`でカスタムフォントを適用する
- `next/image`で画像を追加する
- どのようにフォントと画像が最適化されるか
### フォント

#### なぜフォントを最適化するのか
カスタムフォントを使用した場合，そのフォントファイルをフェッチ・ロードする過程でパフォーマンスに影響を与える場合があります．

ブラウザがWebページを表示する手順は次の通り．
1. はじめにブラウザ規定のフォントでテキストをレンダリング
2. 読み込まれた後にカスタムフォントをロードし，置き換える


手順1から2にかけて，テキストのサイズや間隔，レイアウトが移動し，周囲の要素が移動([Cumulative Layout Shift][link:Cumulative_Layout_Shift])する可能性があります．
Next.jsでは，`next/font`モジュールを使用するとビルド時にフォントファイルをダウンロードし，他の静的アセットと共にホストします．これにより，ユーザは追加でフォントに関する通信(ダウンロード等)をする必要がなく，レイアウトのシフトもなくなります．

#### プライマリフォントの追加
`/app/ui/font.ts`にアプリケーション内で使用するフォントを定義します．
`Inter`モジュールから`next/font/google`フォントをインポートし`latin`サブセットを指定します．
[サブセット][link:subsets]を指定することで，目的の言語セットのみに限定してインポートできます(容量が削減できる)．
```tsx
import { Inter } from 'next/font/google';
 
export const inter = Inter({ subsets: ['latin'] });
```
`/app/layout.tsx`の<body>要素にフォントを追加します．
```diff tsx
import '@/app/ui/global.css';
+import { inter } from '@/app/ui/fonts';
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
+      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```
これによりアプリケーション全体にフォントが適用されます．
ここで[`antialiased`][link:antialiased]はTailwindクラスで，フォントをスムージングするもの．必須ではないけど，あるとGood．
---
### 画像
#### なぜ画像を最適化するのか
Next.jsは，画像等の静的アセットを最上位フォルダの`/public`内に配置します．`/public`内のファイルはアプリケーションで参照できます．

通常のHTMLでは，次のように画像を追加します．
```html
<img
  src="/hero.png"
  alt="Screenshots of the dashboard project showing desktop version"
/>
```
これでは，
- 様々な画面サイズへの対応
- デバイスごとのサイズ指定
- イメージを読み込んだことによるレイアウトのシフト
- ユーザのビュー外にある画像の読み込み遅延

等に対応する必要があります．

が，`next/image`コンポーネントを使うことで，画像を自動的に最適化できます．

#### <Image>コンポーネント
<Image>コンポーネントはHTMLの<img>タグの拡張で，次のような画像の自動最適化機能を提供します．
- 画像が読み込まれた時のレイアウトシフトを防ぐ
- ビューポイントの大きさに合わせて画像のサイズを変更する(小さいデバイスには小さい画像を送信する)
- デフォルトで画像を遅延読み込みする(画像はビューポイントに入るときに読み込まれる)
- ブラウザがサポートしている場合，[WebP][link:webp]や[AVIF][link:avif]等のモダンな形式で画像を提供する．

#### デスクトップヒーロー画像の追加
`/public`内の`hero-desktpo.png`と`hero-mobile.png`を`<Image>`コンポーネントを使って表示します．これらは違う画像ですが，デバイスに応じてどれを表示させるか変化させたいです．

`/app/page.tsx`に`next/image`コンポーネントをインポートし，<Image>コンポーネントを追加します．
```diff tsx
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
+import Image from 'next/image';
 
export default function Page() {
  return (
    // ...
    <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
      {/* Add Hero Images Here */}
+      <Image
+        src="/hero-desktop.png"
+        width={1000}
+        height={760}
+        className="hidden md:block"
+        alt="Screenshots of the dashboard project showing desktop version"
+      />
    </div>
    //...
  );
}
```
ここでwidthとheightを指定しましたが，これを指定するとレイアウトのずれを避けることができます．指定する縦横比はソースの画像と同じものにする必要があります．

また，画像のclassに`hidden`が追加されています(classNameで定義していますね)．これは，モバイル端末では画像をDOMから削除するためのものです．また，`md:block`はデスクトップでは画像を表示させることを示します．
![img:added_class]

この場合，デフォルトでは`hidden`が適用され，`md`ブレークポイント以上の画面幅のとき，`block`が適用されます．
`md`プレフィックスはviewPointの幅が768px以上の場合に適用することを示します．

デフォルトのブレークポイントは，これ以外にも`sm(640px~)`, `lg(1024px~)`, `xl(1280px~)`等いろいろあります．




[link:Cumulative_Layout_Shift]: https://web.dev/articles/cls?hl=ja
[link:subsets]: https://fonts.google.com/knowledge/glossary/subsetting
[link:antialiased]: https://tailwindcss.com/docs/font-smoothing
[link:webp]: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#webp
[link:avif]: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#avif_image
[img:added_class]: ./added_class.png