import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import doctorIcon from '../assets/images/doctor.png';
import patientIcon from '../assets/images/patienticon.png';
import staffIcon from '../assets/images/stafficon.png';
import heroDoctorImg from '../assets/images/home1.avif';
import aboutImg from '../assets/images/home2.avif';



const portalCards = [
  {
    title: 'Doctor Portal',
    description: 'Upload X-ray images, review AI detection results, confirm diagnoses, and generate patient reports.',
    icon: doctorIcon,
    bg: 'bg-sky-100',
    path: '/login?role=doctor',
    action: 'Login as Doctor',
  },
  {
    title: 'Patient Portal',
    description: 'Access finalized reports, view scan history, and track medical records in one place.',
    icon: patientIcon,
    bg: 'bg-emerald-100',
    path: '/login?role=patient',
    action: 'Login as Patient',
  },
  {
    title: 'Staff Portal',
    description: 'Manage appointments, coordinate patient records, and support the diagnostic workflow.',
    icon: staffIcon,
    bg: 'bg-fuchsia-100',
    path: '/login?role=staff',
    action: 'Login as Staff',
  },
];

const systemFeatures = [
  {
    title: 'Two-Phase AI Detection',
    description: 'Phase 1 uses EfficientNet-B0 for classification (94.74% accuracy). Phase 2 uses YOLOv8 for stone localization with bounding boxes (mAP@50: 0.927).',
  },
  {
    title: 'Draft Report Generation',
    description: 'AI generates structured preliminary reports. Doctors review, edit, confirm, and send finalized reports to patients.',
  },
  {
    title: 'Role-Based Access Control',
    description: 'Separate portals for Doctors, Patients, Staff, and Admins with JWT authentication and audit logging.',
  },
];

const workflowSteps = [
  'Upload X-Ray',
  'Phase 1: Classify',
  'Phase 2: Detect',
  'Review & Report',
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-800">
      <Header />

      {/*  Hero Section  */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white px-5 py-16 md:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              AI-Powered Clinical Support System
            </span>

            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
              AI-Assisted{' '}
              <span className="text-blue-600">Urinary Stone Detection</span>{' '}
              for Faster Clinical Review
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-500 md:text-lg lg:mx-0">
              Two-phase AI pipeline using EfficientNet-B0 and YOLOv8 to detect
              urinary stones, visualize findings, and generate draft reports for
              clinical review.
            </p>

            {/* AI Performance badges */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center lg:justify-start">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                Phase 1: 94.74% Accuracy
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                Phase 2: mAP@50 0.927
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                F1-Score: 0.95
              </span>
            </div>

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
            <div className="absolute top-8 h-72 w-72 rounded-full bg-sky-100 blur-3xl md:h-96 md:w-96" />
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
                  <h4 className="text-sm font-semibold text-slate-900">
                    AI Detection Active
                  </h4>
                  <p className="text-xs text-slate-500">
                    EfficientNet-B0 + YOLOv8 ready
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  Workflow Section  */}
      <section className="bg-white px-5 py-14 md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              How the System Works
            </h2>
            <p className="mt-3 text-slate-500">
              Two-phase AI pipeline for accurate urinary stone detection
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

      {/*  Portal Section  */}
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
                <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${card.bg}`}>
                  <img src={card.icon} alt={card.title} className="h-9 w-9 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{card.description}</p>
                <span className="mt-5 inline-block text-sm font-semibold text-blue-600 transition group-hover:translate-x-1">
                  {card.action} →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/*  Features Section  */}
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
                <p className="mt-3 text-sm leading-6 text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  About Section  */}
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
              Clinically-Focused AI Detection
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-500">
              UroScan AI uses a two-phase deep learning pipeline. EfficientNet-B0
              classifies X-rays as normal or stone-positive, then YOLOv8 precisely
              locates and annotates stones with bounding boxes. Built to support
              doctors, not replace them.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-2xl font-bold text-blue-600">94.74%</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Phase 1 Classification Accuracy
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-2xl font-bold text-blue-600">0.927</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Phase 2 YOLOv8 mAP@50
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  CTA Section  */}
      <section className="bg-blue-600 px-5 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to Start Using UroScan AI?
          </h2>
          <p className="mt-4 text-blue-100">
            Access your portal and begin AI-assisted urinary stone detection.
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