# Chapter 7

インタラクション(event・state)

## Listening to events

```html
function handleClick() {
    console.log('increment like count');
}
---
<button onClick={handleClick}>Like</button>
```
みたいに書くことでボタンがクリックされたときに処理を実行できる。

## Stateとhooks

### hooks
- Stateのようなコンポーネントに追加ロジックを与える関数のあつまり

### State
- これを使えばコンポーネント内部に状態を持たせることができる

### StateとPropsの使い分け
- コンポーネント間 → Props
- コンポーネント内 → State

```html
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div id="app"></div>
        <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script type="text/jsx">
            function Header(props) {
                return <h1>{props.title} </h1>;
            }

            function HomePage() {
                const names = ["Ada", "Margaret", "Grace"]
                const [likes, setLikes] = React.useState(0);

                function handleClick() {
                    setLikes(likes + 1);
                }

                return (
                    <div>
                        <Header title="Develop. Preview. SHip." />
                        <ul>
                            {names.map((name) => (
                                <li key={name}>{name}</li>
                            ))}
                        </ul>
                        <button onClick={handleClick}>Likes ({likes})</button>
                    </div>
                );
            }

            ReactDOM.render(<HomePage />, app);
        </script>
    </body>
</html>
```