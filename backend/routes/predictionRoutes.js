const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const upload     = require('../middleware/upload'); 

const predictionController = require('../controllers/predictionController');

// Run AI prediction — doctor only
router.post('/',
  auth,
  allowRoles('doctor'),
  predictionController.predictImage
);

module.exports = router;