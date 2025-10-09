import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const MotherRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status" />
      </div>
    );
  }

  if (!user || user.role !== "mother") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default MotherRoute;
