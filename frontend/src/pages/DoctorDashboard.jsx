import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const metrics = [
  {
    label: 'Total Scans Today',
    value: '24',
    badgeText: 'Updated today',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    label: 'Detected Cases',
    value: '7',
    badgeText: 'Requires review',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  {
    label: 'Pending Reviews',
    value: '3',
    badgeText: 'Action needed',
    badgeClass: 'bg-red-100 text-red-700',
  },
];

const recentActivity = [
  {
    id: '#PT-88231',
    datetime: 'Mar 20, 09:42 AM',
    scanType: 'CT KUB',
    status: 'Stone Detected',
    statusClass: 'bg-red-100 text-red-700',
    action: 'View Report',
    actionLink: '/reports',
  },
  {
    id: '#PT-88230',
    datetime: 'Mar 20, 09:15 AM',
    scanType: 'Ultrasound',
    status: 'No Stone Indicated',
    statusClass: 'bg-emerald-100 text-emerald-700',
    action: 'View Report',
    actionLink: '/reports',
  },
  {
    id: '#PT-88229',
    datetime: 'Mar 20, 08:50 AM',
    scanType: 'X-Ray',
    status: 'Processing',
    statusClass: 'bg-blue-100 text-blue-700',
    action: 'Wait...',
    actionLink: null,
  },
];

const DoctorDashboard = () => {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 md:px-8 lg:px-10">
        {/* Top Section */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Doctor Dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
              Review scan activity, access AI-assisted analysis tools, and monitor recent patient records.
            </p>
          </div>

          <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            📅 {today}
          </div>
        </section>

        {/* Quick Actions */}
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
                <h2 className="text-xl font-bold text-slate-900">
                  New AI Analysis
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Upload a new X-ray or CT scan and start the urinary stone detection workflow.
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
                <h2 className="text-xl font-bold text-slate-900">
                  View Patient Reports
                </h2>
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

        {/* Metrics */}
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
              <span
                className={`mt-4 inline-block rounded-full px-4 py-2 text-xs font-bold ${metric.badgeClass}`}
              >
                {metric.badgeText}
              </span>
            </div>
          ))}
        </section>

        {/* Recent Activity */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Activity
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest scan and report-related actions
              </p>
            </div>

            <Link
              to="/reports"
              className="text-sm font-semibold text-indigo-700 hover:underline"
            >
              View all reports →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Patient ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Scan Type
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Result Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentActivity.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.datetime}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.scanType}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${item.statusClass}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.actionLink ? (
                        <Link
                          to={item.actionLink}
                          className="inline-block rounded-full border border-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                        >
                          {item.action}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-slate-400">
                          {item.action}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;