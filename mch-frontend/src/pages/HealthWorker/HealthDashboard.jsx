// src/pages/HealthWorker/HealthDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import DashboardCard from "../../components/DashboardCard";
import {
    FaCalendarAlt,
    FaBaby,
    FaHeartbeat,
    FaExclamationTriangle,
} from "react-icons/fa";

const HealthDashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [data, setData] = useState({
        appointments: 0,
        lastVisit: "N/A",
        visitType: "N/A",
        pregnancyStage: "N/A",
        missedImmunizations: 0,
    });

    useEffect(() => {
        // Only fetch if user is authenticated and auth is done loading
        if (!authLoading && !user) {
            return; // Don't fetch if not authenticated
        }

        const fetchDashboard = async () => {
            try {
                const [appointmentsRes, lastVisitRes, stageRes] =
                    await Promise.all([
                        api.get("/dashboard/appointments"),
                        api.get("/dashboard/last-visit"), // ✅ updated to unified visit endpoint
                        api.get("/dashboard/pregnancy-stage"),
                    ]);

                setData({
                    appointments: appointmentsRes.data.count,
                    lastVisit: lastVisitRes.data.visit_date || "N/A",
                    visitType: lastVisitRes.data.visit_type || "N/A",
                    pregnancyStage: stageRes.data.stage || "N/A",
                    missedImmunizations:
                        lastVisitRes.data.immunizations?.missed?.length || 0,
                });
            } catch (err) {
                console.error("Dashboard fetch failed:", err);
            }
        };

        if (user) {
            fetchDashboard();
        }
    }, [user, authLoading]);

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
                title="Visit Type"
                value={data.visitType}
                icon={<FaHeartbeat />}
            />
            <DashboardCard
                title="Pregnancy Stage"
                value={data.pregnancyStage}
                icon={<FaBaby />}
            />
            <DashboardCard
                title="Missed Immunizations"
                value={data.missedImmunizations}
                icon={<FaExclamationTriangle />}
                link="/immunizations"
            />
        </div>
    );
};

export default HealthDashboard;
