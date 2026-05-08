import React, { useEffect, useState } from 'react';

import { Link, useParams } from 'react-router-dom';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

import api from '../services/api';

import LoadingSpinner from '../components/common/LoadingSpinner';

const ReportDetailsPage = () => {

  const { id } = useParams();

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');


  // =====================================================
  // FETCH REPORT
  // =====================================================
  useEffect(() => {

    const fetchReport = async () => {

      try {

        setLoading(true);

        setError('');

        const response = await api.getReportById(id);

        const reportData =
          response?.data?.report ||
          response?.report ||
          response;

        setReport(reportData);

      } catch (err) {

        console.error('Failed to load report:', err);

        setError(
          err?.response?.data?.message ||
          'Failed to load report details.'
        );

      } finally {

        setLoading(false);

      }

    };

    fetchReport();

  }, [id]);


  // =====================================================
  // STATUS STYLE
  // =====================================================
  const getStatusStyle = (status) => {

    switch (status) {

      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700';

      case 'pending':
        return 'bg-amber-100 text-amber-700';

      case 'rejected':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-slate-100 text-slate-700';

    }

  };


  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {

    return (

      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">

        <Header />

        <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-5 py-12">

          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">

            <div className="flex flex-col items-center gap-4">

              <LoadingSpinner />

              <p className="text-sm text-slate-500">

                Loading report details...

              </p>

            </div>

          </div>

        </main>

        <Footer />

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================
  if (error || !report) {

    return (

      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">

        <Header />

        <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-5 py-12">

          <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">

              ⚠️

            </div>

            <h1 className="text-3xl font-black text-slate-900">

              Report Not Found

            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-500">

              {error || 'The requested report could not be found.'}

            </p>

            <Link
              to="/my-reports"
              className="mt-6 inline-flex rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >

              Back to My Reports

            </Link>

          </div>

        </main>

        <Footer />

      </div>

    );

  }


  return (

    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">

      <Header />


      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">


        {/* ================================================= */}
        {/* TOP */}
        {/* ================================================= */}
        <section className="mb-8">

          <Link
            to="/my-reports"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >

            ← Back to My Reports

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

                Patient:
                {' '}
                {report.patientName}

              </p>

            </div>


            <div className="flex flex-wrap gap-3">

              <span
                className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(report.status)}`}
              >

                {report.status?.toUpperCase()}

              </span>


              <span
                className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${
                  report.hasStones
                    ? 'bg-red-100 text-red-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >

                {report.hasStones
                  ? 'STONE DETECTED'
                  : 'NO STONE DETECTED'}

              </span>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================================= */}
        <section className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">

              Report Date

            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-900">

              {new Date(report.createdAt).toLocaleDateString()}

            </h3>

          </div>


          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">

              Stone Count

            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-900">

              {report.stoneCount || 0}

            </h3>

          </div>


          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">

              Reviewed By

            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-900">

              {report?.doctor?.name || 'Doctor'}

            </h3>

          </div>


          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">

              Final Diagnosis

            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-900">

              {report.finalDiagnosis || 'Not Available'}

            </h3>

          </div>

        </section>


        {/* ================================================= */}
        {/* AI DRAFT */}
        {/* ================================================= */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 text-xl font-bold text-slate-900">

            AI Preliminary Analysis

          </h2>

          <div className="rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">

            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">

              {report.aiDraft || 'No AI draft available.'}

            </p>

          </div>

        </section>


        {/* ================================================= */}
        {/* DOCTOR NOTES */}
        {/* ================================================= */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-xl font-bold text-slate-900">

              Doctor Notes

            </h2>

            <div className="rounded-2xl border-l-4 border-orange-500 bg-orange-50 p-4">

              <p className="text-sm leading-7 text-slate-700">

                {report.doctorNotes || 'No doctor notes available.'}

              </p>

            </div>

          </div>


          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-xl font-bold text-slate-900">

              Doctor Advice

            </h2>

            <div className="rounded-2xl border-l-4 border-emerald-500 bg-emerald-50 p-4">

              <p className="text-sm leading-7 text-slate-700">

                {report.doctorAdvice || 'No doctor advice available.'}

              </p>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* FOLLOW UP */}
        {/* ================================================= */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 text-xl font-bold text-slate-900">

            Follow-Up Recommendation

          </h2>

          <div className="rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">

            <p className="text-sm leading-7 text-slate-700">

              {report.followUp || 'No follow-up recommendation available.'}

            </p>

          </div>

        </section>


        {/* ================================================= */}
        {/* DISCLAIMER */}
        {/* ================================================= */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-3 text-lg font-bold text-slate-900">

            Medical Disclaimer

          </h2>

          <p className="text-sm leading-7 text-slate-600">

            This report should always be reviewed together
            with professional medical guidance.
            For urgent symptoms or worsening conditions,
            please contact a qualified medical professional immediately.

          </p>

        </section>

      </main>


      <Footer />

    </div>

  );

};

export default ReportDetailsPage;