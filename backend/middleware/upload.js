const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ෆෝල්ඩර්ස් නැත්නම් හදනවා (Auto Create)
const uploadDirs = ['uploads/xrays', 'uploads/processed'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Save කරන තැන සහ නම හදන හැටි
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // backend/uploads ෆෝල්ඩර් එකට දානවා
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File ජාතිය පරීක්ෂා කිරීම (Images only)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

const upload = multer({ 
    storage, fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
 });
module.exports = upload;