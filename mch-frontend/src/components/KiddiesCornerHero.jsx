import React from "react";
import KiddiesCornerNavGrid from "./KiddiesCornerNavGrid.jsx";
import KiddiesCornerFooter from "./KiddiesCornerFooter.jsx";

const KiddiesCornerHero = ({ onSelectTab }) => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center p-4 rounded-4z shadow-smz mb-4z">
            <div className="row">
                <div className="col-md-4">
                    <img
                        src="kiddies_corner/mascot_inga_avatar_hello.png"
                        className="img-fluid rounded-4"
                        alt="Inga the Friendly Giraffe"
                        style={{
                            objectFit: "contain",
                            objectPosition: "top center",
                        }}
                    />
                    <div>
                        <p className="text-center mt-3" style={{ fontFamily: "Baloo, sans-serif", fontSize: "1.1rem" }}>
                            Meet Inga, our friendly giraffe! She's here to guide you through fun activities, stories, and learning adventures. 🦒✨
                        </p>
                    </div>
                </div>
                <div className="col-md-8 d-grid">
                    <h1
                        className="display-5 fw-bold text-center"
                        style={{
                            backgroundImage:
                                "linear-gradient(45deg, #FF6B6B, #FFD166, #06D6A0, #118AB2, #073B4C)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontFamily: "Comic Neue, cursive", // Bubbly font
                        }}
                    >
                        Kids Activities
                    </h1>
                    <p
                        className="lead mt-2 text-center"
                        style={{ fontFamily: "Baloo, sans-serif" }}
                    >
                        Fun & Learning for Little Ones!
                    </p>
                    <KiddiesCornerNavGrid onSelectTab={onSelectTab} />
                    <KiddiesCornerFooter />
                </div>
            </div>
        </div>
    );
};

export default KiddiesCornerHero;
