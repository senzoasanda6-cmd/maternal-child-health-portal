import React, { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import FacilityTable from "../../components/FacilityTable";
//import "./Dashboard.css";

const Dashboard = () => {
    const [stats, setStats] = useState({});
    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        // Fetch dashboard data from API
        fetch("/api/district/dashboard")
            .then((res) => res.json())
            .then((data) => {
                setStats(data.stats);
                setFacilities(data.facilities);
            });
    }, []);

    return (
        <div className="container py-4">
            <h2 className="mb-4">District Dashboard</h2>

            <div className="row mb-4">
                <StatCard title="Facilities" value={stats.totalFacilities} />
                <StatCard title="Health Workers" value={stats.totalWorkers} />
                <StatCard title="Flagged Cases" value={stats.flaggedCases} />
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-light">
                    <h5 className="mb-0">Facility Performance</h5>
                </div>
                <div className="card-body">
                    <FacilityTable data={facilities} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
