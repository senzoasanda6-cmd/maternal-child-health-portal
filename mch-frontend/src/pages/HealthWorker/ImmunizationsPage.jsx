// src/pages/HealthWorker/ImmunizationsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { FaSyringe, FaClock, FaExclamationTriangle } from "react-icons/fa";

const ImmunizationsPage = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [immunizations, setImmunizations] = useState({
        past: [],
        upcoming: [],
        missed: [],
    });

    useEffect(() => {
        // Only fetch if user is authenticated and auth is done loading
        if (!authLoading && !user) {
            return; // Don't fetch if not authenticated
        }

        const fetchImmunizations = async () => {
            try {
                const res = await api.get("/dashboard/last-visit"); // ✅ updated to unified visit endpoint
                setImmunizations(res.data.immunizations || {});
            } catch (err) {
                console.error("Failed to fetch immunizations:", err);
            }
        };

        if (user) {
            fetchImmunizations();
        }
    }, [user, authLoading]);

    const renderList = (list, icon, label) => (
        <div className="mb-4">
            <h4 className="d-flex align-items-center gap-2">
                {icon} {label}
            </h4>
            {list.length === 0 ? (
                <p className="text-muted">None</p>
            ) : (
                <ul className="list-group">
                    {list.map((item) => (
                        <li key={item.id} className="list-group-item">
                            <strong>{item.vaccine_name}</strong> — {item.dose}
                            <br />
                            {item.administered_on && (
                                <span>
                                    Administered: {item.administered_on}
                                </span>
                            )}
                            {item.scheduled_on && (
                                <span>Scheduled: {item.scheduled_on}</span>
                            )}
                            {item.notes && (
                                <p className="mb-0 text-muted">
                                    Notes: {item.notes}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <div className="container py-4">
            <h2 className="mb-4">Immunization Overview</h2>
            {renderList(
                immunizations.past,
                <FaSyringe />,
                "Past Immunizations"
            )}
            {renderList(
                immunizations.upcoming,
                <FaClock />,
                "Upcoming Immunizations"
            )}
            {renderList(
                immunizations.missed,
                <FaExclamationTriangle />,
                "Missed Immunizations"
            )}
        </div>
    );
};

export default ImmunizationsPage;
