import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Approvals = () => {
    const [registrationRequests, setRegistrationRequests] = useState([]);
    const [rescheduleRequests, setRescheduleRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("registrations");
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        const fetchApprovals = async () => {
            try {
                const [registrations, reschedules] = await Promise.all([
                    api.get("/district/approvals/registrations"),
                    api.get("/district/approvals/reschedules"),
                ]);

                setRegistrationRequests(registrations.data.data || []);
                setRescheduleRequests(reschedules.data.data || []);
            } catch (err) {
                console.error("Failed to load approvals:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovals();
    }, []);

    const handleApproveRegistration = async (id) => {
        try {
            await api.post(`/district/approvals/registrations/${id}/approve`);
            setRegistrationRequests((prev) =>
                prev.filter((r) => r.id !== id)
            );
            alert("Registration approved!");
        } catch (err) {
            alert("Failed to approve registration");
        }
    };

    const handleRejectRegistration = async (id) => {
        try {
            await api.post(`/district/approvals/registrations/${id}/reject`, {
                reason: rejectReason,
            });
            setRegistrationRequests((prev) =>
                prev.filter((r) => r.id !== id)
            );
            setRejectingId(null);
            setRejectReason("");
            alert("Registration rejected!");
        } catch (err) {
            alert("Failed to reject registration");
        }
    };

    const handleApproveReschedule = async (appointmentId) => {
        const newDate = prompt("Enter new date (YYYY-MM-DD):");
        const newTime = prompt("Enter new time (HH:MM):");

        if (!newDate || !newTime) return;

        try {
            await api.post(
                `/district/approvals/reschedules/${appointmentId}/approve`,
                { new_date: newDate, new_time: newTime }
            );
            setRescheduleRequests((prev) =>
                prev.filter((r) => r.id !== appointmentId)
            );
            alert("Reschedule approved!");
        } catch (err) {
            alert("Failed to approve reschedule");
        }
    };

    const handleRejectReschedule = async (appointmentId) => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        try {
            await api.post(
                `/district/approvals/reschedules/${appointmentId}/reject`,
                { reason }
            );
            setRescheduleRequests((prev) =>
                prev.filter((r) => r.id !== appointmentId)
            );
            alert("Reschedule rejected!");
        } catch (err) {
            alert("Failed to reject reschedule");
        }
    };

    if (loading) return <p>Loading approvals...</p>;

    return (
        <div className="container py-4">
            <h2 className="mb-4">Approvals</h2>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${
                            activeTab === "registrations" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("registrations")}
                    >
                        Registrations (
                        {registrationRequests.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${
                            activeTab === "reschedules" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("reschedules")}
                    >
                        Reschedule Requests (
                        {rescheduleRequests.length})
                    </button>
                </li>
            </ul>

            {/* Registration Approvals */}
            {activeTab === "registrations" && (
                <div>
                    {registrationRequests.length > 0 ? (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Facility</th>
                                    <th>Requested</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrationRequests.map((req) => (
                                    <tr key={req.id}>
                                        <td>{req.name}</td>
                                        <td>{req.email}</td>
                                        <td>{req.phone}</td>
                                        <td>
                                            {req.facility?.name}
                                        </td>
                                        <td>
                                            {new Date(
                                                req.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() =>
                                                    handleApproveRegistration(
                                                        req.id
                                                    )
                                                }
                                            >
                                                Approve
                                            </button>
                                            {rejectingId === req.id ? (
                                                <div className="mt-2">
                                                    <textarea
                                                        className="form-control mb-2"
                                                        placeholder="Reason for rejection..."
                                                        value={
                                                            rejectReason
                                                        }
                                                        onChange={(e) =>
                                                            setRejectReason(
                                                                e.target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className="btn btn-sm btn-danger me-2"
                                                        onClick={() =>
                                                            handleRejectRegistration(
                                                                req.id
                                                            )
                                                        }
                                                    >
                                                        Confirm Reject
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() =>
                                                            setRejectingId(
                                                                null
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        setRejectingId(req.id)
                                                    }
                                                >
                                                    Reject
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="alert alert-info">
                            No pending registration requests.
                        </div>
                    )}
                </div>
            )}

            {/* Reschedule Approvals */}
            {activeTab === "reschedules" && (
                <div>
                    {rescheduleRequests.length > 0 ? (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Mother</th>
                                    <th>Child</th>
                                    <th>Current Date</th>
                                    <th>Current Time</th>
                                    <th>Reason</th>
                                    <th>Requested</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rescheduleRequests.map((req) => (
                                    <tr key={req.id}>
                                        <td>{req.mother}</td>
                                        <td>{req.child}</td>
                                        <td>{req.date}</td>
                                        <td>{req.time}</td>
                                        <td>{req.reschedule_reason}</td>
                                        <td>
                                            {new Date(
                                                req.reschedule_requested_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() =>
                                                    handleApproveReschedule(
                                                        req.id
                                                    )
                                                }
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() =>
                                                    handleRejectReschedule(
                                                        req.id
                                                    )
                                                }
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="alert alert-info">
                            No pending reschedule requests.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Approvals;
