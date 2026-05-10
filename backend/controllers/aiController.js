const path    = require('path');
const fs      = require('fs');
const { spawn } = require('child_process');

const XrayImage = require('../models/XrayImage');
const Report    = require('../models/Report');


// Run Python AI Model

const runPythonModel = (imagePath) => {
  return new Promise((resolve, reject) => {
    // Path to detect.py
    const scriptPath = path.join(__dirname, '..', 'AI', 'detect.py');

    // Spawn Python process
    const python = spawn('python', [scriptPath, imagePath]);

    let dataString  = '';
    let errorString = '';

    // Collect output from Python
    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    // Collect errors from Python
    python.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    // On process close
    python.on('close', (code) => {
      if (code !== 0) {
        console.error('Python Error:', errorString);
        return reject(new Error(`Python process failed: ${errorString}`));
      }

      try {
        const result = JSON.parse(dataString);
        resolve(result);
      } catch (e) {
        reject(new Error('Failed to parse Python output'));
      }
    });
  });
};


// ANALYZE X-RAY — Main Controller

exports.analyzeXray = async (req, res) => {
  try {
    // Validate uploaded file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No X-ray image uploaded',
      });
    }

    const imagePath = req.file.path;

    // Run AI Model (Python)
    let aiResult;
    try {
      aiResult = await runPythonModel(imagePath);
    } catch (pyError) {
      console.error('AI Model Error:', pyError.message);
      return res.status(500).json({
        success: false,
        message: 'AI model failed to process image',
        error: pyError.message,
      });
    }

    // Extract results from AI output
    const hasStones  = aiResult?.hasStones  ?? false;
    const stoneCount = aiResult?.stoneCount ?? 0;
    const details    = aiResult?.details    ?? [];
    const phase1     = aiResult?.phase1     ?? null;
    const annotatedImageUrl = aiResult?.annotatedImageUrl ?? null;

    // Save X-ray record to DB
    const xrayImage = await XrayImage.create({
      uploadedBy: req.user.id,
      imagePath,
      aiProcessed: true,
      qualityStatus: 'valid',
    });

    // Generate AI draft report text
    const date = new Date().toLocaleDateString('en-GB');
    const aiDraftText = `
MEDICAL IMAGING REPORT (AI-ASSISTED PRELIMINARY DRAFT)

Date of Analysis : ${date}
System           : UroScan AI — Diagnosis Support System

RADIOLOGICAL FINDINGS (AI):
- Phase 1 Classification : ${phase1?.result?.toUpperCase() || 'N/A'}
- Classification Score   : ${phase1?.confidence?.toFixed(2) || 'N/A'}%
- Stone Detection        : ${hasStones ? 'POSITIVE' : 'NEGATIVE'}
- Stone Count            : ${stoneCount}

DETECTED STONE DETAILS:
${details.length > 0
  ? details.map((s, i) =>
      `  Stone ${i + 1}: Location=${s.location || 'N/A'}, Size=${s.size || 'N/A'}mm, Confidence=${((s.confidence || 0) * 100).toFixed(2)}%`
    ).join('\n')
  : '  No stones detected'}

PRELIMINARY CLINICAL RECOMMENDATION:
${hasStones
  ? 'Findings suggest possible urinary stone disease (urolithiasis). Clinical review recommended.'
  : 'No significant radiographic evidence of urinary stones detected.'}


IMPORTANT: This is an AI-generated preliminary report.
Final review and validation by a qualified doctor is mandatory.

    `.trim();

    // Save Report to DB
    const report = await Report.create({
      doctor:          req.user.id,
      imageId:         xrayImage._id,
      imagePath,
      annotatedImageUrl,
      hasStones,
      stoneCount,
      details,
      phase1,
      aiDraft:         aiDraftText,
      doctorConfirmed: false,
      status:          'pending',
    });

    // Send response
    res.status(200).json({
      success: true,
      message: 'AI analysis completed successfully',
      data: {
        hasStones,
        stoneCount,
        details,
        phase1,
        annotatedImageUrl,
        reportId: report._id,
      },
    });

  } catch (error) {
    console.error('analyzeXray Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'AI analysis failed',
      error: error.message,
    });
  }
};