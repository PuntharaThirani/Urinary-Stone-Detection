const express = require('express');
const router = express.Router();
const auth  = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const upload = require('../middleware/upload');

const uploadController = require('../controllers/uploadController');

// Upload X-ray — doctor and staff
router.post('/',
  auth,
  allowRoles('doctor', 'staff'), //  Staff also can upload
  upload.single('image'),
  uploadController.uploadXray
);

module.exports = router;