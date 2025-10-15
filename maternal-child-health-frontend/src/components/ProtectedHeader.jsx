import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./_components.css";

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const userName = user.name || "Jane Doe";
    const role = user.role || "Mother";

    function onLogout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
    }

    const getProfileImage = (role) => {
        switch (role.toLowerCase()) {
            case "mother":
                return "/icons/mother-avatar.png";
            case "health worker":
                return "/icons/health-worker-avatar.png";
            case "admin":
                return "/icons/admin-avatar.png";
            default:
                return "/icons/default-avatar.png";
        }
    };

    const profileImageUrl = getProfileImage(role);

    return (
        <header className="header">
            <Link to="/" className="navbar-brand d-flex align-items-center">
                <img
                    src="/gdoh.jpeg"
                    alt="health"
                    className="rounded-4 shadow"
                    style={{ height: "60px", marginRight: "10px" }}
                />
                <p
                    className="mb-0 text-truncate"
                    style={{
                        fontSize: "12px",
                        color: "#fff",
                        fontWeight: "600",
                    }}
                >
                    Maternal Child Health Portal
                </p>
            </Link>
            <nav className="nav justify-content-end align-items-center gap-3">
                <div className="d-flex justify-content-end align-items-center gap-2">
                    <span className="text-end" style={{fontSize: "12px"}}>{userName}</span>
                    <img
                        src={profileImageUrl}
                        alt={`${userName}'s profile`}
                        className="shadow"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "fit",
                            backgroundColor: "#fff",
                            padding: "3px",
                        }}
                    />
                </div>
                <span className="d-none d-lg-block">|</span>
                <button onClick={onLogout} className="logout-button fw-bold">
                    Logout
                </button>
            </nav>
        </header>
    );
};

export default Header;
