import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const coverImage =
  'https://img.freepik.com/free-photo/medical-banner-with-stethoscope_23-2149611199.jpg?w=1380';
const systemImage =
  'https://img.freepik.com/free-vector/analysis-concept-illustration_114360-1119.jpg?w=800';
const devImage =
  'https://img.freepik.com/free-icon/user_318-159711.jpg';

const techStack = [
  {
    name: 'React.js',
    icon: '⚛️',
    desc: 'Used for the frontend interface. It provides a fast, interactive, and component-based architecture for building the user interface.',
  },
  {
    name: 'Node.js & Express',
    icon: '🟢',
    desc: 'Used to build the backend API. It handles authentication, routing, server-side logic, and communication with the database.',
  },
  {
    name: 'MongoDB',
    icon: '🍃',
    desc: 'A NoSQL database used to store patient records, generated reports, and user profile information securely.',
  },
  {
    name: 'YOLOv8 (Python)',
    icon: '🤖',
    desc: 'The core AI detection engine. Python is used to run the YOLOv8 model for identifying suspected urinary stones in medical images.',
  },
  {
    name: 'Tailwind CSS',
    icon: '🎨',
    desc: 'Used to design a clean, responsive, and modern medical web interface with utility-first styling for faster UI development.',
  },
  {
    name: 'Vite',
    icon: '⚡',
    desc: 'A modern frontend build tool used to provide faster development, hot module replacement, and optimized production builds.',
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <Header />

      {/* Hero Section */}
      <section
        className="relative mb-16 flex h-[350px] items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65)), url(${coverImage})`,
        }}
      >
        <div className="px-4 text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">About UroScan AI</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-100 md:text-lg">
            Innovating medical image analysis with AI-assisted urinary stone detection
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-20">
        {/* Mission Section */}
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
              especially when rapid review is needed.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-500">
              By using <strong>YOLOv8-based deep learning</strong>, the system helps
              detect suspected urinary stones in uploaded scan images, visualize the
              results, and support doctors with draft report generation.
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

        {/* Technology Stack */}
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
                <h3 className="text-xl font-bold text-slate-900">{tech.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Developer Section */}
        <section className="text-center">
          <h2 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">
            Meet the Developer
          </h2>

          <div className="mx-auto max-w-xl rounded-3xl border-t-4 border-blue-600 bg-white px-8 py-12 shadow-lg">
            <img
              src={devImage}
              alt="Developer"
              className="mx-auto h-36 w-36 rounded-full border-4 border-sky-100 object-cover"
            />

            <h3 className="mt-6 text-2xl font-bold text-slate-900">
              Punthara Thirani
            </h3>

            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
              Full Stack Developer & Researcher
            </p>

            <p className="mt-4 text-base text-slate-500">
              BSc (Hons) in Computer Science <br />
              NSBM Green University
            </p>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Passionate about combining artificial intelligence and web technologies
              to build practical systems that solve real-world healthcare problems.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#"
                className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-600 hover:text-white"
              >
                GitHub
              </a>
              <a
                href="#"
                className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-600 hover:text-white"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-600 hover:text-white"
              >
                Email
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