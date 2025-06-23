// ...existing code...
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['standard', 'admin'], default: 'standard' },
  passkeyId: { type: String, required: true },
  password: { type: String }, // for admin-generated OTP fallback
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
// ...existing code...
