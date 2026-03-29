import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const summaryCards = [
  {
    label: 'Total Reports',
    value: '4',
    badgeText: 'Demo data',
    badgeClass: 'bg-slate-100 text-slate-700',
  },
  {
    label: 'Review Status',
    value: 'Confirmed',
    badgeText: 'Doctor reviewed',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    label: 'Follow-Up',
    value: '1 Due',
    badgeText: 'Check advice below',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
];

const notifications = [
  {
    id: 1,
    text: 'Your latest report has been reviewed by the doctor.',
    typeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 2,
    text: 'A follow-up consultation is recommended within 2 weeks.',
    typeClass: 'bg-amber-100 text-amber-700',
  },
];

const recentReports = [
  {
    id: 'R-001',
    date: 'Mar 20, 2026',
    scanType: 'KUB X-Ray',
    status: 'Stone Detected',
    statusClass: 'bg-red-100 text-red-700',
    doctorReviewed: true,
  },
  {
    id: 'R-002',
    date: 'Feb 28, 2026',
    scanType: 'KUB X-Ray',
    status: 'Pending Review',
    statusClass: 'bg-amber-100 text-amber-700',
    doctorReviewed: false,
  },
  {
    id: 'R-003',
    date: 'Jan 15, 2026',
    scanType: 'KUB X-Ray',
    status: 'No Stone Detected',
    statusClass: 'bg-emerald-100 text-emerald-700',
    doctorReviewed: true,
  },
];

const latestReport = {
  id: 'R-001',
  date: 'Mar 20, 2026',
  scanType: 'KUB X-Ray',
  finalResult: 'Stone Detected',
  reviewStatus: 'Confirmed by Doctor',
  reviewStatusClass: 'bg-emerald-100 text-emerald-700',
  doctorAdvice:
    'A urinary stone has been identified. Please consult your doctor for proper treatment and follow-up.',
  followUp:
    'Schedule a follow-up consultation within 2 weeks.',
};

const patientProfile = {
  id: 'PT-1001',
  name: 'Nimal Perera',
  age: 46,
  gender: 'Male',
  bloodGroup: 'O+',
  contact: '+94 71 234 5678',
};

const PatientDashboard = () => {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 md:px-8 lg:px-10">
        {/* Header */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Patient Portal
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Patient Dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
              View your final reports, doctor-reviewed results, medical advice, and follow-up instructions.
            </p>
          </div>

          <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            📅 {today}
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-8 space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
            >
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${item.typeClass}`}>
                Notification
              </span>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <Link
            to="/reports"
            className="group rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white shadow-lg">
                📄
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  View My Reports
                </h2>
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
                <h2 className="text-xl font-bold text-slate-900">
                  Latest Advice
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Please follow your doctor’s latest guidance and attend the recommended follow-up consultation.
                </p>
                <span className="mt-4 inline-block rounded-full bg-amber-100 px-4 py-2 text-xs font-bold text-amber-700">
                  Follow-up recommended
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Cards */}
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
              <span
                className={`mt-4 inline-block rounded-full px-4 py-2 text-xs font-bold ${card.badgeClass}`}
              >
                {card.badgeText}
              </span>
            </div>
          ))}
        </section>

        {/* Profile + Latest Report */}
        <section className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Patient Details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Patient Details</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Name:</span> {patientProfile.name}</p>
              <p><span className="font-semibold text-slate-900">Patient ID:</span> {patientProfile.id}</p>
              <p><span className="font-semibold text-slate-900">Age:</span> {patientProfile.age}</p>
              <p><span className="font-semibold text-slate-900">Gender:</span> {patientProfile.gender}</p>
              <p><span className="font-semibold text-slate-900">Blood Group:</span> {patientProfile.bloodGroup}</p>
              <p><span className="font-semibold text-slate-900">Contact:</span> {patientProfile.contact}</p>
            </div>
          </div>

          {/* Latest Report Summary */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Latest Report Summary</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Finalized report details reviewed by the doctor
                </p>
              </div>

              <span className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${latestReport.reviewStatusClass}`}>
                {latestReport.reviewStatus}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Report ID
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">{latestReport.id}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Date
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">{latestReport.date}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Scan Type
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">{latestReport.scanType}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Final Result
                </p>
                <p className="mt-2 text-lg font-bold text-red-700">{latestReport.finalResult}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                Download Final Report
              </button>

              <Link
                to="/my-reports"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                View All Reports
              </Link>
            </div>
          </div>
        </section>

        {/* Advice + Follow-up */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Doctor Advice</h2>
            <div className="rounded-2xl border-l-4 border-orange-500 bg-orange-50 p-4">
              <p className="text-sm leading-7 text-slate-700">
                {latestReport.doctorAdvice}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Follow-Up / Next Step</h2>
            <div className="rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="text-sm leading-7 text-slate-700">
                {latestReport.followUp}
              </p>
            </div>
          </div>
        </section>

        {/* Recent Reports */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Reports
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest report history and scan outcomes
              </p>
            </div>

            <Link
              to="/reports"
              className="text-sm font-semibold text-blue-700 hover:underline"
            >
              View all reports →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Report ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Scan Type
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Result Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Doctor Review
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {report.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {report.scanType}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${report.statusClass}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {report.doctorReviewed ? 'Confirmed' : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Medical Disclaimer</h2>
          <p className="text-sm leading-7 text-slate-600">
            The information shown in this portal should be reviewed together with your doctor’s guidance.
            For urgent symptoms or treatment decisions, please contact a qualified medical professional directly.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PatientDashboard;