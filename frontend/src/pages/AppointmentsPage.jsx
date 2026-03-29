import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const appointments = [
  { id: 'A-001', patient: 'Nimal Perera', doctor: 'Dr. Silva', date: 'Mar 28, 2026', time: '09:30 AM', status: 'Scheduled', statusClass: 'bg-blue-100 text-blue-700' },
  { id: 'A-002', patient: 'Kavindi Silva', doctor: 'Dr. Fernando', date: 'Mar 28, 2026', time: '11:00 AM', status: 'Completed', statusClass: 'bg-emerald-100 text-emerald-700' },
  { id: 'A-003', patient: 'Amal Fernando', doctor: 'Dr. Silva', date: 'Mar 29, 2026', time: '02:00 PM', status: 'Pending', statusClass: 'bg-amber-100 text-amber-700' },
];

const AppointmentsPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Staff Scheduling
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Appointments
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 md:text-base">
              Manage patient appointments and administrative scheduling tasks.
            </p>
          </div>

          <button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            + New Appointment
          </button>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Appointment ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Patient</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Doctor</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Time</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.patient}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.doctor}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.time}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${item.statusClass}`}>
                        {item.status}
                      </span>
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

export default AppointmentsPage;