import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

const HealthPatients = () => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get("/api/health/patients");
                const allPatients = res.data;

                // ✅ Filter by hospital
                const hospitalPatients = allPatients.filter(
                    (p) => p.user?.hospital_id === user.hospital_id
                );

                setPatients(hospitalPatients);
                setFilteredPatients(hospitalPatients);
            } catch (err) {
                console.error("Failed to load patients:", err);
                setError("Unable to fetch patient list.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.hospital_id) {
            fetchPatients();
        }
    }, [user]);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = patients.filter((p) =>
            p.name.toLowerCase().includes(term)
        );
        setFilteredPatients(filtered);
    }, [searchTerm, patients]);

    if (loading) return <p>Loading patients...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="mb-4">
                Patients at {user.hospital?.name || "your hospital"}
            </h2>

            <input
                type="text"
                placeholder="Search by patient name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control mb-4"
            />

            {filteredPatients.length === 0 ? (
                <p>No patients found.</p>
            ) : (
                <ul className="list-group">
                    {filteredPatients.map((patient) => (
                        <li key={patient.id} className="list-group-item">
                            <strong>{patient.name}</strong> —{" "}
                            {patient.contact || "No contact info"}
                            {Array.isArray(patient.children) &&
                                patient.children.length > 0 && (
                                    <ul className="mt-2">
                                        {patient.children.map((child) => (
                                            <li key={child.id}>
                                                👶 {child.name} — DOB:{" "}
                                                {child.dob} —{" "}
                                                <Link
                                                    to={`/children/${child.id}/vaccinations`}
                                                    className="text-primary"
                                                >
                                                    View Vaccines
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HealthPatients;
