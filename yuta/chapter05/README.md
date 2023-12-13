# Chapter05

Reactには

- Components
- Props
- State

という3つの概念がある。

## Components
- Reactでは関数で部品(コンポーネント)を作成する。
- 先頭は大文字



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
            function Header() {
                return <h1>Develop. Preview. Ship. </h1>;
            }

            function HomePage() {
                return (
                    <div>
                        <Header />
                        <Header />
                    </div>
                );
            }

            ReactDOM.render(<HomePage />, app);
        </script>
    </body>
</html>
```