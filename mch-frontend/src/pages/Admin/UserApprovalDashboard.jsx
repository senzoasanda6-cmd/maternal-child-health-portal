import React, { useEffect, useState } from "react";
import api from "../../services/api";

import AppPageLoading from "../../components/spinners/AppPageLoading";
import AppLoadError from "../../components/spinners/AppLoadError";

function UserApprovalDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Base URL of your backend API

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

    const handleApprove = async (id) => {
        try {
            await api.post(`/api/admin/registration-requests/${id}/approve`);
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
                            <th>Comments</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id}>
                                <td>{req.name}</td>
                                <td>{req.email}</td>
                                <td>{req.role}</td>
                                <td>{req.facility?.name || 'N/A'}</td>
                                <td>{req.comments}</td>
                                <td>
                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        onClick={() => handleApprove(req.id)}
                                    >
                                        Approve
                                    </button>
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
