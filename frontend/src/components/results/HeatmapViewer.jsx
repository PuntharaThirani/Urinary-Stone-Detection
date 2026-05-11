import React, { useState } from 'react';

const HeatmapViewer = ({
  originalImage,
  processedImage,
}) => {

  const [showProcessed, setShowProcessed] =
    useState(true);

  if (!originalImage) return null;

  // Format image URLs correctly
  const formatImageUrl = (url) => {

  if (!url) return null;

  // Blob URL
  if (url.startsWith('blob:')) {
    return url;
  }

  // Base64 image
  if (url.startsWith('data:image')) {
    return url;
  }

  // Full URL
  if (url.startsWith('http')) {
    return url;
  }

  // Relative backend path
  return `http://localhost:5000${
    url.startsWith('/')
      ? url
      : `/${url}`
  }`;
};

  const originalUrl =
    formatImageUrl(originalImage);

  const processedUrl =
    formatImageUrl(processedImage);

  const activeImage =
    showProcessed && processedUrl
      ? processedUrl
      : originalUrl;

  console.log(
    'ORIGINAL:',
    originalUrl
  );

  console.log(
    'PROCESSED:',
    processedUrl
  );

  return (

    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-5 text-center">

        <h3 className="text-xl font-bold text-slate-900">
          Image Analysis View
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Switch between the original scan and the AI-processed visualization.
        </p>

      </div>

      {/* Image */}
      <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-black">

        <img
          src={activeImage}
          alt="Scan analysis preview"
          className="max-h-[420px] max-w-full object-contain"

          onError={(e) => {

            console.error(
              'IMAGE LOAD FAILED:',
              activeImage
            );

            e.target.src = originalUrl;
          }}
        />

      </div>

      {/* Buttons */}
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">

        <button
          type="button"
          onClick={() =>
            setShowProcessed(false)
          }
          className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
            !showProcessed
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          📷 Original View
        </button>

        <button
          type="button"
          onClick={() =>
            setShowProcessed(true)
          }

          disabled={!processedUrl}

          className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
            showProcessed && processedUrl
              ? 'bg-blue-600 text-white shadow-md'
              : processedUrl
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                : 'cursor-not-allowed bg-slate-100 text-slate-400'
          }`}
        >
          🎯 AI Detection View

          {!processedUrl && (

            <span className="ml-2 text-xs">
              (Not available)
            </span>

          )}
        </button>

      </div>

      {/* Footer */}
      <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-center">

        <p className="text-xs leading-6 text-slate-500">
          The AI detection view shows bounding boxes around detected urinary stones identified by the YOLOv8 model.
        </p>

      </div>

    </div>
  );
};

export default HeatmapViewer;