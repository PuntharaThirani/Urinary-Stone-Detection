import React, { useState, useEffect } from 'react';
import { Link }   from 'react-router-dom';
import Header     from '../components/common/Header';
import Footer     from '../components/common/Footer';
import api        from '../services/api';

const PatientDashboard = () => {
  const patientName = localStorage.getItem('userName') || 'Patient';

  const [reports,       setReports]       = useState([]);
  const [latestReport,  setLatestReport]  = useState(null);
  const [loading,       setLoading]       = useState(true);

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports/my/final');
      const data = res.data.reports || [];
      setReports(data);
      setLatestReport(data[0] || null);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Download report
  const handleDownload = (report) => {
    if (!report) return;
    const content = `
UROSCAN AI — PATIENT REPORT
============================
Report ID   : ${report._id}
Patient     : ${report.patientName || patientName}
Date        : ${new Date(report.createdAt).toLocaleDateString()}
Doctor      : ${report.doctor?.name || 'N/A'}

RESULT: ${report.hasStones ? '⚠️ Stone Detected' : '✅ No Stone Detected'}

FINAL DIAGNOSIS: ${report.finalDiagnosis || 'N/A'}
DOCTOR ADVICE  : ${report.doctorAdvice   || 'N/A'}
FOLLOW-UP      : ${report.followUp       || 'N/A'}

============================
⚠️ Always consult your doctor for medical decisions.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `UroScan-Report-${report._id?.substring(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate metrics
  // Dashboard Metrics

const totalReports =
  reports.length;

const confirmedCount =
  reports.filter(

    (r) =>
      r.status === 'confirmed'

  ).length;

const pendingCount =
  reports.filter(

    (r) =>
      r.status === 'pending'

  ).length;

const stoneDetectedCount =
  reports.filter(

    (r) =>
      r.hasStones === true

  ).length;

const clearReportsCount =
  reports.filter(

    (r) =>
      r.hasStones === false

  ).length;

  
  const summaryCards = [

  {
    label: 'Total Reports',

    value:
      loading ? '...' : totalReports,

    badgeText: 'All records',

    badgeClass:
      'bg-slate-100 text-slate-700',
  },

  {
    label: 'Stone Detected',

    value:
      loading ? '...' : stoneDetectedCount,

    badgeText: 'Requires attention',

    badgeClass:
      'bg-red-100 text-red-700',
  },

  {
    label: 'Clear Reports',

    value:
      loading ? '...' : clearReportsCount,

    badgeText: 'No stones detected',

    badgeClass:
      'bg-emerald-100 text-emerald-700',
  },

  {
    label: 'Pending Review',

    value:
      loading ? '...' : pendingCount,

    badgeText:
      pendingCount > 0
        ? 'Awaiting doctor'
        : 'All reviewed',

    badgeClass:
      pendingCount > 0
        ? 'bg-amber-100 text-amber-700'
        : 'bg-green-100 text-green-700',
  },
];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 md:px-8 lg:px-10">

        {/*  Header  */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Patient Portal
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Welcome, {patientName} 👋
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
              View your final reports, doctor-reviewed results, and follow-up instructions.
            </p>
          </div>
          <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            📅 {today}
          </div>
        </section>

        {/*  Quick Actions  */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <Link
            to="/my-reports"
            className="group rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white shadow-lg">
                📄
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">View My Reports</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Open your previous scan reports and review doctor-confirmed findings.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-blue-700 transition group-hover:translate-x-1">
                  Open reports →
                </span>
              </div>
            </div>
          </Link>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-3xl">
                💡
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Latest Advice</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {latestReport?.doctorAdvice ||
                    'No advice available yet. Please wait for your doctor to confirm your report.'}
                </p>
                {latestReport?.followUp && (
                  <span className="mt-4 inline-block rounded-full bg-amber-100 px-4 py-2 text-xs font-bold text-amber-700">
                    Follow-up recommended
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/*  Summary Cards  */}
        <section className="mb-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                {card.label}
              </p>
              <h3 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                {card.value}
              </h3>
              <span className={`mt-4 inline-block rounded-full px-4 py-2 text-xs font-bold ${card.badgeClass}`}>
                {card.badgeText}
              </span>
            </div>
          ))}
        </section>

        {/*  Latest Report  */}
        {latestReport && (
          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Latest Report Summary</h2>
                <p className="mt-1 text-sm text-slate-500">Most recent doctor-confirmed report</p>
              </div>
              <span className="inline-block rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
                ✅ Doctor Confirmed
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Report ID',    value: `#${latestReport._id?.substring(0, 8)}` },
                { label: 'Date',         value: new Date(latestReport.createdAt).toLocaleDateString() },
                { label: 'Scan Type',    value: 'KUB X-Ray' },
                {
                  label: 'Result',
                  value: latestReport.hasStones ? '⚠️ Stone' : '✅ Clear',
                  className: latestReport.hasStones ? 'text-red-700' : 'text-emerald-700',
                },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    {item.label}
                  </p>
                  <p className={`mt-2 text-lg font-bold ${item.className || 'text-slate-900'}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => handleDownload(latestReport)}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                ⬇️ Download Report
              </button>
              <Link
                to="/my-reports"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                View All Reports
              </Link>
            </div>
          </section>
        )}

        {/*  Doctor Advice + Follow-up  */}
        {latestReport && (
          <section className="mb-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Doctor Advice</h2>
              <div className="rounded-2xl border-l-4 border-orange-500 bg-orange-50 p-4">
                <p className="text-sm leading-7 text-slate-700">
                  {latestReport.doctorAdvice || 'No specific advice provided yet.'}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Follow-Up Plan</h2>
              <div className="rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">
                <p className="text-sm leading-7 text-slate-700">
                  {latestReport.followUp || 'No follow-up instructions provided yet.'}
                </p>
              </div>
            </div>
          </section>
        )}

        {/*  Recent Reports Table  */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent Reports</h2>
              <p className="mt-1 text-sm text-slate-500">Your latest scan outcomes</p>
            </div>
            <Link to="/my-reports" className="text-sm font-semibold text-blue-700 hover:underline">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : reports.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-3xl">📋</p>
              <p className="mt-2 text-sm">No reports available yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {['Report ID', 'Date', 'Result', 'Doctor', 'Status'].map((h) => (
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
                        #{report._id?.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${
                          report.hasStones
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {report.hasStones ? '⚠️ Stone' : '✅ Clear'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {report.doctor?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                        {report.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/*  Disclaimer  */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Medical Disclaimer</h2>
          <p className="text-sm leading-7 text-slate-600">
            The information shown in this portal should be reviewed together with your
            doctor's guidance. For urgent symptoms or treatment decisions, please contact
            a qualified medical professional directly. UroScan AI is a decision support
            tool only.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PatientDashboard;