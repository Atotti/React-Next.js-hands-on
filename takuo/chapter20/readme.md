# chapter20 (Next/10th)
## Partial Prerendering
部分事前レンダリング．
> Partial Prerenderingは，Next.js 14の実験的な機能です．今後この内容は更新される可能性があります．

- 部分事前レンダリングとは何か
- 部分事前レンダリングの仕組み

### 静的コンテンツと動的コンテンツの組み合わせ
現時点では，routeの中で`noStore()`等の[動的な関数][link:dynamicFunc]を呼ぶと，ルート全体が動的になります．多くのウェブアプリがこのような方式を採っていて，動的・静的を切り替える単位は**アプリケーション全体**か，**特定のroute**かのだいたい2択です．

route内に動的なコンテンツがあった場合はroute全体が動的になりますが，route全体がすべて動的とは限りません．

dashboardページを見てみると，`SideNav`は静的で，他(`Page`コンポーネント内の要素)は動的な要素です．
![img:Dashboard_SD]

### 部分プリレンダリングとは
Next.js 14のプレビューに含まれる部分事前レンダリングは，一部の部分を動的に保ちながら，性的な読み込みシェルでルートをレンダリングできる実験的な機能です．つまり，ルートの動的部分を分離できます．
![img:partialPreRendering]
たとえば，ユーザーがrouteを訪れると，
- 静的なルートとして読み込まれ，初期ロードが高速になります．
- 読み込まれた静的ルートには，非同期で読み込まれる内容の穴が残ります．
- 非同期の内容は並行してストリーミングされるため，総ロード時間が短縮できます．

事前部分レンダリングはReactの[`Concurrent APIs`][link:ConcurrentAPI]を活用し，[`Suspense`][link:Suspense]によってデータ取得が完了するまでレンダリングを延期します．ここで`Suspense`に指定するフォールバックが，はじめにロードされる静的ルートに組み込まれます．動的コンテンツのフォールバックと他の静的コンテンツはビルド時や再検証を行ったときに事前にレンダリングされ，残りの動的なデータ取得を含む部分はユーザーがrouteを訪れるまで実行されません．

## これまでのまとめ
1. サーバーとデータベースとの通信時間をできるだけ減らすために，サーバーと同じ地域にデータベースを作成しました．
2. React Server Componentsを利用してデータの取得を行いました．これによって，データベース内のデータやロジックをクライアントから秘匿し，クライアントに送るJavaScriptバンドルを削減できます．
3. SQLを用いることで必要なデータのみを取得し，リクエストごとに転送されるデータ量やJavaScriptの記述量を減らしました．
4. 合理的な判断から，JavaScriptでデータ取得の並列化を行いました．
5. Streamingを実装し，あるデータ取得の遅延がページ全体の更新に影響しないようにしまし，ロードが終了した部分については順次ユーザーが操作できるようにしました．
6. データ取得をコンポーネント内の実行に落とし込み，部分事前レンダリングに対応出来るように変更しました．

今後は，検索とページネーションという，データの取得の際に実装する必要がある2つの一般的なパターンについて学びます．


[link:dynamicFunc]: https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-functions

[img:Dashboard_SD]: https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fdashboard-static-dynamic-components.png&w=1920&q=75&dpl=dpl_4qZVDKsgmB6BVspNs9MFHLpgHfaP

[img:partialPreRendering]: https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fthinking-in-ppr.png&w=1920&q=75&dpl=dpl_4qZVDKsgmB6BVspNs9MFHLpgHfaP

[link:ConcurrentAPI]: https://react.dev/blog/2021/12/17/react-conf-2021-recap#react-18-and-concurrent-features

[link:Suspense]: https://react.dev/reference/react/Suspense