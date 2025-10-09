import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import Layout from "./Layout"; // Import your full layout

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
    <Layout>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: "20px" }}>
          <Outlet />
        </main>
      </div>
    </Layout>
  );
};

export default ProtectedLayout;
