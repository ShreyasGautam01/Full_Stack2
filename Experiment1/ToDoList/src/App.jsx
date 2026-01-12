import { useState } from "react";
import './App.css';

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  return (
    <div className="container">
      <h1>To Do List</h1>
      <div className="input-group">
        <input 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          placeholder="Enter a task..."
        />
        <button onClick={addTask}>Add Item</button>
      </div>

      <ul>
        {tasks.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;