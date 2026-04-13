import React from 'react';
import { formatDate } from '../../utils/helpers';

const ReportCard = ({ report, onClick }) => {
  if (!report) return null;

  const hasStones = Boolean(report.hasStones);
  const patientName = report.patientName || 'Unknown Patient';
  const reportId = report._id ? `${report._id.substring(0, 8)}...` : 'N/A';
  const createdDate = report.createdAt ? formatDate(report.createdAt) : 'Not available';
  const status = report.status || 'pending';

  const statusClasses =
    status === 'confirmed'
      ? 'bg-blue-100 text-blue-700'
      : status === 'rejected'
      ? 'bg-slate-200 text-slate-700'
      : 'bg-amber-100 text-amber-700';

  return (
    <button
      type="button"
      onClick={() => onClick?.(report)}
      className="group flex w-full items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
    >
      <span
        className={`h-3.5 w-3.5 flex-shrink-0 rounded-full ${
          hasStones ? 'bg-red-500' : 'bg-emerald-500'
        }`}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{patientName}</h3>

            <div className="mt-2 space-y-1 text-sm text-slate-500">
              <p>📅 Date: {createdDate}</p>
              <p>🆔 Report ID: {reportId}</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-bold ${
                hasStones
                  ? 'bg-red-100 text-red-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {hasStones ? 'Stone Indicated' : 'No Stone Indicated'}
            </span>

            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-bold capitalize ${statusClasses}`}
            >
              {status}
            </span>

            <span className="text-sm font-semibold text-blue-600 transition group-hover:translate-x-1">
              View details →
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ReportCard;