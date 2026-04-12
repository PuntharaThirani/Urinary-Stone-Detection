const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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

    phoneNumber: {
      type: String,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please use a valid phone number'],
    },

    specialization: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);


// ===============================
// HASH PASSWORD BEFORE SAVE
// ===============================
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// ===============================
// PASSWORD COMPARE METHOD
// ===============================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// ===============================
// INDEXES
// ===============================
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);