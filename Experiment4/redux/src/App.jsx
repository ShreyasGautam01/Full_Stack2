import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, reset } from './features/counterSlice';
import './App.css';

function App() {
  const { value, lastAction } = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
    <div className="redux-dashboard">
      <header>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Redux Centralized State</h1>
        <p style={{ color: '#94a3b8' }}>This data persists even if components unmount.</p>
      </header>

      <div className="counter-display">{value}</div>
      
      <div className="badge">
        <strong>Last Action:</strong> {lastAction}
      </div>

      <div className="controls">
        <button onClick={() => dispatch(increment())}>Dispatch Increment</button>
        <button onClick={() => dispatch(decrement())}>Dispatch Decrement</button>
        <button onClick={() => dispatch(reset())}>Dispatch Reset</button>
      </div>

      <div className="redux-explanation">
        <h3>How it's working:</h3>
        <ul>
          <li><strong>Store:</strong> The counter is stored in a global object.</li>
          <li><strong>Dispatch:</strong> Clicking a button triggers <code>dispatch()</code>.</li>
          <li><strong>Reducer:</strong> The slice logic calculates the new <code>value</code>.</li>
        </ul>
      </div>
    </div>
  );
}

export default App;