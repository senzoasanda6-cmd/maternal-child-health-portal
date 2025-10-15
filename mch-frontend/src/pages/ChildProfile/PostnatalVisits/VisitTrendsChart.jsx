import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

const VisitTrendsChart = ({ hospitalId, department }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await axios.get(`/api/hospitals/${hospitalId}/visit-trends`, {
          params: { department },
        });
        const data = response.data;

        setChartData({
          labels: data.months,
          datasets: [
            {
              label: `Postnatal Visits${department && department !== "All" ? ` - ${department}` : ""}`,
              data: data.counts,
              borderColor: "#0d6efd",
              backgroundColor: "rgba(13,110,253,0.2)",
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to load visit trends:", error);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [hospitalId, department]);

  if (loading) return <p>Loading chart...</p>;
  if (!chartData) return <p className="text-danger">Unable to load chart data.</p>;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">Visit Trends (Monthly)</h5>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default VisitTrendsChart;
