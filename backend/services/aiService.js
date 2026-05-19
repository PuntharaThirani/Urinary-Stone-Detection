const { spawn } = require('child_process');
const path = require('path');

// Run Python AI Model
// Sends image to detect.py and returns JSON result

const analyzeImage = (imagePath) => {
  return new Promise((resolve, reject) => {

    // Correct path to detect.py 
    const scriptPath = path.join(
      __dirname, '..', 'AI', 'detect.py'
    );

    // Spawn Python process
    const pythonProcess = spawn('python', [
      scriptPath,
      imagePath,
    ]);

    let dataString  = '';
    let errorString = '';

    // Collect stdout output
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    // Collect stderr output
    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    // On process close
    pythonProcess.on('close', (code) => {
      // Log Python warnings/info (not always errors)
      if (errorString) {
        console.warn(`⚠️ Python stderr: ${errorString}`);
      }

      // Non-zero exit = error
      if (code !== 0) {
        console.error(`❌ Python exited with code ${code}`);
        return reject(
          new Error(`AI Model processing failed: ${errorString}`)
        );
      }

      // Parse JSON output
      try {
        const jsonResult = JSON.parse(dataString);
        resolve(jsonResult);
      } catch (error) {
        console.error('❌ JSON Parse Error:', error.message);
        console.error('Raw output:', dataString);
        reject(new Error('Failed to parse AI model response'));
      }
    });

    // Handle spawn errors
    pythonProcess.on('error', (err) => {
      console.error('❌ Spawn Error:', err.message);
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
};

module.exports = { analyzeImage };