import React from 'react';

import { useLocation, Link } from 'react-router-dom';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

import HeatmapViewer from '../components/results/HeatmapViewer';

import MedicalChatbot from '../components/chatbot/MedicalChatbot';


const ResultsPage = () => {

  const location = useLocation();

  const {
    analysis,
    report,
    image,
  } = location.state || {};


  // =====================================================
  // No Result State
  // =====================================================
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


  // =====================================================
  // Extract Data
  // =====================================================
  const {
    hasStones,
    stoneCount,
    diagnosisData,
  } = analysis;

  const processedImage =
    report?.aiResult?.rawOutput?.annotatedImage
      ? `data:image/jpeg;base64,${report.aiResult.rawOutput.annotatedImage}`
      : null;


  return (

    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">

      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">

        {/* ================================================= */}
        {/* PAGE HEADER */}
        {/* ================================================= */}
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


        {/* ================================================= */}
        {/* PRELIMINARY DIAGNOSIS */}
        {/* ================================================= */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5 border-b border-slate-100 pb-3">

            <h2 className="text-xl font-bold text-slate-900">
              AI Preliminary Diagnosis
            </h2>

          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-xs font-medium text-slate-500">
                Detection Status
              </p>

              <p className="mt-2 text-lg font-black text-slate-900">

                {hasStones
                  ? 'Stone Detected'
                  : 'No Stone Detected'}

              </p>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-xs font-medium text-slate-500">
                Stone Count
              </p>

              <p className="mt-2 text-lg font-black text-slate-900">
                {stoneCount}
              </p>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-xs font-medium text-slate-500">
                Estimated Stone Size
              </p>

              <p className="mt-2 text-lg font-black text-slate-900">
                {diagnosisData?.estimatedSize || 0} mm
              </p>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-xs font-medium text-slate-500">
                Risk Level
              </p>

              <p className="mt-2 text-lg font-black text-slate-900">
                {diagnosisData?.riskLevel || 'N/A'}
              </p>

            </div>

          </div>


          {/* ============================================= */}
          {/* Recommendation */}
          {/* ============================================= */}
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <p className="text-sm font-bold text-blue-900">
              Preliminary Clinical Recommendation
            </p>

            <p className="mt-2 text-sm leading-7 text-slate-700">

              {diagnosisData?.recommendation ||
                'No recommendation available.'}

            </p>

          </div>


          {/* ============================================= */}
          {/* Confidence */}
          {/* ============================================= */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">

            <div className="flex items-center justify-between">

              <p className="text-sm font-bold text-slate-700">
                AI Confidence Score
              </p>

              <p className="text-sm font-black text-slate-900">

                {diagnosisData?.confidence || 0}%

              </p>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* VISUALIZATION */}
        {/* ================================================= */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5 border-b border-slate-100 pb-3">

            <h2 className="text-xl font-bold text-slate-900">
              Scan Visualization Comparison
            </h2>

            <p className="mt-2 text-sm text-slate-500">

              Compare the original uploaded scan
              with the AI-annotated analysis output.

            </p>

          </div>


          {image && processedImage ? (

            <HeatmapViewer
              originalImage={image}
              processedImage={processedImage}
            />

          ) : (

            <div className="rounded-2xl bg-slate-50 px-6 py-10 text-center text-slate-500">

              <p className="text-3xl">🖼️</p>

              <p className="mt-3 text-sm font-medium">
                Annotated scan preview is unavailable.
              </p>

            </div>

          )}


          {/* ============================================= */}
          {/* Report Status */}
          {/* ============================================= */}
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">

            <p className="text-sm font-bold text-amber-900">
              Doctor Review Status
            </p>

            <p className="mt-2 text-sm leading-7 text-slate-700">

              This report is currently marked as:

              <span className="ml-2 font-bold uppercase">
                {report.status}
              </span>

            </p>

            <p className="mt-3 text-xs leading-6 text-slate-500">

              Final validation and confirmation by a qualified doctor
              is required before this report becomes visible to the patient.

            </p>

          </div>


          {/* ============================================= */}
          {/* Actions */}
          {/* ============================================= */}
          <div className="mt-6 flex flex-wrap gap-3">

            <Link
              to="/analyze"
              className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Upload New Scan
            </Link>

            <Link
              to="/reports"
              className="inline-flex rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Go to Reports
            </Link>

          </div>

        </section>

      </main>

      <MedicalChatbot />

      <Footer />

    </div>

  );

};

export default ResultsPage;