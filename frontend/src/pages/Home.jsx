import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

// Online icons
const doctorIcon = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
const patientIcon = "https://cdn-icons-png.flaticon.com/512/2750/2750657.png";
const staffIcon = "https://cdn-icons-png.flaticon.com/512/3209/3209079.png";

// Images
const heroDoctorImg =
  "https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg?w=996";
const aboutImg =
  "https://img.freepik.com/free-photo/doctor-offering-medical-advice_23-2147796538.jpg?w=996";

const portalCards = [
  {
    title: 'Doctor Portal',
    description:
      'Upload X-ray or CT scan images, review AI detection results, and generate draft reports securely.',
    icon: doctorIcon,
    bg: 'bg-sky-100',
    path: '/login?role=doctor',
    action: 'Login as Doctor',
  },
  {
    title: 'Patient Portal',
    description:
      'Access finalized reports, view scan history, and track medical records in one place.',
    icon: patientIcon,
    bg: 'bg-emerald-100',
    path: '/login?role=patient',
    action: 'Login as Patient',
  },
  {
    title: 'Staff Portal',
    description:
      'Manage appointments, coordinate records, and support the diagnostic workflow efficiently.',
    icon: staffIcon,
    bg: 'bg-fuchsia-100',
    path: '/login?role=staff',
    action: 'Login as Staff',
  },
];

const systemFeatures = [
  {
    title: 'Upload Medical Scans',
    description:
      'Doctors can securely upload patient X-ray or CT scan images through a simple and user-friendly interface.',
  },
  {
    title: 'AI Detection Support',
    description:
      'The YOLOv8-based detection engine analyzes uploaded scans and highlights suspected urinary stone locations.',
  },
  {
    title: 'Draft Report Generation',
    description:
      'The system helps generate structured draft reports that doctors can review, edit, and save.',
  },
];

const workflowSteps = [
  'Upload Scan',
  'Run AI Detection',
  'Review Results',
  'Generate Report',
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-800">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white px-5 py-16 md:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              AI-Powered Clinical Support System
            </span>

            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
              AI-Assisted <span className="text-blue-600">Urinary Stone Detection</span> for Faster Clinical Review
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-500 md:text-lg lg:mx-0">
              Upload X-ray or CT scan images, detect suspected urinary stones,
              visualize findings, and generate draft reports to support medical review.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <button
                onClick={() => navigate('/login?mode=register')}
                className="rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Get Started
              </button>

              <button
                onClick={() => navigate('/about')}
                className="rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="relative flex w-full max-w-xl justify-center">
            <div className="absolute top-8 h-72 w-72 rounded-full bg-sky-100 blur-3xl md:h-96 md:w-96"></div>

            <div className="relative z-10">
              <img
                src={heroDoctorImg}
                alt="Doctor"
                className="w-full max-w-md rounded-[28px] object-cover shadow-2xl"
              />

              <div className="absolute -bottom-5 left-4 flex items-center gap-4 rounded-2xl border border-white/50 bg-white/90 px-5 py-4 shadow-xl backdrop-blur md:left-[-20px]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-600">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">AI Detection Active</h4>
                  <p className="text-xs text-slate-500">YOLOv8 model ready for scan review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-white px-5 py-14 md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              How the System Works
            </h2>
            <p className="mt-3 text-slate-500">
              A simple workflow designed to support doctors during scan review
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="font-semibold text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Section */}
      <section className="bg-white px-5 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Select Your Portal
            </h2>
            <p className="mt-3 text-slate-500">
              Choose your role to access the UroScan AI system
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {portalCards.map((card) => (
              <button
                key={card.title}
                onClick={() => navigate(card.path)}
                className="group rounded-3xl border border-slate-200 bg-white p-7 text-left shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
              >
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${card.bg}`}
                >
                  <img
                    src={card.icon}
                    alt={card.title}
                    className="h-9 w-9 object-contain"
                  />
                </div>

                <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {card.description}
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-blue-600 transition group-hover:translate-x-1">
                  {card.action} →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 px-5 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Core System Features
            </h2>
            <p className="mt-3 text-slate-500">
              Designed for clinical support, clarity, and efficiency
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {systemFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white px-5 py-16 md:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 lg:flex-row">
          <div className="w-full max-w-xl">
            <img
              src={aboutImg}
              alt="About UroScan AI"
              className="w-full rounded-[28px] object-cover shadow-2xl"
            />
          </div>

          <div className="max-w-2xl text-center lg:text-left">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Why Choose Us
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Support Clinical Review with Smart Detection Tools
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-500">
              UroScan AI uses a YOLOv8-based detection pipeline to analyze uploaded
              medical scans and highlight suspected urinary stones. The system is
              designed to support doctors by improving workflow efficiency, result
              visualization, and report preparation.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-2xl font-bold text-blue-600">AI-Based</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Detection support powered by a trained YOLOv8 model
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-2xl font-bold text-blue-600">Secure</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Structured workflow for scan review, reporting, and record handling
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 px-5 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to Start Using UroScan AI?
          </h2>
          <p className="mt-4 text-blue-100">
            Access your portal and begin scan-based urinary stone detection support.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="mt-8 rounded-full bg-white px-8 py-3 text-sm font-semibold text-blue-700 shadow-md transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Go to Login
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;