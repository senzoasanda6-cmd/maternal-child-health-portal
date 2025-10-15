import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VaccineScheduleDashboard = ({ childId }) => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await axios.get(`/api/children/${childId}/vaccine-schedule`);
      setSchedule(response.data);
    };
    fetchSchedule();
  }, [childId]);

  return (
    <table>
      <thead>
        <tr>
          <th>Vaccine</th>
          <th>Due Week</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((item, i) => (
          <tr key={i}>
            <td>{item.vaccine}</td>
            <td>{item.due_week}</td>
            <td style={{ color: item.status === 'Overdue' ? 'red' : item.status === 'Completed' ? 'green' : 'orange' }}>
              {item.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VaccineScheduleDashboard;
