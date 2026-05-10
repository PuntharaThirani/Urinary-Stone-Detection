import React from 'react';

const UploadProgress = ({
  progress = 0,
  message  = 'Processing...',
  status   = 'uploading', // uploading, analyzing, complete, error
}) => {

  const statusColors = {
    uploading: 'bg-blue-600',
    analyzing: 'bg-purple-600',
    complete:  'bg-emerald-600',
    error:     'bg-red-500',
  };

  const barColor = statusColors[status] || statusColors.uploading;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      {/* Message + Percentage */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          {message}
        </span>
        <span className="text-sm font-bold text-slate-900">
          {Math.min(100, Math.max(0, progress))}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-in-out ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      {/* Status label */}
      {status === 'complete' && (
        <p className="mt-2 text-xs font-medium text-emerald-600">
          ✅ Complete
        </p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-xs font-medium text-red-600">
          ❌ Error occurred
        </p>
      )}
      {status === 'analyzing' && (
        <p className="mt-2 text-xs font-medium text-purple-600 animate-pulse">
          🤖 AI Model Analyzing...
        </p>
      )}
    </div>
  );
};

export default UploadProgress;