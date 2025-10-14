import React, { useEffect, useState } from "react";
import api from "../../services/api";

import ChildCard from "../components/ChildCard";
import GrowthChart from "../components/GrowthChart";
import AppointmentsList from "../components/AppointmentsList";
import MilestoneTracker from "../components/MilestoneTracker";
import HealthRecords from "../components/HealthRecords";
import QuickLinks from "../components/QuickLinks";

export default function Dashboard() {
    const [child, setChild] = useState(null);
    const [growthData, setGrowthData] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const links = [
        { label: "Nutrition Guides", url: "/resources/nutrition" },
        { label: "Breastfeeding Tips", url: "/resources/breastfeeding" },
        { label: "Mental Health Support", url: "/resources/mental-health" },
        { label: "Emergency Contacts", url: "/resources/emergency" },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [childRes, growthRes, apptRes, milestoneRes, recordRes] =
                    await Promise.all([
                        api.get("/api/child-profile"),
                        api.get("/api/growth-data"),
                        api.get("/api/appointments"),
                        api.get("/api/milestones"),
                        api.get("/api/health-records"),
                    ]);

                setChild(childRes.data);
                setGrowthData(growthRes.data);
                setAppointments(apptRes.data);
                setMilestones(milestoneRes.data);
                setRecords(recordRes.data);
            } catch (err) {
                console.error("Dashboard load failed:", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading)
        return <p className="text-center py-5">Loading dashboard...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="p-6 space-y-6">
            {child && <ChildCard {...child} />}
            <GrowthChart data={growthData} />
            <AppointmentsList appointments={appointments} />
            <MilestoneTracker milestones={milestones} />
            <HealthRecords records={records} />
            <QuickLinks links={links} />
        </div>
    );
}
