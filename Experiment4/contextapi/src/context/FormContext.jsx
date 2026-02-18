import { createContext, useState } from 'react';
export const FormContext = createContext();
export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
  });

  const isComplete = formData.name.length > 2 && formData.role.length > 2;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormContext.Provider value={{ formData, updateField, isComplete }}>
      {children}
    </FormContext.Provider>
  );
};