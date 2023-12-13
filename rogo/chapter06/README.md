# Propsを使用したデータの表示
- コンポーネント（関数みたいなやつ）は使いまわせる
- Props : コンポーネントの引数みたいなやつ
- 


```Javascript
function Header({title}) {
    //{title}で明示的に命名
    console.log(title);
    return <h1>{title}</h1>;
}
function Header2(props) {
    return <h1>{props.title}</h1>;
}
function Header3(props) {
    return <h1>{`Cool ${props.title}`}</h1>;
    //バッククォートに注意
}
function Header4({title}) {
    //汎用的なタイトルのコンポーネントができた
    return <h1>{title ? title : 'Default Title'}</h1>;
}

function HomePage() {
    const names = ['Takahashi', 'Aoki', 'Bob'];
    return (
        <div>
            <Header title = "React" />
            <Header2 title = "React" />
            <Header3 title = "React" />
            <Header4 title = "React" />
            <Header4 />
            <ul>
                {names.map((name) => (
                <li key={name}> {name} </li>
                ))}
            </ul>
        </div>
    );
}
ReactDOM.render(<HomePage />, app);
```

