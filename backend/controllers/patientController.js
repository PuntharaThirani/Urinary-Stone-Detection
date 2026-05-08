const Patient = require('../models/Patient');
const User    = require('../models/User');

// ===============================
// CREATE PATIENT
// ===============================
const createPatient = async (req, res) => {
  try {
    const {
      userId,
      patientId,
      fullName,
      age,
      gender,
      bloodGroup,
      contactNumber,
      address,
      emergencyContact,
      medicalNotes,
    } = req.body;

    // Validate required fields
    if (!userId || !patientId || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'userId, patientId and fullName are required',
      });
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({
      $or: [{ userId }, { patientId }],
    });

    if (existingPatient) {
      return res.status(400).json({ 
        success: false,
        message: 'Patient already exists' 
      });
    }

    // Check if linked user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Linked user account not found' 
      });
    }

    // Create patient record
    const patient = await Patient.create({
      userId,
      patientId,
      fullName,
      age,
      gender,
      bloodGroup,
      contactNumber,
      address,
      emergencyContact,
      medicalNotes,
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to create patient', 
      error: error.message 
    });
  }
};

// ===============================
// GET ALL PATIENTS
// ===============================
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('userId', 'email role name')
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
      error: error.message 
    });
  }
};

// ===============================
// GET PATIENT BY ID
// ===============================
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('userId', 'email role name');

    if (!patient) {
      return res.status(404).json({ 
        success: false,
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch patient', 
      error: error.message 
    });
  }
};

// ===============================
// UPDATE PATIENT
// ===============================
const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('userId', 'email role name');

    if (!updatedPatient) {
      return res.status(404).json({ 
        success: false,
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update patient', 
      error: error.message 
    });
  }
};

// ===============================
// DELETE PATIENT
// ===============================
const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient
      .findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({ 
        success: false,
        message: 'Patient not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Patient deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete patient', 
      error: error.message 
    });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};