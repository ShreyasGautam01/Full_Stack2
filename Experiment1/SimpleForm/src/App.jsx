import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="app">
      <h1>Simple Form</h1>

      {!isSubmitted ? (
        //True
        <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }}>
          <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
      ) : (
        //False
        <div className="result">
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <button onClick={() => setIsSubmitted(false)}>Reset</button>
        </div>
      )}
    </div>
  );
}
export default App;