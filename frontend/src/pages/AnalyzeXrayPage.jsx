import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

import api from '../services/api';

const AnalyzeXrayPage = () => {

  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [loadingText, setLoadingText] = useState('');

  const [error, setError] = useState('');

  const [isDragging, setIsDragging] = useState(false);


  // =====================================================
  // Cleanup Preview URL
  // =====================================================
  useEffect(() => {

    return () => {

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

    };

  }, [previewUrl]);


  // =====================================================
  // Handle File Selection
  // =====================================================
  const handleImageChange = (e) => {

    const file = e.target.files?.[0];

    processFile(file);

  };


  // =====================================================
  // Drag Events
  // =====================================================
  const handleDragOver = (e) => {

    e.preventDefault();

    setIsDragging(true);

  };

  const handleDragLeave = (e) => {

    e.preventDefault();

    setIsDragging(false);

  };

  const handleDrop = (e) => {

    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    processFile(file);

  };


  // =====================================================
  // Validate + Preview File
  // =====================================================
  const processFile = (file) => {

    if (file && file.type.startsWith('image/')) {

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const objectUrl = URL.createObjectURL(file);

      setSelectedImage(file);

      setPreviewUrl(objectUrl);

      setError('');

    } else if (file) {

      setError(
        'Please upload a valid image file such as JPG, JPEG, or PNG.'
      );

    }

  };


  // =====================================================
  // Run AI Analysis
  // =====================================================
  const handleRunAnalysis = async () => {

    if (!selectedImage) return;

    setIsAnalyzing(true);

    setError('');

    try {

      // -----------------------------------------------
      // Uploading
      // -----------------------------------------------
      setLoadingText('Uploading X-ray image...');

      const response =
        await api.uploadAndPredict(selectedImage);

      // -----------------------------------------------
      // Extract Data
      // -----------------------------------------------
      const analysisData = response?.analysis;

      const reportData = response?.report;

      // -----------------------------------------------
      // Validate Response
      // -----------------------------------------------
      if (!analysisData || !reportData) {

        throw new Error(
          'Invalid AI analysis response received from the server.'
        );

      }

      // -----------------------------------------------
      // Opening Results
      // -----------------------------------------------
      setLoadingText(
        'Generating preliminary diagnosis report...'
      );

      // -----------------------------------------------
      // Navigate to Results Page
      // -----------------------------------------------
      navigate('/results', {

        state: {

          analysis: analysisData,

          report: reportData,

          image: previewUrl,

        },

      });

    } catch (err) {

      console.error(
        'AI Analysis Error:',
        err
      );

      setError(

        err?.response?.data?.message ||

        err?.message ||

        'AI analysis failed. Please try again.'

      );

    } finally {

      setIsAnalyzing(false);

      setLoadingText('');

    }

  };


  // =====================================================
  // Reset Upload
  // =====================================================
  const handleReset = () => {

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(null);

    setPreviewUrl(null);

    setError('');

    setLoadingText('');

    setIsAnalyzing(false);

  };


  return (

    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">

      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">

        {/* ================================================= */}
        {/* PAGE HEADER */}
        {/* ================================================= */}
        <section className="mb-6">

          <Link
            to="/doctor-dashboard"
            className="inline-block text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            AI Diagnostic X-ray Analysis
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
            Upload a KUB X-ray image to perform AI-assisted urinary
            stone detection and generate a preliminary diagnostic support report.
          </p>

        </section>


        {/* ================================================= */}
        {/* ERROR MESSAGE */}
        {/* ================================================= */}
        {error && (

          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            ⚠️ {error}

          </div>

        )}


        {/* ================================================= */}
        {/* MAIN GRID */}
        {/* ================================================= */}
        <section className="grid gap-6 xl:grid-cols-2">

          {/* ============================================= */}
          {/* IMAGE PREVIEW */}
          {/* ============================================= */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 border-b border-slate-100 pb-3">

              <h2 className="text-xl font-bold text-slate-900">
                Scan Preview
              </h2>

            </div>

            {!previewUrl ? (

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-2xl border-2 border-dashed px-6 py-16 text-center transition ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 bg-slate-50'
                }`}
              >

                <div className="mb-3 text-5xl">

                  {isDragging ? '📂' : '📤'}

                </div>

                <p className="text-lg font-bold text-slate-700">
                  {isDragging
                    ? 'Drop image here'
                    : 'Drag & Drop X-ray Image'}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Supported formats: JPG, JPEG, PNG
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="file-upload"
                />

                <label
                  htmlFor="file-upload"
                  className="mt-6 inline-flex cursor-pointer rounded-xl border border-blue-600 bg-white px-5 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
                >
                  Browse Files
                </label>

              </div>

            ) : (

              <div className="flex flex-col items-center">

                <div className="relative mb-5 flex h-[350px] w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-black">

                  <img
                    src={previewUrl}
                    alt="Uploaded scan preview"
                    className="max-h-full max-w-full object-contain"
                  />

                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row">

                  <button
                    onClick={handleReset}
                    disabled={isAnalyzing}
                    className="flex-1 rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Remove
                  </button>

                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className={`flex-[2] rounded-xl px-4 py-3 text-sm font-bold transition ${
                      isAnalyzing
                        ? 'cursor-not-allowed bg-blue-200 text-blue-800'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isAnalyzing
                      ? `⚙️ ${loadingText}`
                      : '🚀 Run AI Diagnostic Analysis'}
                  </button>

                </div>

              </div>

            )}

          </div>


          {/* ============================================= */}
          {/* ANALYSIS STATUS */}
          {/* ============================================= */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 border-b border-slate-100 pb-3">

              <h2 className="text-xl font-bold text-slate-900">
                Analysis Status
              </h2>

            </div>

            {!previewUrl ? (

              <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl bg-slate-50 px-6 text-center text-slate-500">

                <p className="text-4xl">📄</p>

                <p className="mt-3 text-sm font-medium">
                  Upload an X-ray image to begin.
                </p>

              </div>

            ) : isAnalyzing ? (

              <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl bg-slate-50 px-6 text-center">

                <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></span>

                <p className="mt-4 text-sm font-bold text-blue-600">
                  {loadingText}
                </p>

                <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">

                  The uploaded X-ray image is being processed
                  through the AI diagnostic pipeline.

                </p>

              </div>

            ) : (

              <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl bg-slate-50 px-6 text-center text-slate-500">

                <p className="text-4xl text-emerald-500">✅</p>

                <p className="mt-3 text-sm font-medium">
                  AI diagnostic analysis is ready.
                </p>

                <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">

                  The system will analyze the uploaded
                  X-ray image and generate a preliminary
                  diagnostic support report for doctor review.

                </p>

              </div>

            )}

          </div>

        </section>

      </main>

      <Footer />

    </div>

  );

};

export default AnalyzeXrayPage;