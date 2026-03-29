import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const patientMap = {
  'PT-1001': {
    id: 'PT-1001',
    name: 'Nimal Perera',
    age: 46,
    gender: 'Male',
    bloodGroup: 'O+',
    contact: '+94 71 234 5678',
    latestStatus: 'Stone Indicated',
    latestStatusClass: 'bg-red-100 text-red-700',
    reports: [
      { id: 'R-001', date: 'Mar 20, 2026', scanType: 'CT KUB', result: 'Stone Indicated' },
      { id: 'R-002', date: 'Feb 28, 2026', scanType: 'X-Ray', result: 'Pending Review' },
    ],
  },
  'PT-1002': {
    id: 'PT-1002',
    name: 'Kavindi Silva',
    age: 32,
    gender: 'Female',
    bloodGroup: 'A+',
    contact: '+94 77 345 6789',
    latestStatus: 'No Stone Indicated',
    latestStatusClass: 'bg-emerald-100 text-emerald-700',
    reports: [
      { id: 'R-003', date: 'Mar 18, 2026', scanType: 'Ultrasound', result: 'No Stone Indicated' },
    ],
  },
  'PT-1003': {
    id: 'PT-1003',
    name: 'Amal Fernando',
    age: 51,
    gender: 'Male',
    bloodGroup: 'B+',
    contact: '+94 70 456 7890',
    latestStatus: 'Pending Review',
    latestStatusClass: 'bg-amber-100 text-amber-700',
    reports: [
      { id: 'R-004', date: 'Mar 17, 2026', scanType: 'X-Ray', result: 'Pending Review' },
    ],
  },
};

const PatientProfilePage = () => {
  const { id } = useParams();
  const patient = patientMap[id];

  if (!patient) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
        <Header />
        <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-5 py-12">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-black text-slate-900">Patient Not Found</h1>
            <Link to="/patients" className="mt-6 inline-flex rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">
              Back to Patients
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
                {patient.name}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Patient ID: {patient.id}
              </p>
            </div>

            <span className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${patient.latestStatusClass}`}>
              {patient.latestStatus}
            </span>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Patient Details</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Age:</span> {patient.age}</p>
              <p><span className="font-semibold text-slate-900">Gender:</span> {patient.gender}</p>
              <p><span className="font-semibold text-slate-900">Blood Group:</span> {patient.bloodGroup}</p>
              <p><span className="font-semibold text-slate-900">Contact:</span> {patient.contact}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                to="/analyze"
                className="rounded-2xl border border-blue-200 bg-blue-50 p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-900">New Analysis</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Upload a new scan for AI-assisted urinary stone detection.
                </p>
              </Link>

              <Link
                to="/reports"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-900">View Reports</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Open the report history related to this patient.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">Report History</h2>
            <p className="mt-1 text-sm text-slate-500">Previous reports and scan records</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Report ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Scan Type</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Result</th>
                </tr>
              </thead>
              <tbody>
                {patient.reports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{report.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{report.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{report.scanType}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{report.result}</td>
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

export default PatientProfilePage;