import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

function App() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  let buttonClass = "btn mt-3 w-100 py-2 ";
  if (isClicked) {
    buttonClass += "btn-success";
  } else if (isHovered) {
    buttonClass += "btn-primary";
  } else {
    buttonClass += "btn-danger";
  }
  return (
    <div className="vh-100 vw-100 position-relative">
      <div className="position-absolute top-50 start-50 translate-middle" style={{ width: '400px' }}>
        <h2 className="text-success">Learning Bootstrap!</h2>

        <div className="card shadow-lg border border-success p-3 mt-3">
          <input className="form-control mb-2" placeholder="Enter your name:" />
          <input className="form-control mb-2" placeholder="Enter your e-mail:" />
          
          <button 
            className={buttonClass}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setIsClicked(false); }}
            onMouseDown={() => setIsClicked(true)}
            onMouseUp={() => setIsClicked(false)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
export default App;