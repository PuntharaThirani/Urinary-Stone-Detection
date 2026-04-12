const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const upload = require('../middleware/upload');

// Single X-ray upload
router.post(
  '/',
  auth,
  allowRoles('doctor'),
  upload.single('image'),
  uploadController.uploadXray
);

module.exports = router;