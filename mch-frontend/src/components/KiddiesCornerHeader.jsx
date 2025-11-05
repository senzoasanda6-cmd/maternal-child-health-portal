import React from "react";

const KiddiesCornerHeader = () => {
    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center p-4 rounded-4 shadow-sm mb-4"
            style={{
                backgroundColor: "rgba(255, 223, 186, 0.7)", // Peach pastel overlay
                backgroundImage: 'url("giraffe_clouds_stars.png")', // Full image
                backgroundSize: "contain", // Ensures the whole image is visible
                backgroundRepeat: "no-repeat", // Prevents tiling
                backgroundPosition: "center", // Centers the image
                minHeight: "400px", // Increase height for better visibility
                color: "#333",
            }}
        >
            <h1
                className="display-5 fw-bold"
                style={{
                    backgroundImage:
                        "linear-gradient(45deg, #FF6B6B, #FFD166, #06D6A0, #118AB2, #073B4C)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "Comic Neue, cursive", // Bubbly font
                }}
            >
                Kiddies Corner
            </h1>
            <p
                className="lead mt-2"
                style={{ fontFamily: "Baloo, sans-serif" }}
            >
                Fun & Learning for Little Ones!
            </p>
        </div>
    );
};

export default KiddiesCornerHeader;
