import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';

const StaffPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchPatients();
  }, []);

  // ---------------- FETCH PATIENTS ----------------
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await api.get('/patients');

      const patientData =
        res.data?.data ||
        res.data?.patients ||
        [];

      setPatients(patientData);

    } catch (err) {
      console.error(err);
      setError('Failed to load patients.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ---------------- CREATE PATIENT ----------------
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setError('');

      // ✅ Get logged in user
      const authData = JSON.parse(localStorage.getItem('auth'));
      console.log('AUTH DATA:', authData);

      // ✅ Payload with userId
      const payload = {
        ...formData,
        userId:
        authData?.user?._id ||
        authData?._id ||
        authData?.id
        };

      console.log('Submitting:', payload);

      await api.post('/patients', payload);

      // ✅ Reset form
      setFormData({
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

      setShowForm(false);

      fetchPatients();

    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        'Failed to create patient.'
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">

      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8">

        {/* HEADER */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Staff Management
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Patient Records
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Register and manage patient information
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Add Patient'}
          </button>

        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="mb-6 grid gap-4 rounded-2xl border bg-white p-6 md:grid-cols-2"
          >

            {/* FULL NAME */}
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="input"
            />

            {/* PATIENT ID */}
            <input
              type="text"
              name="patientId"
              placeholder="Patient ID *"
              required
              value={formData.patientId}
              onChange={handleChange}
              className="input"
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />

            {/* AGE */}
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="input"
            />

            {/* GENDER */}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {/* CONTACT */}
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number *"
              required
              value={formData.contactNumber}
              onChange={handleChange}
              className="input"
            />

            {/* BLOOD GROUP */}
            <input
              type="text"
              name="bloodGroup"
              placeholder="Blood Group"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="input"
            />

            {/* EMERGENCY CONTACT */}
            <input
              type="text"
              name="emergencyContact"
              placeholder="Emergency Contact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="input"
            />

            {/* ADDRESS */}
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="input md:col-span-2"
            />

            {/* MEDICAL NOTES */}
            <textarea
              name="medicalNotes"
              placeholder="Medical Notes"
              value={formData.medicalNotes}
              onChange={handleChange}
              className="input md:col-span-2"
            />

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="md:col-span-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Register Patient
            </button>

          </form>
        )}

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border bg-white">

          {loading ? (
            <div className="p-10 text-center">
              Loading...
            </div>
          ) : patients.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No patients found
            </div>
          ) : (
            <table className="w-full text-left">

              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-4">Patient ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Age</th>
                  <th className="p-4">Gender</th>
                  <th className="p-4">Contact</th>
                </tr>
              </thead>

              <tbody>
                {patients.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t"
                  >
                    <td className="p-4 font-semibold">
                      {p.patientId}
                    </td>

                    <td className="p-4">
                      {p.fullName}
                    </td>

                    <td className="p-4 text-slate-600">
                      {p.email || 'N/A'}
                    </td>

                    <td className="p-4">
                      {p.age || '-'}
                    </td>

                    <td className="p-4 capitalize">
                      {p.gender || '-'}
                    </td>

                    <td className="p-4">
                      {p.contactNumber}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>

      </main>

      <Footer />

      {/* INPUT STYLE */}
      <style>{`
        .input {
          border: 1px solid #e2e8f0;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          width: 100%;
        }

        .input:focus {
          border-color: #2563eb;
        }
      `}</style>

    </div>
  );
};

export default StaffPatientsPage;