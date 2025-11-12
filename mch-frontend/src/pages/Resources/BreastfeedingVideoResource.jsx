import React, { useState } from "react";
import "./BreastfeedingVideoResource.css";

const BreastfeedingVideoResource = () => {
    const [showYouTube, setShowYouTube] = useState(true);

    const handleToggleVideo = () => {
        setShowYouTube(!showYouTube);
    };

    return (
        <div className="container py-5">
            <h2>Breastfeeding Tips</h2>
            <p className="text-muted">Category: Nutrition</p>

            <p>
                Breastfeeding provides essential nutrients and bonding for
                newborns. This video offers practical tips for positioning,
                latching, and maintaining milk supply.
            </p>

            {/* Toggle Button */}
            <button
                onClick={handleToggleVideo}
                className="btn btn-primary mb-3"
            >
                {showYouTube ? "Show Local Video" : "Show YouTube Video"}
            </button>

            {/* Animated Video Container */}
            <div
                key={showYouTube ? "youtube" : "local"}
                className="video-container fade-in"
            >
                {showYouTube ? (
                    <iframe
                        src="https://www.youtube.com/embed/S5RijIXcHlk"
                        title="Breastfeeding Tips from YouTube"
                        allowFullScreen
                    ></iframe>
                    
                ) : (
                    <video
                        src="/breastfeeding-tips.mp4"
                        controls
                        aria-label="Breastfeeding Tips Local Video"
                    ></video>
                )}
            </div>

            <p>
                For more guidance, explore our{" "}
                <a href="/resources/nutrition">Nutrition During Pregnancy</a>{" "}
                article.
            </p>
        </div>
    );
};

export default BreastfeedingVideoResource;
                           
