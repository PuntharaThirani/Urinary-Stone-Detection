const Report  = require('../models/Report');


// CREATE AI DRAFT REPORT

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

    // Get stone count from results
    const stoneCount =
      yoloResults?.stoneCount ||
      yoloResults?.detected_objects?.length ||
      0;

    const hasStones = stoneCount > 0;

    // Generate AI draft text
    const date = new Date().toLocaleDateString('en-GB');
    const aiDraft = yoloResults?.aiDraft || `
AI-ASSISTED PRELIMINARY REPORT

Date           : ${date}
System         : UroScan AI — Diagnosis Support System

PATIENT INFORMATION:
Name           : ${patientName   || 'N/A'}
Age            : ${patientAge    || 'N/A'}
Gender         : ${patientGender || 'N/A'}

DETECTION RESULTS:
Status         : ${hasStones ? 'POSITIVE — Stone Detected' : 'NEGATIVE — No Stone Detected'}
Stone Count    : ${stoneCount}

IMPORTANT:
This is an AI-generated preliminary interpretation.
Final diagnosis must be confirmed by a qualified doctor.

    `.trim();

    // Save report to database
    const newReport = new Report({
      doctor:          doctorId,
      patient:         patientId || null,
      patientName,
      patientAge,
      patientGender,
      imageId,
      imagePath,
      aiResult:        yoloResults,
      hasStones,
      stoneCount,
      aiDraft,
      doctorNotes:     '',
      doctorAdvice:    '',
      finalDiagnosis:  '',
      followUp:        '',
      doctorConfirmed: false,
      status:          'pending',
    });

    await newReport.save();

    res.status(201).json({
      success: true,
      message: 'AI draft report created successfully',
      report:  newReport,
    });
  } catch (error) {
    console.error('Create Draft Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create draft report',
      error:   error.message,
    });
  }
};


// CONFIRM FINAL REPORT (Doctor Only)

exports.confirmReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Only the assigned doctor can confirm
    if (report.doctor?.toString() !== req.user.id?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied — not your report',
      });
    }

    const {
      aiDraft,
      doctorNotes,
      doctorAdvice,
      finalDiagnosis,
      followUp,
    } = req.body;

    // Update report fields
    report.aiDraft        = aiDraft        || report.aiDraft;
    report.doctorNotes    = doctorNotes    || report.doctorNotes;
    report.doctorAdvice   = doctorAdvice   || report.doctorAdvice;
    report.finalDiagnosis = finalDiagnosis || (
      report.hasStones
        ? 'Suspicious urinary stone detected'
        : 'No obvious urinary stone detected'
    );
    report.followUp         = followUp || report.followUp;
    report.doctorConfirmed  = true;
    report.status           = 'confirmed';
    report.confirmedAt      = new Date();

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report confirmed successfully',
      report,
    });
  } catch (error) {
    console.error('Confirm Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm report',
      error:   error.message,
    });
  }
};


// EDIT DRAFT REPORT

exports.editDraftReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Only pending reports can be edited
    if (report.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit a confirmed report',
      });
    }

    report.aiDraft = req.body.aiDraft || report.aiDraft;
    await report.save();

    res.status(200).json({
      success: true,
      message: 'Draft report updated successfully',
      report,
    });
  } catch (error) {
    console.error('Edit Draft Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update draft report',
      error:   error.message,
    });
  }
};


// REJECT REPORT

exports.rejectReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Cannot reject already confirmed report
    if (report.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reject an already confirmed report',
      });
    }

    report.status           = 'rejected';
    report.doctorConfirmed  = false;
    report.rejectedAt       = new Date();

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report rejected successfully',
      report,
    });
  } catch (error) {
    console.error('Reject Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject report',
      error:   error.message,
    });
  }
};


// GET ALL REPORTS (Doctor / Admin)

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate('doctor',  'name email role')
      .populate('patient', 'fullName patientId');

    res.status(200).json({
      success: true,
      count:   reports.length,
      reports,
    });
  } catch (error) {
    console.error('Get All Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error:   error.message,
    });
  }
};


// GET SINGLE REPORT BY ID

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('doctor',  'name email role')
      .populate('patient', 'fullName patientId');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Get Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
      error:   error.message,
    });
  }
};


// GET REPORTS BY PATIENT ID

exports.getReportsByPatientId = async (req, res) => {
  try {
    const reports = await Report.find({
      patient: req.params.patientId,
    })
      .sort({ createdAt: -1 })
      .populate('doctor', 'name email role');

    res.status(200).json({
      success: true,
      count:   reports.length,
      reports,
    });
  } catch (error) {
    console.error('Get Reports By Patient Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient reports',
      error:   error.message,
    });
  }
};


// GET MY FINAL REPORTS (Logged-in Patient)

exports.getMyFinalReports = async (req, res) => {
  try {
    // Find reports where patient matches logged-in user
    const reports = await Report.find({
      $or: [
        { patient: req.user.id },
        { patientName: req.user.name },
      ],
      doctorConfirmed: true,
      status:          'confirmed',
    })
      .sort({ createdAt: -1 })
      .populate('doctor', 'name email role');

    res.status(200).json({
      success: true,
      count:   reports.length,
      reports,
    });
  } catch (error) {
    console.error('Get My Final Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch finalized reports',
      error:   error.message,
    });
  }
};


// GET DOCTOR'S OWN REPORTS

exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({
      doctor: req.user.id,
    })
      .sort({ createdAt: -1 })
      .populate('patient', 'fullName patientId');

    res.status(200).json({
      success: true,
      count:   reports.length,
      reports,
    });
  } catch (error) {
    console.error('Get My Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error:   error.message,
    });
  }
};


// DELETE REPORT (Admin Only)

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Delete Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error:   error.message,
    });
  }
};