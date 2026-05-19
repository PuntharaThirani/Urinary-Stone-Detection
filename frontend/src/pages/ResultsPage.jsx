import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import HeatmapViewer from '../components/results/HeatmapViewer';
import ResultDisplay from '../components/results/ResultDisplay'; // 
import MedicalChatbot from '../components/chatbot/MedicalChatbot';

const ResultsPage = () => {
  const location = useLocation();

  const {
    analysis,
    report,
    image,
  } = location.state || {};

  //  No Result State 
  if (!analysis || !report) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
        <Header />
        <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-5 py-12">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
              ⚠️
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              No Results Found
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 md:text-base">
              No AI diagnostic analysis result is available.
              Please upload a KUB X-ray image first.
            </p>
            <Link
              to="/analyze"
              className="mt-8 inline-flex rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Go to Analysis Page
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  //  Extract annotated image URL 
 const annotatedImageUrl =

  analysis?.annotatedImageUrl ||

  report?.annotatedImageUrl ||

  null;


const processedImageUrl = annotatedImageUrl

  ? (

      // Already proper base64 image
      annotatedImageUrl.startsWith('data:image')

        ? annotatedImageUrl

        // RAW base64 returned from backend
        : annotatedImageUrl.startsWith('/9j/')

          ? `data:image/jpeg;base64,${annotatedImageUrl}`

          // Full URL
          : annotatedImageUrl.startsWith('http')

            ? annotatedImageUrl

            // Relative backend path
            : `http://localhost:5000${
                annotatedImageUrl.startsWith('/')

                  ? annotatedImageUrl

                  : `/${annotatedImageUrl}`
              }`
    )

  : null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">

        {/* Page Header */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              AI Diagnostic Output
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Preliminary Diagnosis Report
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Review the AI-assisted urinary stone analysis,
              diagnostic findings, and preliminary clinical recommendation.
            </p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex w-fit rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Analyze Another Image
          </Link>
        </section>

        {/*  ResultDisplay — Phase 1 + Phase 2  */}
        <section className="mb-8">
          <ResultDisplay result={analysis} />
        </section>

        {/*  Scan Visualization  */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-slate-900">
              Scan Visualization
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Compare the original uploaded scan with the AI-annotated output.
            </p>
          </div>

          {image ? (
            <HeatmapViewer
              originalImage={image}
              processedImage={processedImageUrl}
            />
          ) : (
            <div className="rounded-2xl bg-slate-50 px-6 py-10 text-center text-slate-500">
              <p className="text-3xl">🖼️</p>
              <p className="mt-3 text-sm font-medium">
                Scan preview not available.
              </p>
            </div>
          )}
        </section>

        {/*  AI Draft Report  */}
        {report?.aiDraft && (
          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              🤖 AI Preliminary Draft Report
            </h2>
            <div className="rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                {report.aiDraft}
              </p>
            </div>
          </section>
        )}

        {/*  Report Status  */}
        <section className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <p className="text-sm font-bold text-amber-900">
            📋 Doctor Review Status
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            This report is currently marked as:{' '}
            <span className="font-bold uppercase">{report.status}</span>
          </p>
          <p className="mt-3 text-xs leading-6 text-slate-500">
            Final validation and confirmation by a qualified doctor is required
            before this report becomes visible to the patient.
          </p>
        </section>

        {/*  Actions  */}
        <section className="flex flex-wrap gap-3">
          <Link
            to="/analyze"
            className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            🔄 Upload New Scan
          </Link>
          <Link
            to="/reports"
            className="inline-flex rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            📋 Go to Reports
          </Link>
          {report?._id && (
            <Link
              to={`/report-details/${report._id}`}
              className="inline-flex rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
            >
              📄 View Full Report
            </Link>
          )}
        </section>
      </main>

      {/*  Medical Chatbot — analysis pass  */}
      <MedicalChatbot analysis={analysis} />

      <Footer />
    </div>
  );
};

export default ResultsPage;