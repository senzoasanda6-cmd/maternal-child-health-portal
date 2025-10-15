import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VaccinationList = ({ childId }) => {
  const [vaccinations, setVaccinations] = useState([]);

  useEffect(() => {
    const fetchVaccinations = async () => {
      const response = await axios.get(`/api/children/${childId}/vaccinations`);
      setVaccinations(response.data);
    };
    fetchVaccinations();
  }, [childId]);

  return (
    <ul>
      {vaccinations.map(v => (
        <li key={v.id}>
          <strong>{v.vaccine_name}</strong> — {v.date}
        </li>
      ))}
    </ul>
  );
};

export default VaccinationList;
