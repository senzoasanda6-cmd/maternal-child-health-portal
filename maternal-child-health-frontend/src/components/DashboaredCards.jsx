import React, { useState, useEffect } from "react";
import axios from "axios";
import StatCard from "./StatCard"; // adjust path if needed
import "./styles.css";

const DashboardCards = ({ role, hospitalId }) => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }

                const endpoint =
                    role === "admin"
                        ? "/api/admin/hospitals"
                        : "/api/health/dashboard";

                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
                setError("Unauthorized or failed to load data.");
            }
        };

        fetchStats();
    }, [role, hospitalId]);

    if (error) {
        return <div className="dashboard-error">{error}</div>;
    }

    return (
        <div className="dashboard-grid">
            <StatCard title="Patients" value={stats?.patients?.length || 0} />
            <StatCard
                title="Appointments"
                value={stats?.appointments?.length || 0}
            />
            {role === "admin" && (
                <StatCard title="Hospitals" value={stats?.length || 0} />
            )}
        </div>
    );
};

export default DashboardCards;
