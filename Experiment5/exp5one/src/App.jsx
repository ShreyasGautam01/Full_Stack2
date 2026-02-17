import './App.css';
import {lazy, Suspense} from 'react';
const Dash=lazy(()=>import('./Components/Dashboard'));
function App() {
  return (
    <div className="container">
      <Suspense fallback={<div><h1>Loading...</h1></div>}> <Dash/> </Suspense>
    </div>
  );
}
export default App; 