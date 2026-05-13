import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';

const PatientDashboard = () => {
  const storedName = localStorage.getItem('userName') || 'Patient';

  const [reports, setReports] = useState([]);
  const [latestReport, setLatestReport] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const patientName = patientProfile?.fullName || patientProfile?.name || storedName;

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);

    try {
      await Promise.all([fetchReports(), fetchPatientProfile()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports/my/final');
      const data = res.data.reports || [];

      setReports(data);
      setLatestReport(data[0] || null);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setReports([]);
      setLatestReport(null);
    }
  };

  const fetchPatientProfile = async () => {
    try {
      const res = await api.get('/patients/my-profile');
      setPatientProfile(res.data.patient || null);
    } catch (err) {
      console.error('Patient profile not found:', err);
      setPatientProfile(null);
    }
  };

  const handleDownload = (report) => {
    if (!report) return;

    const content = `
UROSCAN AI - PATIENT REPORT
============================
Report ID   : ${report._id}
Patient     : ${report.patientName || patientName}
Patient ID  : ${patientProfile?.patientId || 'N/A'}
Date        : ${new Date(report.createdAt).toLocaleDateString()}
Doctor      : ${report.doctor?.name || 'N/A'}
Doctor ID   : ${report.doctor?.doctorId || 'N/A'}

RESULT: ${report.hasStones ? 'Stone Detected' : 'No Stone Detected'}

FINAL DIAGNOSIS: ${report.finalDiagnosis || 'N/A'}
DOCTOR ADVICE  : ${report.doctorAdvice || 'N/A'}
FOLLOW-UP      : ${report.followUp || 'N/A'}

============================
Always consult your doctor.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `UroScan-${report._id?.substring(0, 8)}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const totalReports = reports.length;
  const confirmedCount = reports.filter((r) => r.status === 'confirmed').length;
  const stoneDetectedCount = reports.filter((r) => r.hasStones).length;
  const clearCount = reports.filter((r) => !r.hasStones).length;

  const summaryCards = [
    {
      label: 'Total Reports',
      value: loading ? '...' : totalReports,
      badgeText: 'All records',
      badgeClass: 'bg-slate-100 text-slate-700',
    },
    {
      label: 'Stone Detected',
      value: loading ? '...' : stoneDetectedCount,
      badgeText: 'Requires attention',
      badgeClass: 'bg-red-100 text-red-700',
    },
    {
      label: 'Clear Reports',
      value: loading ? '...' : clearCount,
      badgeText: 'No stones',
      badgeClass: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Confirmed',
      value: loading ? '...' : confirmedCount,
      badgeText: 'Doctor reviewed',
      badgeClass: 'bg-blue-100 text-blue-700',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 md:px-8 lg:px-10">
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Patient Portal
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Welcome, {patientName}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
              View your reports, doctor advice, and follow-up instructions.
            </p>

            {patientProfile?.patientId && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
                Patient ID: {patientProfile.patientId}
              </div>
            )}

            {patientProfile && (
              <div className="mt-3 flex flex-wrap gap-3">
                {patientProfile.email && (
                  <span className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    Email: {patientProfile.email}
                  </span>
                )}

                {patientProfile.age > 0 && (
                  <span className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    Age: {patientProfile.age}
                  </span>
                )}

                {patientProfile.gender && (
                  <span className="rounded-full border bg-white px-3 py-1 text-xs font-medium capitalize text-slate-600">
                    {patientProfile.gender}
                  </span>
                )}

                {patientProfile.bloodGroup && (
                  <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                    Blood Group: {patientProfile.bloodGroup}
                  </span>
                )}

                {patientProfile.contactNumber && (
                  <span className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    Contact: {patientProfile.contactNumber}
                  </span>
                )}
              </div>
            )}

            {!loading && !patientProfile && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Your patient profile has not been set up yet. Please contact hospital staff
                to register your Patient ID, email, and personal details.
              </div>
            )}
          </div>

          <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            {today}
          </div>
        </section>

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
                  Open your doctor-confirmed scan reports.
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
                    'No advice yet. Wait for your doctor to confirm your report.'}
                </p>

                {latestReport?.followUp && (
                  <span className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    Follow-up recommended
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                {card.label}
              </p>

              <h3 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                {card.value}
              </h3>

              <span
                className={`mt-4 inline-block rounded-full px-4 py-2 text-xs font-bold ${card.badgeClass}`}
              >
                {card.badgeText}
              </span>
            </div>
          ))}
        </section>

        {latestReport && (
          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Latest Report</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Most recent confirmed report
                </p>
              </div>

              <span className="inline-block rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
                Doctor Confirmed
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: 'Report ID',
                  value: `#${latestReport._id?.substring(0, 8)}`,
                },
                {
                  label: 'Date',
                  value: new Date(latestReport.createdAt).toLocaleDateString(),
                },
                {
                  label: 'Doctor',
                  value: latestReport.doctor?.name || 'N/A',
                },
                {
                  label: 'Result',
                  value: latestReport.hasStones ? 'Stone' : 'Clear',
                  className: latestReport.hasStones
                    ? 'text-red-700'
                    : 'text-emerald-700',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    {item.label}
                  </p>
                  <p className={`mt-2 text-lg font-bold ${item.className || 'text-slate-900'}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {latestReport.doctorAdvice && (
              <div className="mt-4 rounded-2xl border-l-4 border-orange-500 bg-orange-50 p-4">
                <p className="text-sm font-bold text-orange-800">Doctor Advice</p>
                <p className="mt-1 text-sm text-slate-600">
                  {latestReport.doctorAdvice}
                </p>
              </div>
            )}

            {latestReport.followUp && (
              <div className="mt-3 rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">
                <p className="text-sm font-bold text-blue-800">Follow-Up Plan</p>
                <p className="mt-1 text-sm text-slate-600">
                  {latestReport.followUp}
                </p>
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => handleDownload(latestReport)}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Download Report
              </button>

              <Link
                to="/my-reports"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                View All Reports
              </Link>
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            Medical Disclaimer
          </h2>

          <p className="text-sm leading-7 text-slate-600">
            Information shown here should be reviewed with your doctor. For urgent
            symptoms, contact a qualified medical professional immediately. UroScan AI
            is a decision support tool only.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PatientDashboard;
