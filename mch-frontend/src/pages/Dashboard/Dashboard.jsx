import React, { useEffect, useState, useContext } from "react";
import LastVisitSummaryCard from "./LastVisitSummaryCard";
import PregnancyStageCard from "./PregnancyStageCard";
import UpcomingAppointmentsCard from "./UpcomingAppointmentsCard";
import AppointmentStatsCard from "./AppointmentStatsCard";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import AppLoading from "../../components/spinners/AppPageLoading";
import AppLoadError from "../../components/spinners/AppLoadError";
import {
  fetchConsolidatedDashboardData,
  transformEventsToAppointments,
  mergeAppointmentsWithEvents,
  getAppointmentStats,
} from "../../services/dashboardService";

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { childId } = useParams();

  const [lastVisit, setLastVisit] = useState(null);
  const [pregnancyStage, setPregnancyStage] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentStats, setAppointmentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if user is authenticated and auth is done loading
    if (!authLoading && !user) {
      return; // Don't fetch if not authenticated
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch consolidated data from all endpoints
        const consolidatedData = await fetchConsolidatedDashboardData(childId);

        setLastVisit(consolidatedData.lastVisit);
        setPregnancyStage(consolidatedData.pregnancyStage);

        // Merge appointments from API with calendar events
        const apiAppointments = consolidatedData.appointments?.appointments || [];
        const events = consolidatedData.events || [];

        const mergedAppointments = mergeAppointmentsWithEvents(
          apiAppointments,
          events
        );

        setAppointments(mergedAppointments);

        // Calculate statistics from events
        const stats = getAppointmentStats(events);
        setAppointmentStats(stats);
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

      {/* Quick stats row */}
      {appointmentStats && <AppointmentStatsCard stats={appointmentStats} />}

      <LastVisitSummaryCard visit={lastVisit} />
      <PregnancyStageCard stage={pregnancyStage} />
      <UpcomingAppointmentsCard appointments={appointments} />
    </div>
  );
};

export default Dashboard;
