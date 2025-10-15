import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem('role');

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}


