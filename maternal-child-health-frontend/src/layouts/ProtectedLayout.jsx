import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/ProtectedHeader.jsx";
import Sidebar from "../components/AppSidebar.jsx";
//import Layout from "./Layout"; // Import your full layout
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
        <>
            <Navbar user={user} />
            <main>
                <CookieConsentModal />
                <div style={{ display: "flex" }}>
                    <Sidebar />
                    <div style={{ flexGrow: 1, padding: "20px" }}>
                        <Outlet />
                    </div>
                </div>
            </main>
        </>
    );
};

export default ProtectedLayout;
