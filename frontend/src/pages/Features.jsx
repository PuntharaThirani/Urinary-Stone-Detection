import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

// Icons
const aiIcon = 'https://cdn-icons-png.flaticon.com/512/8654/8654261.png';
const reportIcon = 'https://cdn-icons-png.flaticon.com/512/3029/3029337.png';
const securityIcon = 'https://cdn-icons-png.flaticon.com/512/2092/2092663.png';
const dashboardIcon = 'https://cdn-icons-png.flaticon.com/512/2328/2328966.png';
const speedIcon = 'https://cdn-icons-png.flaticon.com/512/9673/9673722.png';
const cloudIcon = 'https://cdn-icons-png.flaticon.com/512/414/414927.png';

const coreFeatures = [
  {
    title: 'EfficientNet-B0 Classification',
    icon:  aiIcon,
    desc:  'Phase 1 uses EfficientNet-B0 with transfer learning to classify X-rays as normal or stone-positive, achieving 94.74% test accuracy and F1-score of 0.95.',
  },
  {
    title: 'YOLOv8 Stone Detection',
    icon:  reportIcon,
    desc:  'Phase 2 uses YOLOv8l trained on 1698 images with 4367 annotated stones. Achieves mAP@50 of 0.927 and precision of 0.944 for precise stone localization.',
  },
  {
    title: 'Secure Record Handling',
    icon:  securityIcon,
    desc:  'Patient information, scan records, and reports are managed through JWT authentication, role-based access control, and MongoDB with audit logging.',
  },
];

const detailedFeatures = [
  {
    title: 'Role-Based Access',
    icon: dashboardIcon,
    desc: 'Different user roles can be managed to support secure and organized access across the system.',
  },
  {
    title: 'Scan Analysis Workflow',
    icon: speedIcon,
    desc: 'Doctors can upload medical scans and receive AI-assisted detection results within the application workflow.',
  },
  {
    title: 'Record Storage',
    icon: cloudIcon,
    desc: 'Generated reports and patient-related records can be stored and retrieved for future review.',
  },
  {
    title: 'Responsive Interface',
    emoji: '📱',
    desc: 'The interface is designed to adapt across desktop, tablet, and mobile screen sizes.',
  },
  {
    title: 'History Tracking',
    emoji: '📄',
    desc: 'The system supports maintaining previous scan results and report history for follow-up review.',
  },
  {
    title: 'Workflow Management',
    emoji: '🛠️',
    desc: 'The platform is designed to simplify scan submission, result review, and report preparation in one place.',
  },
];

const systemHighlights = [
  { value: '94.74%', label: 'Phase 1 Classification Accuracy'  },
  { value: '0.927',  label: 'Phase 2 YOLOv8 mAP@50'           },
  { value: '4',      label: 'User Roles Supported'             },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-white text-slate-700">
      <Header />

      {/* Hero Section */}
      <section className="bg-slate-50 px-5 py-16 md:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            System Capabilities
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Powerful Features for
            <span className="block text-blue-600">AI-Assisted Stone Detection</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-500 md:text-lg">
            UroScan AI combines medical image analysis, result visualization,
            and report preparation tools to support urinary stone detection workflows.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="bg-white px-5 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {coreFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="mb-6 h-20 w-20 object-contain"
                />
                <h3 className="text-2xl font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Highlights */}
      <section className="bg-slate-900 px-5 py-16 text-white md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">System Highlights</h2>
          <p className="mt-3 text-slate-300">
            Core strengths of the platform design and workflow
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {systemHighlights.map((item) => (
              <div
                key={item.value}
                className="rounded-2xl border border-slate-700 bg-slate-800/70 px-6 py-8"
              >
                <h3 className="text-3xl font-bold text-blue-400">{item.value}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="bg-slate-50 px-5 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-3 text-slate-500">
              A focused feature set for scan review, detection support, and report handling
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {detailedFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-7 shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {feature.icon ? (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
                      <img
                        src={feature.icon}
                        alt={feature.title}
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-2xl">
                      {feature.emoji}
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {feature.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;