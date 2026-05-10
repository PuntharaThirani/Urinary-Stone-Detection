import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const token    = localStorage.getItem('token');
  const role     = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  // Logout — clear storage and redirect
  const handleLogout = () => {
    localStorage.clear();
    setMenuOpen(false);
    navigate('/');
  };

  // Active link styling
  const isActive = (path) => location.pathname === path;
  const linkClasses = (path) =>
    `border-b-2 pb-1 text-sm font-medium transition md:text-base ${
      isActive(path)
        ? 'border-yellow-300 text-yellow-300'
        : 'border-transparent text-white hover:text-blue-100'
    }`;

  return (
    <nav className="flex items-center">

      {/*  Desktop Menu  */}
      <ul className="hidden items-center gap-4 md:flex md:gap-7">

        {/* Public Links — not logged in */}
        {!token && (
          <>
            <li><Link to="/"            className={linkClasses('/')}>Home</Link></li>
            <li><Link to="/about"       className={linkClasses('/about')}>About</Link></li>
            <li><Link to="/features"    className={linkClasses('/features')}>Features</Link></li>
            <li><Link to="/how-it-works" className={linkClasses('/how-it-works')}>How It Works</Link></li>
          </>
        )}

        {/* Doctor Links */}
        {token && role === 'doctor' && (
          <>
            <li><Link to="/doctor-dashboard" className={linkClasses('/doctor-dashboard')}>Dashboard</Link></li>
            <li><Link to="/analyze"          className={linkClasses('/analyze')}>Analyze</Link></li>
            <li><Link to="/reports"          className={linkClasses('/reports')}>Reports</Link></li>
            <li><Link to="/patients"         className={linkClasses('/patients')}>Patients</Link></li>
          </>
        )}

        {/* Patient Links */}
        {token && role === 'patient' && (
          <>
            <li><Link to="/patient-dashboard" className={linkClasses('/patient-dashboard')}>Dashboard</Link></li>
            <li><Link to="/my-reports"        className={linkClasses('/my-reports')}>My Reports</Link></li>
          </>
        )}

        {/* Staff Links */}
        {token && role === 'staff' && (
          <>
            <li><Link to="/staff-dashboard" className={linkClasses('/staff-dashboard')}>Dashboard</Link></li>
            <li><Link to="/staff-patients"  className={linkClasses('/staff-patients')}>Patients</Link></li>
            <li><Link to="/appointments"    className={linkClasses('/appointments')}>Appointments</Link></li>
          </>
        )}

        {/* Admin Links */}
        {token && role === 'admin' && (
          <>
            <li><Link to="/admin" className={linkClasses('/admin')}>Dashboard</Link></li>
          </>
        )}

        {/* Login / Register — not logged in */}
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

        {/* User name + Logout */}
        {token && (
          <>
            {userName && (
              <li className="text-sm text-blue-100 font-medium">
                👤 {userName}
              </li>
            )}
            <li>
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      {/*  Mobile Menu Button  */}
      <button
        className="flex md:hidden flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/*  Mobile Dropdown  */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-[75px] z-50 border-t border-blue-500/30 bg-blue-700 px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-4 text-white text-sm font-medium">

            {!token && (
              <>
                <li><Link to="/"             onClick={() => setMenuOpen(false)}>Home</Link></li>
                <li><Link to="/about"        onClick={() => setMenuOpen(false)}>About</Link></li>
                <li><Link to="/features"     onClick={() => setMenuOpen(false)}>Features</Link></li>
                <li><Link to="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link></li>
                <li><Link to="/login"        onClick={() => setMenuOpen(false)}>Login</Link></li>
                <li><Link to="/login?mode=register" onClick={() => setMenuOpen(false)}>Register</Link></li>
              </>
            )}

            {token && role === 'doctor' && (
              <>
                <li><Link to="/doctor-dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
                <li><Link to="/analyze"          onClick={() => setMenuOpen(false)}>Analyze</Link></li>
                <li><Link to="/reports"          onClick={() => setMenuOpen(false)}>Reports</Link></li>
                <li><Link to="/patients"         onClick={() => setMenuOpen(false)}>Patients</Link></li>
              </>
            )}

            {token && role === 'patient' && (
              <>
                <li><Link to="/patient-dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
                <li><Link to="/my-reports"        onClick={() => setMenuOpen(false)}>My Reports</Link></li>
              </>
            )}

            {token && role === 'staff' && (
              <>
                <li><Link to="/staff-dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
                <li><Link to="/staff-patients"  onClick={() => setMenuOpen(false)}>Patients</Link></li>
                <li><Link to="/appointments"    onClick={() => setMenuOpen(false)}>Appointments</Link></li>
              </>
            )}

            {token && role === 'admin' && (
              <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link></li>
            )}

            {token && (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-full bg-red-500 py-2 text-center font-semibold"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;