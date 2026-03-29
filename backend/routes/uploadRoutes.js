const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/upload');

// @route   POST api/upload
// @desc    Upload X-ray image only
router.post('/', upload.single('image'), uploadController.uploadXray);

module.exports = router;