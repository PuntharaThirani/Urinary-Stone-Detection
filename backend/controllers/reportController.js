const Report = require('../models/Report');

// 1. Create AI Draft Report
exports.createDraftReport = async (req, res) => {
  try {
    const {
      doctorId,
      patientId,
      patientName,
      patientAge,
      patientGender,
      imageId,
      imagePath,
      yoloResults,
    } = req.body;

    const stoneCount = yoloResults?.detected_objects?.length || 0;
    const hasStones = stoneCount > 0;

    const date = new Date().toLocaleDateString('en-GB');

    const findingText = hasStones
      ? `The YOLOv8 model identified ${stoneCount} suspected urinary stone object(s) in the KUB X-ray image.`
      : 'No obvious radiographic evidence of urinary stones was detected in the uploaded KUB X-ray image.';

    const aiDraftText = `MEDICAL IMAGING REPORT (AI-ASSISTED PRELIMINARY DRAFT)
==================================================
Date of Analysis: ${date}

PATIENT SUMMARY:
- Name: ${patientName}
- Age: ${patientAge}
- Gender: ${patientGender}

RADIOLOGICAL FINDINGS (AI):
- Observations: ${findingText}
- Stone Count: ${stoneCount}

CLINICAL IMPRESSION:
- ${hasStones ? 'Findings suggest possible urolithiasis.' : 'No obvious urinary stones detected.'}

--------------------------------------------------
IMPORTANT:
This is an AI-generated preliminary draft based on KUB X-ray analysis.
Final validation by a qualified doctor is mandatory.
==================================================`;

    const newReport = new Report({
      doctor: doctorId,
      patient: patientId || null,
      patientName,
      patientAge,
      patientGender,
      imageId,
      imagePath,
      aiResult: yoloResults,
      hasStones,
      stoneCount,
      aiDraft: aiDraftText,
      doctorNotes: '',
      doctorAdvice: '',
      finalDiagnosis: '',
      followUp: '',
      doctorConfirmed: false,
      status: 'pending',
    });

    await newReport.save();

    res.status(201).json({
      success: true,
      message: 'Draft report generated successfully.',
      report: newReport,
    });
  } catch (error) {
    console.error('Create Draft Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate draft report.',
      error: error.message,
    });
  }
};

// 2. Confirm Report by Doctor
exports.confirmReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const {
      doctorNotes,
      doctorAdvice,
      finalDiagnosis,
      followUp,
    } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    report.doctorNotes = doctorNotes || report.doctorNotes;
    report.doctorAdvice = doctorAdvice || report.doctorAdvice;
    report.finalDiagnosis =
      finalDiagnosis || (report.hasStones ? 'Stone Detected' : 'No Stone Detected');
    report.followUp = followUp || report.followUp;
    report.doctorConfirmed = true;
    report.status = 'confirmed';

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report confirmed successfully.',
      report,
    });
  } catch (error) {
    console.error('Confirm Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm report.',
      error: error.message,
    });
  }
};

// 3. Get All Reports (Doctor / Staff)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate('doctor', 'name email role')
      .populate('patient', 'fullName patientId');

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error('Get All Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports.',
      error: error.message,
    });
  }
};

// 4. Get Single Report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('doctor', 'name email role')
      .populate('patient', 'fullName patientId');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Get Report By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report.',
      error: error.message,
    });
  }
};

// 5. Get Reports by Patient ID
exports.getReportsByPatientId = async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.params.patientId })
      .sort({ createdAt: -1 })
      .populate('doctor', 'name email role');

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error('Get Patient Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient reports.',
      error: error.message,
    });
  }
};

// 6. Get Finalized Reports for Logged-in Patient
exports.getMyFinalReports = async (req, res) => {
  try {
    const reports = await Report.find({
      patient: req.user.id,
      doctorConfirmed: true,
      status: 'confirmed',
    })
      .sort({ createdAt: -1 })
      .populate('doctor', 'name email role');

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error('Get My Final Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching finalized patient reports.',
      error: error.message,
    });
  }
};