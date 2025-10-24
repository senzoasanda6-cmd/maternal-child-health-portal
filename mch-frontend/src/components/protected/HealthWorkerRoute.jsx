import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

import AppPageLoading from "../spinners/AppPageLoading";

const HealthWorkerRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <AppPageLoading />;
        
        /* (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status" />
            </div>
        ); */
    }

    if (!user || user.role !== "health_worker") {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default HealthWorkerRoute;
