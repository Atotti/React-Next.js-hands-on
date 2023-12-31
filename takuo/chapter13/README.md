# chapter 13
## フォントと画像の最適化

ここで学ぶこと
- `next/font`でカスタムフォントを適用する
- `next/image`で画像を追加する
- どのようにフォントと画像が最適化されるか

### なぜフォントを最適化するのか
カスタムフォントを使用した場合，そのフォントファイルをフェッチ・ロードする過程でパフォーマンスに影響を与える場合があります．

ブラウザがWebページを表示する場合，ブラウザは
[Cumulative Layout Shift][link:Cumulative_Layout_Shift]




[link:Cumulative_Layout_Shift]: https://web.dev/articles/cls?hl=ja