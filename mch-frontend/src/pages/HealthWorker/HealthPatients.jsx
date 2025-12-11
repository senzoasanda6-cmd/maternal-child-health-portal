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
                let endpoint = "/health/patients";
                
                // HIS Manager can view all mothers from all facilities
                if (user?.role === "manager") {
                    endpoint = "/health/patients?all=true";
                }
                
                const res = await api.get(endpoint);
                setPatients(res.data || []);
            } catch (err) {
                console.error("Failed to load patients:", err);
                setError("Unable to fetch patient list.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
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

    const title = user?.role === "manager" 
        ? "All Mothers (All Facilities)" 
        : "Mothers at Your Facility";

    return (
        <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">
                {title}
            </h2>

            <input
                type="text"
                placeholder="Search by mother name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control mb-4"
            />

            {filteredPatients.length === 0 ? (
                <p className="text-muted">No mothers found.</p>
            ) : (
                <PatientList patients={filteredPatients} />
            )}
        </div>
    );
};

export default HealthPatients;
