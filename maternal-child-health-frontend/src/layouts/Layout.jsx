import React from "react";
import Header from "../components/Header";
import CookieConsentModal from "../components/CookieConsentModal";

const Layout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header /> {/* Always at the top */}
            <CookieConsentModal />
            <main className="flex-grow-1 container py-4">{children}</main>
            
        </div>
    );
};

export default Layout;
