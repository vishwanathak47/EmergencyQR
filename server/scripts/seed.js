require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Contact = require('../models/Contact');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/emergency_db';

async function main() {
  console.log('Connecting to', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  try {
    // Ensure indexes defined by Mongoose schemas are created
    console.log('Ensuring Contact indexes...');
    await Contact.init();
    console.log('Contact indexes created/verified');
  } catch (err) {
    console.error('Error creating Contact indexes:', err && err.message ? err.message : err);
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'password123';

  let user = await User.findOne({ email: adminEmail });
  if (user) {
    console.log('Admin user already exists:', adminEmail);
  } else {
    const hashed = await bcrypt.hash(adminPassword, 10);
    user = await User.create({ email: adminEmail, password: hashed, role: 'admin' });
    console.log('Created admin user:', adminEmail);
    console.log('Admin password (keep secret):', adminPassword);
  }

  // Optionally create a sample contact for the admin to avoid duplicate issues
  if ((process.env.SEED_CREATE_CONTACT || 'true') === 'true') {
    const existing = await Contact.findOne({ ownerId: user._id });
    if (existing) {
      console.log('Contact for admin already exists:', existing._id.toString());
    } else {
      const sample = {
        ownerId: user._id,
        fullName: 'Admin Example',
        address: '123 Example St',
        bloodGroup: 'O+',
        allergies: 'None',
        emergencyContacts: [{ name: 'Alice', relationship: 'friend', phone: '555-1111' }]
      };
      const created = await Contact.create(sample);
      console.log('Created sample contact for admin:', created._id.toString());
    }
  }

  console.log('Seed complete. Disconnecting.');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Seeding failed:', err && err.stack ? err.stack : err);
  process.exit(1);
});
