import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';

const StaffPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success,  setSuccess]  = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    patientId: '',
    email: '',
    age: '',
    gender: 'male',
    bloodGroup: '',
    contactNumber: '',
    address: '',
    emergencyContact: '',
    medicalNotes: '',
  });

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/patients');
      setPatients(res.data?.data || res.data?.patients || []);
    } catch (err) {
      setError('Failed to load patients.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/patients', formData);

      setSuccess(`✅ Patient "${formData.fullName}" registered successfully!`);

      setFormData({
        fullName: '', patientId: '', email: '', age: '',
        gender: 'male', bloodGroup: '', contactNumber: '',
        address: '', emergencyContact: '', medicalNotes: '',
      });

      setShowForm(false);
      fetchPatients();

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Failed to register patient.'
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8">

        {/*  Header  */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Staff Management
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Patient Records
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Register patients using their login email address
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            {showForm ? '✕ Cancel' : '+ Add Patient'}
          </button>
        </section>

        {/*  Success  */}
        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/*  Error  */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/*  Form  */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-6"
          >
            <h2 className="mb-2 text-lg font-bold text-slate-800">
              Register New Patient
            </h2>

            {/* ⚠️ Important Note */}
            <div className="mb-5 rounded-xl border border-blue-300 bg-blue-100 px-4 py-3 text-sm text-blue-800">
              ⚠️ <strong>Important:</strong> Patient must first{' '}
              <a href="/login?mode=register&role=patient" target="_blank" className="underline font-bold">
                create an account
              </a>{' '}
              using their email. Enter that same email below to link their profile.
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {/* Full Name */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Patient full name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Patient ID */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">
                  Patient ID *
                </label>
                <input
                  type="text"
                  name="patientId"
                  placeholder="e.g. PT-2026-001"
                  required
                  value={formData.patientId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Email — Link to user account */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">
                  Patient Login Email * (must match their account)
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="patient@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-slate-400">
                  This links the patient record to their login account.
                </p>
              </div>

              {/* Age */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Age</label>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  min={0} max={150}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Contact */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">
                  Contact Number *
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="07XXXXXXXX"
                  required
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  placeholder="Emergency contact number"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Patient address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Medical Notes */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">
                  Medical Notes
                </label>
                <textarea
                  name="medicalNotes"
                  placeholder="Any relevant medical history or notes..."
                  value={formData.medicalNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="md:col-span-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"
              >
                ✅ Register Patient
              </button>
            </div>
          </form>
        )}

        {/*  Table  */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : patients.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="text-4xl">👥</p>
              <p className="mt-3 text-sm">No patients registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {['Patient ID', 'Name', 'Email', 'Age', 'Gender', 'Contact', 'Blood'].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-bold uppercase text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p._id} className="border-t hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {p.patientId}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {p.fullName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {p.userId?.email || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {p.age || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                        {p.gender || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {p.contactNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {p.bloodGroup || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StaffPatientsPage;