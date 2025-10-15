import React, { useState } from 'react';
import axios from 'axios';

const PostnatalVisitForm = ({ childId, onVisitAdded }) => {
  const [form, setForm] = useState({ visit_date: '', notes: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`/api/children/${childId}/postnatal-visits`, form);
    onVisitAdded();
    setForm({ visit_date: '', notes: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="date" name="visit_date" value={form.visit_date} onChange={handleChange} required />
      <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Visit notes" />
      <button type="submit">Save Visit</button>
    </form>
  );
};

export default PostnatalVisitForm;
