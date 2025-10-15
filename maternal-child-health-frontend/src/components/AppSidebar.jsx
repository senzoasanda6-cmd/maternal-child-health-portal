import React from "react";
import { NavLink } from "react-router-dom";
import "./_components.css";

const Sidebar = ({ user }) => {
    const role = user?.role?.toLowerCase() || "guest";

    const sharedLinks = [
        { label: "Appointments", path: "/calendar" },
        { label: "Postnatal Care", path: "/postnatal-care" },
        { label: "Pregnancy Stages", path: "/pregnancy-stages" },
        { label: "Safe Medicines", path: "/safe-medicines" },
        { label: "Health Education", path: "/health-education" }, // still role-specific
    ];

    const routesByRole = {
        mother: [
            { label: "Home", path: "/mother/home" },
            { label: "Dashboard", path: "/mother/dashboard" },
            { label: "My Profile", path: "/mother/mom-profile" },
            { label: "My Children", path: "/mother/children" },
            ...sharedLinks,
        ],
        health_worker: [
            { label: "Dashboard", path: "/health/dashboard" },
            { label: "My Patients", path: "/health/patients" },
            ...sharedLinks,
        ],
        admin: [
            { label: "Admin Dashboard", path: "/admin/dashboard" },
            { label: "Create Health Worker", path: "/admin/users" },
            { label: "Hospitals", path: "/admin/hospitals" },
            { label: "Reports", path: "/admin/reports" },
        ],
    };

    const links = routesByRole[role] || [
        { label: "Home", path: "/" },
        { label: "Profile", path: "/profile" },
    ];

    const getLinkClass = ({ isActive }) =>
        `sidebar-link ${isActive ? "active-link" : ""}`;

    return (
        <aside className="sidebar shadow">
            <h2>Navigation</h2>
            <hr />
            <ul>
                {links.map((link) => (
                    <li key={link.path}>
                        <NavLink to={link.path} className={getLinkClass}>
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <hr />
            <div className="pb-2">
                <p style={{ fontSize: "12px", color: "#666" }}>
                    &copy; {new Date().getFullYear()} Maternal Child Health
                    Portal.{" "}
                    <a
                        href="mailto:senzo.dubazana@gauteng.gov.za"
                        className="text-primary"
                    >
                        Need help?
                    </a>
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;
