## ストリーミング
一部の遅いデータ要求によってページ全体の読み込みが遅くなるのを防ぐ。

`<SideNav>`は静的なので、とりあえずこれを先に表示させる。

## コンポーネントのストリーミング
ページ中でfetchされていたものを、コンポーネント中でfetchするようにする。ことで、コンポーネントごとに先に読み込めるようにする。

## コンポーネントのグループ化
`<Card>`も同様にコンポーネント中でfetchするようにした。

これらの処理で、サイトのパフォーマンスが向上する。これはNext.jsの特徴とも言えるだろう。現段階では分からなくても、将来他のWebフレームワークを触った時に真に理解できるはずである。