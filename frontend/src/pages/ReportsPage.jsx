import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ReportCard from '../components/results/ReportCard';
import DoctorReportReview from '../components/results/DoctorReportReview';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.getAllReports();

      let reportData = [];

      if (Array.isArray(response)) {
        reportData = response;
      } else if (Array.isArray(response?.reports)) {
        reportData = response.reports;
      } else if (Array.isArray(response?.data?.reports)) {
        reportData = response.data.reports;
      } else if (Array.isArray(response?.data)) {
        reportData = response.data;
      }

      setReports(reportData);
    } catch (err) {
      console.error('Failed to load reports', err);
      setError('Failed to load patient reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  const handleVerifiedSuccess = (updatedReport) => {
    setSelectedReport(null);

    setReports((prevReports) =>
      prevReports.map((report) =>
        report._id === updatedReport._id ? updatedReport : report
      )
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">
        {!selectedReport ? (
          <>
            {/* Page Header */}
            <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Report Management
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  All Patient Reports
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                  Review generated patient reports, inspect previous findings, and
                  confirm pending AI-generated reports before they are shown to patients.
                </p>
              </div>

              <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                📋 {reports.length} Report{reports.length !== 1 ? 's' : ''}
              </div>
            </section>

            {/* Error State */}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                ⚠️ {error}
              </div>
            )}

            {/* Content */}
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <LoadingSpinner />
                  <p className="text-sm font-medium text-slate-500">
                    Loading patient reports...
                  </p>
                </div>
              </div>
            ) : reports.length > 0 ? (
              <div className="grid gap-6">
                {reports.map((report) => (
                  <ReportCard
                    key={report._id}
                    report={report}
                    onClick={() => setSelectedReport(report)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                  📄
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  No Reports Available
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500 md:text-base">
                  There are currently no saved patient reports in the database.
                  Once scan analysis and report generation are completed, records will appear here.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Back button */}
            <div className="mb-6">
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                ← Back to Reports
              </button>
            </div>

            {/* Doctor Review Panel */}
            <DoctorReportReview
              report={selectedReport}
              onVerifiedSuccess={handleVerifiedSuccess}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ReportsPage;