import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import DashboardCard from "../../components/DashboardCard";
import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaClock,
    FaBabyCarriage,
} from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminReports = () => {
    const [facilities, setFacilities] = useState([]);
    const [selectedFacilityId, setSelectedFacilityId] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [summary, setSummary] = useState(null);
    const [visitStats, setVisitStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Fetch facilities on component mount
    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const res = await api.get("/admin/facilities");
                setFacilities(res.data);
            } catch (err) {
                console.error("Failed to load facilities:", err);
            }
        };

        fetchFacilities();
    }, []);

    // Define fetchReport function with useCallback so it can be called from retry button
    const fetchReport = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            // Fetch aggregated report for all facilities or for selected facility
            if (selectedFacilityId === "all") {
                const allVaccineStats = [];
                const allVisitStats = [];
                const batchSize = 5;

                // Process facilities in batches to avoid resource exhaustion
                for (let i = 0; i < facilities.length; i += batchSize) {
                    const batch = facilities.slice(i, i + batchSize);
                    const batchPromises = batch.map((f) =>
                        Promise.all([
                            api
                                .get(
                                    `/admin/facilities/${f.id}/vaccine-progress`,
                                    { params }
                                )
                                .then((res) => res.data)
                                .catch(() => ({})),
                            api
                                .get(
                                    `/admin/facilities/${f.id}/postnatal-visits`,
                                    { params }
                                )
                                .then((res) => res.data)
                                .catch(() => ({})),
                        ])
                    );

                    const batchResults = await Promise.all(batchPromises);
                    batchResults.forEach(([vaccineResult, visitResult]) => {
                        allVaccineStats.push(vaccineResult);
                        allVisitStats.push(visitResult);
                    });
                }

                // Aggregating stats
                const aggregatedVaccine = {
                    completed: allVaccineStats.reduce(
                        (sum, r) => sum + (r.completed || 0),
                        0
                    ),
                    missed: allVaccineStats.reduce(
                        (sum, r) => sum + (r.missed || 0),
                        0
                    ),
                    upcoming: allVaccineStats.reduce(
                        (sum, r) => sum + (r.upcoming || 0),
                        0
                    ),
                    total_children: allVaccineStats.reduce(
                        (sum, r) => sum + (r.total_children || 0),
                        0
                    ),
                };

                // Merge visit by day data
                let totalVisits = 0;
                let totalChildren = 0;
                const mergedVisitsByDay = {};

                allVisitStats.forEach((result) => {
                    totalVisits += result.total_visits || 0;
                    totalChildren += result.total_children || 0;
                    if (result.visits_by_day) {
                        Object.entries(result.visits_by_day).forEach(([date, count]) => {
                            mergedVisitsByDay[date] = (mergedVisitsByDay[date] || 0) + count;
                        });
                    }
                });

                const aggregatedVisits = {
                    total_visits: totalVisits,
                    total_children: totalChildren,
                    average_visits_per_child:
                        totalChildren > 0 ? (totalVisits / totalChildren).toFixed(2) : 0,
                    visits_by_day: mergedVisitsByDay,
                };

                setSummary(aggregatedVaccine);
                setVisitStats(aggregatedVisits);
            } else {
                // Fetch data for single facility
                const [vaccineRes, visitRes] = await Promise.all([
                    api.get(
                        `/admin/facilities/${selectedFacilityId}/vaccine-progress`,
                        { params }
                    ),
                    api.get(
                        `/admin/facilities/${selectedFacilityId}/postnatal-visits`,
                        { params }
                    ),
                ]);

                setSummary(vaccineRes.data || {});
                setVisitStats(visitRes.data || {});
            }
        } catch (err) {
            console.error("Failed to load report:", err);
            setError(true);
            setSummary(null);
            setVisitStats(null);
        } finally {
            setLoading(false);
        }
    }, [selectedFacilityId, startDate, endDate, facilities]);

    // Trigger fetch when dependencies change
    useEffect(() => {
        if (selectedFacilityId) {
            fetchReport();
        }
    }, [selectedFacilityId, startDate, endDate, facilities, fetchReport]);

    // Chart data for vaccine progress
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

    // Chart data for postnatal visits
    const visitTrendData =
        visitStats?.visits_by_day &&
        Object.keys(visitStats.visits_by_day).length > 0
            ? {
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
              }
            : null;

    return (
        <div className="container p-4 space-y-6">
            <h2 className="text-custom-color-primary fw-bold mb-4">Facility Reports</h2>

            {/* Error Alert with Retry */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error:</strong> Failed to load report data. Too many concurrent requests.
                    <button
                        type="button"
                        className="btn btn-sm btn-primary ms-2"
                        onClick={() => fetchReport()}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="alert alert-info" role="alert">
                    Loading report data...
                </div>
            )}

            {/* Filters */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <label htmlFor="facility-select" className="form-label">
                        Select Facility:
                    </label>
                    <select
                        id="facility-select"
                        className="form-select"
                        value={selectedFacilityId}
                        onChange={(e) => setSelectedFacilityId(e.target.value)}
                    >
                        <option value="all">All Facilities</option>
                        {facilities.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.name}
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
            {summary && !loading && (
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
                        {vaccineChartData ? (
                            <Bar data={vaccineChartData} />
                        ) : (
                            <p>No vaccine data available.</p>
                        )}
                        <p className="mt-3">
                            Total Children Tracked:{" "}
                            <strong>{summary.total_children}</strong>
                        </p>
                    </div>
                </>
            )}

            {/* Postnatal Visit Stats */}
            {visitStats && !loading && (
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
                        {visitTrendData ? (
                            <Line data={visitTrendData} />
                        ) : (
                            <p>No visit trend data available.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminReports;
