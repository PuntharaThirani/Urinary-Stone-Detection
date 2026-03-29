import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const RegisterForm = ({ defaultRole = 'doctor', onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: defaultRole,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: defaultRole,
    }));
  }, [defaultRole]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.registerUser(formData);

      setMessage({
        type: 'success',
        text: 'Registration successful. Please sign in.',
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        role: defaultRole,
      });

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err?.response?.data?.message ||
          err?.message ||
          'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-2xl font-black tracking-tight text-slate-900">
          Create an Account
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Register to access the UroScan AI platform.
        </p>
      </div>

      {message.text && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            message.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          <span className="mt-0.5">{message.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 font-medium outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 font-medium outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 font-medium outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 font-medium capitalize outline-none transition focus:border-blue-500"
          >
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;