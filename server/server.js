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
const deployedClientUrl = process.env.CLIENT_URL || process.env.VITE_SERVER_URL || 'https://emergencyqr-jtlp.onrender.com';
const allowedOrigins = [
  deployedClientUrl,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174'
];

// Helper function to check if origin is from Netlify
const isNetlifyDomain = (origin) => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return url.hostname.endsWith('.netlify.app') || 
           url.hostname === 'netlify.app' ||
           url.hostname.endsWith('.netlify.com');
  } catch (e) {
    return false;
  }
};

app.use(cors({
  origin: function(origin, callback) {
    // log the origin for debugging
    console.log('CORS check - origin:', origin);
    
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // check against allowed origins list
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    
    // allow Netlify domains
    if (isNetlifyDomain(origin)) return callback(null, true);
    
    // allow same-origin requests (when client is served from the same host)
    try {
      const url = new URL(origin);
      if (url.hostname === (process.env.HOSTNAME || url.hostname)) return callback(null, true);
    } catch (e) {
      // ignore URL parsing errors
    }
    
    console.log('CORS rejected origin:', origin);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
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

// In production serve the built frontend
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  const clientDistPath = path.join(__dirname, 'dist', 'client');
  
  // Debug information
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Current directory:', __dirname);
  console.log('Static files path:', clientDistPath);
  
  // Create dist/client if it doesn't exist
  if (!fs.existsSync(clientDistPath)) {
    console.log('Creating client dist directory...');
    fs.mkdirSync(clientDistPath, { recursive: true });
  }
  
  // List directory contents for debugging
  try {
    const showDir = (dir) => {
      console.log(`\nContents of ${dir}:`);
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        console.log(`- ${item} (${stats.isDirectory() ? 'directory' : 'file'})`);
      });
    };
    
    showDir(__dirname);
    if (fs.existsSync(path.join(__dirname, 'dist'))) {
      showDir(path.join(__dirname, 'dist'));
    }
    if (fs.existsSync(clientDistPath)) {
      showDir(clientDistPath);
    }
  } catch (err) {
    console.error('Error listing directories:', err);
  }
  
  // Serve static files
  app.use(express.static(clientDistPath));
  
  // For any route not handled by API, send index.html (client-side routing)
  app.get('*', (req, res) => {
    // don't override API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'Not found' });
    }
    
    const indexPath = path.join(clientDistPath, 'index.html');
    console.log('\nServing request:', req.path);
    console.log('Looking for index.html at:', indexPath);
    
    try {
      if (!fs.existsSync(indexPath)) {
        console.error('index.html not found!');
        console.log('Searching for index.html in parent directories...');
        
        // Try to find index.html in parent directories
        let searchDir = __dirname;
        const foundFiles = [];
        
        while (searchDir !== path.parse(searchDir).root) {
          const found = fs.readdirSync(searchDir)
            .filter(f => f === 'index.html')
            .map(f => path.join(searchDir, f));
          foundFiles.push(...found);
          searchDir = path.dirname(searchDir);
        }
        
        return res.status(404).json({
          error: 'Frontend files not found',
          searchedPath: indexPath,
          currentDir: __dirname,
          dirContents: fs.readdirSync(__dirname),
          foundIndexFiles: foundFiles
        });
      }
      
      console.log('Found index.html, serving...');
      res.sendFile(indexPath);
    } catch (err) {
      console.error('Error serving index.html:', err);
      res.status(500).json({ error: 'Error serving frontend files', details: err.message });
    }
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
