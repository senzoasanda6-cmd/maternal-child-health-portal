import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const HealthWorkerRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "health_worker") return <Navigate to="/unauthorized" />;

  return children;
};

export default HealthWorkerRoute;
