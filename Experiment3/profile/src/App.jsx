import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
function Profile(){
    return <>
      <h1>Shreyas Gautam</h1>
      <h2>Full Stack Developer</h2>
    </>
}
function Dashboard(){
  return <>
    <h1>Skills</h1>
    <h2>HTML</h2>
    <h2>CSS</h2>
  </>
}
function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/Profile" element={<Profile/>}/>
      <Route path="/Dashboard" element={<Dashboard/>}/>
    </Routes>
    </BrowserRouter>
  );
}
export default App;