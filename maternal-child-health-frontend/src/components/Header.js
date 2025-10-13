import React from "react";
import "./styles.css"; // Assuming you have some CSS for styling

const Header = ({ userName = "Jane Doe", role = "Mother", onLogout }) => {
    return (
        <header className="header">
            <h1>Maternal Child Health Portal</h1>
            <nav className="nav">
                <span>
                    {userName} ({role === "Mother" ? "👩‍🍼" : role})
                </span>

                <button onClick={onLogout} className="logout-button">
                    Logout
                </button>
            </nav>
        </header>
    );
};

export default Header;
