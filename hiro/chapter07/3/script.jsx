
const app = document.getElementById("app")
const app2 = document.getElementById("app2")

function Header({ title }) {
  return <h1>{title ? title : 'Default Title'}</h1>;
}

function HomePage() {
    const [likes, setLikes] = React.useState(0);

    const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

    function handleClick() {
      setLikes(likes + 1);
    }

  return (
    <div>
      <Header title="Develop. Preview. Ship. 🚀" />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <button onClick={handleClick}>Like({likes})</button>
    </div>
  );
}

function HomePage2() {
  // const [likes, setLikes] = React.useState(0);
  let likes = 0;

  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

  function handleClick() {
    // setLikes(likes + 1);
    likes++;
    console.log(likes);
  }

return (
  <div>
    <Header title="Develop. Preview. Ship. 🚀" />
    <ul>
      {names.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
    <button onClick={handleClick}>Like({likes})</button>
  </div>
);
}
ReactDOM.render(<HomePage />, app);
ReactDOM.render(<HomePage2 />, app2);