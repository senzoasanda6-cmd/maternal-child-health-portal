import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaHospital, FaChartBar, FaUserNurse, FaUserCheck, FaCog } from "react-icons/fa";

const DistrictHome = () => {
    return (
        <div className="container py-4">
            <h2 className="mb-3">Welcome, District Administrator</h2>
            <p className="text-muted mb-4">
                Use the tools below to manage facilities, staff, and health data across your district.
            </p>

            <div className="row g-4">
                <DashboardCard
                    title="Dashboard"
                    icon={<FaTachometerAlt />}
                    description="View district-wide health stats and performance metrics."
                    to="/district/dashboard"
                />
                <DashboardCard
                    title="Facilities"
                    icon={<FaHospital />}
                    description="Browse and manage all facilities in your district."
                    to="/district/facilities"
                />
                <DashboardCard
                    title="Reports"
                    icon={<FaChartBar />}
                    description="Access visit summaries, risk trends, and vaccination coverage."
                    to="/district/reports"
                />
                <DashboardCard
                    title="Health Workers"
                    icon={<FaUserNurse />}
                    description="View and manage health worker accounts by facility."
                    to="/district/users"
                />
                <DashboardCard
                    title="Approvals"
                    icon={<FaUserCheck />}
                    description="Review and approve pending account requests."
                    to="/district/approvals"
                />
                <DashboardCard
                    title="Settings"
                    icon={<FaCog />}
                    description="Update district info and notification preferences."
                    to="/district/settings"
                />
            </div>
        </div>
    );
};

const DashboardCard = ({ title, icon, description, to }) => (
    <div className="col-md-4">
        <Link to={to} className="text-decoration-none text-dark">
            <div className="card h-100 shadow-sm hover-shadow">
                <div className="card-body text-center">
                    <div className="mb-3 fs-2 text-primary">{icon}</div>
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text small">{description}</p>
                </div>
            </div>
        </Link>
    </div>
);

export default DistrictHome;
