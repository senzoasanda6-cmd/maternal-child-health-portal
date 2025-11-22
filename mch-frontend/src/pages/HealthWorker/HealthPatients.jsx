import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { useDebounce } from "../../hooks/useDebounce";

const ChildList = ({ children }) => (
    <ul className="mt-2 list-unstyled">
        {children.map((child) => (
            <li key={child.id} className="ms-3">
                👶 {child.name} — DOB: {child.dob} —{" "}
                <Link
                    to={`/children/${child.id}/vaccinations`}
                    className="text-primary"
                >
                    View Vaccines
                </Link>
            </li>
        ))}
    </ul>
);

const PatientListItem = ({ patient }) => (
    <li className="list-group-item">
        <strong>{patient.name}</strong> — {patient.contact || "No contact info"}
        {Array.isArray(patient.children) && patient.children.length > 0 && (
            <ChildList children={patient.children} />
        )}
    </li>
);

const PatientList = ({ patients }) => (
    <ul className="list-group">
        {patients.map((patient) => (
            <PatientListItem key={patient.id} patient={patient} />
        ))}
    </ul>
);

const HealthPatients = () => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get("/health/patients");
                // It's better to filter on the backend if possible, e.g., /health/patients?hospital_id=${user.hospital_id}
                // For now, we'll keep the client-side filter.
                const hospitalPatients = res.data.filter(
                    (p) => p.user?.hospital_id === user.hospital_id,
                );

                setPatients(hospitalPatients);
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

    const filteredPatients = React.useMemo(() => {
        if (!debouncedSearchTerm) {
            return patients;
        }
        const term = debouncedSearchTerm.toLowerCase();
        return patients.filter((p) => p.name.toLowerCase().includes(term));
    }, [debouncedSearchTerm, patients]);

    if (loading) return <div className="p-6 text-center">Loading patients...</div>;
    if (error) return <div className="p-6 text-center text-danger">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">
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
                <p className="text-muted">No patients found.</p>
            ) : (
                <PatientList patients={filteredPatients} />
            )}
        </div>
    );
};

export default HealthPatients;
