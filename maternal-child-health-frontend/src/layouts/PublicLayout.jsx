import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/PublicHeader.jsx";
import Footer from "../components/PublicFooter.jsx";
import CookieConsentModal from "../components/CookieConsentModal";

const PublicLayout = () => {
    return (
        <main>
            <CookieConsentModal />
            <Navbar />
            <Outlet />
            <Footer />
        </main>
    );
};

export default PublicLayout;
