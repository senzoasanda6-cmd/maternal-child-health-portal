import React, { useEffect, useState } from "react";

function AdminApprovalPanel() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch("/api/admin/registration-requests")
            .then((res) => res.json())
            .then((data) => setRequests(data));
    }, []);

    const handleApprove = async (id) => {
        await fetch(`/api/admin/registration-requests/${id}/approve`, {
            method: "POST",
        });
        setRequests((prev) => prev.filter((r) => r.id !== id));
    };

    const handleReject = async (id) => {
        await fetch(`/api/admin/registration-requests/${id}/reject`, {
            method: "POST",
        });
        setRequests((prev) => prev.filter((r) => r.id !== id));
    };

    return (
        <div className="container p-4 space-y-6">
            <h2 className="text-custom-color-primary fw-bold">Pending Registration Requests</h2>
            {requests.map((req) => (
                <div key={req.id} className="request-card">
                    <p>
                        <strong>Name:</strong> {req.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {req.email}
                    </p>
                    <p>
                        <strong>Role:</strong> {req.role}
                    </p>
                    <p>
                        <strong>Facility:</strong> {req.hospital_id}
                    </p>
                    <p>
                        <strong>Comments:</strong> {req.comments}
                    </p>
                    <button onClick={() => handleApprove(req.id)}>
                        Approve
                    </button>
                    <button onClick={() => handleReject(req.id)}>Reject</button>
                </div>
            ))}
        </div>
    );
}

export default AdminApprovalPanel;
