import React, { useState } from 'react';
import axios from 'axios';

const GrowthRecordForm = ({ childId, onRecordAdded }) => {
  const [form, setForm] = useState({
    date: '',
    height: '',
    weight: '',
    head_circumference: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/children/${childId}/growth-records`, form);
      onRecordAdded(); // refresh list or chart
      setForm({ date: '', height: '', weight: '', head_circumference: '' });
    } catch (err) {
      console.error('Error saving growth record:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="growth-form">
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input type="number" name="height" value={form.height} onChange={handleChange} placeholder="Height (cm)" required />
      <input type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="Weight (kg)" required />
      <input type="number" name="head_circumference" value={form.head_circumference} onChange={handleChange} placeholder="Head Circumference (cm)" />
      <button type="submit">Save Record</button>
    </form>
  );
};

export default GrowthRecordForm;
