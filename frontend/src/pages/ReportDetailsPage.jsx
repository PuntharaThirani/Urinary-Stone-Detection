import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header        from '../components/common/Header';
import Footer        from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api           from '../services/api';

const ReportDetailsPage = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const userRole    = localStorage.getItem('userRole');

  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Back path based on role
  const backPath  = userRole === 'doctor' ? '/reports' : '/my-reports';
  const backLabel = userRole === 'doctor' ? '← Back to Reports' : '← Back to My Reports';

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');

      //  Direct api.get
      const res    = await api.get(`/reports/${id}`);
      const data   = res.data?.report || res.data;
      setReport(data);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Failed to load report details.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Download report
  const handleDownload = () => {
    if (!report) return;

    const content = `
UROSCAN AI — DIAGNOSTIC REPORT
================================
Report ID      : ${report._id}
Patient        : ${report.patientName || 'N/A'}
Age / Gender   : ${report.patientAge || 'N/A'} / ${report.patientGender || 'N/A'}
Date           : ${new Date(report.createdAt).toLocaleDateString()}
Doctor         : ${report.doctor?.name || 'N/A'}
Status         : ${report.status?.toUpperCase()}

AI DETECTION RESULTS:
Phase 1 Result : ${report.phase1?.result?.toUpperCase() || 'N/A'}
Phase 1 Score  : ${report.phase1?.confidence?.toFixed(2) || 'N/A'}%
Detection      : ${report.hasStones ? '⚠️ Stone Detected' : '✅ No Stone Detected'}
Stone Count    : ${report.stoneCount || 0}

FINAL DIAGNOSIS:
${report.finalDiagnosis || 'N/A'}

DOCTOR NOTES:
${report.doctorNotes || 'N/A'}

DOCTOR ADVICE:
${report.doctorAdvice || 'N/A'}

FOLLOW-UP:
${report.followUp || 'N/A'}

AI PRELIMINARY DRAFT:
${report.aiDraft || 'N/A'}

================================
⚠️ This report is AI-assisted and should be reviewed
   with a qualified medical professional.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `UroScan-Report-${report._id?.substring(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusStyle = (status) => ({
    confirmed:    'bg-emerald-100 text-emerald-700',
    pending:      'bg-amber-100 text-amber-700',
    rejected:     'bg-red-100 text-red-700',
    under_review: 'bg-purple-100 text-purple-700',
  }[status] || 'bg-slate-100 text-slate-700');

  //  Loading 
  if (loading) return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-5 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner />
            <p className="text-sm text-slate-500">Loading report details...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  //  Error 
  if (error || !report) return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-5 py-12">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
            ⚠️
          </div>
          <h1 className="text-3xl font-black text-slate-900">Report Not Found</h1>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            {error || 'The requested report could not be found.'}
          </p>
          <Link
            to={backPath}
            className="mt-6 inline-flex rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            {backLabel}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">

        {/*  Top  */}
        <section className="mb-8">
          <Link to={backPath} className="text-sm font-semibold text-blue-600 hover:underline">
            {backLabel}
          </Link>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Final Medical Report
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                Report Details
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Patient: {report.patientName || 'N/A'} | 
                Doctor: {report.doctor?.name || 'N/A'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(report.status)}`}>
                {report.status?.toUpperCase()}
              </span>
              <span className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${
                report.hasStones ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {report.hasStones ? '⚠️ STONE DETECTED' : '✅ NO STONE DETECTED'}
              </span>
            </div>
          </div>
        </section>

        {/*  Summary Cards  */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Report Date',     value: new Date(report.createdAt).toLocaleDateString() },
            { label: 'Stone Count',     value: report.stoneCount || 0 },
            { label: 'Reviewed By',     value: report.doctor?.name || 'Doctor' },
            { label: 'Final Diagnosis', value: report.finalDiagnosis || 'Pending' },
          ].map((card) => (
            <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                {card.label}
              </p>
              <h3 className="mt-3 text-xl font-bold text-slate-900">{card.value}</h3>
            </div>
          ))}
        </section>

        {/*  Phase 1 + Phase 2 Results  */}
        {(report.phase1 || report.hasStones) && (
          <section className="mb-8 grid gap-6 md:grid-cols-2">
            {/* Phase 1 */}
            {report.phase1 && (
              <div className="rounded-3xl border border-purple-200 bg-purple-50 p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-purple-900">
                  🧠 Phase 1 — EfficientNet-B0 Classification
                </h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold text-slate-700">Result:</span>{' '}
                    <span className="capitalize font-bold text-purple-700">
                      {report.phase1.result || 'N/A'}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Confidence:</span>{' '}
                    <span className="font-bold text-purple-700">
                      {report.phase1.confidence
                        ? `${report.phase1.confidence.toFixed(2)}%`
                        : 'N/A'}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Phase 2 */}
            {report.hasStones && (
              <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-blue-900">
                  🎯 Phase 2 — YOLOv8 Detection
                </h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold text-slate-700">Stones Found:</span>{' '}
                    <span className="font-bold text-blue-700">{report.stoneCount}</span>
                  </p>
                  {report.details?.length > 0 && report.details.map((stone, i) => (
                    <div key={i} className="rounded-xl bg-white/70 px-3 py-2 text-xs">
                      Stone {i + 1}: {stone.location || 'Unknown'} —
                      Confidence: {stone.confidence
                        ? `${(stone.confidence * 100).toFixed(1)}%`
                        : 'N/A'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/*  Annotated Image  */}
        {report.annotatedImageUrl && (
          <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">🖼️ AI Annotated X-Ray</h2>
            </div>
            <div className="flex justify-center bg-black p-4">
              <img
                src={
                  report.annotatedImageUrl.startsWith('http')
                    ? report.annotatedImageUrl
                    : `http://localhost:5000/${report.annotatedImageUrl}`
                }
                alt="Annotated X-Ray"
                className="max-h-[400px] object-contain"
              />
            </div>
          </section>
        )}

        {/*  AI Draft  */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            🤖 AI Preliminary Analysis
          </h2>
          <div className="rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">
            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
              {report.aiDraft || 'No AI draft available.'}
            </p>
          </div>
        </section>

        {/*  Doctor Notes + Advice  */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">✍️ Doctor Notes</h2>
            <div className="rounded-2xl border-l-4 border-orange-500 bg-orange-50 p-4">
              <p className="text-sm leading-7 text-slate-700">
                {report.doctorNotes || 'No doctor notes available.'}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">💊 Doctor Advice</h2>
            <div className="rounded-2xl border-l-4 border-emerald-500 bg-emerald-50 p-4">
              <p className="text-sm leading-7 text-slate-700">
                {report.doctorAdvice || 'No advice available.'}
              </p>
            </div>
          </div>
        </section>

        {/*  Follow Up  */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">📅 Follow-Up Recommendation</h2>
          <div className="rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">
            <p className="text-sm leading-7 text-slate-700">
              {report.followUp || 'No follow-up recommendation available.'}
            </p>
          </div>
        </section>

        {/*  Download Button  */}
        <section className="mb-8 flex gap-3">
          <button
            onClick={handleDownload}
            className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            ⬇️ Download Report
          </button>
          <Link
            to={backPath}
            className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            {backLabel}
          </Link>
        </section>

        {/*  Disclaimer  */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Medical Disclaimer</h2>
          <p className="text-sm leading-7 text-slate-600">
            This report should always be reviewed together with professional medical
            guidance. For urgent symptoms or worsening conditions, please contact a
            qualified medical professional immediately. UroScan AI is a decision
            support tool only.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReportDetailsPage;