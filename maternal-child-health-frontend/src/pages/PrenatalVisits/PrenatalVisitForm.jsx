import React, { useState } from 'react';

const PreNatalVisitForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    visitDate: initialData.visitDate || '',
    bloodPressure: initialData.bloodPressure || '',
    weight: initialData.weight || '',
    fetalHeartRate: initialData.fetalHeartRate || '',
    symptoms: initialData.symptoms || '',
    labTests: initialData.labTests || '',
    recommendations: initialData.recommendations || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formStyle = {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '1rem',
    fontWeight: 'bold'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Prenatal Visit Form</h2>

      <label style={labelStyle}>
        Visit Date:
        <input type="date" name="visitDate" value={formData.visitDate} onChange={handleChange} style={inputStyle} required />
      </label>

      <label style={labelStyle}>
        Blood Pressure:
        <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} style={inputStyle} />
      </label>

      <label style={labelStyle}>
        Weight (kg):
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} style={inputStyle} />
      </label>

      <label style={labelStyle}>
        Fetal Heart Rate:
        <input type="number" name="fetalHeartRate" value={formData.fetalHeartRate} onChange={handleChange} style={inputStyle} />
      </label>

      <label style={labelStyle}>
        Symptoms:
        <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} style={inputStyle} />
      </label>

      <label style={labelStyle}>
        Lab Tests:
        <textarea name="labTests" value={formData.labTests} onChange={handleChange} style={inputStyle} />
      </label>

      <label style={labelStyle}>
        Recommendations:
        <textarea name="recommendations" value={formData.recommendations} onChange={handleChange} style={inputStyle} />
      </label>

      <button type="submit" style={buttonStyle}>Save Visit</button>
    </form>
  );
};

