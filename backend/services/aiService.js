const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * පින්තූරයක් Python AI Model එකට යවා ප්‍රතිඵලය ලබා ගැනීම
 * @param {String} imagePath - පින්තූරය තියෙන තැන
 */
const analyzeImage = (imagePath) => {
    return new Promise((resolve, reject) => {
        
        // Python Script එක තියෙන තැන (backend/detect.py)
        const scriptPath = path.join(__dirname, '..', 'detect.py');
        
        // Python Process එක පටන් ගන්නවා
        const pythonProcess = spawn('python', [scriptPath, imagePath]);

        let dataString = '';
        let errorString = '';

        // Data එනකොට එකතු කරගන්නවා
        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        // Error ආවොත් එකතු කරගන්නවා
        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        // වැඩේ ඉවර වුනාම
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`❌ Python Error: ${errorString}`);
                return reject(new Error('AI Model processing failed'));
            }

            try {
                // String එක JSON බවට හරවනවා
                const jsonResult = JSON.parse(dataString);
                resolve(jsonResult);
            } catch (error) {
                console.error('❌ Parsing Error:', error.message);
                reject(new Error('Failed to parse AI response'));
            }
        });
    });
};

module.exports = { analyzeImage };