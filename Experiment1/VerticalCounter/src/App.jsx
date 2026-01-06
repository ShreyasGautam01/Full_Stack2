import {useState} from "react";
import './App.css';
function App(){
  const[count, setCount]= useState(0);
  return(
    <div className="container">
      <h1>Counter</h1>
      <p>Count:{count}</p>
      <button onClick={()=>setCount(count+1)}>+</button>
      <button onClick={()=>setCount(count-1)}>-</button>
    </div>
  )
}
export default App;
CompositionEvent;