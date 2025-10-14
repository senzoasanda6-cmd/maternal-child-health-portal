import React from "react";

const BreastfeedingVideoResource = () => {
    return (
        <>
            <div className="container py-5">
                <h2>Breastfeeding Tips</h2>
                <p className="text-muted">Category: Nutrition</p>

                <p>
                    Breastfeeding provides essential nutrients and bonding for
                    newborns. This video offers practical tips for positioning,
                    latching, and maintaining milk supply.
                </p>

                <div
                    className="ratio ratio-16x9 mb-4 rounded-xl overflow-hidden"
                    style={{
                        margin: "0 auto",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        borderRadius: "18px",
                    }}
                >
                    <iframe
                        src="/breastfeeding-tips.mp4"
                        title="Breastfeeding Tips"
                        allowFullScreen
                    ></iframe>
                </div>

                <p>
                    For more guidance, explore our{" "}
                    <a href="/resources/nutrition">
                        Nutrition During Pregnancy
                    </a>{" "}
                    article.
                </p>
            </div>
        </>
    );
};

export default BreastfeedingVideoResource;
