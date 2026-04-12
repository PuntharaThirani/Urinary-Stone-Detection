const Appointment = require('../models/Appointment');

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, timeSlot, reason, status, notes } = req.body;

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      timeSlot,
      reason,
      status,
      notes,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create appointment.',
      error: error.message,
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'fullName patientId')
      .populate('doctorId', 'name email role');

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch appointments.',
      error: error.message,
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'fullName patientId')
      .populate('doctorId', 'name email role');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch appointment.',
      error: error.message,
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update appointment.',
      error: error.message,
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully.' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete appointment.',
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