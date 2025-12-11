import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import moment from "moment";

const CareTimeline = ({ motherId = null, childId = null }) => {
    const { user } = useContext(AuthContext);

    const isHealthWorker = [
        "health_worker",
        "midwife",
        "facility_worker",
        "facility_nurse",
        "facility_doctor",
    ].includes(user?.role);

    // Determine mode
    const mode = isHealthWorker ? "health_worker" : "mother";

    const [loading, setLoading] = useState(true);
    const [timeline, setTimeline] = useState([]);

    useEffect(() => {
        fetchTimeline();
    }, [motherId, childId]);

    const fetchTimeline = async () => {
        try {
            setLoading(true);

            // Determine which mother to load
            const activeMotherId = mode === "mother" ? user.id : motherId;
            const activeChildId =
                mode === "mother"
                    ? user?.child_id || user?.latest_child_id
                    : childId;

            if (!activeMotherId) {
                console.warn("No mother ID provided.");
                setLoading(false);
                return;
            }

            // 1. Fetch pregnancy stage
            const pregnancyRes = await api.get(
                `/mother/${activeMotherId}/dashboard`
            );
            const pregnancy = pregnancyRes.data?.pregnancy_stage || {};

            // 2. prenatal appointments
            const appointmentsRes = await api.get(`/dashboard/appointments`, {
                params: { mother_id: activeMotherId },
            });
            const appointments = appointmentsRes.data || [];

            // 3. last visit
            const lastVisitRes = await api.get(`/dashboard/last-visit`, {
                params: { mother_id: activeMotherId },
            });
            const lastVisit = lastVisitRes.data;

            // 4. child-related data
            let vaccines = [];
            let upcomingVaccines = [];
            let postnatalVisits = [];

            if (activeChildId) {
                const vaccRes = await api.get(
                    `/children/${activeChildId}/vaccinations`
                );
                const upcomingRes = await api.get(
                    `/children/${activeChildId}/upcoming-vaccines`
                );
                const postnatalRes = await api.get(
                    `/children/${activeChildId}/postnatal-visits`
                );

                vaccines = vaccRes.data || [];
                upcomingVaccines = upcomingRes.data || [];
                postnatalVisits = postnatalRes.data || [];
            }

            // Build timeline
            const timelineData = [];

            timelineData.push({
                label: `Pregnancy Stage (${
                    mode === "mother" ? "You" : "Mother"
                })`,
                icon: "🤰",
                color: "#a855f7",
                description:
                    pregnancy.currentStage && pregnancy.week
                        ? `${pregnancy.currentStage} — Week ${pregnancy.week}`
                        : "No pregnancy data available",
            });

            if (lastVisit) {
                timelineData.push({
                    label: "Last Visit",
                    icon: "🏥",
                    color: "#0d6efd",
                    description: moment(lastVisit.date).format("MMM DD, YYYY"),
                });
            }

            if (appointments.length > 0) {
                timelineData.push({
                    label: "Upcoming Appointments",
                    icon: "📅",
                    color: "#16a34a",
                    list: appointments.map((apt) => ({
                        text: `${apt.type || "Prenatal"} — ${moment(
                            apt.date
                        ).format("MMM DD")} @ ${apt.start_time}`,
                    })),
                });
            }

            if (postnatalVisits.length > 0) {
                timelineData.push({
                    label: "Postnatal Visits",
                    icon: "👶",
                    color: "#2563eb",
                    list: postnatalVisits.map((v) => ({
                        text: `Visit ${v.visit_number} — ${moment(
                            v.date
                        ).format("MMM DD, YYYY")}`,
                    })),
                });
            }

            if (vaccines.length > 0) {
                timelineData.push({
                    label: "Completed Vaccinations",
                    icon: "💉",
                    color: "#4f46e5",
                    list: vaccines.map((v) => ({
                        text: `${v.vaccine_name} — Completed`,
                    })),
                });
            }

            if (upcomingVaccines.length > 0) {
                timelineData.push({
                    label: "Upcoming Vaccines",
                    icon: "⏳",
                    color: "#f59e0b",
                    list: upcomingVaccines.map((v) => ({
                        text: `${v.vaccine_name} — Due ${moment(
                            v.due_date
                        ).format("MMM DD")}`,
                    })),
                });
            }

            setTimeline(timelineData);
        } catch (error) {
            console.error("Failed to load timeline:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="alert alert-info">
                Loading {mode === "mother" ? "your" : "mother's"} care
                timeline...
            </div>
        );

    return (
        <div className="container p-4">
            <h2 className="mb-4">
                🧭 Maternal Care Timeline{" "}
                <small className="text-muted">
                    ({mode === "mother" ? "Mother Mode" : "Health Worker Mode"})
                </small>
            </h2>

            <div className="card shadow-sm">
                <div className="card-body">
                    {timeline.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-3 mb-3 rounded"
                            style={{
                                background: item.color + "22",
                                borderLeft: `5px solid ${item.color}`,
                            }}
                        >
                            <h5>
                                {item.icon} {item.label}
                            </h5>

                            {item.description && (
                                <p className="text-muted mb-2">
                                    {item.description}
                                </p>
                            )}

                            {item.list && (
                                <ul className="mb-0">
                                    {item.list.map((e, i) => (
                                        <li key={i} className="text-muted">
                                            {e.text}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CareTimeline;
