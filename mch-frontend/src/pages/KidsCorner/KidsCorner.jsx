import React, { useRef, useEffect, useState } from "react";
import KiddiesCornerHero from "../../components/KiddiesCornerHero.jsx";

import HealthyHabits from "./HealthyHabits.jsx";
import ColoringBook from "./ColoringBook.jsx";
import QuizTime from "./QuizTime.jsx";
import Storytime from "./Storytime.jsx";
import Games from "./Games.jsx";
import EmotionalWellness from "./EmotionalWellness.jsx";
import "../../Main.css";

// Custom hook for observing intersection
const useIntersectionObserver = (options) => {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target); // Animate only once
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return ref;
};

function KidsCorner() {
    const kiddiesCornerRef = useIntersectionObserver({ threshold: 0.1 });
    const [activeTab, setActiveTab] = useState("Healthy Habits"); // Default to first tab

    const renderTabContent = () => {
        switch (activeTab) {
            case "Healthy Habits":
                return <HealthyHabits />;
            case "Coloring Book":
                return <ColoringBook />;
            case "Quiz Time":
                return <QuizTime />;
            case "Storytime":
                return <Storytime />;
            case "Games":
                return <Games />;
            case "Emotional Wellness":
                return <EmotionalWellness />;
            default:
                return (
                    <div>
                        <h4>Welcome</h4>
                        <p>Select a tab to explore!</p>
                    </div>
                );
        }
    };

    return (
        <div
            className="kids-corner-bg"
            style={{
                backgroundColor: "rgba(255, 223, 186, 0.7)", // Peach pastel overlay
                backgroundImage: 'url("kiddies_corner/background_1.png")', // Full image
                backgroundSize: "cover", // Ensures the whole image is visible
                backgroundRepeat: "no-repeat", // Prevents tiling
                backgroundPosition: "center", // Centers the image
                backgroundAttachment: "fixed", // Fixes the background image during scroll
                minHeight: "400px", // Increase height for better visibility
            }}
        >
            <div className="bg-white p-4">
                <h2 className="text-center m-0 p-0 border-0" style={{color:'#1d4189'}}>
                    Welcome to the{" "}
                    <span
                        style={{
                            backgroundImage:
                                "linear-gradient(45deg, #FF6B6B, #FFD166, #06D6A0, #118AB2, #073B4C)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontFamily: "Comic Neue, cursive", // Bubbly font
                        }}
                    >
                        Kiddies Corner
                    </span>{" "}
                    🎨
                </h2>
            </div>
            {/* Kiddies Corner Section */}
            <section
                ref={kiddiesCornerRef}
                id="kiddies-corner"
                className="section fade-in-section"
                style={{
                    background: "rgba(255,255,255,0.8)", // Semi-transparent white background for readability
                }}
            >
                <div className="container">
                    <div className="p-4 rounded-4 shadow bg-white">
                        <KiddiesCornerHero onSelectTab={setActiveTab} />
                        <div className="mt-4">{renderTabContent()}</div>
                        
                    </div>
                </div>
            </section>
        </div>
    );
}

export default KidsCorner;
