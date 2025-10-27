import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Main.css";

function AdminHomePage() {
    const navigate = useNavigate();

    return (
        <div className="admin-home p-4">
            <div className="admin-hero card mb-4 text-center">
                <h1 className="text-custom-color-primary fw-bold">Admin Portal</h1>
                <p className="lead">Welcome to the Maternal & Child Health Admin Dashboard</p>
                <div className="d-flex justify-content-center gap-3 mt-3">
                    <button className="button button-primary button-fw-medium" onClick={() => navigate('/admin/dashboard')}>Go to Dashboard</button>
                    <button className="button button-outline button-fw-medium" onClick={() => navigate('/admin/users')}>Manage Users</button>
                </div>
            </div>

            <div className="admin-grid">
                <div className="admin-card admin-card-accent" onClick={() => navigate("/admin/users")}>
                    <h3>User Monitoring</h3>
                    <p>Track user activity and engagement</p>
                </div>

                <div className="admin-card admin-card-accent" onClick={() => navigate("/admin/approvals")}>
                    <h3>Registration Approvals</h3>
                    <p>Review and approve pending user registrations</p>
                </div>

                <div className="admin-card admin-card-accent" onClick={() => navigate("/admin/facilities")}>
                    <h3>Facility Management</h3>
                    <p>Manage clinics and hospitals</p>
                </div>

                <div className="admin-card admin-card-accent" onClick={() => navigate("/admin/reports")}>
                    <h3>Reports & Analytics</h3>
                    <p>View system usage and health metrics</p>
                </div>

                <div className="admin-card admin-card-accent" onClick={() => navigate("/admin/settings")}>
                    <h3>Settings</h3>
                    <p>Configure roles, permissions, and preferences</p>
                </div>
            </div>
        </div>
    );
}

export default AdminHomePage;
