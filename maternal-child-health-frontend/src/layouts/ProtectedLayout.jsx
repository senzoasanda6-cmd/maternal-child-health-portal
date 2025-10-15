import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/ProtectedHeader.jsx";
import Sidebar from "../components/AppSidebar.jsx";
import CookieConsentModal from "../components/CookieConsentModal";

const ProtectedLayout = () => {
    const context = useContext(AuthContext);

    if (!context) {
        return <div className="text-danger">Auth context not available</div>;
    }

    const { user, loading } = context;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div style={{ maxHeight: "100vh" }}>
            <Navbar user={user} />
            <main>
                <CookieConsentModal />
                <div style={{ display: "flex" }}>
                    <Sidebar user={user} />
                    <div className="page-view">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProtectedLayout;
