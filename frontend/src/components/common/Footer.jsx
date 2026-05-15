import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t-4 border-blue-600 bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-4 lg:px-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold text-white">
            UroScan <span className="text-blue-500">AI</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            An AI-assisted web platform designed to support urinary stone
            detection, scan review, and report preparation for medical workflows.
          </p>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            Final Year Research Project <br />
            BSc (Hons) Computer Science — 2025/2026
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-white">Quick Links</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { to: '/', label: 'Home'},
              { to: '/about', label: 'About'},
              { to: '/features', label: 'Features'},
              { to: '/how-it-works', label: 'How It Works'},
              { to: '/login', label: 'Login / Register'},
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-blue-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* System Features */}
        <div>
          <h3 className="text-lg font-bold text-white">System</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              'AI-Assisted Detection',
              'EfficientNet-B0 Classification',
              'YOLOv8 Stone Detection',
              'Draft Report Generation',
              'Doctor Verification Workflow',
              'Patient Record Handling',
            ].map((item) => (
              <li key={item} className="transition hover:text-blue-400">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold text-white">Contact</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span>📍</span>
              <span>NSBM Green University, Sri Lanka</span>
            </li>
            <li className="flex items-start gap-3">
              <span>📧</span>
              <span>puntharathirani@gmail.com</span>
            </li>
            <li className="flex items-start gap-3">
              <span>🎓</span>
              <span>BSc (Hons) in Computer Science</span>
            </li>
            <li className="flex items-start gap-3">
              <span>🏫</span>
              <span>University of Plymouth — NSBM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-black/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-5 text-center text-xs text-slate-500 md:px-8 lg:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} UroScan AI System. All rights reserved.</p>
          <p>
            Designed & Developed by{' '}
            <span className="font-semibold text-slate-300">
              Allage A Thirani
            </span>
          </p>
          <div className="flex items-center gap-4 text-base">
         <a
          href="https://your-website-link.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Website"
          className="transition hover:text-blue-400"
        >
          🌐
        </a>

        <a
          href="https://www.linkedin.com/in/punthara-thirani-449776265/"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
          className="transition hover:text-blue-400"
        >
         💼
       </a>

       <a
          href="https://github.com/PuntharaThirani"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          className="transition hover:text-blue-400"
        >
         💻
       </a>
      </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;