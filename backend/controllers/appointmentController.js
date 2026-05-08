const Appointment = require('../models/Appointment');

// ===============================
// CREATE APPOINTMENT
// ===============================
const createAppointment = async (req, res) => {
  try {
    const { 
      patientId, 
      doctorId, 
      appointmentDate, 
      timeSlot, 
      reason, 
      status, 
      notes 
    } = req.body;

    // Validate required fields
    if (!patientId || !doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'patientId, doctorId, appointmentDate and timeSlot are required',
      });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      timeSlot,
      reason:  reason  || '',
      status:  status  || 'scheduled',
      notes:   notes   || '',
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message,
    });
  }
};

// ===============================
// GET ALL APPOINTMENTS
// ===============================
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'fullName patientId')
      .populate('doctorId',  'name email role')
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message,
    });
  }
};

// ===============================
// GET APPOINTMENT BY ID
// ===============================
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'fullName patientId')
      .populate('doctorId',  'name email role');

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error.message,
    });
  }
};

// ===============================
// UPDATE APPOINTMENT
// ===============================
const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('patientId', 'fullName patientId')
      .populate('doctorId',  'name email role');

    if (!updatedAppointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message,
    });
  }
};

// ===============================
// DELETE APPOINTMENT
// ===============================
const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment
      .findByIdAndDelete(req.params.id);

    if (!deletedAppointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Appointment deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};