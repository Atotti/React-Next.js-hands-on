# EventHandler
onClick とかそういうやつ
```jsx
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
# StateHandler
useStateでやるやつ。状態を持ってるっていう理解。
```jsx
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



デザインは[ここ](https://lightgauge.net/language/javascript/cdn-react-mui)を参考にした。

