import React, { useState } from "react";
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
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import { FaHome, FaUser, FaUsers } from "react-icons/fa";

import "./_components.css";

const Sidebar = ({ user }) => {
    const [isOpen, setIsOpen] = useState(true);
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
                label: "Home",
                path: "/admin/home",
                icon: <FaHome />,
            },
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
            { label: "Approvals", path: "/admin/approvals", icon: <FaUserPlus /> },
            { label: "Profile", path: "/profile", icon: <FaUser /> },
        ],
    };

    const links = routesByRole[role] || [
        { label: "Home", path: "/" },
        { label: "Profile", path: "/profile" },
    ];

    const getLinkClass = ({ isActive }) =>
        `sidebar-link text-truncate ${isOpen ? "text-start" : "text-center"} ${isActive ? "active-link" : ""}`;

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <aside
            className={`sidebar shadow ${isOpen ? "expanded" : "collapsed"}`}
        // onMouseEnter={() => !isOpen && setIsOpen(true)}
        // onMouseLeave={() => !isOpen && setIsOpen(false)}
        >
            <div className="d-flex align-items-center mb-3z bg-white sticky-top border-bottom" style={{ padding: "20px" }}>
                {isOpen && <div className="col-md-10">
                    <h2 className="sidebar-title">Navigation</h2>
                </div>}
                <div className="col-md d-flex justify-content-end">
                    {/* toggle sidebar */}
                    <button className="button bg-custom-color-primary p-2 flex-fill text-white custom-color-primary" onMouseDown={toggleSidebar}>
                        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
                    </button>
                </div>
            </div>
            <div style={{ padding: "10px 20px 20px 20px" }}>
                {/* <hr className="mt-0" /> */}
                <ul>
                    {links.map((link) => (
                        <li key={link.path}>
                            <NavLink to={link.path} className={getLinkClass}>
                                {link.icon && (
                                    <span>{link.icon}</span>
                                )}
                                {isOpen && (<span className="ms-2">{link.label}</span>)}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <hr />
                <div className={`pb-0 ${isOpen ? "" : "rotate-pos-90"}`}>
                    <p className="m-0 text-custom-color-primary" style={{ fontSize: "12px" }}>
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
            </div>

        </aside>
    );
};

export default Sidebar;
