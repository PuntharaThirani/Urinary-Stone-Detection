const express = require('express');
const router = express.Router();

const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

const authMiddleware = require('../middleware/auth');
const allowRoles = require('../middleware/role');

router.post('/', authMiddleware, allowRoles('staff', 'doctor'), createPatient);
router.get('/', authMiddleware, allowRoles('staff', 'doctor'), getAllPatients);
router.get('/:id', authMiddleware, allowRoles('staff', 'doctor', 'patient'), getPatientById);
router.put('/:id', authMiddleware, allowRoles('staff', 'doctor'), updatePatient);
router.delete('/:id', authMiddleware, allowRoles('staff'), deletePatient);

module.exports = router;