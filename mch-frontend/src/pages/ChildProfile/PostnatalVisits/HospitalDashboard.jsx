import React, { useEffect, useState } from "react";
import axios from "axios";
import VisitTrendsChart from "./VisitTrendsChart"; // chart component

const HospitalDashboard = ({ hospitalId }) => {
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDept, setSelectedDept] = useState("");

    const departments = ["All", "Pediatrics", "Maternity", "General Medicine"];
    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const response = await axios.get(
                    `/api/hospitals/${hospitalId}/dashboard`
                );
                setHospital(response.data);
            } catch (err) {
                setError("Failed to load hospital data.");
            } finally {
                setLoading(false);
            }
        };
        fetchHospital();
    }, [hospitalId]);

    if (loading)
        return <div className="container py-4">Loading dashboard...</div>;
    if (error) return <div className="container py-4 text-danger">{error}</div>;

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-center">{hospital.name} Dashboard</h2>
            <select
                className="form-select mb-3"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
            >
                {departments.map((dept) => (
                    <option key={dept} value={dept}>
                        {dept}
                    </option>
                ))}
            </select>
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Patients</h5>
                            <p className="display-6">
                                {hospital.patients_count}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Appointments</h5>
                            <p className="display-6">
                                {hospital.appointments_count}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Postnatal Visits</h5>
                            <p className="display-6">{hospital.visits_count}</p>
                        </div>
                    </div>
                </div>
            </div>

            <VisitTrendsChart
                hospitalId={hospitalId}
                department={selectedDept}
            />
        </div>
    );
};

export default HospitalDashboard;
