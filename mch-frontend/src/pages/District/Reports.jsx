import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Reports = () => {
    const [appointmentStats, setAppointmentStats] = useState(null);
    const [visitTrends, setVisitTrends] = useState([]);
    const [vaccinationProgress, setVaccinationProgress] = useState([]);
    const [highRiskCases, setHighRiskCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("stats");

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const [stats, trends, vaccination, highRisk] = await Promise.all([
                    api.get("/district/reports/appointments"),
                    api.get("/district/reports/trends"),
                    api.get("/district/reports/vaccination-progress"),
                    api.get("/district/reports/high-risk-cases"),
                ]);

                setAppointmentStats(stats.data);
                setVisitTrends(trends.data);
                setVaccinationProgress(vaccination.data);
                setHighRiskCases(highRisk.data.data || []);
            } catch (err) {
                console.error("Failed to load reports:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <p>Loading reports...</p>;

    return (
        <div className="container py-4">
            <h2 className="mb-4">District Reports</h2>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "stats" ? "active" : ""}`}
                        onClick={() => setActiveTab("stats")}
                    >
                        Appointment Statistics
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "vaccination" ? "active" : ""}`}
                        onClick={() => setActiveTab("vaccination")}
                    >
                        Vaccination Progress
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "highRisk" ? "active" : ""}`}
                        onClick={() => setActiveTab("highRisk")}
                    >
                        High-Risk Cases
                    </button>
                </li>
            </ul>

            {/* Appointment Statistics */}
            {activeTab === "stats" && appointmentStats && (
                <div className="card">
                    <div className="card-body">
                        <h5>Appointment Statistics</h5>
                        <p>
                            <strong>Total:</strong> {appointmentStats.total}
                        </p>
                        <h6>By Status:</h6>
                        <ul>
                            {Object.entries(appointmentStats.by_status).map(
                                ([status, count]) => (
                                    <li key={status}>
                                        {status}: {count}
                                    </li>
                                )
                            )}
                        </ul>
                        <h6>By Phase:</h6>
                        <ul>
                            {Object.entries(appointmentStats.by_phase).map(
                                ([phase, count]) => (
                                    <li key={phase}>
                                        {phase}: {count}
                                    </li>
                                )
                            )}
                        </ul>
                        <p>
                            <strong>High-Risk:</strong>{" "}
                            {appointmentStats.high_risk}
                        </p>
                    </div>
                </div>
            )}

            {/* Vaccination Progress */}
            {activeTab === "vaccination" && (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Facility</th>
                            <th>Total Children</th>
                            <th>Vaccinated</th>
                            <th>Coverage %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vaccinationProgress.map((facility) => (
                            <tr key={facility.facility_id}>
                                <td>{facility.facility_name}</td>
                                <td>{facility.total_children}</td>
                                <td>{facility.vaccinated}</td>
                                <td>
                                    <div className="progress">
                                        <div
                                            className="progress-bar"
                                            style={{
                                                width: `${facility.coverage}%`,
                                            }}
                                        >
                                            {facility.coverage}%
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* High-Risk Cases */}
            {activeTab === "highRisk" && (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Mother</th>
                            <th>Child</th>
                            <th>Facility</th>
                            <th>Phase</th>
                            <th>Status</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {highRiskCases.length > 0 ? (
                            highRiskCases.map((appt) => (
                                <tr key={appt.id}>
                                    <td>{appt.date}</td>
                                    <td>{appt.mother}</td>
                                    <td>{appt.child}</td>
                                    <td>{appt.facility}</td>
                                    <td>
                                        <span className="badge bg-info">
                                            {appt.phase}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge bg-warning">
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td>{appt.notes}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No high-risk cases found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Reports;
