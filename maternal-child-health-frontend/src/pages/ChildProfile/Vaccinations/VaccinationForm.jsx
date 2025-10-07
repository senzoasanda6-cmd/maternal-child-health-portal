import React, { useState } from 'react';
import axios from 'axios';

const VaccinationForm = ({ childId, onVaccinationAdded }) => {
  const [form, setForm] = useState({ vaccine_name: '', date: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`/api/children/${childId}/vaccinations`, form);
    onVaccinationAdded();
    setForm({ vaccine_name: '', date: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="vaccine_name" value={form.vaccine_name} onChange={handleChange} placeholder="Vaccine name" required />
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <button type="submit">Record Vaccination</button>
    </form>
  );
};

export default VaccinationForm;
