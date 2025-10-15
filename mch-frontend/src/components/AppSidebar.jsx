import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaUserPlus,
    FaHospital,
    FaChartBar,
    FaTachometerAlt,
    FaCalendarAlt,
    FaBaby,
    FaCapsules,
    FaBookMedical,
} from "react-icons/fa";
import { FaHome, FaUser, FaUsers } from "react-icons/fa";

import "./_components.css";

const Sidebar = ({ user }) => {
    const role = user?.role?.toLowerCase() || "guest";

    const sharedLinks = [
        { label: "Appointments", path: "/calendar", icon: <FaCalendarAlt /> },
        { label: "Postnatal Care", path: "/postnatal-care", icon: <FaBaby /> },
        {
            label: "Pregnancy Stages",
            path: "/pregnancy-stages",
            icon: <FaBaby />,
        },
        {
            label: "Safe Medicines",
            path: "/safe-medicines",
            icon: <FaCapsules />,
        },
        {
            label: "Health Education",
            path: "/health-education",
            icon: <FaBookMedical />,
        },
    ];

    const routesByRole = {
        mother: [
            { label: "Home", path: "/mother/home", icon: <FaHome /> },
            {
                label: "Dashboard",
                path: "/mother/dashboard",
                icon: <FaTachometerAlt />,
            },
            {
                label: "My Profile",
                path: "/mother/mom-profile",
                icon: <FaUser />,
            },
            {
                label: "My Children",
                path: "/mother/children",
                icon: <FaUsers />,
            },
            ...sharedLinks,
        ],
        health_worker: [
            {
                label: "Dashboard",
                path: "/health/dashboard",
                icon: <FaTachometerAlt />,
            },
            {
                label: "My Patients",
                path: "/health/patients",
                icon: <FaUsers />,
            },
            ...sharedLinks,
        ],
        admin: [
            {
                label: "Admin Dashboard",
                path: "/admin/dashboard",
                icon: <FaTachometerAlt />,
            },
            {
                label: "Create Health Worker",
                path: "/admin/users",
                icon: <FaUserPlus />,
            },
            {
                label: "Hospitals",
                path: "/admin/hospitals",
                icon: <FaHospital />,
            },
            { label: "Reports", path: "/admin/reports", icon: <FaChartBar /> },
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
                            {link.icon && (
                                <span className="me-2">{link.icon}</span>
                            )}
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
