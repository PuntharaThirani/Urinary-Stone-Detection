import React, { useState } from 'react';
import { registerUser } from '../../services/api';

const RegisterForm = ({ onSuccess }) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  // Handle input changes
  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (message.text) {
      setMessage({
        type: '',
        text: '',
      });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    setMessage({
      type: '',
      text: '',
    });

    try {

      // Password match validation
      if (
        formData.password !==
        formData.confirmPassword
      ) {

        setMessage({
          type: 'error',
          text: 'Passwords do not match.',
        });

        setLoading(false);
        return;
      }

      // Strong password validation
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!passwordRegex.test(formData.password)) {

        setMessage({
          type: 'error',
          text:
            'Password must be at least 8 characters with 1 uppercase letter and 1 number.',
        });

        setLoading(false);
        return;
      }

      // Prepare clean payload
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: 'patient',
      };

      await registerUser(payload);

      setMessage({
        type: 'success',
        text:
          'Registration successful. Please sign in.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'patient',
      });

      // Redirect to login
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

      {/* Heading */}
      <div className="mb-6">

        <h3 className="text-2xl font-black tracking-tight text-slate-900">
          Create Patient Account
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Register to access the UroScan AI platform.
        </p>

      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            message.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >

          <span className="mt-0.5">
            {message.type === 'error'
              ? '⚠️'
              : '✅'}
          </span>

          <span>{message.text}</span>

        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* Hidden role */}
        <input
          type="hidden"
          name="role"
          value="patient"
        />

        {/* Full Name */}
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

        {/* Email */}
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

        {/* Password */}
        <div className="space-y-2">

          <label className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Minimum 8 chars, 1 uppercase, 1 number"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 font-medium outline-none transition focus:border-blue-500"
          />

        </div>

        {/* Confirm Password */}
        <div className="space-y-2">

          <label className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 font-medium outline-none transition focus:border-blue-500"
          />

        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
        >

          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Registering...
            </>
          ) : (
            'Create Account'
          )}

        </button>

      </form>

    </div>
  );
};

export default RegisterForm;