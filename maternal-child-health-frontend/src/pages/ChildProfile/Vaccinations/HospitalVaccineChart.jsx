import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const HospitalVaccineChart = ({ hospitalId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      const response = await axios.get(`/api/hospital/${hospitalId}/vaccine-progress`);
      setData(response.data);
    };
    fetchProgress();
  }, [hospitalId]);

  if (!data) return <p>Loading hospital vaccine data...</p>;

  const chartData = {
    labels: ['Completed', 'Missed', 'Upcoming'],
    datasets: [
      {
        label: 'Vaccines',
        data: [data.completed, data.missed, data.upcoming],
        backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
      },
    ],
  };

  return (
    <div>
      <h4>Hospital Vaccine Coverage</h4>
      <Bar data={chartData} />
      <p>Total children: {data.total_children}</p>
    </div>
  );
};

export default HospitalVaccineChart;
