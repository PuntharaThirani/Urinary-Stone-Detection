import React, { useEffect, useState } from 'react';
import { registerUser } from '../../services/api';

const createInitialFormData = (role) => ({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role,
  patientId: '',
});

const RegisterForm = ({ defaultRole = 'patient', onSuccess }) => {
  const [formData, setFormData] = useState(createInitialFormData(defaultRole));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: defaultRole,
      patientId: defaultRole === 'patient' ? prev.patientId : '',
    }));
  }, [defaultRole]);

  const selectedRole =
    formData.role.charAt(0).toUpperCase() + formData.role.slice(1);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const patientId = formData.patientId.trim();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters with 1 uppercase letter and 1 number.',
      });
      return;
    }

    if (formData.role === 'patient' && !patientId) {
      setMessage({ type: 'error', text: 'Patient ID is required.' });
      return;
    }

    const payload = {
      name,
      email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === 'patient') {
      payload.patientId = patientId;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await registerUser(payload);

      setMessage({
        type: 'success',
        text: 'Registration successful. Please sign in.',
      });

      setFormData(createInitialFormData(defaultRole));

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
          Create {selectedRole} Account
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
          <span className="mt-0.5">
            {message.type === 'error' ? '⚠️' : '✅'}
          </span>
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
            minLength={2}
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

        {formData.role === 'patient' && (
          <div className="space-y-2">
            <label className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
              Patient ID
            </label>

            <input
              type="text"
              name="patientId"
              placeholder="Enter patient ID given by hospital"
              value={formData.patientId}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 font-medium uppercase outline-none transition focus:border-blue-500"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Minimum 8 chars, 1 uppercase, 1 number"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 pr-14 font-medium outline-none transition focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-blue-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
            {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
            </svg>
              ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
            </svg>
            )}
          </button>

          </div>
        </div>

        <div className="space-y-2">
          <label className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 pr-14 font-medium outline-none transition focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-blue-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
           </svg>
              ) : (
           <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
           >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
            </svg>
              )}
           </button>

          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
        >
          {loading ? 'Registering...' : `Create ${selectedRole} Account`}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
