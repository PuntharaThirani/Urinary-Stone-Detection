require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');
const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected');
    // Already exists?
    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log('⚠️  Admin already exists:', existing.email);
      process.exit(0);
    }
    // Create admin
    const admin = new User({
      name:     'Admin',
      email:    'admin@gmail.com',   
      password: 'Admin@1234',          
      role:     'admin',
      isActive: true,
    });
    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log('   Email    :', 'admin@gmail.com');
    console.log('   Password :', 'Admin@1234');
  } catch (error) {
    console.error('❌ Seed Error:', error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
};
seedAdmin();  