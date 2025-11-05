const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function signup(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET || 'dev-secret', { expiresIn: process.env.JWT_ACCESS_EXPIRY });

    // Use lax sameSite so cookie is sent on top-level navigations in development.
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // For cross-site requests (Netlify frontend -> Render backend) cookies must use 'none'
      // in production and require `secure: true`. In development we keep 'lax' for convenience.
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });
    console.log('User signed up:', user.email);
  return res.status(201).json({ user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error', detail: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET || 'dev-secret', { expiresIn: process.env.JWT_ACCESS_EXPIRY });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
    console.log('User logged in:', user.email);
  return res.json({ user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error', detail: err.message });
  }
}

module.exports = { signup, login };
