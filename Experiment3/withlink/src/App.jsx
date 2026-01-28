import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
      
      <nav style={{ marginTop: '20px' }}>
        <Link to="/Profile"><button>Go to Profile</button></Link>
        <Link to="/Dashboard"><button>Go to Dashboard</button></Link>
      </nav>
    </BrowserRouter>
  );
}

function Profile() {
  return (
    <div>
      <marquee loop="5">
        <h1>Welcome to my Profile</h1>
      </marquee>
      <h1>Shreyas Gautam</h1>
      <h2>Full Stack Developer</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the admin panel.</p>
    </div>
  );
}

export default App;