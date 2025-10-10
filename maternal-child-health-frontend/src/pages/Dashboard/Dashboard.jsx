import React, { useEffect, useState } from "react";
import LastVisitSummaryCard from "./LastVisitSummaryCard";
import PregnancyStageCard from "./PregnancyStageCard";
import UpcomingAppointmentsCard from "./UpcomingAppointmentsCard";
import { useParams } from "react-router-dom";
import api from "../../services/api"; // Adjust path if needed

const Dashboard = () => {
  const { childId } = useParams();

  const [lastVisit, setLastVisit] = useState(null);
  const [pregnancyStage, setPregnancyStage] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [visitRes, stageRes, apptRes] = await Promise.all([
          api.get("/api/dashboard/last-visit"),
          api.get("/api/dashboard/pregnancy-stage"),
          api.get(`/api/dashboard/appointments?child_id=${childId}`),
        ]);

        setLastVisit(visitRes.data);
        setPregnancyStage(stageRes.data);
        setAppointments(apptRes.data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [childId]);

  if (loading) return <div className="container py-4">Loading dashboard...</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">👩‍⚕️ Mother Dashboard</h2>
      <LastVisitSummaryCard visit={lastVisit} />
      <PregnancyStageCard stage={pregnancyStage} />
      <UpcomingAppointmentsCard appointments={appointments} />
    </div>
  );
};

export default Dashboard;
