import { useContext } from 'react';
import { FormContext } from '../context/FormContext';

export default function ProgressHeader() {
  const { formData, isComplete } = useContext(FormContext);

  return (
    <header style={{ padding: '20px', background: isComplete ? '#d4edda' : '#fff3cd', border: '1px solid' }}>
      <h2>Application for: {formData.role || '...'}</h2>
      <p>Status: <strong>{isComplete ? '✅ Ready to Submit' : '❌ Please fill all fields'}</strong></p>
    </header>
  );
}