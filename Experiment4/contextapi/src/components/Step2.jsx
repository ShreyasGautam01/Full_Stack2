// Step 2: Role Selection
import { useContext } from 'react';
import { FormContext } from '../context/FormContext';

export default function Step2() {
  const { formData, updateField } = useContext(FormContext);
  return (
    <div>
      <h3>Step 2: Position</h3>
      <select value={formData.role} onChange={(e) => updateField('role', e.target.value)}>
        <option value="">Select Role</option>
        <option value="Developer">Developer</option>
        <option value="Designer">Designer</option>
      </select>
    </div>
  );
}