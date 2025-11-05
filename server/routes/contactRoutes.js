const express = require('express');
const router = express.Router();
const { submitContact, scanContact } = require('../controllers/contactController');
const { verifyJWT } = require('../middleware/authMiddleware');

router.post('/submit', verifyJWT, submitContact);
router.get('/scan/:id', scanContact);

module.exports = router;
