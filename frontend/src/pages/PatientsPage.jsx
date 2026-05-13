import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';

import api from '../services/api';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAssignedPatients = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/appointments');
      const appointments = response.data?.data || [];

      const patientMap = new Map();

      appointments.forEach((appointment) => {
        const patient = appointment.patientId;

        if (!patient?._id) return;

        if (!patientMap.has(patient._id)) {
          patientMap.set(patient._id, {
            ...patient,
            latestAppointmentDate: appointment.appointmentDate,
            latestTimeSlot: appointment.timeSlot,
            appointmentStatus: appointment.status,
            reason: appointment.reason,
          });
        }
      });

      setPatients(Array.from(patientMap.values()));
    } catch (err) {
      console.error('Failed to fetch assigned patients:', err);
      setError('Failed to load assigned patients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedPatients();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Doctor Patients
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Assigned Patients
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Patients assigned to you through scheduled appointments.
            </p>
          </div>

          <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            {patients.length} Patients
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-4">
              <LoadingSpinner />
              <p className="text-sm font-medium text-slate-500">
                Loading assigned patients...
              </p>
            </div>
          </div>
        ) : patients.length > 0 ? (
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {[
                      'Patient ID',
                      'Name',
                      'Age',
                      'Gender',
                      'Contact',
                      'Appointment',
                      'Status',
                      'Action',
                    ].map((header) => (
                      <th
                        key={header}
                        className={`px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500 ${
                          header === 'Action' ? 'text-right' : ''
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {patients.map((patient) => {
                    const statusClass =
                      patient.appointmentStatus === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : patient.appointmentStatus === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : patient.appointmentStatus === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700';

                    return (
                      <tr
                        key={patient._id}
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {patient.patientId || 'N/A'}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {patient.fullName || 'N/A'}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {patient.age || '-'}
                        </td>

                        <td className="px-6 py-4 text-sm capitalize text-slate-600">
                          {patient.gender || '-'}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {patient.contactNumber || '-'}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {patient.latestAppointmentDate
                            ? `${new Date(
                                patient.latestAppointmentDate
                              ).toLocaleDateString()} ${patient.latestTimeSlot || ''}`
                            : 'N/A'}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${statusClass}`}
                          >
                            {patient.appointmentStatus || 'scheduled'}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/patients/${patient._id}`}
                            className="inline-block rounded-full border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                          >
                            View Profile
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
              👥
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              No Assigned Patients
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Patients will appear here after staff schedule appointments for you.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PatientsPage;
