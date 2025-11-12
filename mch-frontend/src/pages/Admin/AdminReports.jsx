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
    const [selectedFacilityId, setSelectedFacilityId] = useState("1");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [summary, setSummary] = useState(null);
    const [visitStats, setVisitStats] = useState(null);

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

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const params = {};
                if (startDate) params.start_date = startDate;
                if (endDate) params.end_date = endDate;

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

                setSummary(vaccineRes.data);
                setVisitStats(visitRes.data);
            } catch (err) {
                console.error("Failed to load report:", err);
            }
        };

        if (selectedFacilityId) {
            fetchReport();
        }
    }, [selectedFacilityId, startDate, endDate]);

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
            <h2  className="text-custom-color-primary fw-bold mb-4">Facility Reports</h2>

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
