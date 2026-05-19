import React, { useState } from 'react';
import api from '../../services/api';

const DoctorReportReview = ({ report, onVerifiedSuccess }) => {

  const [editedDraft, setEditedDraft] = useState(report?.aiDraft || '');
  const [doctorNotes, setDoctorNotes]  = useState(report?.doctorNotes || '');
  const [doctorAdvice, setDoctorAdvice] = useState(report?.doctorAdvice  || '');
  const [followUp, setFollowUp] = useState(report?.followUp || '');
  const [finalDiagnosis, setFinalDiagnosis] = useState(
    report?.finalDiagnosis ||
    (report?.hasStones ? 'Urolithiasis Detected' : 'Normal / No Stones')
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRejecting, setIsRejecting]  = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  
  // CONFIRM REPORT
 
  const handleConfirmReport = async () => {
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await api.put(
        `/reports/${report._id}/confirm`,
        {
          aiDraft: editedDraft,
          doctorNotes,
          doctorAdvice,
          followUp,
          finalDiagnosis,
        }
      );

      if (response.data.success) {
        setSuccessMessage(
          'Report confirmed and sent to the patient successfully.'
        );
        if (onVerifiedSuccess) {
          onVerifiedSuccess(response.data.report);
        }
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
        'Failed to confirm report. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  
  // REJECT REPORT 
 
  const handleRejectReport = async () => {
    if (!window.confirm('Are you sure you want to reject this report?')) return;

    setIsRejecting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await api.put(
        `/reports/${report._id}/reject`
      );

      if (response.data.success) {
        setSuccessMessage('Report rejected successfully.');
        if (onVerifiedSuccess) {
          onVerifiedSuccess(response.data.report);
        }
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
        'Failed to reject report. Please try again.'
      );
    } finally {
      setIsRejecting(false);
    }
  };

  // No report
  if (!report) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        No report data found.
      </div>
    );
  }

  const isConfirmed = report.doctorConfirmed || report.status === 'confirmed';
  const isRejected  = report.status === 'rejected';
  const isLocked = isConfirmed || isRejected;

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

      {/*  Header  */}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
          Doctor Review Panel
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Review the AI-generated draft, edit the diagnosis,
          and confirm the final report before it becomes visible to the patient.
        </p>

        {successMessage && (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            ✅ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            ⚠️ {errorMessage}
          </div>
        )}
      </div>

      {/*  Patient Summary  */}
      <div className="mb-6 rounded-2xl bg-slate-50 p-5">
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Patient Summary
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Patient Name</p>
            <p className="font-semibold text-slate-900">
              {report.patientName || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Age / Gender</p>
            <p className="font-semibold text-slate-900">
              {report.patientAge || 'N/A'} / {report.patientGender || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Detection Result</p>
            <p className="font-semibold text-slate-900">
              {report.hasStones
                ? `⚠️ Detected ${report.stoneCount} stone(s)`
                : '✅ No stones detected'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Current Status</p>
            <p className="font-semibold capitalize text-slate-900">
              {report.status || 'pending'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Doctor Validation</p>
            <p className="font-semibold text-slate-900">
              {isConfirmed ? '✅ Confirmed' : isRejected ? '❌ Rejected' : '⏳ Pending Review'}
            </p>
          </div>
        </div>
      </div>

      {/*  Phase 1 AI Summary  */}
      {report.phase1 && (
        <div className="mb-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">
          <h3 className="text-lg font-bold text-purple-900">
            Phase 1 — Classification (EfficientNet-B0)
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Result</p>
              <p className="font-bold text-slate-900 capitalize">
                {report.phase1.result || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Confidence</p>
              <p className="font-bold text-purple-700">
                {report.phase1.confidence
                  ? `${report.phase1.confidence.toFixed(2)}%`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/*  AI Diagnostic Summary  */}
      <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h3 className="text-lg font-bold text-blue-900">
          Phase 2 — AI Detection Summary (YOLOv8)
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Detection Status</p>
            <p className="font-bold text-slate-900">
              {report.hasStones ? '⚠️ Stone Detected' : '✅ No Stone'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Stone Count</p>
            <p className="font-bold text-slate-900">{report.stoneCount}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Report Status</p>
            <p className="font-bold uppercase text-slate-900">{report.status}</p>
          </div>
        </div>

        {/* Stone details table */}
        {report.details?.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold uppercase text-slate-500 mb-2">
              Stone Details
            </p>
            {report.details.map((stone, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mb-1 text-sm">
                <span className="text-slate-600">Stone {i + 1}</span>
                <span className="text-slate-600">{stone.location || 'Unknown'}</span>
                <span className="text-blue-600 font-bold">
                  {stone.confidence
                    ? `${(stone.confidence * 100).toFixed(1)}%`
                    : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/*  AI Draft  */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-bold text-slate-800">
          🤖 AI Preliminary Draft
        </label>
        <textarea
          value={editedDraft}
          onChange={(e) => setEditedDraft(e.target.value)}
          rows={12}
          disabled={isLocked}
          className="w-full rounded-2xl border border-slate-300 p-4 font-mono text-sm outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>

      {/*  Final Diagnosis  */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-bold text-slate-800">
          🩺 Final Diagnosis
        </label>
        <input
          type="text"
          value={finalDiagnosis}
          onChange={(e) => setFinalDiagnosis(e.target.value)}
          disabled={isLocked}
          className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Enter final diagnosis"
        />
      </div>

      {/*  Doctor Notes  */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-bold text-slate-800">
          ✍️ Doctor Notes
        </label>
        <textarea
          value={doctorNotes}
          onChange={(e) => setDoctorNotes(e.target.value)}
          rows={4}
          disabled={isLocked}
          className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Add clinical notes here..."
        />
      </div>

      {/*  Doctor Advice  */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-bold text-slate-800">
          💊 Doctor Advice
        </label>
        <textarea
          value={doctorAdvice}
          onChange={(e) => setDoctorAdvice(e.target.value)}
          rows={4}
          disabled={isLocked}
          className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Add treatment advice..."
        />
      </div>

      {/*  Follow Up  */}
      <div className="mb-8">
        <label className="mb-2 block text-sm font-bold text-slate-800">
          📅 Follow-Up Recommendation
        </label>
        <textarea
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
          rows={3}
          disabled={isLocked}
          className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Add follow-up plan here..."
        />
      </div>

      {/*  Action Buttons  */}
      {!isLocked ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Confirm */}
          <button
            onClick={handleConfirmReport}
            disabled={isSubmitting}
            className="flex-1 rounded-2xl py-4 text-base font-bold text-white transition bg-emerald-600 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Confirming...' : '✅ Confirm & Send to Patient'}
          </button>

          {/* Reject */}
          <button
            onClick={handleRejectReport}
            disabled={isRejecting}
            className="flex-1 rounded-2xl py-4 text-base font-bold text-white transition bg-red-500 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRejecting ? 'Rejecting...' : '❌ Reject Report'}
          </button>
        </div>
      ) : (
        <div className={`w-full rounded-2xl py-4 text-center text-base font-bold text-white ${
          isConfirmed ? 'bg-emerald-500' : 'bg-slate-400'
        }`}>
          {isConfirmed ? '✅ Report Already Confirmed' : '❌ Report Rejected'}
        </div>
      )}

    </div>
  );
};

export default DoctorReportReview;