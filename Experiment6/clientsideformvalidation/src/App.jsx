import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);

  // 1. Logic: Derived Validation States (Calculated every render)
  const emailValid = /^[^\s@]+@[^\s@]+\.(com|in|[a-zA-Z]{2,})$/.test(formData.email);

  const passwordCriteria = {
    startsWithCap: /^[A-Z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    isMinLength: formData.password.length >= 5,
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const canSubmit = emailValid && isPasswordValid;

  // 2. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSubmitted(false); // Reset success message on new input
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) {
      setSubmitted(true);
      console.log("Form Data Submitted:", formData);
    }
  };

  // 3. UI Helper Components
  const Requirement = ({ met, text }) => (
    <li style={{ 
      color: met ? '#4caf50' : '#f44336', 
      listStyleType: met ? 'check' : 'circle',
      transition: 'all 0.3s ease'
    }}>
      {text}
    </li>
  );

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>Experiment 2</h2>
        <p>Client-Side Form Validation</p>
      </header>
      
      {submitted && (
        <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          ✓ Form submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>Email ID</label>
          <input
            type="text"
            name="email"
            placeholder="example@domain.com"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginTop: '5px', border: `1px solid ${emailValid ? '#4caf50' : '#ccc'}` }}
          />
          {!emailValid && formData.email.length > 0 && (
            <span style={{ color: '#f44336', fontSize: '12px' }}>Requires @ and valid domain (.com, .in, etc)</span>
          )}
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
          
          <ul style={{ fontSize: '13px', marginTop: '10px', paddingLeft: '20px' }}>
            <Requirement met={passwordCriteria.startsWithCap} text="Starts with a Capital Letter" />
            <Requirement met={passwordCriteria.hasNumber} text="At least one number" />
            <Requirement met={passwordCriteria.hasSpecial} text="At least one special character" />
            <Requirement met={passwordCriteria.isMinLength} text="Minimum 5 characters" />
          </ul>
        </div>

        <button 
          type="submit" 
          disabled={!canSubmit}
          style={{ 
            padding: '12px', 
            backgroundColor: canSubmit ? '#2196f3' : '#e0e0e0', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: canSubmit ? 'pointer' : 'not-allowed'
          }}
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default App;