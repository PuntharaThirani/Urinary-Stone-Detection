const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const createNotification = require('../utils/createNotification');

const DOCTOR_APPOINTMENTS_LINK = '/doctor-appointments';

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

    await createNotification({
      userId: doctor._id,
      title: 'New Appointment Scheduled',
      message: `New appointment with ${patient.fullName} on ${date.toLocaleDateString()} at ${timeSlot}.`,
      type: 'appointment',
      link: DOCTOR_APPOINTMENTS_LINK,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'fullName patientId email contactNumber age gender')
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
    const query = {};

    if (req.user.role === 'doctor') {
      query.doctorId = req.user.id;
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id });

      if (!patient) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
        });
      }

      query.patientId = patient._id;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'fullName patientId email contactNumber age gender')
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
      .populate('patientId', 'fullName patientId email contactNumber age gender')
      .populate('doctorId', 'name email role doctorId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (
      req.user.role === 'doctor' &&
      String(appointment.doctorId._id) !== String(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to view this appointment.',
      });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id });

      if (!patient || String(appointment.patientId._id) !== String(patient._id)) {
        return res.status(403).json({
          success: false,
          message: 'You are not allowed to view this appointment.',
        });
      }
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
      .populate('patientId', 'fullName patientId email contactNumber age gender')
      .populate('doctorId', 'name email role doctorId');

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    await createNotification({
      userId: updatedAppointment.doctorId._id,
      title: 'Appointment Updated',
      message: `Appointment with ${updatedAppointment.patientId.fullName} was updated.`,
      type: 'appointment',
      link: DOCTOR_APPOINTMENTS_LINK,
    });

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
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id)
      .populate('patientId', 'fullName patientId')
      .populate('doctorId', 'name email role doctorId');

    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    await createNotification({
      userId: deletedAppointment.doctorId._id,
      title: 'Appointment Cancelled',
      message: `Appointment with ${deletedAppointment.patientId.fullName} was cancelled.`,
      type: 'appointment',
      link: DOCTOR_APPOINTMENTS_LINK,
    });

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
