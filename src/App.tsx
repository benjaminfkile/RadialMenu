import RadialMenu from './RadialMenu/RadialMenu';
import './App.css';

const slices = [
  { title: "bar", icon: "settings", callback: () => console.log("settings") },
  { title: "baz", icon: "face", callback: () => console.log("face") },
  { title: "foo2", icon: "lightbulb", callback: () => console.log("lightbulb") },
  { title: "bar2", icon: "star", callback: () => console.log("star") },
  { title: "baz2", icon: "visibility", callback: () => console.log("visibility") },
  { title: "moo2", icon: "shopping_cart", callback: () => console.log("shopping_cart") },
  { title: "bar", icon: "settings", callback: () => console.log("settings") },
  { title: "baz", icon: "face", callback: () => console.log("face") },
  { title: "moo", icon: "pets", callback: () => foo() },
];

const foo = () => {
  console.log("foo")
}

function App() {
  return (
    <div className="App">
      <RadialMenu
        diameter={400}
        coreIcon={"account_circle"}
        slices={slices}
      />
    </div>
  );
}

export default App;
