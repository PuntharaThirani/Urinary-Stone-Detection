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
    email: '',            // ✅ FIX: email added
    age: '',
    gender: 'male',
    bloodGroup: '',
    contactNumber: '',
    address: '',
    emergencyContact: '',
    medicalNotes: '',
    userId: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

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

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await api.post('/patients', formData);

      setShowForm(false);

      setFormData({
        fullName: '',
        patientId: '',
        email: '',   // reset email
        age: '',
        gender: 'male',
        bloodGroup: '',
        contactNumber: '',
        address: '',
        emergencyContact: '',
        medicalNotes: '',
        userId: '',
      });

      fetchPatients();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create patient.');
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

            <input
              placeholder="Full Name *"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="input"
            />

            <input
              placeholder="Patient ID *"
              required
              value={formData.patientId}
              onChange={(e) =>
                setFormData({ ...formData, patientId: e.target.value })
              }
              className="input"
            />

            {/* ✅ EMAIL FIELD */}
            <input
              type="email"
              placeholder="Email Address *"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="input"
            />

            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className="input"
            />

            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="input"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              placeholder="Contact Number *"
              required
              value={formData.contactNumber}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber: e.target.value })
              }
              className="input"
            />

            <input
              placeholder="Blood Group"
              value={formData.bloodGroup}
              onChange={(e) =>
                setFormData({ ...formData, bloodGroup: e.target.value })
              }
              className="input"
            />

            <input
              placeholder="Emergency Contact"
              value={formData.emergencyContact}
              onChange={(e) =>
                setFormData({ ...formData, emergencyContact: e.target.value })
              }
              className="input"
            />

            <textarea
              placeholder="Medical Notes"
              value={formData.medicalNotes}
              onChange={(e) =>
                setFormData({ ...formData, medicalNotes: e.target.value })
              }
              className="input md:col-span-2"
            />

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
            <div className="p-10 text-center">Loading...</div>
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
                  <tr key={p._id} className="border-t">

                    <td className="p-4 font-semibold">{p.patientId}</td>
                    <td className="p-4">{p.fullName}</td>

                    {/* ✅ EMAIL DISPLAY */}
                    <td className="p-4 text-slate-600">
                      {p.email || 'N/A'}
                    </td>

                    <td className="p-4">{p.age || '-'}</td>
                    <td className="p-4 capitalize">{p.gender || '-'}</td>
                    <td className="p-4">{p.contactNumber}</td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>

      </main>

      <Footer />

      {/* simple input style */}
      <style>{`
        .input {
          border: 1px solid #e2e8f0;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
        }
        .input:focus {
          border-color: #2563eb;
        }
      `}</style>

    </div>
  );
};

export default StaffPatientsPage;