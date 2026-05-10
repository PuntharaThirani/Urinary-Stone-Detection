import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import Home          from './pages/Home';
import Features      from './pages/Features';
import HowItWorks    from './pages/HowItWorks';
import About         from './pages/About';

// Auth
import LoginForm      from './components/auth/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin     from './components/auth/AdminLoginForm.jsx';

// Dashboards
import DoctorDashboard  from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import StaffDashboard   from './pages/StaffDashboard';
import AdminDashboard   from './pages/AdminDashboard';

// Doctor Pages
import AnalyzeXrayPage    from './pages/AnalyzeXrayPage';
import ResultsPage        from './pages/ResultsPage';
import ReportsPage        from './pages/ReportsPage';
import PatientsPage       from './pages/PatientsPage';
import PatientProfilePage from './pages/PatientProfilePage';

// Patient Pages
import MyReportsPage     from './pages/MyReportsPage';
import ReportDetailsPage from './pages/ReportDetailsPage';

// Staff Pages
import StaffPatientsPage from './pages/StaffPatientsPage';
import AppointmentsPage  from './pages/AppointmentsPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        {/* ─── Public Routes ─── */}
        <Route path="/"             element={<Home />} />
        <Route path="/features"     element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about"        element={<About />} />
        <Route path="/login"        element={<LoginForm />} />
        <Route path="/admin-login"  element={<AdminLogin />} />

        {/* ─── Doctor Routes ─── */}
        <Route path="/doctor-dashboard"
          element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>}
        />
        <Route path="/analyze"
          element={<ProtectedRoute role="doctor"><AnalyzeXrayPage /></ProtectedRoute>}
        />
        <Route path="/reports"
          element={<ProtectedRoute role="doctor"><ReportsPage /></ProtectedRoute>}
        />
        <Route path="/patients"
          element={<ProtectedRoute role="doctor"><PatientsPage /></ProtectedRoute>}
        />
        <Route path="/patients/:id"
          element={<ProtectedRoute role="doctor"><PatientProfilePage /></ProtectedRoute>}
        />
        <Route path="/report-details/:id"
          element={<ProtectedRoute role="doctor"><ReportDetailsPage /></ProtectedRoute>}
        />

        {/* ─── Patient Routes ─── */}
        <Route path="/patient-dashboard"
          element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>}
        />
        <Route path="/my-reports"
          element={<ProtectedRoute role="patient"><MyReportsPage /></ProtectedRoute>}
        />
        <Route path="/report/:id"
          element={<ProtectedRoute role="patient"><ReportDetailsPage /></ProtectedRoute>}
        />

        {/* ─── Staff Routes ─── */}
        <Route path="/staff-dashboard"
          element={<ProtectedRoute role="staff"><StaffDashboard /></ProtectedRoute>}
        />
        <Route path="/staff-patients"
          element={<ProtectedRoute role="staff"><StaffPatientsPage /></ProtectedRoute>}
        />
        <Route path="/appointments"
          element={<ProtectedRoute role="staff"><AppointmentsPage /></ProtectedRoute>}
        />

        {/* ─── Admin Routes ─── */}
        {/* ✅ /admin-dashboard — consistent with all other routes */}
        <Route path="/admin-dashboard"
          element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
        />

        {/* ─── Shared Routes ─── */}
        <Route path="/results"
          element={<ProtectedRoute><ResultsPage /></ProtectedRoute>}
        />

        {/* ─── 404 ─── */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
              <h1 className="text-6xl font-black text-slate-800">404</h1>
              <p className="text-slate-500 mt-2 mb-6">Page not found</p>
              <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                Go Home
              </a>
            </div>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;