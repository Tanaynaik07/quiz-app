const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,
});

module.exports = mongoose.model('User', userSchema);
