const express = require('express');
const router = express.Router();

const predictionController = require('../controllers/predictionController');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

// Doctor only
router.post('/', auth, allowRoles('doctor'), predictionController.predictImage);

module.exports = router;