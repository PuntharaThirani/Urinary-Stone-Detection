import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../services/api';
import RegisterForm from './RegisterForm';
import myLogo from '../../assets/images/logo-removebg-preview.png';

const roles = ['doctor', 'patient', 'staff'];

const imageMap = {
  patient:
    'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800',
  doctor:
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop',
  staff:
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000',
};

const headingMap = {
  doctor: 'Doctor Access',
  patient: 'Patient Access',
  staff: 'Staff Access',
};

const LoginForm = () => {
  const [userType, setUserType] = useState('doctor');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    const role = queryParams.get('role');

    setIsLogin(mode !== 'register');

    if (role && roles.includes(role)) {
      setUserType(role);
    } else {
      setUserType('doctor');
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(formData);
      const role = response?.role || response?.user?.role;

      if (role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (role === 'patient') {
        navigate('/patient-dashboard');
      } else if (role === 'staff') {
        navigate('/staff-dashboard');
      } else {
        setError('Login successful, but role not found.');
        return;
      }

      window.location.reload();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 font-sans text-slate-900 md:px-6 md:py-10">
      <div className="mx-auto flex min-h-[720px] w-full max-w-6xl overflow-hidden rounded-[36px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        {/* Left Panel */}
        <div className="relative hidden w-1/2 overflow-hidden md:block">
          <img
            key={userType}
            src={imageMap[userType]}
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
                className="h-10 w-auto object-contain"
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

              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-lg">
                <span className="text-xl">✓</span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
                    System Status
                  </p>
                  <p className="text-sm font-black">AI Detection Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex w-full items-center justify-center bg-white px-6 py-10 md:w-1/2 md:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 md:hidden">
              <img
                src={myLogo}
                alt="UroScan AI Logo"
                className="mx-auto h-12 w-auto object-contain"
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
                : 'Create your account to access the platform.'}
            </p>

            <div className="mt-8 flex rounded-2xl border border-slate-200 bg-slate-100 p-1.5">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setUserType(role)}
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
                  <input
                    required
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-5 py-4 font-medium outline-none transition focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
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