import {useState} from "react";
import './App.css';
function App(){
  const[isDark,setIsDark]=useState(false);
  const toggleTheme=()=>{
    setIsDark(!isDark);
  };
  const themeClass=isDark?"app dark":"app light";
  return(
    <div className={themeClass}>
      <h1>{isDark?"Dark Mode":"Light Mode"}</h1>
      <p>"This is an SPA Theme Toggler.</p>
      <button onClick={toggleTheme}>
        Switch to {isDark?"Dark":"Light"} Mode
      </button>
    </div>
  );
}
export default App;