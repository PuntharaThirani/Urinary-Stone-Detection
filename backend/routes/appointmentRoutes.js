const express = require('express');
const router = express.Router();

const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');

const authMiddleware = require('../middleware/auth');
const allowRoles = require('../middleware/role');

router.post('/', authMiddleware, allowRoles('staff'), createAppointment);
router.get('/', authMiddleware, allowRoles('staff', 'doctor'), getAllAppointments);
router.get('/:id', authMiddleware, allowRoles('staff', 'doctor', 'patient'), getAppointmentById);
router.put('/:id', authMiddleware, allowRoles('staff'), updateAppointment);
router.delete('/:id', authMiddleware, allowRoles('staff'), deleteAppointment);

module.exports = router;