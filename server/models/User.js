const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  contactRef: { type: Schema.Types.ObjectId, ref: 'Contact' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
