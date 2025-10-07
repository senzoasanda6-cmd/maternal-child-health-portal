import React from 'react';
import { Line } from 'react-chartjs-2';

const GrowthChart = ({ records }) => {
  const dates = records.map(r => r.date);
  const heightData = records.map(r => r.height);
  const weightData = records.map(r => r.weight);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Height (cm)',
        data: heightData,
        borderColor: '#00c6ff',
        fill: false,
      },
      {
        label: 'Weight (kg)',
        data: weightData,
        borderColor: '#ff6b6b',
        fill: false,
      },
    ],
  };

  return (
    <div className="growth-chart">
      <Line data={data} />
    </div>
  );
};

export default GrowthChart;
