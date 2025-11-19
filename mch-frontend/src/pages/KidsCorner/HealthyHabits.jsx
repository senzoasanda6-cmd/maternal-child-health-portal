import React from 'react';

function HealthyHabits() {
    return (
        <div className="container mt-5" style={{
            background: "linear-gradient(135deg, #B2DFDB 0%, #E0F2F1 100%)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
        }}>
            <h2 className="fw-bold text-center" style={{ fontFamily: "Comic Neue, cursive", color: "#004D40" }}>Healthy Habits</h2>
            <p className="text-center" style={{ fontFamily: "Baloo, sans-serif", color: "#00695C" }}>Learn about brushing your teeth, eating fruits, and staying active! 🍎🦷</p>
            {/* Placeholder for future content */}
        </div>
    );
}

export default HealthyHabits;
