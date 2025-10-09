import React from "react";
import Header from "../components/Header";
import CookieConsentModal from "../components/layout/CookieConsentModal";

const Layout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header /> {/* Always at the top */}
            <CookieConsentModal />
            <main className="flex-grow-1 container py-4">{children}</main>
            <footer className="bg-dark text-white py-4 mt-auto">
                <div className="container text-center">
                    <p>
                        &copy; {new Date().getFullYear()} PostnatalCare+. All
                        rights reserved.
                    </p>
                    <div>
                        <a href="/privacy" className="text-white me-3">
                            Privacy Policy
                        </a>
                        <a href="/terms" className="text-white">
                            Terms of Use
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
