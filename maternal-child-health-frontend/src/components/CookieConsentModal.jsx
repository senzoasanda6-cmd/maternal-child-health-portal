import React, { useState, useEffect } from "react";
import Nav from "./nav";

const CookieConsentModal = () => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) setShowModal(true);
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "true");
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <>
            <Nav />
            <div
                className="position-fixed bottom-0 start-0 end-0 bg-light border-top shadow-lg p-3"
                style={{ zIndex: 9999 }}
            >
                <div className="container d-flex justify-content-between align-items-center">
                    <p className="mb-0">
                        We use cookies to improve your experience. By using our
                        site, you accept our{" "}
                        <a href="/cookie-policy">Cookie Policy</a>.
                    </p>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleAccept}
                    >
                        Accept
                    </button>
                </div>
            </div>
        </>
    );
};

export default CookieConsentModal;
