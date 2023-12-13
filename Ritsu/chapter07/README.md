# Reactによる状態変化

## ボタンの作成（いいね）
```
function HomePage() {
  // 	...
  function handleClick() {
    console.log('increment like count');
  }
 
  return (
    <div>
      {/* ... */}
      <button onClick={handleClick}>Like</button>
    </div>
  );
}
```

- `onClick`　ユーザーによるクリックを検知
- `onChange` 入力フィールド
- `onSubmit` フォーム

## クリック数の保存
```
function HomePage() {
  // ...
  const [likes, setLikes] = React.useState(0);
 
  function handleClick() {
    setLikes(likes + 1);
  }
 
  return (
    <div>
      {/* ... */}
      <button onClick={handleClick}>Likes ({likes})</button>
    </div>
  );
}
```

`userState()`は配列を返すものであり、これを用いることでボタンを押した数を管理することが可能。
配列の一つ目では値が入る任意の変数名をつけることができる。
二つ目では、値を更新するための関数に任意の名前をつけることができる。一般的には先頭に`set`をつけ、その後に更新する状態変数の名前を付ける。
また、カッコ内に`0`を追加することで、初期値の設定が可能。