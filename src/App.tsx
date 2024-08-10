import RadialMenu from './RadialMenu/RadialMenu';
import './App.css';

const slices = [
  { title: "User Administration", icon: "admin_panel_settings", callback: () => console.log("user admin") },
  { title: "Workers Comp", icon: "personal_injury", callback: () => console.log("work comp") },
  { title: "Reviews", icon: "grading", callback: () => console.log("reviews") },
  { title: "PTO", icon: "access_time", callback: () => console.log("pto") },
  { title: "Tasks", icon: "task", callback: () => console.log("tasks") },
  { title: "Roles", icon: "key", callback: () => console.log("roles") },
  { title: "User Access", icon: "lock", callback: () => console.log("user access") },
];

const foo = () => {
  console.log("foo")
}

function App() {
  return (
    <div className="App">
      <RadialMenu
        diameter={430}
        coreIcon={"account_circle"}
        slices={slices}
      />
    </div>
  );
}

export default App;
