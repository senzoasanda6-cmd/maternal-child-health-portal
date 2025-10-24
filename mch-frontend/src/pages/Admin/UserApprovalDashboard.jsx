import React, { useEffect, useState } from "react";
import api from "../../services/api";

import AppPageLoading from "../../components/spinners/AppPageLoading";
import AppLoadError from "../../components/spinners/AppLoadError";

function UserApprovalDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get("/api/admin/registration-requests");
            setRequests(response.data);
        } catch (err) {
            setError("Failed to load registration requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id, subRole = null, customSubRole = null) => {
        try {
            await api.post(`/api/admin/registration-requests/${id}/approve`, {
                sub_role: subRole === "other" ? customSubRole : subRole,
            });
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            alert("Approval failed.");
        }
    };

    const handleReject = async (id) => {
        try {
            await api.post(`/api/admin/registration-requests/${id}/reject`);
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            alert("Rejection failed.");
        }
    };

    if (loading) return <AppPageLoading loadingText="Loading requests..." />;
    if (error) return <AppLoadError message={error} />;

    return (
        <div className="user-approval-dashboard p-4 space-y-6">
            <h2>Pending Registration Requests</h2>
            {requests.length === 0 ? (
                <p>No pending requests.</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Requested Facility</th>
                            <th>Designation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id}>
                                <td>{req.name}</td>
                                <td>{req.email}</td>
                                <td>{req.role}</td>
                                <td>{req.facility?.name || "N/A"}</td>
                                <td>
                                    {req.designation}
                                    {req.custom_designation && (
                                        <span className="text-muted">
                                            {" "}
                                            ({req.custom_designation})
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {req.role === "health_worker" ? (
                                        <div className="d-flex flex-column">
                                            <select
                                                className="form-select form-select-sm mb-2"
                                                value={req.sub_role || ""}
                                                onChange={(e) => {
                                                    const updated =
                                                        requests.map((r) =>
                                                            r.id === req.id
                                                                ? {
                                                                      ...r,
                                                                      sub_role:
                                                                          e
                                                                              .target
                                                                              .value,
                                                                      custom_sub_role:
                                                                          "", // reset if not "other"
                                                                  }
                                                                : r
                                                        );
                                                    setRequests(updated);
                                                }}
                                            >
                                                <option value="">
                                                    Assign Sub-Role
                                                </option>
                                                <option value="nurse">
                                                    Nurse
                                                </option>
                                                <option value="midwife">
                                                    Midwife
                                                </option>
                                                <option value="community_health_worker">
                                                    Community Health Worker
                                                </option>
                                                <option value="doctor">
                                                    Doctor
                                                </option>
                                                <option value="clinical_manager">
                                                    Clinical Manager
                                                </option>
                                                <option value="other">
                                                    Other
                                                </option>
                                            </select>

                                            {req.sub_role === "other" && (
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm mb-2"
                                                    placeholder="Specify custom sub-role"
                                                    value={
                                                        req.custom_sub_role ||
                                                        ""
                                                    }
                                                    onChange={(e) => {
                                                        const updated =
                                                            requests.map((r) =>
                                                                r.id === req.id
                                                                    ? {
                                                                          ...r,
                                                                          custom_sub_role:
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                      }
                                                                    : r
                                                            );
                                                        setRequests(updated);
                                                    }}
                                                />
                                            )}

                                            <button
                                                className="btn btn-success btn-sm mb-1"
                                                onClick={() =>
                                                    handleApprove(
                                                        req.id,
                                                        req.sub_role,
                                                        req.custom_sub_role
                                                    )
                                                }
                                                disabled={
                                                    !req.sub_role ||
                                                    (req.sub_role === "other" &&
                                                        !req.custom_sub_role)
                                                }
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() =>
                                                handleApprove(req.id)
                                            }
                                        >
                                            Approve
                                        </button>
                                    )}

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleReject(req.id)}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserApprovalDashboard;
