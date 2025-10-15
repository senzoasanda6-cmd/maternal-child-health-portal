import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const VaccineProgressChart = ({ childId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      const response = await axios.get(`/api/children/${childId}/vaccine-progress`);
      setData(response.data);
    };
    fetchProgress();
  }, [childId]);

  if (!data) return <p>Loading chart...</p>;

  const chartData = {
    labels: ['Completed', 'Missed', 'Upcoming'],
    datasets: [
      {
        data: [data.completed, data.missed, data.upcoming],
        backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
      },
    ],
  };

  return (
    <div>
      <h4>Vaccine Progress</h4>
      <Pie data={chartData} />
    </div>
  );
};

export default VaccineProgressChart;
