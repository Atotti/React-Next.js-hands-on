### リンク
- `Link`コンポーネントを使うことでクライアント側でのページ遷移ができる．

### コードの自動分割とプリフェッチ
- Nextjsではコードはルートセグメントごとに自動で分割される．
- 特定のページでエラーが発生してもその他のページは開ける．
- 本番環境では`Link`コンポーネントの遷移先ページがプリフェッチされる（バックグラウンドで先読みされる）

### パスを取得する
- `usePathname`フックでパスを取得できる．