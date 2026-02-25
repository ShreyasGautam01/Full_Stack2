import { useState } from 'react';
import "./App.css";

const calculateAge = (dob) => {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    skills: [],
    address: '',
    state: '',
    age: ''
  });

  const todayDate = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const updatedSkills = checked 
        ? [...formData.skills, value] 
        : formData.skills.filter(skill => skill !== value);
      setFormData({ ...formData, skills: updatedSkills });
    } else if (name === 'dob') {
      setFormData({ 
        ...formData, 
        dob: value, 
        age: calculateAge(value) 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(formData, null, 2));
  };

  const handleCancel = () => {
    setFormData({
      firstName: '', lastName: '', gender: '', dob: '',
      skills: [], address: '', state: '', age: ''
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h1>Experiment I: Controlled Components</h1>
      <form onSubmit={handleSubmit}>
        
        <div>
          <label>First Name: </label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} />
        </div>

        <div>
          <label>Last Name: </label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>

        <div>
          <label>Gender: </label>
          <input type="radio" name="gender" value="Male" onChange={handleChange} checked={formData.gender === 'Male'} /> Male
          <input type="radio" name="gender" value="Female" onChange={handleChange} checked={formData.gender === 'Female'} /> Female
        </div>

        <div>
          <label>DOB: </label>
          <input 
            type="date" 
            name="dob" 
            value={formData.dob} 
            onChange={handleChange} 
            max={todayDate}
          />
        </div>

        <div>
          <label>Skills: </label>
          <input type="checkbox" name="skills" value="React" onChange={handleChange} checked={formData.skills.includes("React")} /> React
          <input type="checkbox" name="skills" value="Node" onChange={handleChange} checked={formData.skills.includes("Node")} /> Node
          <input type="checkbox" name="skills" value="MongoDB" onChange={handleChange} checked={formData.skills.includes("MongoDB")} /> MongoDB
        </div>

        <div>
          <label>Address: </label>
          <textarea name="address" value={formData.address} onChange={handleChange} />
        </div>

        <div>
          <label>State: </label>
          <select name="state" value={formData.state} onChange={handleChange}>
            <option value="">Select State</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="Punjab">Punjab</option>
          </select>
        </div>

        <div>
          <label>Age: </label>
          <input type="number" name="age" value={formData.age} readOnly placeholder="Calculated from DOB" />
        </div>

        <div style={{ marginTop: '10px' }}>
          <button type="submit">Submit</button>
          <button type="button" onClick={handleCancel} style={{ marginLeft: '10px' }}>Cancel</button>
        </div>

      </form>
    </div>
  );
}

export default App;