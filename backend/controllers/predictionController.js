const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.predictImage = (req, res) => {
  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: 'Image path is missing. Please upload an image first.',
      });
    }

    // ✅ AI/detect.py ekata update una
    const pythonScriptPath = path.join(__dirname, '..', 'AI', 'detect.py');

    const absoluteImagePath = path.isAbsolute(imagePath)
      ? imagePath
      : path.join(__dirname, '..', imagePath);

    if (!fs.existsSync(pythonScriptPath)) {
      return res.status(500).json({
        success: false,
        message: 'Python detection script not found.',
      });
    }

    if (!fs.existsSync(absoluteImagePath)) {
      return res.status(404).json({
        success: false,
        message: 'Uploaded image file not found.',
      });
    }

    const pythonProcess = spawn('python', [pythonScriptPath, absoluteImagePath]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (errorString) {
        console.error('🐍 Python stderr:', errorString);
      }

      if (code !== 0) {
        return res.status(500).json({
          success: false,
          message: 'Python process exited with an error.',
          details: errorString || `Exit code: ${code}`,
        });
      }

      try {
        const results = JSON.parse(dataString);

        if (results.status === 'error') {
          return res.status(500).json({
            success: false,
            message: results.message || 'Model processing failed.',
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Analysis completed successfully.',
          // ✅ Phase 1 result ekath include una
          phase1: results.phase1 || null,
          stoneCount: results.stoneCount || 0,
          hasStones: results.hasStones || false,
          details: results.details || [],
          annotatedImageUrl: results.annotatedImage || null, 
        });

      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError);
        return res.status(500).json({
          success: false,
          message: 'Failed to parse AI model output.',
          rawOutput: dataString,
          details: errorString,
        });
      }
    });

  } catch (error) {
    console.error('Prediction Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unexpected server error during prediction.',
      error: error.message,
    });
  }
};