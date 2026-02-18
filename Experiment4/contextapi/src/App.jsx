import { useState } from 'react';
import ProgressHeader from './components/ProgressHeader';
import Step1 from './components/Step1';
import Step2 from './components/Step2';

function App() {
  const [step, setStep] = useState(1);

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <ProgressHeader />
      
      <div style={{ margin: '20px 0', minHeight: '100px' }}>
        {step === 1 ? <Step1 /> : <Step2 />}
      </div>

      <button onClick={() => setStep(1)} disabled={step === 1}>Back</button>
      <button onClick={() => setStep(2)} disabled={step === 2}>Next</button>
    </div>
  );
}

export default App;