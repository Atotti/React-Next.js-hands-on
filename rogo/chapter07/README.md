# Stateとの対話性の追加
- onClickイベント：ボタンがクリックされたときに何か実行する


```Javascript
function Header({title}) {
    //汎用的なタイトルのコンポーネントができた
    return <h1>{title ? title : 'Default Title'}</h1>;
}
function HomePage() {
    const names = ['Takahashi', 'Aoki', 'Bob'];
    //フックを使う
    const [likes, setLikes] = React.useState(0);
    function handleClick() {
        console.log('increment like count');
        setLikes(likes+1);
    }
    return (
        <div>
            <Header title = "AtCoder Member" />
            <ul>
                {names.map((name) => (
                <li key={name}> {name} </li>
                ))}
            </ul>
            <p>onClickイベント：ボタンがクリックされたときに何かを実行する</p>
            <button onClick={handleClick}>Likes ({likes})</button>
        </div>
    );
}
ReactDOM.render(<HomePage />, app);
```

