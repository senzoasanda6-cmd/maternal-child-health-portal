// src/pages/HealthWorker/HealthDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardCard from "../../components/DashboardCard";
import { FaCalendarAlt, FaBaby, FaHeartbeat } from "react-icons/fa";

const HealthDashboard = () => {
  const [data, setData] = useState({
    appointments: 0,
    lastVisit: "N/A",
    pregnancyStage: "N/A",
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [appointmentsRes, lastVisitRes, stageRes] = await Promise.all([
          api.get("/api/dashboard/appointments"),
          api.get("/api/dashboard/last-visit"),
          api.get("/api/dashboard/pregnancy-stage"),
        ]);

        setData({
          appointments: appointmentsRes.data.count,
          lastVisit: lastVisitRes.data.date,
          pregnancyStage: stageRes.data.stage,
        });
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Health Worker Dashboard</h2>
      <DashboardCard
        title="Upcoming Appointments"
        value={data.appointments}
        icon={<FaCalendarAlt />}
        link="/appointments"
      />
      <DashboardCard
        title="Last Visit"
        value={data.lastVisit}
        icon={<FaHeartbeat />}
      />
      <DashboardCard
        title="Pregnancy Stage"
        value={data.pregnancyStage}
        icon={<FaBaby />}
      />
    </div>
  );
};

export default HealthDashboard;
