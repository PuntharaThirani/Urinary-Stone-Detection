const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// 🚀 වෙනස මෙතනයි: '/predict' වෙනුවට '/' කියලා විතරක් දාන්න!
router.post('/', predictionController.predictImage);

module.exports = router;