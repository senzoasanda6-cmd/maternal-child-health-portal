import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChildProfileView = () => {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [growthRecords, setGrowthRecords] = useState([]);
  const [newGrowth, setNewGrowth] = useState({ height: '', weight: '', date: '' });

  useEffect(() => {
    axios.get(`/children/${id}`).then(res => setChild(res.data));
    axios.get(`/children/${id}/growth`).then(res => setGrowthRecords(res.data));
  }, [id]);

  const calculateAgeInMonths = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth();
    return months;
  };

  const handleGrowthSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/children/${id}/growth`, newGrowth);
      const updated = await axios.get(`/children/${id}/growth`);
      setGrowthRecords(updated.data);
      setNewGrowth({ height: '', weight: '', date: '' });
    } catch (err) {
      console.error('Error adding growth record:', err);
    }
  };

  if (!child) return <div className="container py-4">Loading child profile...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Child Profile</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h4>{child.name}</h4>
          <p><strong>Date of Birth:</strong> {child.dob}</p>
          <p><strong>Age:</strong> {calculateAgeInMonths(child.dob)} months</p>
          <p><strong>Gender:</strong> {child.gender}</p>
          <p><strong>Mother:</strong> {child.mother?.name}</p>
        </div>
      </div>

      <h5 className="mb-3">Growth Records</h5>
      <ul className="list-group mb-4">
        {growthRecords.map((record, index) => (
          <li key={index} className="list-group-item">
            <strong>Date:</strong> {record.date} | <strong>Height:</strong> {record.height} cm | <strong>Weight:</strong> {record.weight} kg
          </li>
        ))}
      </ul>

      <h5 className="mb-3">Add Growth Record</h5>
      <form onSubmit={handleGrowthSubmit}>
        <div className="row mb-3">
          <div className="col">
            <input
              type="date"
              className="form-control"
              value={newGrowth.date}
              onChange={(e) => setNewGrowth({ ...newGrowth, date: e.target.value })}
              required
            />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Height (cm)"
              value={newGrowth.height}
              onChange={(e) => setNewGrowth({ ...newGrowth, height: e.target.value })}
              required
            />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Weight (kg)"
              value={newGrowth.weight}
              onChange={(e) => setNewGrowth({ ...newGrowth, weight: e.target.value })}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success">Add Record</button>
      </form>
    </div>
  );
};

export default ChildProfileView;
