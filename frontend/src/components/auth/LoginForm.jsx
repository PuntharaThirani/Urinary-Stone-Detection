import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../services/api';
import RegisterForm from './RegisterForm';
import myLogo from '../../assets/images/logo-removebg-preview.png';
import patient from '../../assets/images/patient image.avif';
import doctor from '../../assets/images/doctor image.avif';
import staff from '../../assets/images/staff image.avif';
import admin from '../../assets/images/admin login photo.avif';

const roles = ['doctor', 'patient', 'staff'];

const imageMap = {
  doctor,
  patient,
  staff,
  admin,
};

const headingMap = {
  doctor: 'Doctor Access',
  patient: 'Patient Access',
  staff: 'Staff Access',
  admin: 'Admin Access',
};

const dashboardMap = {
  doctor: '/doctor-dashboard',
  patient: '/patient-dashboard',
  staff: '/staff-dashboard',
  admin: '/admin-dashboard',
};

const LoginForm = ({ adminMode = false }) => {
  const [userType, setUserType] = useState(adminMode ? 'admin' : 'doctor');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (adminMode) {
      setUserType('admin');
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    const role = queryParams.get('role');

    setIsLogin(mode !== 'register');
    setUserType(role && roles.includes(role) ? role : 'doctor');
  }, [location.search, adminMode]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError('');
  };

  const handleRoleChange = (role) => {
    setUserType(role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const role = response?.role || response?.user?.role;

      if (adminMode && role !== 'admin') {
        setError('Unauthorized admin access.');
        return;
      }

      const token = response?.token || '';
      const name = response?.user?.name || '';
      const id = response?.user?.id || response?.user?._id || '';

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', name);
      localStorage.setItem('userId', id);
      localStorage.setItem('doctorId', response?.user?.doctorId || '');
      localStorage.setItem('patientId', response?.user?.patientId || '');

      navigate(dashboardMap[role] || '/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const currentImage = imageMap[userType] || imageMap.doctor;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 font-sans text-slate-900 md:px-6 md:py-10">
      {!adminMode && (
        <div className="mx-auto mb-4 flex max-w-6xl justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin-login')}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
          >
            Admin Login
          </button>
        </div>
      )}

      <div className="mx-auto flex min-h-[720px] w-full max-w-6xl overflow-hidden rounded-[36px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        <div className="relative hidden w-1/2 overflow-hidden md:block">
          <img
            key={userType}
            src={currentImage}
            alt={`${userType} panel`}
            className="absolute inset-0 h-full w-full object-cover transition duration-700"
          />

          <div className="absolute inset-0 bg-blue-700/25 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900/20 to-slate-900/70" />

          <div className="absolute left-8 top-8 z-20">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-xl backdrop-blur-md">
              <img
                src={myLogo}
                alt="UroScan AI Logo"
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>

          <div className="absolute bottom-10 left-8 right-8 z-20">
            <div className="max-w-md rounded-3xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">
                UroScan AI
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight">
                AI-Assisted Urinary Stone Detection
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-100/90">
                Access the platform to upload X-ray images, review detection results,
                and support report preparation through a structured workflow.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-white px-6 py-10 md:w-1/2 md:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 md:hidden">
              <img
                src={myLogo}
                alt="UroScan AI Logo"
                className="mx-auto h-20 w-auto object-contain"
              />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              {isLogin ? 'Secure Sign In' : 'Create Account'}
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
              {isLogin ? headingMap[userType] : 'Register for UroScan AI'}
            </h1>

            <p className="mt-3 text-base leading-7 text-slate-500">
              {isLogin
                ? 'Sign in to continue to your system portal.'
                : `Create your ${userType} account to access the platform.`}
            </p>

            {!adminMode && (
              <div className="mt-8 flex rounded-2xl border border-slate-200 bg-slate-100 p-1.5">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`flex-1 rounded-xl py-3 text-sm font-bold capitalize transition-all duration-300 ${
                      userType === role
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}

            {isLogin ? (
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <span className="mt-0.5">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

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
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 font-medium outline-none transition focus:border-blue-500"
                  />
                </div>

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
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <div className="mt-8">
                <RegisterForm
                  defaultRole={userType}
                  onSuccess={() => setIsLogin(true)}
                />
              </div>
            )}

            {!adminMode && (
              <div className="mt-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  {isLogin ? 'New user?' : 'Already have an account?'}

                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin((prev) => !prev);
                      setError('');
                    }}
                    className="ml-2 font-bold text-blue-600 hover:underline"
                  >
                    {isLogin ? 'Create an account' : 'Sign In'}
                  </button>
                </p>
              </div>
            )}

            <div className="mt-8 rounded-2xl bg-slate-50 px-5 py-4">
              <p className="text-xs leading-6 text-slate-500">
                This system is intended to support medical workflow activities such as
                X-ray upload, AI-assisted result review, and report preparation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
