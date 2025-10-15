import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChildDirectory = () => {
  const [filters, setFilters] = useState({ name: '', dob: '', hospital_id: '', mother_id: '' });
  const [results, setResults] = useState([]);
  const [hospitals, setHospitals] = useState([]);

 useEffect(() => {
  const fetchHospitals = async () => {
    try {
      const token = localStorage.getItem('token'); // or wherever you store it
      const res = await axios.get('/api/admin/hospitals', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHospitals(res.data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error.response?.data || error.message);
    }
  };

  fetchHospitals();
}, []);


  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    const response = await axios.get('/api/children/search', { params: filters });
    setResults(response.data);
  };

  return (
    <div>
      <h2>Search Child Directory</h2>
      <div className="filters">
        <input type="text" name="name" placeholder="Name" value={filters.name} onChange={handleChange} />
        <input type="date" name="dob" value={filters.dob} onChange={handleChange} />
        <input type="number" name="mother_id" placeholder="Mother ID" value={filters.mother_id} onChange={handleChange} />
        <select name="hospital_id" value={filters.hospital_id} onChange={handleChange}>
          <option value="">All Hospitals</option>
          {hospitals.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Mother</th>
            <th>Hospital</th>
          </tr>
        </thead>
        <tbody>
          {results.map(child => (
            <tr key={child.id}>
              <td>{child.name}</td>
              <td>{new Date(child.dob).toLocaleDateString()}</td>
              <td>{child.mother?.name || child.mother_id}</td>
              <td>{child.hospital?.name || child.hospital_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChildDirectory;
