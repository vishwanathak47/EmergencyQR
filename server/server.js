require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Global middleware (strict order)
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser());
// Allow the configured client URL and Vite dev server (5173) during development.
// Allow common local dev ports (5173, 5174) and an explicitly configured CLIENT_URL.
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true
}));
// Basic rate limiter
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes will be mounted here
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// In production serve the built frontend from dist/client
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, 'dist', 'client');
  app.use(express.static(clientDist));
  // For any route not handled by API, send index.html (client-side routing)
  app.get('*', (req, res) => {
    // don't override API routes
    if (req.path.startsWith('/api/')) return res.status(404).json({ message: 'Not found' });
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('MongoDB connection error', err);
  process.exit(1);
});
