const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ['doctor', 'patient', 'staff', 'admin'],
      default: 'patient',
    },

    doctorId: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined,
    },

    patientId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
      default: undefined,
    },

    phoneNumber: {
      type: String,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please use a valid phone number'],
    },

    specialization: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ role: 1 });
userSchema.index({ patientId: 1 });

module.exports = mongoose.model('User', userSchema);
