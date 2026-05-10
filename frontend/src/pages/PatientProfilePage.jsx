import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api    from '../services/api';

const PatientProfilePage = () => {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetchPatient();
    fetchReports();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const res = await api.get(`/patients/${id}`);
      setPatient(res.data.data || res.data);
    } catch (err) {
      setError('Failed to load patient profile.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await api.get(`/reports/patient/${id}`);
      setReports(res.data.reports || []);
    } catch (err) {
      console.error('Failed to fetch patient reports:', err);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
      <Footer />
    </div>
  );

  if (error || !patient) return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-5 py-12">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">Patient Not Found</h1>
          <p className="mt-3 text-sm text-slate-500">{error}</p>
          <Link
            to="/patients"
            className="mt-6 inline-flex rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Back to Patients
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">

        {/*  Header */}
        <section className="mb-6">
          <Link to="/patients" className="text-sm font-semibold text-blue-600 hover:underline">
            ← Back to Patients
          </Link>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Patient Profile
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                {patient.fullName}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Patient ID: {patient.patientId || 'N/A'}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-3">

          {/*  Patient Details  */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Patient Details</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Age:</span> {patient.age || 'N/A'}</p>
              <p><span className="font-semibold text-slate-900">Gender:</span> {patient.gender || 'N/A'}</p>
              <p><span className="font-semibold text-slate-900">Blood Group:</span> {patient.bloodGroup || 'N/A'}</p>
              <p><span className="font-semibold text-slate-900">Contact:</span> {patient.contactNumber || 'N/A'}</p>
              {patient.address && (
                <p><span className="font-semibold text-slate-900">Address:</span> {patient.address}</p>
              )}
              {patient.emergencyContact && (
                <p><span className="font-semibold text-slate-900">Emergency:</span> {patient.emergencyContact}</p>
              )}
              {patient.medicalNotes && (
                <p><span className="font-semibold text-slate-900">Notes:</span> {patient.medicalNotes}</p>
              )}
            </div>
          </div>

          {/*  Quick Actions  */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                to="/analyze"
                className="rounded-2xl border border-blue-200 bg-blue-50 p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-900">New Analysis</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Upload a new X-ray for AI-assisted urinary stone detection.
                </p>
              </Link>

              <Link
                to="/reports"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-900">View All Reports</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Open the complete report history for all patients.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/*  Report History  */}
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">Report History</h2>
            <p className="mt-1 text-sm text-slate-500">
              Previous reports and scan records ({reports.length})
            </p>
          </div>

          {reports.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-3xl">📋</p>
              <p className="mt-2 text-sm">No reports found for this patient</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {['Report ID', 'Date', 'Result', 'Status', 'Action'].map((h) => (
                      <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
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
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                        {report.status}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/report-details/${report._id}`}
                          className="inline-block rounded-full border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          View
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

export default PatientProfilePage;