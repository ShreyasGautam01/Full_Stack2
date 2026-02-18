// Step 1: Personal Info
import { useContext } from 'react';
import { FormContext } from '../context/FormContext';

export default function Step1() {
  const { formData, updateField } = useContext(FormContext);
  return (
    <div>
      <h3>Step 1: Identity</h3>
      <input 
        placeholder="Enter Name" 
        value={formData.name} 
        onChange={(e) => updateField('name', e.target.value)} 
      />
    </div>
  );
}
