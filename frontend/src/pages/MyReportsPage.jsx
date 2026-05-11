import React, {
  useState,
  useEffect,
} from 'react';

import { Link }
  from 'react-router-dom';

import Header
  from '../components/common/Header';

import Footer
  from '../components/common/Footer';

import api
  from '../services/api';

const MyReportsPage = () => {

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {

    fetchReports();

  }, []);

  const fetchReports = async () => {

    try {

      const res =
        await api.get(
          '/reports/my/final'
        );

      setReports(
        res.data.reports || []
      );

    } catch (err) {

      console.error(err);

      setError(
        'Failed to load reports. Please try again.'
      );

    } finally {

      setLoading(false);
    }
  };

  // Download report
  const handleDownload = (report) => {

    const content = `

UROSCAN AI — DIAGNOSTIC REPORT
================================

Report ID :
${report._id}

Patient :
${report.patient?.fullName || report.patientName || 'N/A'}

Patient ID :
${report.patient?.patientId || 'N/A'}

Date :
${new Date(report.createdAt).toLocaleDateString()}

Doctor :
${report.doctor?.name || 'N/A'}

Doctor ID :
${report.doctor?.doctorId || 'N/A'}

--------------------------------

RESULT:
${
  report.hasStones

    ? `⚠️ Stone Detected (${report.stoneCount} stone(s))`

    : '✅ No Stone Detected'
}

--------------------------------

FINAL DIAGNOSIS:

${report.finalDiagnosis || 'N/A'}

--------------------------------

DOCTOR NOTES:

${report.doctorNotes || 'N/A'}

--------------------------------

DOCTOR ADVICE:

${report.doctorAdvice || 'N/A'}

--------------------------------

FOLLOW-UP:

${report.followUp || 'N/A'}

================================

⚠️ This report is generated for clinical review purposes only.
Always consult your doctor for medical decisions.

`.trim();

    const blob = new Blob(

      [content],

      { type: 'text/plain' }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement('a');

    a.href = url;

    a.download =
      `UroScan-Report-${
        report._id?.substring(0, 8)
      }.txt`;

    a.click();

    URL.revokeObjectURL(url);
  };

  return (

    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">

      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">

        {/* Header */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Patient Reports
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              My Reports
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              View your doctor-reviewed reports, final diagnosis, and follow-up advice.
            </p>

          </div>

          <Link
            to="/patient-dashboard"
            className="inline-flex w-fit rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            ← Back to Dashboard
          </Link>

        </section>

        {/* Error */}
        {error && (

          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            ⚠️ {error}

          </div>
        )}

        {/* Loading */}
        {loading ? (

          <div className="flex items-center justify-center py-20">

            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          </div>

        ) : reports.length === 0 ? (

          /* Empty State */
          <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center shadow-sm">

            <p className="text-5xl">
              📋
            </p>

            <p className="mt-4 text-lg font-bold text-slate-700">
              No confirmed reports yet
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Your doctor-confirmed reports will appear here once reviewed.
            </p>

          </div>

        ) : (

          /* Reports */
          <section className="grid gap-6">

            {reports.map((report) => (

              <div
                key={report._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                {/* Top */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">

                      Report #

                      {report._id?.substring(0, 8)}

                    </h2>

                    <div className="mt-3 space-y-2 text-sm text-slate-600">

                      <p>

                        <span className="font-semibold text-slate-900">
                          Date:
                        </span>{' '}

                        {new Date(
                          report.createdAt
                        ).toLocaleDateString()}

                      </p>

                      <p>

                        <span className="font-semibold text-slate-900">
                          Patient ID:
                        </span>{' '}

                        {report.patient?.patientId || 'N/A'}

                      </p>

                      <p>

                        <span className="font-semibold text-slate-900">
                          Doctor:
                        </span>{' '}

                        {report.doctor?.name || 'N/A'}

                        {report.doctor?.doctorId && (

                          <span className="ml-2 text-xs text-slate-400">

                            ({report.doctor.doctorId})

                          </span>

                        )}

                      </p>

                      <p>

                        <span className="font-semibold text-slate-900">
                          Doctor Review:
                        </span>{' '}

                        {report.doctorConfirmed

                          ? '✅ Confirmed'

                          : '⏳ Pending'}

                      </p>

                      {report.hasStones && (

                        <p>

                          <span className="font-semibold text-slate-900">
                            Stones:
                          </span>{' '}

                          {report.stoneCount} detected

                        </p>

                      )}

                    </div>

                  </div>

                  {/* Badge */}
                  <span className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${
                    report.hasStones
                      ? 'bg-red-100 text-red-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>

                    {report.hasStones

                      ? '⚠️ Stone Detected'

                      : '✅ No Stone Detected'}

                  </span>

                </div>

                {/* Diagnosis */}
                {report.finalDiagnosis && (

                  <div className="mt-4 rounded-2xl border-l-4 border-purple-500 bg-purple-50 p-4">

                    <p className="text-sm font-bold text-purple-800">
                      Final Diagnosis
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">

                      {report.finalDiagnosis}

                    </p>

                  </div>

                )}

                {/* Advice */}
                {report.doctorAdvice && (

                  <div className="mt-4 rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">

                    <p className="text-sm font-bold text-blue-800">
                      Doctor Advice
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">

                      {report.doctorAdvice}

                    </p>

                  </div>

                )}

                {/* Follow-up */}
                {report.followUp && (

                  <div className="mt-4 rounded-2xl border-l-4 border-emerald-500 bg-emerald-50 p-4">

                    <p className="text-sm font-bold text-emerald-800">
                      Follow-Up Plan
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">

                      {report.followUp}

                    </p>

                  </div>

                )}

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-3">

                  <button
                    onClick={() =>
                      handleDownload(report)
                    }
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    ⬇️ Download Report
                  </button>

                  <Link
                    to={`/report/${report._id}`}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    View Details
                  </Link>

                </div>

              </div>
            ))}

          </section>
        )}

        {/* Disclaimer */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-3 text-lg font-bold text-slate-900">
            Medical Disclaimer
          </h2>

          <p className="text-sm leading-7 text-slate-600">

            These reports should be reviewed together with your doctor's advice.
            For urgent symptoms or treatment decisions, please contact a qualified
            medical professional directly. UroScan AI is a decision support tool only.

          </p>

        </section>

      </main>

      <Footer />

    </div>
  );
};

export default MyReportsPage;