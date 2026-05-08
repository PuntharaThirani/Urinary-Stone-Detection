import React, { useState } from 'react';

import api from '../../services/api';

const DoctorReportReview = ({ report, onVerifiedSuccess }) => {

  const [editedDraft, setEditedDraft] = useState(
    report?.aiDraft || ''
  );

  const [doctorNotes, setDoctorNotes] = useState(
    report?.doctorNotes || ''
  );

  const [doctorAdvice, setDoctorAdvice] = useState(
    report?.doctorAdvice || ''
  );

  const [followUp, setFollowUp] = useState(
    report?.followUp || ''
  );

  const [finalDiagnosis, setFinalDiagnosis] = useState(

    report?.finalDiagnosis ||

    (report?.hasStones
      ? 'Urolithiasis Detected'
      : 'Normal / No Stones')

  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');


  // =====================================================
  // CONFIRM REPORT
  // =====================================================
  const handleConfirmReport = async () => {

    setIsSubmitting(true);

    setSuccessMessage('');

    setErrorMessage('');

    try {

      const response = await api.confirmReport(

        report._id,

        {
          aiDraft: editedDraft,
          doctorNotes,
          doctorAdvice,
          followUp,
          finalDiagnosis,
          status: 'confirmed',
        }

      );

      if (response.data.success) {

        setSuccessMessage(
          'Report successfully confirmed and sent to the patient.'
        );

        if (onVerifiedSuccess) {
          onVerifiedSuccess(response.data.report);
        }

      }

    } catch (error) {

      console.error('Error confirming report:', error);

      setErrorMessage(
        error?.response?.data?.message ||
        'Failed to verify the report. Please try again.'
      );

    } finally {

      setIsSubmitting(false);

    }

  };


  // =====================================================
  // NO REPORT
  // =====================================================
  if (!report) {

    return (

      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">

        No report data found.

      </div>

    );

  }


  return (

    <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}
      <div className="mb-6 border-b border-slate-200 pb-4">

        <h2 className="text-2xl font-black text-slate-900 md:text-3xl">

          Doctor Review Panel

        </h2>

        <p className="mt-2 text-sm text-slate-500">

          Review the AI-generated draft, edit the diagnosis,
          and confirm the final report before it becomes
          visible to the patient.

        </p>


        {/* SUCCESS */}
        {successMessage && (

          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

            ✅ {successMessage}

          </div>

        )}


        {/* ERROR */}
        {errorMessage && (

          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            ⚠️ {errorMessage}

          </div>

        )}

      </div>


      {/* ================================================= */}
      {/* PATIENT SUMMARY */}
      {/* ================================================= */}
      <div className="mb-6 rounded-2xl bg-slate-50 p-5">

        <h3 className="mb-4 text-lg font-bold text-slate-900">

          Patient Summary

        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          <div>

            <p className="text-sm text-slate-500">
              Patient Name
            </p>

            <p className="font-semibold text-slate-900">
              {report.patientName}
            </p>

          </div>


          <div>

            <p className="text-sm text-slate-500">
              Age / Gender
            </p>

            <p className="font-semibold text-slate-900">

              {report.patientAge} / {report.patientGender}

            </p>

          </div>


          <div>

            <p className="text-sm text-slate-500">
              Detection Result
            </p>

            <p className="font-semibold text-slate-900">

              {report.hasStones
                ? `⚠️ Detected ${report.stoneCount} stone(s)`
                : '✅ No stones detected'}

            </p>

          </div>


          <div>

            <p className="text-sm text-slate-500">
              Current Status
            </p>

            <p className="font-semibold capitalize text-slate-900">

              {report.status || 'pending'}

            </p>

          </div>


          <div>

            <p className="text-sm text-slate-500">
              Doctor Validation
            </p>

            <p className="font-semibold text-slate-900">

              {report.doctorConfirmed
                ? '✅ Confirmed'
                : '⏳ Pending Review'}

            </p>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* AI DIAGNOSTIC SUMMARY */}
      {/* ================================================= */}
      <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

        <h3 className="text-lg font-bold text-blue-900">

          AI Diagnostic Summary

        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-3">

          <div>

            <p className="text-sm text-slate-500">
              Detection Status
            </p>

            <p className="font-bold text-slate-900">

              {report.hasStones
                ? 'Stone Detected'
                : 'No Stone Detected'}

            </p>

          </div>


          <div>

            <p className="text-sm text-slate-500">
              Stone Count
            </p>

            <p className="font-bold text-slate-900">

              {report.stoneCount}

            </p>

          </div>


          <div>

            <p className="text-sm text-slate-500">
              Report Status
            </p>

            <p className="font-bold uppercase text-slate-900">

              {report.status}

            </p>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* AI PRELIMINARY DRAFT */}
      {/* ================================================= */}
      <div className="mb-6">

        <label className="mb-2 block text-sm font-bold text-slate-800">

          🤖 AI Preliminary Draft

        </label>

        <textarea
          value={editedDraft}
          onChange={(e) => setEditedDraft(e.target.value)}
          rows={12}
          disabled={report.doctorConfirmed}
          className="w-full rounded-2xl border border-slate-300 p-4 font-mono text-sm outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
        />

      </div>


      {/* ================================================= */}
      {/* FINAL DIAGNOSIS */}
      {/* ================================================= */}
      <div className="mb-6">

        <label className="mb-2 block text-sm font-bold text-slate-800">

          🩺 Final Diagnosis

        </label>

        <input
          type="text"
          value={finalDiagnosis}
          onChange={(e) => setFinalDiagnosis(e.target.value)}
          disabled={report.doctorConfirmed}
          className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Enter final diagnosis"
        />

      </div>


      {/* ================================================= */}
      {/* DOCTOR NOTES */}
      {/* ================================================= */}
      <div className="mb-6">

        <label className="mb-2 block text-sm font-bold text-slate-800">

          ✍️ Doctor Notes

        </label>

        <textarea
          value={doctorNotes}
          onChange={(e) => setDoctorNotes(e.target.value)}
          rows={4}
          disabled={report.doctorConfirmed}
          className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Add clinical notes here..."
        />

      </div>


      {/* ================================================= */}
      {/* DOCTOR ADVICE */}
      {/* ================================================= */}
      <div className="mb-6">

        <label className="mb-2 block text-sm font-bold text-slate-800">

          💊 Doctor Advice

        </label>

        <textarea
          value={doctorAdvice}
          onChange={(e) => setDoctorAdvice(e.target.value)}
          rows={4}
          disabled={report.doctorConfirmed}
          className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Add treatment advice / recommendations here..."
        />

      </div>


      {/* ================================================= */}
      {/* FOLLOW UP */}
      {/* ================================================= */}
      <div className="mb-8">

        <label className="mb-2 block text-sm font-bold text-slate-800">

          📅 Follow-Up Recommendation

        </label>

        <textarea
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
          rows={3}
          disabled={report.doctorConfirmed}
          className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Add follow-up plan here..."
        />

      </div>


      {/* ================================================= */}
      {/* ACTION BUTTON */}
      {/* ================================================= */}
      <button
        onClick={handleConfirmReport}
        disabled={isSubmitting || report.doctorConfirmed}
        className={`w-full rounded-2xl py-4 text-base font-bold text-white transition ${
          isSubmitting || report.doctorConfirmed
            ? 'cursor-not-allowed bg-slate-400'
            : 'bg-emerald-600 hover:bg-emerald-700'
        }`}
      >

        {report.doctorConfirmed
          ? '✅ Report Already Confirmed'
          : isSubmitting
          ? 'Confirming Report...'
          : '✅ Confirm & Send to Patient'}

      </button>

    </div>

  );

};

export default DoctorReportReview;