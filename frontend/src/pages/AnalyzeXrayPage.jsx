import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';

const AnalyzeXrayPage = () => {

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Patient info for report
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('male');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');

  // Loading steps
  const loadingSteps = [
    'Uploading X-ray image...',
    'Running Phase 1 Classification (EfficientNet-B0)...',
    'Running Phase 2 Detection (YOLOv8)...',
    'Generating preliminary diagnosis report...',
  ];

  // Cleanup preview URL on unmount
useEffect(() => {
  fetchPatients();
}, []);

  // Validate and process file
  const processFile = (file) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file: JPG, JPEG, or PNG.');
      return;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 5MB.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  const handleImageChange = (e) => processFile(e.target.files?.[0]);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true);  };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files?.[0]); };

  // Run AI Analysis — Upload → Predict → Navigate
  const fetchPatients = async () => {

  try {

    const res = await api.get('/patients');

    setPatients(
      res.data.data || []
    );

  } catch (err) {

    console.error(
      'Failed to fetch patients:',
      err
    );

  }
};

  const handleRunAnalysis = async () => {

  if (!selectedImage) return;

  if (!selectedPatient) {

    setError('Please select a patient');
    return;
  }

  setIsAnalyzing(true);
  setError('');

  try {

    // Step 1 — Upload image
    setLoadingStep(0);

    const formData = new FormData();

    formData.append(
      'image',
      selectedImage
    );

    const uploadRes = await api.post(
      '/upload',
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    );

    const imagePath =
      uploadRes.data.image?.filePath;

    if (!imagePath) {
      throw new Error(
        'Image upload failed'
      );
    }

    // Step 2 — AI Prediction
    setLoadingStep(1);

    await new Promise((r) =>
      setTimeout(r, 500)
    );

    setLoadingStep(2);

    const predictRes = await api.post(
      '/predict',
      { imagePath }
    );

    if (!predictRes.data.success) {

      throw new Error(
        'AI analysis failed'
      );
    }

    // Step 3 — Create Draft Report
    setLoadingStep(3);

    const authData =
      JSON.parse(
        localStorage.getItem('auth')
      ) || {};

    console.log(
      'AUTH:',
      authData
    );

    console.log(
      'DOCTOR ID:',
      authData?.user?.id
    );

    console.log(
      'PATIENT:',
      selectedPatient
    );

    const reportRes = await api.post(
      '/reports/draft',
      {

        doctorId:
          authData?.user?.id,

        patientId:
          selectedPatient,

        patientName:
          patientName ||
          'Unknown Patient',

        patientAge:
          patientAge || null,

        patientGender:
          patientGender,

        imagePath,

        yoloResults: {

          hasStones:
            predictRes.data.hasStones,

          stoneCount:
            predictRes.data.stoneCount,

          details:
            predictRes.data.details || [],

          phase1:
            predictRes.data.phase1 || null,
        },
      }
    );

    // Navigate to Results Page
    navigate('/results', {

  state: {

    analysis: {

      hasStones:
        predictRes.data.hasStones,

      stoneCount:
        predictRes.data.stoneCount,

      details:
        predictRes.data.details,

      phase1:
        predictRes.data.phase1,

      annotatedImageUrl:
        predictRes.data
          .annotatedImageUrl,
    },

    report:
      reportRes.data.report,

    image:
      previewUrl,
  },
});

  } catch (err) {

    console.error(
      'ANALYSIS ERROR:',
      err
    );

    setError(

      err?.response?.data?.message ||

      err?.message ||

      'AI analysis failed. Please try again.'
    );

  } finally {

    setIsAnalyzing(false);
    setLoadingStep(0);
  }
};


  // Reset
  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);

    setPreviewUrl(null);

    setError('');
    setPatientName('');
    setPatientAge('');
    setPatientGender('male');
  };


  return (

    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">

      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-8 lg:px-10">

        {/*  Page Header  */}
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
            Upload a KUB X-ray image to perform AI-assisted urinary stone
            detection and generate a preliminary diagnostic support report.
          </p>

        </section>

        {/*  Error  */}
        {error && (

          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            ⚠️ {error}
          
          </div>

        )}

        <div className="grid gap-6 xl:grid-cols-2">

          {/*  Left — Upload  */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 border-b border-slate-100 pb-3">
              <h2 className="text-xl font-bold text-slate-900">Scan Preview</h2>
            </div>

            {!previewUrl ? (

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-16 text-center transition ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >

                <div className="mb-3 text-5xl">

                  {isDragging ? '📂' : '📤'}

                </div>

                <p className="text-lg font-bold text-slate-700">
                  {isDragging ? 'Drop image here' : 'Drag & Drop X-ray Image'}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  JPG, JPEG, PNG — Max 5MB
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"

                />
                <span className="mt-6 inline-flex cursor-pointer rounded-xl border border-blue-600 bg-white px-5 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50">
                  Browse Files
                </span>
              </div>

            ) : (

              <div className="flex flex-col items-center">
                <div className="relative mb-5 flex h-[300px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-black">
                  <img
                    src={previewUrl}
                    alt="Uploaded scan"
                    className="max-h-full max-w-full object-contain"
                  />

                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row">

                  <button
                    onClick={handleReset}
                    disabled={isAnalyzing}
                    className="flex-1 rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
                  >
                    Remove
                  </button>

                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="flex-[2] rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isAnalyzing
                      ? `⚙️ ${loadingSteps[loadingStep]}`
                      : '🚀 Run AI Diagnostic Analysis'}
                  </button>

                </div>

              </div>

            )}

          </div>

          {/*  Right — Patient Info + Status  */}
          <div className="space-y-6">

            {/* Patient Info Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5 border-b border-slate-100 pb-3">

            <h2 className="text-xl font-bold text-slate-900">
              Patient Information
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Select a registered patient for report generation
            </p>

          </div>

           <div className="space-y-4">

               {/* Select Patient */}
          <div>

            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Select Patient
            </label>

            <select
              value={selectedPatient}
              onChange={(e) => {

          const patient =
            patients.find(
              (p) => p._id === e.target.value
            );

          setSelectedPatient(
            e.target.value
          );

          if (patient) {

            setPatientName(
              patient.fullName
            );

            setPatientAge(
              patient.age || ''
            );

            setPatientGender(
              patient.gender || 'male'
            );
          }
        }}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
      >

        <option value="">
          Select Patient
        </option>

        {patients.map((patient) => (

          <option
            key={patient._id}
            value={patient._id}
          >
            {patient.patientId} - {patient.fullName}
          </option>

        ))}

      </select>

    </div>

    {/* Patient Age */}
    <div className="grid grid-cols-2 gap-4">

      <div>

        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
          Age
        </label>

        <input
          type="number"
          value={patientAge}
          readOnly
          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm"
        />

      </div>

      {/* Patient Gender */}
      <div>

        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
          Gender
        </label>

        <input
          type="text"
          value={patientGender}
          readOnly
          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm capitalize"
        />

      </div>

    </div>

  </div>

</div>

            {/* Analysis Status */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 border-b border-slate-100 pb-3">
                <h2 className="text-xl font-bold text-slate-900">Analysis Status</h2>
              </div>

              {!previewUrl ? (
                <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl bg-slate-50 text-center text-slate-500">
                  <p className="text-4xl">📄</p>
                  <p className="mt-3 text-sm font-medium">Upload an X-ray image to begin.</p>
                </div>
              ) : isAnalyzing ? (
                <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl bg-slate-50 text-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                  <p className="mt-4 text-sm font-bold text-blue-600">
                    {loadingSteps[loadingStep]}
                  </p>

                  {/* Progress steps */}
                  <div className="mt-4 w-full max-w-xs space-y-1 px-4">
                    {loadingSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={i <= loadingStep ? 'text-blue-600' : 'text-slate-300'}>
                          {i < loadingStep ? '✅' : i === loadingStep ? '⚙️' : '⏳'}
                        </span>
                        <span className={i <= loadingStep ? 'text-slate-700' : 'text-slate-400'}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl bg-emerald-50 text-center">
                  <p className="text-4xl">✅</p>
                  <p className="mt-3 text-sm font-bold text-emerald-700">
                    Ready for AI Analysis
                  </p>
                  <p className="mt-2 max-w-xs text-xs leading-6 text-slate-500">
                    Click "Run AI Diagnostic Analysis" to begin.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

    </div>

  );

};

export default AnalyzeXrayPage;