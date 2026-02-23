import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './Components/Navbar';
import './App.css';

// Lazy loading the components
const Home = lazy(() => import('./Components/Home'));
const Contact = lazy(() => import('./Components/Contact'));
const About = lazy(() => import('./Components/About'));

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={
            <Suspense fallback={<div className="home-load">Entering Home...</div>}>
              <Home />
            </Suspense>
          } />
          <Route path="/contact" element={
            <Suspense fallback={<div className="contact-load">Collecting Contact Information...</div>}>
              <Contact />
            </Suspense>
          } />
          <Route path="/about" element={
            <Suspense fallback={<div className="about-load">About Under Loading...</div>}>
              <About />
            </Suspense>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;