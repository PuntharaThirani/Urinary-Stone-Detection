import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';

// Auth
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboard Pages
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import StaffDashboard from './pages/StaffDashboard';

// Feature Pages
import AnalyzeXrayPage from './pages/AnalyzeXrayPage';
import ResultsPage from './pages/ResultsPage';
import ReportsPage from './pages/ReportsPage';
import PatientsPage from './pages/PatientsPage';
import PatientProfilePage from './pages/PatientProfilePage';
import MyReportsPage from './pages/MyReportsPage';
import ReportDetailsPage from './pages/ReportDetailsPage';
import StaffPatientsPage from './pages/StaffPatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginForm />} />

        {/* Doctor Routes */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyze"
          element={
            <ProtectedRoute role="doctor">
              <AnalyzeXrayPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute role="doctor">
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute role="doctor">
              <PatientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute role="doctor">
              <PatientProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Patient Routes */}
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reports"
          element={
            <ProtectedRoute role="patient">
              <MyReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/report/:id"
  element={
    <ProtectedRoute role="patient">
      <ReportDetailsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/staff-dashboard"
  element={
    <ProtectedRoute role="staff">
      <StaffDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/staff-patients"
  element={
    <ProtectedRoute role="staff">
      <StaffPatientsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/appointments"
  element={
    <ProtectedRoute role="staff">
      <AppointmentsPage />
    </ProtectedRoute>
  }
/>

        {/* Shared */}
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;