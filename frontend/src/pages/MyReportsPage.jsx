import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const myReports = [
  {
    id: 'R-001',
    date: 'Mar 20, 2026',
    scanType: 'KUB X-Ray',
    finalResult: 'Stone Detected',
    statusClass: 'bg-red-100 text-red-700',
    doctorReviewed: true,
    advice:
      'A stone has been identified in the urinary tract. Please consult your doctor for further clinical evaluation and treatment options.',
  },
  {
    id: 'R-002',
    date: 'Feb 28, 2026',
    scanType: 'KUB X-Ray',
    finalResult: 'Pending Review',
    statusClass: 'bg-amber-100 text-amber-700',
    doctorReviewed: false,
    advice: 'Awaiting doctor confirmation.',
  },
  {
    id: 'R-003',
    date: 'Jan 15, 2026',
    scanType: 'KUB X-Ray',
    finalResult: 'No Stone Detected',
    statusClass: 'bg-emerald-100 text-emerald-700',
    doctorReviewed: true,
    advice:
      'No urinary stones were detected in this X-ray. Continue regular monitoring if necessary.',
  },
];

const MyReportsPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">
        {/* Header */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Patient Reports
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              My Reports
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              View your doctor-reviewed reports, final results, and follow-up advice.
            </p>
          </div>

          <Link
            to="/patient-dashboard"
            className="inline-flex w-fit rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            ← Back to Dashboard
          </Link>
        </section>

        {/* Report Cards */}
        <section className="grid gap-6">
          {myReports.map((report) => (
            <div
              key={report.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Report {report.id}
                  </h2>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-900">Date:</span>{' '}
                      {report.date}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Scan Type:</span>{' '}
                      {report.scanType}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Doctor Review:</span>{' '}
                      {report.doctorReviewed ? 'Confirmed' : 'Pending'}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${report.statusClass}`}
                >
                  {report.finalResult}
                </span>
              </div>

              <div className="mt-5 rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">
                <p className="text-sm font-bold text-blue-800">Doctor Advice</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {report.advice}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                  Download Report
                </button>

                <Link
  to={`/report/${report.id}`}
  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
>
  View Details
</Link>
              </div>
            </div>
          ))}
        </section>

        {/* Disclaimer */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            Medical Disclaimer
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            These reports should be reviewed together with your doctor’s advice.
            For urgent symptoms or treatment decisions, please contact a qualified
            medical professional directly.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyReportsPage;