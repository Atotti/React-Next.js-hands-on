# Chapter06

## Props

- Componentに渡す引数のこと
- 2通りの書き方がある

- 書き方1

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
            function Header({title}) {
                return <h1>{title} </h1>;
            }

            function HomePage() {
                return (
                    <div>
                        <Header title="React a"/>
                        <Header title="A new title"/>
                    </div>
                );
            }

            ReactDOM.render(<HomePage />, app);
        </script>
    </body>
</html>
```

- 書き方2

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
                return (
                    <div>
                        <Header title="Reafct a"/>
                        <Header title="A nefw title"/>
                    </div>
                );
            }

            ReactDOM.render(<HomePage />, app);
        </script>
    </body>
</html>
```