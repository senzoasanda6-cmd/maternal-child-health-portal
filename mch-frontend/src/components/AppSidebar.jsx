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
    FaUserNurse,
    FaUserCheck,
    FaCog,
    FaHome,
    FaUser,
    FaUsers,
} from "react-icons/fa";

import "./_components.css";

const Sidebar = ({ user }) => {
    const [isOpen, setIsOpen] = useState(true);
    const role = user?.role?.toLowerCase() || "guest";

    const sharedLinks = [
        { label: "Appointments", path: "/calendar", icon: <FaCalendarAlt /> },
        { label: "Postnatal Care", path: "/postnatal-care", icon: <FaBaby /> },
        { label: "Pregnancy Stages", path: "/pregnancy-stages", icon: <FaBaby /> },
        { label: "Safe Medicines", path: "/safe-medicines", icon: <FaCapsules /> },
        { label: "Health Education", path: "/health-education", icon: <FaBookMedical /> },
    ];

    const motherRoutes = [
        { label: "Home", path: "/mother/home", icon: <FaHome /> },
        { label: "Dashboard", path: "/mother/dashboard", icon: <FaTachometerAlt /> },
        { label: "My Profile", path: "/mother/mom-profile", icon: <FaUser /> },
        { label: "My Children", path: "/mother/children", icon: <FaUsers /> },
        ...sharedLinks,
    ];

    const healthWorkerRoutes = [
        { label: "Dashboard", path: "/health/dashboard", icon: <FaTachometerAlt /> },
        { label: "My Patients", path: "/health/patients", icon: <FaUsers /> },
        ...sharedLinks,
    ];

    const adminRoutes = [
        { label: "Home", path: "/admin/home", icon: <FaHome /> },
        { label: "Admin Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
        { label: "Facility Reports", path: "/admin/reports", icon: <FaChartBar /> },
        { label: "Facility Management", path: "/admin/facilities", icon: <FaHospital /> },
        { label: "Health Worker Accounts", path: "/admin/users", icon: <FaUserPlus /> },
        { label: "Acc. Request Approvals", path: "/admin/approvals", icon: <FaUserPlus /> },
        { label: "My Profile", path: "/profile", icon: <FaUser /> },
    ];

    const districtAdminRoutes = [
        { label: "Home", path: "/district/home", icon: <FaHome /> },
        { label: "District Dashboard", path: "/district/dashboard", icon: <FaTachometerAlt /> },
        { label: "My Facilities", path: "/district/facilities", icon: <FaHospital /> },
        { label: "Facility Reports", path: "/district/reports", icon: <FaChartBar /> },
        { label: "Health Worker Accounts", path: "/district/users", icon: <FaUserNurse /> },
        { label: "Account Requests", path: "/district/approvals", icon: <FaUserCheck /> },
        { label: "District Settings", path: "/district/settings", icon: <FaCog /> },
        { label: "My Profile", path: "/profile", icon: <FaUser /> },
    ];

    const routesByRole = {
        mother: motherRoutes,
        health_worker: healthWorkerRoutes,
        midwife: healthWorkerRoutes,
        facility_worker: healthWorkerRoutes,
        facility_nurse: healthWorkerRoutes,
        facility_doctor: healthWorkerRoutes,
        admin: adminRoutes,
        hospital_admin: adminRoutes,
        facility_admin: adminRoutes,
        facility_manager: adminRoutes,
        district_admin: districtAdminRoutes,
    };

    const links = routesByRole[role] || [
        { label: "Home", path: "/" },
        { label: "Profile", path: "/profile" },
    ];

    const getLinkClass = ({ isActive }) =>
        `sidebar-link text-truncate ${isOpen ? "text-start" : "text-center"} ${
            isActive ? "active-link" : ""
        }`;

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <aside className={`sidebar shadow ${isOpen ? "expanded" : "collapsed"}`}>
            <div
                className="d-flex justify-content-between align-items-center mb-3z bg-white sticky-top border-bottom"
                style={{ padding: "20px" }}
            >
                {isOpen && (
                    <div className="col-md-10">
                        <h2 className="sidebar-title">Navigation</h2>
                    </div>
                )}
                <div className="col-md d-flex justify-content-end">
                    <button
                        className="button bg-custom-color-primary p-2 flex-fill text-white custom-color-primary d-flex align-items-center justify-content-center"
                        onMouseDown={toggleSidebar}
                    >
                        {/* toggle label (hidden when collapsed, shown on hover or when expanded) */}
                        {!isOpen && (<span className="me-2 toggle-label text-truncate">Navigation</span>)}
                        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
                    </button>
                </div>
            </div>
            <div style={{ padding: "10px 20px 20px 20px" }}>
                <ul>
                    {links.map((link) => (
                        <li key={link.path}>
                            <NavLink to={link.path} className={getLinkClass}>
                                {link.icon && <span className="icon-span">{link.icon}</span>}
                                {/* always render label span so CSS can reveal it on hover when collapsed */}
                                <span className="ms-2 sidebar-label">{link.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <hr />
                <div className={`pb-0 ${isOpen ? "" : "rotate-pos-90"}`}>
                    <p className="m-0 text-custom-color-primary" style={{ fontSize: "12px" }}>
                        &copy; {new Date().getFullYear()} Maternal Child Health Portal.{" "}
                        <a href="mailto:senzo.dubazana@gauteng.gov.za" className="text-primary">
                            Need help?
                        </a>
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
