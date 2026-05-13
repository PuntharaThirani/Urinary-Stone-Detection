import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const coverImage  = 'https://img.freepik.com/free-photo/medical-banner-with-stethoscope_23-2149611199.jpg?w=1380';
const systemImage = 'https://img.freepik.com/free-vector/analysis-concept-illustration_114360-1119.jpg?w=800';

const profileLinks = {
  github: 'https://github.com/PuntharaThirani',
  linkedin: 'https://www.linkedin.com/in/punthara-thirani-449776265/',
  email: 'mailto:puntharathirani@gmail.com',
};

const techStack = [
  {
    name: 'React.js',
    icon: '⚛️',
    desc: 'Used for the frontend interface. Provides a fast, interactive, and component-based architecture for building the user interface.',
  },
  {
    name: 'Node.js & Express',
    icon: '🟢',
    desc: 'Used to build the backend API. Handles authentication, routing, server-side logic, and communication with the database.',
  },
  {
    name: 'MongoDB',
    icon: '🍃',
    desc: 'A NoSQL database used to store patient records, generated reports, and user profile information securely.',
  },
  {
    name: 'EfficientNet-B0',
    icon: '🧠',
    desc: 'Phase 1 classification model using transfer learning. Trained on KUB X-ray images to classify normal vs stone images with 94.74% test accuracy.',
  },
  {
    name: 'YOLOv8 (Python)',
    icon: '🤖',
    desc: 'Phase 2 object detection engine. Trained on 1698 images with 4367 annotated stones. Achieves mAP@50 of 0.927 for precise stone localization.',
  },
  {
    name: 'Tailwind CSS',
    icon: '🎨',
    desc: 'Used to design a clean, responsive, and modern medical web interface with utility-first styling.',
  },
  {
    name: 'Python & PyTorch',
    icon: '🐍',
    desc: 'Used for AI model training, inference, and image processing. Core libraries include Ultralytics, OpenCV, and NumPy.',
  },
  {
    name: 'Vite',
    icon: '⚡',
    desc: 'Modern frontend build tool providing faster development, hot module replacement, and optimized production builds.',
  },
];

// AI Performance metrics
const metrics = [
  { label: 'Phase 1 Test Accuracy',  value: '94.74%', color: 'blue'   },
  { label: 'Phase 1 F1 Score',       value: '0.95',   color: 'purple' },
  { label: 'Phase 2 mAP@50',         value: '0.927',  color: 'green'  },
  { label: 'YOLOv8 Precision',       value: '0.944',  color: 'indigo' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <Header />

      {/*  Hero Section  */}
      <section
        className="relative mb-16 flex h-[350px] items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.65), rgba(15,23,42,0.65)), url(${coverImage})`,
        }}
      >
        <div className="px-4 text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">
            About UroScan AI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-100 md:text-lg">
            Innovating medical image analysis with AI-assisted urinary stone detection
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-20">

        {/*  Mission Section  */}
        <section className="mb-20 flex flex-col items-center gap-10 rounded-3xl bg-white p-8 shadow-sm md:p-10 lg:flex-row lg:gap-14">
          <div className="flex-1 text-center lg:text-left">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Our Mission
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Supporting Faster and Smarter Clinical Review
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-500">
              <strong>UroScan AI</strong> is a final year research project focused on
              improving the medical imaging workflow for urinary stone detection.
              Manual interpretation of scans can be time-consuming and challenging,
              especially in resource-limited settings.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-500">
              The system uses a <strong>two-phase AI architecture</strong> — EfficientNet-B0
              for classification and YOLOv8 for detection — to identify suspected
              urinary stones, visualize results with bounding boxes, and support
              doctors with draft report generation.
            </p>
          </div>
          <div className="flex-1">
            <img
              src={systemImage}
              alt="System overview"
              className="mx-auto w-full max-w-md rounded-2xl object-cover shadow-lg"
            />
          </div>
        </section>

        {/*  AI Performance Metrics  */}
        <section className="mb-20">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              AI Model Performance
            </h2>
            <p className="mt-3 text-slate-500">
              Validated metrics from trained models
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <p className={`text-3xl font-black text-${m.color}-600`}>
                  {m.value}
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/*  Technology Stack  */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Technologies Used
            </h2>
            <p className="mt-3 text-slate-500">
              Core tools and technologies used to build the system
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <span className="mb-4 block text-4xl">{tech.icon}</span>
                <h3 className="text-xl font-bold text-slate-900">
                  {tech.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/*  Developer Section  */}
        <section className="text-center">
          <h2 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">
            Meet the Developer
          </h2>

          <div className="mx-auto max-w-xl rounded-3xl border-t-4 border-blue-600 bg-white px-8 py-12 shadow-lg">

            <h3 className="mt-6 text-2xl font-bold text-slate-900">
              Allage A Thirani
            </h3>

            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
              Full Stack Developer & AI Researcher
            </p>

            <p className="mt-4 text-base text-slate-500">
              BSc (Hons) in Computer Science <br />
              NSBM Green University — University of Plymouth
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Plymouth Index: 10953547
            </p>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Passionate about combining artificial intelligence and web
              technologies to build practical systems that solve real-world
              healthcare problems. This project explores the intersection of
              deep learning and clinical decision support.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
  <a
    href={profileLinks.github}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-600 hover:text-white"
  >
    💻 GitHub
  </a>

  <a
    href={profileLinks.linkedin}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-600 hover:text-white"
  >
    💼 LinkedIn
  </a>

  <a
    href={profileLinks.email}
    className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-600 hover:text-white"
  >
    📧 Email
  </a>
</div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;