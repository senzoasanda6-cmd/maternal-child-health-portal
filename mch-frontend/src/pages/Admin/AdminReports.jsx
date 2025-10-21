import React, { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardCard from "../../components/DashboardCard";
import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaClock,
    FaBabyCarriage,
} from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";

const AdminReports = () => {
    const [hospitals, setHospitals] = useState([]);
    const [selectedHospitalId, setSelectedHospitalId] = useState("1");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [summary, setSummary] = useState(null);
    const [visitStats, setVisitStats] = useState(null);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await api.get("/api/admin/hospitals");
                setHospitals(res.data);
            } catch (err) {
                console.error("Failed to load hospitals:", err);
            }
        };

        fetchHospitals();
    }, []);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const params = {};
                if (startDate) params.start_date = startDate;
                if (endDate) params.end_date = endDate;

                const [vaccineRes, visitRes] = await Promise.all([
                    api.get(
                        `/api/admin/hospitals/${selectedHospitalId}/vaccine-progress`,
                        { params }
                    ),
                    api.get(
                        `/api/admin/hospitals/${selectedHospitalId}/postnatal-visits`,
                        { params }
                    ),
                ]);

                setSummary(vaccineRes.data);
                setVisitStats(visitRes.data);
            } catch (err) {
                console.error("Failed to load report:", err);
            }
        };

        if (selectedHospitalId) {
            fetchReport();
        }
    }, [selectedHospitalId, startDate, endDate]);

    const vaccineChartData = summary && {
        labels: ["Completed", "Missed", "Upcoming"],
        datasets: [
            {
                label: "Vaccines",
                data: [summary.completed, summary.missed, summary.upcoming],
                backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
            },
        ],
    };

    const visitTrendData = visitStats && {
        labels: Object.keys(visitStats.visits_by_day),
        datasets: [
            {
                label: "Postnatal Visits",
                data: Object.values(visitStats.visits_by_day),
                borderColor: "#007bff",
                backgroundColor: "rgba(0,123,255,0.1)",
                fill: true,
            },
        ],
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Hospital Reports</h2>

            {/* Filters */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <label htmlFor="hospital-select" className="form-label">
                        Select Hospital:
                    </label>
                    <select
                        id="hospital-select"
                        className="form-select"
                        value={selectedHospitalId}
                        onChange={(e) => setSelectedHospitalId(e.target.value)}
                    >
                        {hospitals.map((h) => (
                            <option key={h.id} value={h.id}>
                                {h.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <label htmlFor="start-date" className="form-label">
                        Start Date:
                    </label>
                    <input
                        type="date"
                        id="start-date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="end-date" className="form-label">
                        End Date:
                    </label>
                    <input
                        type="date"
                        id="end-date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Vaccine Summary */}
            {summary && (
                <>
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <DashboardCard
                                title="Completed Vaccines"
                                value={summary.completed}
                                icon={<FaCheckCircle />}
                            />
                        </div>
                        <div className="col-md-4">
                            <DashboardCard
                                title="Missed Vaccines"
                                value={summary.missed}
                                icon={<FaExclamationTriangle />}
                            />
                        </div>
                        <div className="col-md-4">
                            <DashboardCard
                                title="Upcoming Vaccines"
                                value={summary.upcoming}
                                icon={<FaClock />}
                            />
                        </div>
                    </div>

                    <div className="card shadow-sm p-4 mb-4">
                        <h5 className="mb-3">Vaccination Overview</h5>
                        <Bar data={vaccineChartData} />
                        <p className="mt-3">
                            Total Children Tracked:{" "}
                            <strong>{summary.total_children}</strong>
                        </p>
                    </div>
                </>
            )}

            {/* Postnatal Visit Stats */}
            {visitStats && (
                <>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <DashboardCard
                                title="Total Postnatal Visits"
                                value={visitStats.total_visits}
                                icon={<FaBabyCarriage />}
                            />
                        </div>
                        <div className="col-md-6">
                            <DashboardCard
                                title="Avg Visits per Child"
                                value={visitStats.average_visits_per_child}
                                icon={<FaBabyCarriage />}
                            />
                        </div>
                    </div>

                    <div className="card shadow-sm p-4">
                        <h5 className="mb-3">Postnatal Visit Trends</h5>
                        <Line data={visitTrendData} />
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminReports;
