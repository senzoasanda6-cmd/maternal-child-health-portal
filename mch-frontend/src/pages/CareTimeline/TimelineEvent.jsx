import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import moment from "moment";
import { AuthContext } from "../../contexts/AuthContext";

const TimelineEvent = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const isHealthWorker = [
        "health_worker",
        "midwife",
        "facility_worker",
        "facility_nurse",
        "facility_doctor",
    ].includes(user?.role);

    const mode = isHealthWorker ? "health_worker" : "mother";

    const [loading, setLoading] = useState(true);
    const [eventData, setEventData] = useState(null);
    const [error, setError] = useState(null);

    // ---------------------------
    // Fetch Event Details
    // ---------------------------
    useEffect(() => {
        fetchEventDetails();
    }, [type, id]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);

            let endpoint = "";
            if (type === "event") endpoint = `/events/${id}`;
            else if (type === "appointment") endpoint = `/appointments/${id}`;
            else throw new Error("Invalid event type in URL.");

            const res = await api.get(endpoint);
            setEventData(res.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load event details.");
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------
    // Delete Event (Health Worker)
    // ---------------------------
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event?"))
            return;

        try {
            const endpoint =
                type === "event" ? `/events/${id}` : `/appointments/${id}`;

            await api.delete(endpoint);
            alert("Event deleted successfully.");
            navigate(-1);
        } catch (err) {
            alert("Error deleting the event.");
            console.error(err);
        }
    };

    if (loading) return <div className="alert alert-info">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!eventData)
        return <div className="alert alert-warning">Event not found.</div>;

    const isAppointment = type === "appointment";

    // ------------------------------------------------
    // UI Helpers
    // ------------------------------------------------
    const statusColors = {
        completed: "success",
        pending: "warning",
        cancelled: "danger",
        missed: "secondary",
        approved: "primary",
        default: "secondary",
    };

    const statusBadge = statusColors[eventData.status] || statusColors.default;

    const isHighRisk = eventData?.high_risk === true || eventData?.is_high_risk;

    return (
        <div className="container py-4">
            {/* -------------------------- */}
            {/* Breadcrumbs */}
            {/* -------------------------- */}
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/timeline">Timeline</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {type === "appointment" ? "Appointment" : "Event"} #{id}
                    </li>
                </ol>
            </nav>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>
                    📌 {isAppointment ? "Appointment Details" : "Event Details"}{" "}
                    <small className="text-muted ms-2">
                        (
                        {mode === "mother"
                            ? "Mother Mode"
                            : "Health Worker Mode"}
                        )
                    </small>
                </h2>

                {/* -------------------------- */}
                {/* Back Button */}
                {/* -------------------------- */}
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    {/* -------------------------- */}
                    {/* Title */}
                    {/* -------------------------- */}
                    <div className="d-flex justify-content-between">
                        <h4>
                            {isAppointment
                                ? eventData.type || "Appointment"
                                : eventData.title}
                        </h4>

                        {/* Status badge */}
                        {eventData.status && (
                            <span className={`badge bg-${statusBadge} p-2`}>
                                {eventData.status.toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* High-risk Indicator */}
                    {isHighRisk && (
                        <div className="alert alert-danger mt-3">
                            ⚠️ <strong>High-Risk Case:</strong> Extra care
                            required.
                        </div>
                    )}

                    <hr />

                    {/* -------------------------- */}
                    {/* Event Info */}
                    {/* -------------------------- */}
                    <p>
                        <strong>ID:</strong> {eventData.id}
                    </p>

                    <p>
                        <strong>Date:</strong>{" "}
                        {moment(eventData.date || eventData.start).format(
                            "MMM DD, YYYY"
                        )}
                    </p>

                    <p>
                        <strong>Time:</strong>{" "}
                        {isAppointment
                            ? `${eventData.start_time} - ${eventData.end_time}`
                            : `${moment(eventData.start).format(
                                  "LT"
                              )} - ${moment(eventData.end).format("LT")}`}
                    </p>

                    {eventData.facility?.name && (
                        <p>
                            <strong>Clinic:</strong> {eventData.facility.name}
                        </p>
                    )}

                    {/* Clickable Mother Profile */}
                    {eventData.user && (
                        <p>
                            <strong>Mother:</strong>{" "}
                            <Link to={`/mother/${eventData.user.id}/profile`}>
                                {eventData.user.name}
                            </Link>
                        </p>
                    )}

                    {/* Clickable Child Profile */}
                    {eventData.child && (
                        <p>
                            <strong>Child:</strong>{" "}
                            <Link to={`/children/${eventData.child.id}`}>
                                {eventData.child.name}
                            </Link>
                        </p>
                    )}

                    {/* Assigned health worker */}
                    {eventData.health_worker && (
                        <p>
                            <strong>Health Worker:</strong>{" "}
                            {eventData.health_worker.name}
                        </p>
                    )}

                    {eventData.notes && (
                        <div className="mt-3">
                            <strong>Notes:</strong>
                            <p className="text-muted">{eventData.notes}</p>
                        </div>
                    )}

                    <hr />

                    {/* -------------------------- */}
                    {/* Edit / Delete (Health Worker Only) */}
                    {/* -------------------------- */}
                    {isHealthWorker && (
                        <div className="d-flex gap-2">
                            <Link
                                to={`/timeline/${type}/${id}/edit`}
                                className="btn btn-primary"
                            >
                                ✏️ Edit
                            </Link>

                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimelineEvent;
