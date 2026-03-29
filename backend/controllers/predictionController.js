const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.predictImage = (req, res) => {
    const { imagePath, fileName } = req.body;

    if (!imagePath) {
        return res.status(400).json({ error: "Image path is missing! Please upload first." });
    }

    const pythonScriptPath = path.join(__dirname, '..', 'detect.py');
    const absoluteImagePath = path.join(__dirname, '..', imagePath);

    const pythonProcess = spawn('python', [pythonScriptPath, absoluteImagePath]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => { dataString += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { errorString += data.toString(); });

    pythonProcess.on('close', (code) => {
        if (errorString) {
            console.error("🐍 Python Errors:", errorString);
        }

        try {
           
            const results = JSON.parse(dataString);
            
            if (results.error) {
                return res.status(500).json({ message: "Model Error", error: results.error });
            }

         
            res.json({ 
                message: "✅ Analysis Successful", 
                stoneCount: results.stoneCount,       // කලින් තිබ්බ length කෑල්ල අයින් කළා
                details: results.details,
                annotatedImage: results.annotatedImage // කොටු ඇඳපු පින්තූරය
            });

        } catch (e) {
            console.error("JSON Parsing Error:", e);
            res.status(500).json({ error: "Processing failed", details: errorString });
        }
    });
};