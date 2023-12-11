
const app = document.getElementById("app")

function Header({ title }) {
  return <h1>{title ? title : 'Default Title'}</h1>;
}

function HomePage() {
  return (
    <div>
      <Header title="Develop. Preview. Ship. 🚀" />
    </div>
  );
}

ReactDOM.render(<HomePage />, app);