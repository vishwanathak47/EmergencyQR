const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmergencyContactSchema = new Schema({
  name: { type: String, required: true },
  relationship: { type: String },
  phone: { type: String }
});

const ContactSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  address: { type: String },
  bloodGroup: { type: String },
  allergies: { type: String },
  emergencyContacts: { type: [EmergencyContactSchema], required: true, validate: v => Array.isArray(v) && v.length >=1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);
