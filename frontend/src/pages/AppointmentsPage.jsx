import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    timeSlot: '',
    reason: '',
    status: 'scheduled',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);

    try {
      await Promise.all([fetchAppointments(), fetchDoctors()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/users?role=doctor');
      const users = res.data.data || res.data.users || [];
      setDoctors(users.filter((user) => user.role === 'doctor'));
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      setDoctors([]);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formError) {
      setFormError('');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    setFormError('');

    try {
      await api.post('/appointments', {
        patientId: formData.patientId.trim(),
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot.trim(),
        reason: formData.reason.trim(),
        status: formData.status,
      });

      setShowForm(false);
      setFormData({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        timeSlot: '',
        reason: '',
        status: 'scheduled',
      });

      fetchAppointments();
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Failed to create appointment.'
      );
      console.error('Failed to create appointment:', err);
    }
  };

  const getStatusClass = (status) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-700',
      completed: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-amber-100 text-amber-700',
      cancelled: 'bg-red-100 text-red-700',
    };

    return styles[status] || 'bg-slate-100 text-slate-700';
  };

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

          <button
            type="button"
            onClick={() => {
              setShowForm((prev) => !prev);
              setFormError('');
            }}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'New Appointment'}
          </button>
        </section>

        {showForm && (
          <div className="mb-6 rounded-3xl border border-blue-200 bg-blue-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">
              Create New Appointment
            </h2>

            {formError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Patient ID (e.g. 001)"
                value={formData.patientId}
                onChange={(e) => handleChange('patientId', e.target.value)}
                required
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />

              <select
                value={formData.doctorId}
                onChange={(e) => handleChange('doctorId', e.target.value)}
                required
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} {doctor.doctorId ? `(${doctor.doctorId})` : ''}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => handleChange('appointmentDate', e.target.value)}
                required
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />

              <input
                type="text"
                placeholder="Time Slot (e.g. 09:30 AM)"
                value={formData.timeSlot}
                onChange={(e) => handleChange('timeSlot', e.target.value)}
                required
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />

              <input
                type="text"
                placeholder="Reason (optional)"
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 md:col-span-2"
              />

              <button
                type="submit"
                className="rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 md:col-span-2"
              >
                Create Appointment
              </button>
            </form>
          </div>
        )}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="text-4xl">📅</p>
              <p className="mt-3 text-sm">No appointments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {['Patient', 'Doctor', 'Date', 'Time', 'Reason', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {item.patientId?.fullName || 'N/A'}
                        {item.patientId?.patientId && (
                          <span className="ml-2 text-xs font-medium text-slate-400">
                            #{item.patientId.patientId}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.doctorId?.name || 'N/A'}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(item.appointmentDate).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.timeSlot}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {item.reason || '-'}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
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

export default AppointmentsPage;
