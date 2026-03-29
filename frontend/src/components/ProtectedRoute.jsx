import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    if (userRole === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
    if (userRole === 'patient') return <Navigate to="/patient-dashboard" replace />;
    if (userRole === 'staff') return <Navigate to="/staff-dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;