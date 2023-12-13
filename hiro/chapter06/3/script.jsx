
const app = document.getElementById("app")

function Header(props) {
  console.log(props); // { title: "React 💙" }
  return <h1>{props.title}</h1>;
}

function Header1({ title }) { // オブジェクトの分割代入
  console.log(title); // "React 💙"
  return <h1>{title ? title : 'Default Title'}</h1>;
}

function HomePage() {
  return (
    <div>
      <Header title="React 💙" />
      <Header1 title="React 💙" />
    </div>
  );
}

ReactDOM.render(<HomePage />, app);