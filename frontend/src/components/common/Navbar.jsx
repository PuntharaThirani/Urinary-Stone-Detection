import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) =>
    `border-b-2 pb-1 text-sm font-medium transition md:text-base ${
      isActive(path)
        ? 'border-yellow-300 text-yellow-300'
        : 'border-transparent text-white hover:text-blue-100'
    }`;

  return (
    <nav className="flex items-center">
      <ul className="flex items-center gap-4 md:gap-7">
        {/* Public Links */}
        {!token && (
          <>
            <li>
              <Link to="/" className={linkClasses('/')}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={linkClasses('/about')}>
                About
              </Link>
            </li>
            <li>
              <Link to="/features" className={linkClasses('/features')}>
                Features
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className={linkClasses('/how-it-works')}>
                How It Works
              </Link>
            </li>
          </>
        )}

        {/* Doctor Links */}
        {token && role === 'doctor' && (
          <>
            <li>
              <Link to="/doctor-dashboard" className={linkClasses('/doctor-dashboard')}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/analyze" className={linkClasses('/analyze')}>
                Analyze
              </Link>
            </li>
            <li>
              <Link to="/reports" className={linkClasses('/reports')}>
                Reports
              </Link>
            </li>
            <li>
              <Link to="/patients" className={linkClasses('/patients')}>
                Patients
              </Link>
            </li>
          </>
        )}

        {/* Patient Links */}
        {token && role === 'patient' && (
          <>
            <li>
              <Link to="/patient-dashboard" className={linkClasses('/patient-dashboard')}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/my-reports" className={linkClasses('/my-reports')}>
                My Reports
              </Link>
            </li>
          </>
        )}

        {/* Staff Links */}
        {token && role === 'staff' && (
          <>
            <li>
              <Link to="/staff-dashboard" className={linkClasses('/staff-dashboard')}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/staff-patients" className={linkClasses('/staff-patients')}>
                Patients
              </Link>
            </li>
            <li>
              <Link to="/appointments" className={linkClasses('/appointments')}>
                Appointments
              </Link>
            </li>
          </>
        )}

        {/* Login / Register */}
        {!token && (
          <>
            <li>
              <Link
                to="/login"
                className="rounded-full border-2 border-white px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-blue-600 md:px-5"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/login?mode=register"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-blue-600 shadow-md transition hover:bg-blue-50"
              >
                Register
              </Link>
            </li>
          </>
        )}

        {/* Logout */}
        {token && (
          <li>
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;