import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Main.css";

function AdminHomePage() {
    const navigate = useNavigate();

    return (
        <div className="admin-home">
            <header className="admin-header">
                <h1>Admin Portal</h1>
                <p>Welcome to the Maternal & Child Health Admin Dashboard</p>
            </header>

            <div className="admin-grid">
                <div
                    className="admin-card"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    <h3>User Monitoring</h3>
                    <p>Track user activity and engagement</p>
                </div>

                <div
                    className="admin-card"
                    onClick={() => navigate("/admin/approvals")}
                >
                    <h3>Registration Approvals</h3>
                    <p>Review and approve pending user registrations</p>
                </div>

                <div
                    className="admin-card"
                    onClick={() => navigate("/admin/facilities")}
                >
                    <h3>Facility Management</h3>
                    <p>Manage clinics and hospitals</p>
                </div>

                <div
                    className="admin-card"
                    onClick={() => navigate("/admin/reports")}
                >
                    <h3>Reports & Analytics</h3>
                    <p>View system usage and health metrics</p>
                </div>

                <div
                    className="admin-card"
                    onClick={() => navigate("/admin/settings")}
                >
                    <h3>Settings</h3>
                    <p>Configure roles, permissions, and preferences</p>
                </div>
            </div>
        </div>
    );
}

export default AdminHomePage;
