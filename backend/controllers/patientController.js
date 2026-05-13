const Patient = require('../models/Patient');
const User = require('../models/User');

// ===============================
// CREATE PATIENT - Staff creates record first
// ===============================
const createPatient = async (req, res) => {
  try {
    const {
      fullName,
      patientId,
      email,
      age,
      gender,
      bloodGroup,
      contactNumber,
      address,
      emergencyContact,
      medicalNotes,
    } = req.body;

    if (!fullName || !patientId || !email || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'fullName, patientId, email and contactNumber are required',
      });
    }

    const normalizedPatientId = patientId.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();

    const existingId = await Patient.findOne({
      patientId: normalizedPatientId,
    });

    if (existingId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID already exists. Use a different ID.',
      });
    }

    const existingEmail = await Patient.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'A patient record already exists for this email.',
      });
    }

    let userId = null;

    const existingUser = await User.findOne({
      email: normalizedEmail,
      role: 'patient',
    });

    if (existingUser) {
      userId = existingUser._id;
    }

    const patient = await Patient.create({
      userId,
      patientId: normalizedPatientId,
      email: normalizedEmail,
      fullName: fullName.trim(),
      age: age || 0,
      gender: gender || 'male',
      bloodGroup: bloodGroup || '',
      contactNumber,
      address: address || '',
      emergencyContact: emergencyContact || '',
      medicalNotes: medicalNotes || '',
    });

    if (existingUser && !existingUser.patientId) {
      existingUser.patientId = normalizedPatientId;
      await existingUser.save();
    }

    res.status(201).json({
      success: true,
      message:
        'Patient record created successfully. Patient can create an account using this Patient ID and email.',
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create patient',
      error: error.message,
    });
  }
};

// ===============================
// GET ALL PATIENTS
// ===============================
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('userId', 'email role name patientId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients',
      error: error.message,
    });
  }
};

// ===============================
// GET PATIENT BY ID
// ===============================
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      'userId',
      'email role name patientId'
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient',
      error: error.message,
    });
  }
};

// ===============================
// GET MY PATIENT PROFILE
// ===============================
const getMyPatientProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'email role name patientId'
    );

    if (!user || user.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Only patient accounts can access patient profile.',
      });
    }

    let patient = await Patient.findOne({ userId: user._id }).populate(
      'userId',
      'email role name patientId'
    );

    if (!patient && user.patientId) {
      patient = await Patient.findOne({
        patientId: user.patientId,
        email: user.email,
      }).populate('userId', 'email role name patientId');
    }

    if (!patient) {
      patient = await Patient.findOne({
        email: user.email,
      }).populate('userId', 'email role name patientId');
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found',
      });
    }

    if (!patient.userId) {
      patient.userId = user._id;
      await patient.save();
    }

    if (!user.patientId) {
      user.patientId = patient.patientId;
      await user.save();
    }

    res.status(200).json({ success: true, patient });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient profile',
      error: error.message,
    });
  }
};

// ===============================
// UPDATE PATIENT
// ===============================
const updatePatient = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.patientId) {
      updateData.patientId = updateData.patientId.trim().toUpperCase();
    }

    if (updateData.email) {
      updateData.email = updateData.email.trim().toLowerCase();
    }

    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'email role name patientId');

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update patient',
      error: error.message,
    });
  }
};

// ===============================
// DELETE PATIENT
// ===============================
const deletePatient = async (req, res) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete patient',
      error: error.message,
    });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  getMyPatientProfile,
  updatePatient,
  deletePatient,
};
