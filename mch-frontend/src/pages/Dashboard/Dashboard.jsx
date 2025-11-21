import React, { useEffect, useState, useContext } from "react";
import LastVisitSummaryCard from "./LastVisitSummaryCard";
import PregnancyStageCard from "./PregnancyStageCard";
import UpcomingAppointmentsCard from "./UpcomingAppointmentsCard";
import { useParams } from "react-router-dom";
import api from "../../services/api"; // Adjust path if needed
import { AuthContext } from "../../contexts/AuthContext";
import AppLoading from "../../components/spinners/AppPageLoading";
import AppLoadError from "../../components/spinners/AppLoadError";

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { childId } = useParams();

  const [lastVisit, setLastVisit] = useState(null);
  const [pregnancyStage, setPregnancyStage] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if user is authenticated and auth is done loading
    if (!authLoading && !user) {
      return; // Don't fetch if not authenticated
    }

    const fetchDashboardData = async () => {
      try {
        const [visitRes, stageRes, apptRes] = await Promise.all([
          api.get("/dashboard/last-visit"),
          api.get("/dashboard/pregnancy-stage"),
          api.get(`/dashboard/appointments?child_id=${childId}`),
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

    if (user) {
      fetchDashboardData();
    }
  }, [childId, user, authLoading]);

  if (loading) return <AppLoading loadingText="Loading dashboard..." />;
  if (error) return <AppLoadError errorText={error} />;

  return (
    <div className="container p-4">
      <h2 className="mb-4">👩‍⚕️ Mother Dashboard</h2>
      <LastVisitSummaryCard visit={lastVisit} />
      <PregnancyStageCard stage={pregnancyStage} />
      <UpcomingAppointmentsCard appointments={appointments} />
    </div>
  );
};

export default Dashboard;
