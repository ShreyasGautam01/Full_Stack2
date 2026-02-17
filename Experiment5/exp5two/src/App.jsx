import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
const Dash = lazy(() => import('./Components/Dashboard'));
const Prof = lazy(() => import('./Components/Profile'));
function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Dashboard</Link>
        <br />
        <Link to="/profile">Profile</Link>
      </nav>
      <Suspense fallback={<div><h1>Loading Component...</h1></div>}>
        <Routes>
          <Route path="/" element={<Dash />} />
          <Route path="/profile" element={<Prof />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
export default App;