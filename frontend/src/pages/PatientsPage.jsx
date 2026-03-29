import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const patients = [
  {
    id: 'PT-1001',
    name: 'Nimal Perera',
    age: 46,
    gender: 'Male',
    status: 'Stone Indicated',
    statusClass: 'bg-red-100 text-red-700',
    lastVisit: 'Mar 20, 2026',
  },
  {
    id: 'PT-1002',
    name: 'Kavindi Silva',
    age: 32,
    gender: 'Female',
    status: 'No Stone Indicated',
    statusClass: 'bg-emerald-100 text-emerald-700',
    lastVisit: 'Mar 18, 2026',
  },
  {
    id: 'PT-1003',
    name: 'Amal Fernando',
    age: 51,
    gender: 'Male',
    status: 'Pending Review',
    statusClass: 'bg-amber-100 text-amber-700',
    lastVisit: 'Mar 17, 2026',
  },
];

const PatientsPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Patient Management
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Patients List
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Browse patient records and open individual profiles to review history, reports, and scan activity.
            </p>
          </div>

          <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            👥 {patients.length} Patients
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Patient ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Age</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Gender</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Latest Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Last Visit</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Action</th>
                </tr>
              </thead>

              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b border-slate-100 transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{patient.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{patient.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.age}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.gender}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${patient.statusClass}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.lastVisit}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/patients/${patient.id}`}
                        className="inline-block rounded-full border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                      >
                        View Profile
                      </Link>
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

export default PatientsPage;