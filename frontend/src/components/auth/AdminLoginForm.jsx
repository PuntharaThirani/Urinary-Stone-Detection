import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/api';
import myLogo from '../../assets/images/logo-removebg-preview.png';
import admin from '../../assets/images/admin login photo.avif';

const AdminLoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email:'', password:''});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); //  Password toggle state

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const response = await adminLogin({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const token = response?.token || '';
      const user  = response?.user  || {};

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role || 'admin');
      localStorage.setItem('userName', user.name || '');
      localStorage.setItem('userId', user.id || user._id || '');

      navigate('/admin-dashboard');

    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 font-sans text-slate-900 md:px-6 md:py-10">

      <div className="mx-auto flex min-h-[720px] w-full max-w-6xl overflow-hidden rounded-[36px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">

        {/* LEFT PANEL */}
        <div className="relative hidden w-1/2 overflow-hidden md:block">
          <img
            src={admin} 
            alt="Admin panel"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-700/25 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900/20 to-slate-900/70" />

          {/* Logo */}
          <div className="absolute left-8 top-8 z-20">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-xl backdrop-blur-md">
              <img src={myLogo} alt="UroScan AI Logo" className="h-20 w-auto object-contain" />
            </div>
          </div>

          {/* Info */}
          <div className="absolute bottom-10 left-8 right-8 z-20">
            <div className="max-w-md rounded-3xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">UroScan AI</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight">Administrative Access Portal</h2>
              <p className="mt-4 text-sm leading-6 text-slate-100/90">
                Access the administrative dashboard to manage users, reports, system monitoring, and hospital workflow operations.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-lg">
                <span className="text-xl">🛡️</span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400">Access Level</p>
                  <p className="text-sm font-black">Restricted Admin Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex w-full items-center justify-center bg-white px-6 py-10 md:w-1/2 md:px-12 lg:px-16">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-8 md:hidden">
              <img src={myLogo} alt="UroScan AI Logo" className="mx-auto h-20 w-auto object-contain" />
            </div>

            {/* Back button */}
            <button
              onClick={() => navigate('/login')}
              className="mb-6 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              ← Back to Main Login
            </button>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Secure Admin Access</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Admin Login</h1>
            <p className="mt-3 text-base leading-7 text-slate-500">Sign in using your administrator account.</p>

            {/* FORM */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span className="mt-0.5">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@uroscan.com"
                  className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 font-medium outline-none transition focus:border-blue-500"
                />
              </div>

              {/* Password with show/hide toggle */}
              <div className="space-y-2">
                <label className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 pr-14 font-medium outline-none transition focus:border-blue-500"
                  />
                  {/* Show/Hide Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      // Eye-off (hide)
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      // Eye (show)
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing In...
                  </>
                ) : 'Admin Sign In'}
              </button>

            </form>

            <div className="mt-8 rounded-2xl bg-slate-50 px-5 py-4">
              <p className="text-xs leading-6 text-slate-500">
                Administrative access is restricted to authorized hospital personnel only.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginForm;