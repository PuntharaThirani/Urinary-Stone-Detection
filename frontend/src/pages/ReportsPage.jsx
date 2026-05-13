import React, { useEffect, useMemo, useState } from 'react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/reports/my');

      const reportData =
        response.data?.reports ||
        response.data?.data ||
        [];

      setReports(reportData);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Failed to load your patient reports. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const handleVerifiedSuccess = (updatedReport) => {
    setSelectedReport(updatedReport);

    setReports((prevReports) =>
      prevReports.map((report) =>
        report._id === updatedReport._id ? updatedReport : report
      )
    );
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        report?.patientName?.toLowerCase().includes(search) ||
        report?._id?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === 'all' ? true : report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter]);

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === 'pending'
  ).length;

  const confirmedReports = reports.filter(
    (report) => report.status === 'confirmed'
  ).length;

  const rejectedReports = reports.filter(
    (report) => report.status === 'rejected'
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">
        {!selectedReport ? (
          <>
            <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Report Management
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  My Patient Reports
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                  Review reports created or assigned to you, inspect findings,
                  and confirm pending reports before patients can view them.
                </p>
              </div>

              <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                {totalReports} Report{totalReports !== 1 ? 's' : ''}
              </div>
            </section>

            <section className="mb-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Reports</p>
                <h2 className="mt-3 text-3xl font-black text-slate-900">
                  {totalReports}
                </h2>
              </div>

              <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
                <p className="text-sm text-yellow-700">Pending Review</p>
                <h2 className="mt-3 text-3xl font-black text-yellow-900">
                  {pendingReports}
                </h2>
              </div>

              <div className="rounded-3xl border border-green-200 bg-green-50 p-5 shadow-sm">
                <p className="text-sm text-green-700">Confirmed Reports</p>
                <h2 className="mt-3 text-3xl font-black text-green-900">
                  {confirmedReports}
                </h2>
              </div>

              <div className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
                <p className="text-sm text-red-700">Rejected Reports</p>
                <h2 className="mt-3 text-3xl font-black text-red-900">
                  {rejectedReports}
                </h2>
              </div>
            </section>

            <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Search Reports
                  </label>

                  <input
                    type="text"
                    placeholder="Search by patient name or report ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Filter by Status
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500"
                  >
                    <option value="all">All Reports</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </section>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <LoadingSpinner />

                  <p className="text-sm font-medium text-slate-500">
                    Loading your patient reports...
                  </p>
                </div>
              </div>
            ) : filteredReports.length > 0 ? (
              <div className="grid gap-6">
                {filteredReports.map((report) => (
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
                  There are currently no matching reports assigned to your account.
                  Once scan analysis and report generation are completed, records
                  will appear here.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Back to Reports
              </button>
            </div>

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
