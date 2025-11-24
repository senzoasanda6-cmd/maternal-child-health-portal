import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./_components.css";
import mch_logo from "../assets/logos/mch_ai_v1_logo.png";

const Header = ({ user = {}, onLogout }) => {
    const navigate = useNavigate();

    const userName = user.name || "Jane Doe";
    const role = user.role || "Mother";

    const getProfileImage = (role) => {
        switch (role?.toLowerCase()) {
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

    async function handleLogout() {
        try {
            await api.post("/logout");
        } catch (e) {
            console.warn("Logout failed, clearing local session anyway.");
        }

        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        navigate("/login");
    }

    return (
        <header className="header gap-4">
            <Link to="/" className="navbar-brand d-flex align-items-center">
                <div className="d-flex align-items-center bg-white overflow-hidden rounded-3 pe-2 me-2 shadow">
                    <img
                        src="/gdoh.jpeg"
                        alt="gdoh logo"
                        className="navbar-brand"
                        style={{ height: "60px" }}
                    />
                    <img
                        src={mch_logo}
                        alt="mch logo"
                        className="navbar-brand py-2"
                        style={{ width: "auto", height: "60px" }}
                    />
                </div>
                <p
                    className="mb-0 text-truncate"
                    style={{
                        fontSize: "12px",
                        color: "#fff",
                        fontWeight: "600",
                        paddingBottom: "2px",
                    }}
                >
                    <span className="text-custom-color-accent">
                        Gauteng Health
                    </span>{" "}
                    <br />
                    Maternal Child <br /> Health Portal
                </p>
            </Link>

            <nav className="nav justify-content-end align-items-center gap-3 rounded-4 p-3 shadow profile-tag">
                <div className="d-flex justify-content-end align-items-center gap-2">
                    <p
                        className="mb-0 text-center"
                        style={{ lineHeight: "1.1" }}
                    >
                        <span
                            className="text-end"
                            style={{ fontSize: "14px", fontWeight: "600" }}
                        >
                            {userName}
                        </span>
                        <br />
                        <span
                            className="text-custom-color-secondary"
                            style={{ fontSize: "10px", fontWeight: "400" }}
                        >
                            {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
                            Profile
                        </span>
                    </p>

                    <img
                        src={getProfileImage(role)}
                        alt={`${userName}'s profile`}
                        className="shadow"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            backgroundColor: "#fff",
                            padding: "3px",
                        }}
                    />
                </div>

                <span className="d-none d-lg-block">|</span>

                <button
                    onClick={onLogout || handleLogout}
                    className="logout-button fw-bold"
                >
                    Logout
                </button>
            </nav>
        </header>
    );
};

export default Header;
