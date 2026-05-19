import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const steps = [
  {
    number: '01',
    title: 'Upload X-Ray Image',
    description: 'The doctor logs in and uploads a KUB X-ray image (JPG, PNG). The system validates file type and size before processing.',
    image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
    alt: 'Upload scan',
  },
  {
    number: '02',
    title: 'Phase 1 — EfficientNet-B0 Classification',
    description: 'The image is classified as Normal or Stone-Positive by EfficientNet-B0 with transfer learning. Achieves 94.74% test accuracy and F1-score of 0.95. Phase 2 only runs if Phase 1 detects a stone.',
    image: 'https://cdn-icons-png.flaticon.com/512/8654/8654261.png',
    alt: 'Classification',
  },
  {
    number: '03',
    title: 'Phase 2 — YOLOv8 Stone Detection',
    description: 'YOLOv8l trained on 1698 images (4367 annotated stones) locates and draws bounding boxes around detected stones. Precision: 0.944, Recall: 0.893, mAP@50: 0.927.',
    image: 'https://cdn-icons-png.flaticon.com/512/2983/2983677.png',
    alt: 'Detection',
  },
  {
    number: '04',
    title: 'Doctor Review & Report Generation',
    description: 'The system generates a preliminary AI draft report. The doctor reviews, edits, adds clinical notes, confirms, and sends the finalized report to the patient.',
    image: 'https://cdn-icons-png.flaticon.com/512/3029/3029337.png',
    alt: 'Report',
  },
];

const faqs = [
  {
    question: 'Is the system a replacement for a doctor?',
    answer:
      'No. UroScan AI is designed as a clinical decision support tool to assist detection and reporting workflows. Final medical interpretation remains the responsibility of the doctor.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'The system currently supports common image formats such as JPG, JPEG, and PNG for scan upload and analysis.',
  },
  {
    question: 'How are results presented?',
    answer:
      'Detection results are shown visually on the uploaded image, along with output details that can be used to support draft report preparation.',
  },
];

const architecture = [
  { title: 'React Frontend', subtitle: 'React + Vite + Tailwind' },
  { title: 'Node.js API', subtitle: 'Express + JWT + MongoDB' },
  { title: 'EfficientNet-B0', subtitle: 'Phase 1 Classification', highlight: true },
  { title: 'YOLOv8', subtitle: 'Phase 2 Detection', highlight: true },
  { title: 'MongoDB Atlas', subtitle: 'Reports + Users + Logs'            },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white text-slate-700">
      <Header />

      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50 px-5 py-16 md:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Workflow Overview
          </span>

          <h1 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
            How <span className="text-blue-600">UroScan AI</span> Works
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
            A simple and structured workflow designed to support scan upload,
            AI-assisted detection, result visualization, and report preparation.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white px-5 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`mb-14 flex flex-col items-center gap-8 last:mb-0 lg:gap-14 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}
            >
              <div className="flex-1 text-center lg:text-left">
                <div className="text-6xl font-extrabold leading-none text-sky-100 md:text-7xl">
                  {step.number}
                </div>
                <h3 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-500">
                  {step.description}
                </p>
              </div>

              <div className="flex flex-1 justify-center">
                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="mx-auto w-32 object-contain md:w-36"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="bg-slate-900 px-5 py-16 text-white md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">System Architecture</h2>
          <p className="mt-3 text-slate-300">
            How data moves through the application
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {architecture.map((item, index) => (
              <React.Fragment key={item.title}>
                <div
                  className={`min-w-[170px] rounded-2xl border px-6 py-5 ${
                    item.highlight
                      ? 'border-blue-500 bg-blue-900/60'
                      : 'border-slate-700 bg-slate-800'
                  }`}
                >
                  <h4 className="text-lg font-bold">{item.title}</h4>
                  <p
                    className={`mt-1 text-sm ${
                      item.highlight ? 'text-blue-200' : 'text-slate-300'
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>

                {index < architecture.length - 1 && (
                  <div className="text-2xl font-bold text-blue-400">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 px-5 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl bg-white p-7 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-900">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;