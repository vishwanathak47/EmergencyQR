const Contact = require('../models/Contact');
const validator = require('validator');
const qrcode = require('qrcode');

async function submitContact(req, res) {
  try {
    // Basic server-side sanitation using validator
    const ownerId = req.user.userId;
    const fullName = validator.escape(req.body.fullName || '');
    const address = validator.escape(req.body.address || '');
    const bloodGroup = validator.escape(req.body.bloodGroup || '');
    const allergies = validator.escape(req.body.allergies || '');
    const emergencyContacts = (req.body.emergencyContacts || []).map(c => ({
      name: validator.escape(c.name || ''),
      relationship: validator.escape(c.relationship || ''),
      phone: validator.escape(c.phone || '')
    }));

    if (!fullName || emergencyContacts.length < 1) return res.status(400).json({ message: 'Full name and at least one emergency contact required' });
    // If a contact for this user already exists, update it instead of creating
    let contact = await Contact.findOne({ ownerId });
    if (contact) {
      contact.fullName = fullName;
      contact.address = address;
      contact.bloodGroup = bloodGroup;
      contact.allergies = allergies;
      contact.emergencyContacts = emergencyContacts;
      await contact.save();

      const domain = process.env.DEPLOYED_DOMAIN || process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
      const cleanDomain = String(domain).replace(/\/$/, '');
      const qrUrl = `${cleanDomain}/scan/${contact._id}`;
      const qrCodeDataUrl = await qrcode.toDataURL(qrUrl);
      console.log('Generated QR URL (update):', qrUrl);

      return res.status(200).json({ contact, qrCodeDataUrl, qrUrl, updated: true });
    }

    const newContact = await Contact.create({ ownerId, fullName, address, bloodGroup, allergies, emergencyContacts });

    // Build a safe domain for QR linking:
    // Priority: DEPLOYED_DOMAIN (explicit production), then CLIENT_URL (frontend dev host),
    // finally fall back to the request host (protocol + host) to support a variety of envs.
    const domain = process.env.DEPLOYED_DOMAIN || process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
    const cleanDomain = String(domain).replace(/\/$/, ''); // remove trailing slash if any
    const qrUrl = `${cleanDomain}/scan/${newContact._id}`;
    const qrCodeDataUrl = await qrcode.toDataURL(qrUrl);
    console.log('Generated QR URL (create):', qrUrl);

    return res.status(201).json({ contact: newContact, qrCodeDataUrl, qrUrl, created: true });
  } catch (err) {
    // Handle duplicate key as conflict just in case
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Contact already exists for this user' });
    }

    console.error(err && err.stack ? err.stack : err);
    const resp = { message: 'Server error' };
    if (process.env.NODE_ENV !== 'production' && err && err.message) resp.details = err.message;
    return res.status(500).json(resp);
  }
}

async function scanContact(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'Missing id' });

    const contact = await Contact.findById(id).select('fullName emergencyContacts allergies');
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    return res.json({ fullName: contact.fullName, emergencyContacts: contact.emergencyContacts, allergies: contact.allergies });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    const resp = { message: 'Server error' };
    if (process.env.NODE_ENV !== 'production' && err && err.message) resp.details = err.message;
    return res.status(500).json(resp);
  }
}

module.exports = { submitContact, scanContact };
