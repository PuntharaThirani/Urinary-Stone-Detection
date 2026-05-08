import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token    = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // ===============================
  // Token නැත්නම් Login වලට
  // ===============================
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ===============================
  // Wrong Role — Dashboard වලට Redirect
  // ===============================
  if (role && userRole !== role) {
    if (userRole === 'doctor')  return <Navigate to="/doctor-dashboard"  replace />;
    if (userRole === 'patient') return <Navigate to="/patient-dashboard" replace />;
    if (userRole === 'staff')   return <Navigate to="/staff-dashboard"   replace />;
    if (userRole === 'admin')   return <Navigate to="/admin"             replace />; // ✅ NEW
    return <Navigate to="/login" replace />;
  }

  // ===============================
  // OK — Page Render කරනවා
  // ===============================
  return children;
};

export default ProtectedRoute;