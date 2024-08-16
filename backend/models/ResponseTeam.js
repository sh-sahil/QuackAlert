const mongoose = require('mongoose');

const responseTeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, default: 'Unknown' }, // New field for location, optional
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }, // New field for status with default value
  createdAt: { type: Date, default: Date.now }, // Track when the entry was created
  updatedAt: { type: Date, default: Date.now } // Track when the entry was last updated
});
// Update the `updatedAt` field on save
responseTeamSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model('ResponseTeamSchema', responseTeamSchema);
