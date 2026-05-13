const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');

// CREATE APPOINTMENT
const createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentDate,
      timeSlot,
      reason,
      status,
      notes,
    } = req.body;

    if (!patientId || !doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'patientId, doctorId, appointmentDate and timeSlot are required',
      });
    }

    let patient = null;

    if (mongoose.Types.ObjectId.isValid(patientId)) {
      patient = await Patient.findById(patientId);
    }

    if (!patient) {
      patient = await Patient.findOne({
        patientId: String(patientId).trim().toUpperCase(),
      });
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found. Please check Patient ID.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctorId.',
      });
    }

    const doctor = await User.findOne({
      _id: doctorId,
      role: 'doctor',
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    const date = new Date(appointmentDate);

    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment date.',
      });
    }

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      appointmentDate: date,
      timeSlot: timeSlot.trim(),
      reason: reason || '',
      status: status || 'scheduled',
      notes: notes || '',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'fullName patientId email')
      .populate('doctorId', 'name email role doctorId');

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: populatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message,
    });
  }
};

// GET ALL APPOINTMENTS
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'fullName patientId email')
      .populate('doctorId', 'name email role doctorId')
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

// GET APPOINTMENT BY ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'fullName patientId email')
      .populate('doctorId', 'name email role doctorId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
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

// UPDATE APPOINTMENT
const updateAppointment = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.patientId) {
      let patient = null;

      if (mongoose.Types.ObjectId.isValid(updateData.patientId)) {
        patient = await Patient.findById(updateData.patientId);
      }

      if (!patient) {
        patient = await Patient.findOne({
          patientId: String(updateData.patientId).trim().toUpperCase(),
        });
      }

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found. Please check Patient ID.',
        });
      }

      updateData.patientId = patient._id;
    }

    if (updateData.doctorId) {
      if (!mongoose.Types.ObjectId.isValid(updateData.doctorId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid doctorId.',
        });
      }

      const doctor = await User.findOne({
        _id: updateData.doctorId,
        role: 'doctor',
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found.',
        });
      }

      updateData.doctorId = doctor._id;
    }

    if (updateData.appointmentDate) {
      const date = new Date(updateData.appointmentDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid appointment date.',
        });
      }

      updateData.appointmentDate = date;
    }

    if (updateData.timeSlot) {
      updateData.timeSlot = updateData.timeSlot.trim();
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('patientId', 'fullName patientId email')
      .populate('doctorId', 'name email role doctorId');

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
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

// DELETE APPOINTMENT
const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
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
