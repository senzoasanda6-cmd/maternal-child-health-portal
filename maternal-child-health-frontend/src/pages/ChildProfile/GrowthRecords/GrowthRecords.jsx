import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GrowthRecord = ({ childId }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const response = await axios.get(`/api/children/${childId}/growth-records`);
      setRecords(response.data);
    };
    fetchRecords();
  }, [childId]);

  return (
    <table className="growth-record-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Height (cm)</th>
          <th>Weight (kg)</th>
          <th>Head Circumference (cm)</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => (
          <tr key={r.id}>
            <td>{r.date}</td>
            <td>{r.height}</td>
            <td>{r.weight}</td>
            <td>{r.head_circumference || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GrowthRecord;
