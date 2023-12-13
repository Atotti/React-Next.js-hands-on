
const app = document.getElementById("app")

function Header({ title }) {
  return <h1>{title ? title : 'Default Title'}</h1>;
}

function HomePage() {
    const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

  return (
    <div>
      <Header title="Develop. Preview. Ship. 🚀" />
      <ul>
        {names.map((name) => (
          <li>{name}</li>
        ))}
      </ul>

      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li> // keyを設定できる
        ))}
      </ul>
    </div>
  );
}

ReactDOM.render(<HomePage />, app);