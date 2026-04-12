const Patient = require('../models/Patient');
const User = require('../models/User');

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

    const existingPatient = await Patient.findOne({
      $or: [{ userId }, { patientId }],
    });

    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Linked user not found.' });
    }

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

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create patient.', error: error.message });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('userId', 'email role');
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patients.', error: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'email role');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patient.', error: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update patient.', error: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.status(200).json({ message: 'Patient deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete patient.', error: error.message });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};