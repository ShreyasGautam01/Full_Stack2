import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './Components/Navbar';
import './App.css';

const Home = lazy(() => import('./Components/Home'));
const Dash = lazy(() => import('./Components/Dashboard'));
const Contact = lazy(() => import('./Components/Contact'));
const Prof = lazy(() => import('./Components/Profile'));

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="page-content">
        <Routes>
          {/* Each route now has its own specific fallback UI */}
          <Route path="/" element={
            <Suspense fallback={<div className="home-load">Entering Home...</div>}>
              <Home />
            </Suspense>
          } />
          
          <Route path="/dashboard" element={
            <Suspense fallback={<div className="dash-load">Fetching Dashboard...</div>}>
              <Dash />
            </Suspense>
          } />

          <Route path="/contact" element={
            <Suspense fallback={<div className="contact-load">Collecting Contact Information...</div>}>
              <Contact />
            </Suspense>
          } />

          <Route path="/profile" element={
            <Suspense fallback={<div className="prof-load">Loading User Profile...</div>}>
              <Prof />
            </Suspense>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;