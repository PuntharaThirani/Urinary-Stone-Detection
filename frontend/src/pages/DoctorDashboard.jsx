import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';

const DoctorDashboard = () => {

  const navigate = useNavigate();

  const authData =
    JSON.parse(localStorage.getItem('auth')) || {};

  const doctor =
    authData.user || {};

  const doctorName =
    doctor.name || 'Doctor';

  const doctorId =
    doctor.doctorId || 'N/A';

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports/my');
      setReports(res.data.reports || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics from real data
  const totalScans = reports.length;
  const stonesDetected = reports.filter((r) => r.hasStones).length;
  const pendingReviews = reports.filter((r) => r.status === 'pending').length;

  const metrics = [
    {
      label: 'Total Scans',
      value: loading ? '...' : totalScans,
      badgeText: 'All time',
      badgeClass: 'bg-blue-100 text-blue-700',
    },
    {
      label:'Stones Detected',
      value: loading ? '...' : stonesDetected,
      badgeText: 'Requires review',
      badgeClass: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Pending Reviews',
      value: loading ? '...' : pendingReviews,
      badgeText: pendingReviews > 0 ? 'Action needed' : 'All clear',
      badgeClass: pendingReviews > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 md:px-8 lg:px-10">

        {/*  Top Section  */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Welcome back, {doctorName} 👋
            </h1>
              <div className="mt-3 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
            🩺 {doctorName} • {doctorId}
          </div>
            <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
              Review scan activity, access AI-assisted analysis tools, and monitor recent patient records.
            </p>
          </div>
          <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            📅 {today}
          </div>
        </section>

        {/*  Quick Actions  */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <Link
            to="/analyze"
            className="group rounded-3xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-3xl text-white shadow-lg">
                📤
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">New AI Analysis</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Upload a new X-ray and start the urinary stone detection workflow.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-indigo-700 transition group-hover:translate-x-1">
                  Start analysis →
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/reports"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-3xl">
                📋
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">View Patient Reports</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Access report history, previous scan results, and patient-related records.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-indigo-700 transition group-hover:translate-x-1">
                  Open reports →
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/*  Metrics  */}
        <section className="mb-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                {metric.label}
              </p>
              <h3 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                {metric.value}
              </h3>
              <span className={`mt-4 inline-block rounded-full px-4 py-2 text-xs font-bold ${metric.badgeClass}`}>
                {metric.badgeText}
              </span>
            </div>
          ))}
        </section>

        {/*  Recent Activity  */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
              <p className="mt-1 text-sm text-slate-500">Latest scan and report actions</p>
            </div>
            <Link to="/reports" className="text-sm font-semibold text-indigo-700 hover:underline">
              View all reports →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="text-4xl">📋</p>
              <p className="mt-3 text-sm font-medium">No reports yet. Start a new analysis!</p>
              <Link
                to="/analyze"
                className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700"
              >
                Start Analysis
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {['Patient', 'Date', 'Scan Type', 'Result', 'Action'].map((h) => (
                      <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reports.slice(0, 5).map((report) => (
                    <tr key={report._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {report.patientName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        KUB X-Ray
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${
                          report.hasStones
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {report.hasStones ? '⚠️ Stone Detected' : '✅ No Stone'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/report-details/${report._id}`}
                          className="inline-block rounded-full border border-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                        >
                          View Report
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;