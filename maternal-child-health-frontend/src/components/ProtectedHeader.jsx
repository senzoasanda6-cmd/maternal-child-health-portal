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

    return (
        <header className="header">
            <Link to="/" className="navbar-brand d-flex align-items-center">
                <img
                    src="/gdoh.jpeg"
                    alt="health"
                    className="rounded-4 shadow-sm"
                    style={{ height: "80px", marginRight: "10px" }}
                />
                <p
                    className="mb-0 "
                    style={{
                        fontSize: "18px",
                        color: "#1d4189",
                        fontWeight: "600",
                    }}
                >
                    Maternal Child Health Portal
                </p>
                {/* <img src="/gdoh.jpeg" alt="health" style={{ height:'50px', width:'100px'}} /> */}
            </Link>
            <h1>Maternal Child Health Portal</h1>
            <nav className="nav">
                <span>
                    {userName} ({role === "mother" ? "👩‍🍼" : role})
                </span>

                <button onClick={onLogout} className="logout-button">
                    Logout
                </button>
            </nav>
        </header>
    );
};

export default Header;
