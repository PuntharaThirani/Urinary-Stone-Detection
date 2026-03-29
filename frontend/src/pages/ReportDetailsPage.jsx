import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const reportMap = {
  'R-001': {
    id: 'R-001',
    patientName: 'Nimal Perera',
    patientId: 'PT-1001',
    date: 'Mar 20, 2026',
    scanType: 'KUB X-Ray',
    finalResult: 'Stone Detected',
    resultClass: 'bg-red-100 text-red-700',
    doctorReview: 'Confirmed by Doctor',
    doctorReviewClass: 'bg-emerald-100 text-emerald-700',
    doctorName: 'Dr. Silva',
    doctorAdvice:
      'A urinary stone has been identified. Please maintain adequate hydration and schedule a consultation for further clinical evaluation.',
    followUp:
      'Follow up with your doctor within 2 weeks and bring this finalized report during the visit.',
    summary:
      'The uploaded KUB X-ray was reviewed and a urinary stone finding was confirmed by the doctor.',
  },
  'R-002': {
    id: 'R-002',
    patientName: 'Nimal Perera',
    patientId: 'PT-1001',
    date: 'Feb 28, 2026',
    scanType: 'KUB X-Ray',
    finalResult: 'Pending Review',
    resultClass: 'bg-amber-100 text-amber-700',
    doctorReview: 'Awaiting Doctor Review',
    doctorReviewClass: 'bg-amber-100 text-amber-700',
    doctorName: 'Not yet assigned',
    doctorAdvice: 'This report is still under review and final advice is not available yet.',
    followUp:
      'Please wait until the report is reviewed and confirmed by the responsible doctor.',
    summary:
      'The uploaded KUB X-ray has been processed, but the final interpretation is still pending doctor review.',
  },
  'R-003': {
    id: 'R-003',
    patientName: 'Nimal Perera',
    patientId: 'PT-1001',
    date: 'Jan 15, 2026',
    scanType: 'KUB X-Ray',
    finalResult: 'No Stone Detected',
    resultClass: 'bg-emerald-100 text-emerald-700',
    doctorReview: 'Confirmed by Doctor',
    doctorReviewClass: 'bg-emerald-100 text-emerald-700',
    doctorName: 'Dr. Silva',
    doctorAdvice:
      'No urinary stone was identified in this X-ray. Continue regular follow-up if symptoms persist.',
    followUp:
      'Seek medical advice if pain, urinary symptoms, or discomfort continue.',
    summary:
      'The doctor reviewed the KUB X-ray and did not identify a urinary stone in the final report.',
  },
};

const ReportDetailsPage = () => {
  const { id } = useParams();
  const report = reportMap[id];

  if (!report) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
        <Header />
        <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-5 py-12">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
              ⚠️
            </div>
            <h1 className="text-3xl font-black text-slate-900">Report Not Found</h1>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              The requested report could not be found. Please return to your reports page.
            </p>
            <Link
              to="/my-reports"
              className="mt-6 inline-flex rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Back to My Reports
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">
        {/* Top */}
        <section className="mb-8">
          <Link
            to="/my-reports"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Back to My Reports
          </Link>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Final Report
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                Report {report.id}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Patient: {report.patientName} • Patient ID: {report.patientId}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span
                className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${report.resultClass}`}
              >
                {report.finalResult}
              </span>
              <span
                className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${report.doctorReviewClass}`}
              >
                {report.doctorReview}
              </span>
            </div>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Report Date
            </p>
            <h3 className="mt-3 text-xl font-bold text-slate-900">{report.date}</h3>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Scan Type
            </p>
            <h3 className="mt-3 text-xl font-bold text-slate-900">{report.scanType}</h3>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Reviewed By
            </p>
            <h3 className="mt-3 text-xl font-bold text-slate-900">{report.doctorName}</h3>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Final Result
            </p>
            <h3 className="mt-3 text-xl font-bold text-slate-900">{report.finalResult}</h3>
          </div>
        </section>

        {/* Main Sections */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Report Summary</h2>
            <div className="rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="text-sm leading-7 text-slate-700">{report.summary}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Doctor Advice</h2>
            <div className="rounded-2xl border-l-4 border-orange-500 bg-orange-50 p-4">
              <p className="text-sm leading-7 text-slate-700">{report.doctorAdvice}</p>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Follow-Up / Next Step</h2>
          <div className="rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">
            <p className="text-sm leading-7 text-slate-700">{report.followUp}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
              Download Final Report
            </button>

            <Link
              to="/patient-dashboard"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Return to Dashboard
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Medical Disclaimer</h2>
          <p className="text-sm leading-7 text-slate-600">
            This report should be reviewed together with your doctor’s guidance.
            For urgent symptoms, treatment decisions, or worsening pain, please contact a qualified medical professional directly.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReportDetailsPage;