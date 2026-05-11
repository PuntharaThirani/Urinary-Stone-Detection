const Patient = require('../models/Patient');

// ---------------- CREATE PATIENT ----------------
exports.createPatient = async (req, res) => {
  try {

    const {
      userId,
      patientId,
      fullName,
      email,
      age,
      gender,
      bloodGroup,
      contactNumber,
      address,
      emergencyContact,
      medicalNotes
    } = req.body;

    // ✅ DEBUG
    console.log('REQ BODY:', req.body);

    // ✅ VALIDATION
if (
  !patientId ||
  !fullName ||
  !contactNumber
) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: [
        
          'patientId',
          'fullName',
          'contactNumber'
        ]
      });
    }

    // ✅ CREATE PATIENT
    const patient = new Patient({
      userId: userId || null,
      patientId,
      fullName,
      email,
      age,
      gender,
      bloodGroup,
      contactNumber,
      address,
      emergencyContact,
      medicalNotes
    });

    // ✅ SAVE
    const saved = await patient.save();

    return res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: saved
    });

  } catch (error) {

    console.error('CREATE PATIENT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: error.message,
      type: error.name
    });
  }
};

// ---------------- GET ALL PATIENTS ----------------
exports.getAllPatients = async (req, res) => {
  try {

    const patients = await Patient.find();

    return res.status(200).json({
      success: true,
      data: patients
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ---------------- GET PATIENT BY ID ----------------
exports.getPatientById = async (req, res) => {
  try {

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: patient
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ---------------- UPDATE PATIENT ----------------
exports.updatePatient = async (req, res) => {
  try {

    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: updated
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ---------------- DELETE PATIENT ----------------
exports.deletePatient = async (req, res) => {
  try {

    const deleted = await Patient.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};