import React from 'react';

function Games() {
    return (
        <div className="container mt-5" style={{
            background: "linear-gradient(135deg, #C8E6C9 0%, #E8F5E8 100%)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
        }}>
            <h2 className="fw-bold text-center" style={{ fontFamily: "Comic Neue, cursive", color: "#1B5E20" }}>Games</h2>
            <p className="text-center" style={{ fontFamily: "Baloo, sans-serif", color: "#2E7D32" }}>Play exciting games and puzzles! 🧩🎮</p>
            {/* Placeholder for future content */}
        </div>
    );
}

export default Games;
