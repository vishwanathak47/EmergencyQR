const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { verifyJWT } = require('../middleware/authMiddleware');

router.get('/contacts', verifyJWT, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const contacts = await Contact.find().select('fullName ownerId createdAt');
  return res.json(contacts);
});

module.exports = router;
