// මේක පාවිච්චි වෙන්නේ නිකන්ම පින්තූරයක් Upload කරලා Save කරන්න විතරක් ඕන වුනොත්.
// (AI Prediction එකට යවන්නේ නැතුව).

exports.uploadXray = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
        message: "File uploaded successfully!",
        filePath: req.file.path,
        fileName: req.file.filename
    });
};