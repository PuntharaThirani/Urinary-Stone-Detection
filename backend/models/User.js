const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Full name
    name: {
      type:     String,
      required: true,
      trim:     true,
      minlength: 2,
    },

    // Email — unique login identifier
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },

    // Password — hashed by pre-save hook
    password: {
      type:      String,
      required:  true,
      minlength: 6,
    },

    // User role
    role: {
      type:    String,
      enum:    ['doctor', 'patient', 'staff', 'admin'],
      default: 'patient',
    },

    // Phone number — optional
    phoneNumber: {
      type:  String,
      trim:  true,
      match: [/^[0-9]{10,15}$/, 'Please use a valid phone number'],
    },

    // Doctor specialization — optional
    specialization: {
      type: String,
      trim: true,
    },

    // Account status — soft delete support ✅ NEW
    isActive: {
      type:    Boolean,
      default: true,
    },

    // Last login time ✅ NEW
    lastLogin: {
      type:    Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ─────────────────────────────────────
// HASH PASSWORD BEFORE SAVE
// Only runs when password is modified
// authController must send plain text!
// ─────────────────────────────────────
userSchema.pre('save', async function (next) {
  // Skip if password not changed
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─────────────────────────────────────
// COMPARE PASSWORD METHOD
// Used in login to verify password
// ─────────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─────────────────────────────────────
// INDEXES
// ─────────────────────────────────────
userSchema.index({ email: 1 });
userSchema.index({ role:  1 });

module.exports = mongoose.model('User', userSchema);