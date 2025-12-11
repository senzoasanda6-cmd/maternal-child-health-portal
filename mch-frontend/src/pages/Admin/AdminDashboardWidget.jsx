import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  getAppointmentStats,
  getAppointmentsByStatus,
  getAppointmentsByCareType,
} from "../../services/dashboardService";
import StatCard from "../../components/cards/StatCard";
import ChartCard from "../../components/cards/ChartCard";
import AppLoading from "../../components/spinners/AppPageLoading";

/**
 * Admin Dashboard component with calendar event statistics
 * Shows aggregated appointment and event data from the calendar
 */
const AdminDashboardWidget = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [careTypeStats, setCareTypeStats] = useState([]);
  const [statusStats, setStatusStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarStats = async () => {
      try {
        const res = await api.get("/events");
        const eventData = Array.isArray(res.data) ? res.data : [];
        setEvents(eventData);

        // Calculate stats
        const appointmentStats = getAppointmentStats(eventData);
        setStats(appointmentStats);

        // Get care type breakdown
        const careTypes = ["prenatal", "postnatal", "vaccination", "follow-up"];
        const careStats = careTypes.map((type) => ({
          label: type.charAt(0).toUpperCase() + type.slice(1),
          value: getAppointmentsByStatus(eventData, type).length,
        }));
        setCareTypeStats(careStats);

        // Get status breakdown
        const statuses = ["confirmed", "pending", "cancelled"];
        const statStatusStats = statuses.map((status) => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),
          value: getAppointmentsByStatus(eventData, status).length,
        }));
        setStatusStats(statStatusStats);
      } catch (error) {
        console.error("Failed to fetch calendar stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarStats();
  }, []);

  if (loading) return <AppLoading loadingText="Loading calendar statistics..." />;

  if (!stats)
    return (
      <div className="alert alert-info">
        No calendar data available yet.
      </div>
    );

  return (
    <div className="mt-4">
      <h4 className="mb-4">📅 Calendar & Appointment Statistics</h4>

      <div className="row mb-4">
        <div className="col-md-3">
          <StatCard
            title="Today's Appointments"
            value={stats.today}
            icon="📍"
            color="info"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Upcoming"
            value={stats.upcoming}
            icon="📅"
            color="primary"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Confirmed"
            value={stats.confirmed}
            icon="✅"
            color="success"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Pending"
            value={stats.pending}
            icon="⏳"
            color="warning"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <ChartCard
            title="Appointments by Care Type"
            type="bar"
            data={careTypeStats}
          />
        </div>
        <div className="col-md-6">
          <ChartCard
            title="Appointments by Status"
            type="pie"
            data={statusStats}
          />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Event Summary</h5>
            </div>
            <div className="card-body">
              <p className="mb-2">
                <strong>Total Events:</strong> {stats.total}
              </p>
              <p className="mb-2">
                <strong>Overdue:</strong>{" "}
                <span className="badge bg-danger">{stats.overdue}</span>
              </p>
              <p className="mb-2">
                <strong>Cancelled:</strong>{" "}
                <span className="badge bg-secondary">{stats.cancelled}</span>
              </p>
              <p className="mb-0">
                <strong>Confirmed Rate:</strong>{" "}
                {stats.total > 0
                  ? Math.round((stats.confirmed / stats.total) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardWidget;
