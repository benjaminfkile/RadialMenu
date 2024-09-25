import RadialMenu from "./RadialMenu/RadialMenu"
import I_MenuItem from "./RadialMenu/Interfaces/I_MenuItem"
import "./App.css"

const slices = [
  // { title: "Administration", icon: "admin_panel_settings", color: "#3F5B2A", callback: () => console.log("user admin") },
  { title: "Workers", icon: "personal_injury", color: "#8AC1D4", callback: () => console.log("work comp") },
  { title: "Reviews", icon: "grading", color: "#E47F9A", callback: () => console.log("reviews") },
  { title: "PTO", icon: "access_time", color: "#F0A830", callback: () => console.log("pto") },
  { title: "Tasks", icon: "task", color: "#5E35B1", callback: () => console.log("tasks") },
  { title: "Roles", icon: "key", color: "#26A69A", callback: () => console.log("roles") },
  { title: "Access", icon: "lock", color: "#D84315", callback: () => console.log("user access") },
  // { title: "Workers", icon: "personal_injury", color: "#7CB342", callback: () => console.log("work comp") },
  // { title: "Reviews", icon: "grading", color: "#FFB300", callback: () => console.log("reviews") },
  // { title: "PTO", icon: "access_time", color: "#039BE5", callback: () => console.log("pto") },
  // { title: "Tasks", icon: "task", color: "#8E24AA", callback: () => console.log("tasks") },
  // { title: "Roles", icon: "key", color: "green", callback: () => console.log("roles") },
] as I_MenuItem[]



function App() {
  return (
    <div className="App">
      <RadialMenu
        diameter={500}
        coreIcon={"account_circle"}
        slices={slices}
        hoverFill="gray"
        backgroundColor="#000000"
        coreBackgroundColor="green"
        iconType="sharp"
        fontWeight={800}
        coreIconColor="gray"
        strokeColor="green"
        textColor="green"
      />
    </div>
  )
}

export default App
