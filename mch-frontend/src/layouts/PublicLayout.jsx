import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/PublicHeader.jsx";
import Footer from "../components/PublicFooter.jsx";
import CookieConsentModal from "../components/CookieConsentModal";

const PublicLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <CookieConsentModal />
            <Navbar />
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
