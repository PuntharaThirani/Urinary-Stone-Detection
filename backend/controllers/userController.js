const User = require('../models/User');


// GET LOGGED-IN USER PROFILE

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch current user',
      error:   error.message,
    });
  }
};


// GET ALL USERS (Admin Only)

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error:   error.message,
    });
  }
};


// GET ALL DOCTORS

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
  role: 'doctor'
})
.select('name email doctorId specialization')
.sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count:   doctors.length,
      doctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
      error:   error.message,
    });
  }
};


// GET ALL PATIENTS

exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count:    patients.length,
      patients,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch patients',
      error:   error.message,
    });
  }
};


// UPDATE USER PROFILE

exports.updateProfile = async (req, res) => {
  try {
    // Prevent role change through this endpoint
    delete req.body.role;
    delete req.body.password;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error:   error.message,
    });
  }
};