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

    const newContact = await Contact.create({ ownerId, fullName, address, bloodGroup, allergies, emergencyContacts });

  // Build a safe domain for QR linking:
  // Priority: DEPLOYED_DOMAIN (explicit production), then CLIENT_URL (frontend dev host),
  // finally fall back to the request host (protocol + host) to support a variety of envs.
  const domain = process.env.DEPLOYED_DOMAIN || process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
  const cleanDomain = String(domain).replace(/\/$/, ''); // remove trailing slash if any
  const qrUrl = `${cleanDomain}/scan/${newContact._id}`;
  const qrCodeDataUrl = await qrcode.toDataURL(qrUrl);

    return res.status(201).json({ contact: newContact, qrCodeDataUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
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
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { submitContact, scanContact };
