import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const patients = [
  { id: 'PT-1001', name: 'Nimal Perera', age: 46, gender: 'Male', contact: '+94 71 234 5678' },
  { id: 'PT-1002', name: 'Kavindi Silva', age: 32, gender: 'Female', contact: '+94 77 345 6789' },
  { id: 'PT-1003', name: 'Amal Fernando', age: 51, gender: 'Male', contact: '+94 70 456 7890' },
];

const StaffPatientsPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Staff Management
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Patient Records
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 md:text-base">
              Review registered patient information and administrative details.
            </p>
          </div>

          <button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            + Add New Patient
          </button>
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
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Contact</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{patient.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.age}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.gender}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.contact}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-full border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
                        View Record
                      </button>
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

export default StaffPatientsPage;