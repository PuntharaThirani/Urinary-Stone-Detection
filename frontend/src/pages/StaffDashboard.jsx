import React, { useState, useEffect } from 'react';
import { Link }  from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';

const StaffDashboard = () => {
  const staffName = localStorage.getItem('userName') || 'Staff';

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, aRes, rRes] = await Promise.all([
        api.get('/patients'),
        api.get('/appointments'),
        api.get('/reports'),
      ]);

      setPatients(pRes.data?.data || pRes.data?.patients || []);
      setAppointments(aRes.data?.data || aRes.data?.appointments || []);
      setReports(rRes.data?.reports || rRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch staff data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const pendingReports = reports.filter((r) => r.status === 'pending').length;

  const summaryCards = [
    {
      label: 'Registered Patients',
      value: loading ? '...' : patients.length,
      badgeText: 'Total',
      badgeClass: 'bg-slate-100 text-slate-700',
    },
    {
      label: 'Appointments',
      value: loading ? '...' : appointments.length,
      badgeText:  'All time',
      badgeClass: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Pending Reports',
      value: loading ? '...' : pendingReports,
      badgeText:  pendingReports > 0 ? 'Awaiting review' : 'All reviewed',
      badgeClass: pendingReports > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 md:px-8 lg:px-10">

        {/*  Header  */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Staff Portal
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Welcome, {staffName} 👋
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
              Manage patient records, appointments, and administrative workflow.
            </p>
          </div>
          <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            📅 {today}
          </div>
        </section>

        {/*  Quick Actions  */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <Link
            to="/staff-patients"
            className="group rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white shadow-lg">
                👥
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Patients</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Register patients, update records, and access administrative information.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-blue-700 transition group-hover:translate-x-1">
                  Open patients →
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/appointments"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-3xl">
                📅
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Appointments</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Schedule, update, and monitor patient appointments.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-blue-700 transition group-hover:translate-x-1">
                  Open appointments →
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/*  Summary Cards  */}
        <section className="mb-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                {card.label}
              </p>
              <h3 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                {card.value}
              </h3>
              <span className={`mt-4 inline-block rounded-full px-4 py-2 text-xs font-bold ${card.badgeClass}`}>
                {card.badgeText}
              </span>
            </div>
          ))}
        </section>

        {/*  Recent Appointments  */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">Recent Appointments</h2>
            <p className="mt-1 text-sm text-slate-500">Latest scheduling activity</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-3xl">📅</p>
              <p className="mt-2 text-sm">No appointments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {['Patient', 'Doctor', 'Date', 'Time', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 5).map((apt) => (
                    <tr key={apt._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {apt.patientId?.fullName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {apt.doctorId?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(apt.appointmentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {apt.timeSlot}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${
                          apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {apt.status}
                        </span>
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

export default StaffDashboard;