// Load environment from the backend folder explicitly so running from the workspace
// root (or via nodemon) still picks up the backend/.env file.
require('dotenv').config({ path: __dirname + '/.env' });

// Monkey-patch module loading for `express-mongo-sanitize` to return a safe no-op
// sanitizer. This prevents the package from attempting to reassign request properties
// (which can be getter-only in some environments) and causing a TypeError.
try {
  const Module = require('module');
  const originalLoad = Module._load;
  Module._load = function(request, parent, isMain) {
    if (request === 'express-mongo-sanitize') {
      // return a factory that returns middleware (req,res,next) => next()
      return function() {
        return function(req, res, next) { next(); };
      };
    }
    return originalLoad.apply(this, arguments);
  };
} catch (e) {
  // If monkey-patching fails, continue without it; we'll still have our in-place sanitizer below.
}

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const certificateRouter = require('./routes/certificate');
const testimonialRouter = require('./routes/testimonial');
const productRouter = require('./routes/product');
const cookieParser = require('cookie-parser');

const app = express();

// CORS configuration driven by ALLOWED_ORIGINS env; allows both dev and production origins.
// Use the `cors` package so preflight handling and headers are correct.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (e.g., server-to-server or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Security & middleware (enabled)
// Trust first proxy (useful when behind load balancer)
app.set('trust proxy', 1);

// Basic security headers
app.use(helmet());

// Input parsing
app.use(express.json({ limit: '1mb' }));

// Safe in-place sanitizer: mutates objects (req.body, req.query, req.params)
// to remove keys containing '$' or '.' without reassigning the request properties.
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) return obj.forEach(sanitizeObject);
  Object.keys(obj).forEach((key) => {
    try {
      if (key.indexOf('$') !== -1 || key.indexOf('.') !== -1) {
        delete obj[key];
        return;
      }
      const val = obj[key];
      if (val && typeof val === 'object') sanitizeObject(val);
    } catch (e) {
      // ignore and continue sanitizing other keys
    }
  });
};

app.use((req, res, next) => {
  try {
    ['body', 'query', 'params'].forEach((p) => {
      if (req[p] && typeof req[p] === 'object') sanitizeObject(req[p]);
    });
  } catch (e) {
    console.warn('Sanitizer middleware error:', e && e.stack ? e.stack : e);
  }
  next();
});

// XSS and HTTP param pollution protections
app.use(xss());
app.use(hpp());
app.use(cookieParser());

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Enforce HTTPS in production (behind proxy/load-balancer)
// if (process.env.NODE_ENV === 'production') {
//   app.use((req, res, next) => {
//     const proto = req.headers['x-forwarded-proto'];
//     if (proto && proto !== 'https') {
//       return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
//     }
//     next();
//   });
// }

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if unable to connect to database
  }
};

connectDB();

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Serve uploaded images
app.use('/uploads', express.static(uploadDir));
app.use('/static', express.static(uploadDir));

// If a front-end build exists (vite production build), serve it and provide SPA fallback
const clientDist = path.join(__dirname, '..', 'vite-project', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

// Routes
// Safely mount routers and capture errors from path-to-regexp during mount
const mountSafe = (mountPath, router, name) => {
  try {
    if (typeof mountPath !== 'string') {
      console.warn(`mountSafe: mountPath for ${name} is not a string:`, mountPath);
    }
    if (!router) {
      console.warn(`mountSafe: router for ${name} is falsy`);
    }
    console.log(`Mounting ${name} at ${mountPath}`);
    app.use(mountPath, router);
  } catch (err) {
    console.error(`Failed to mount ${name} at ${mountPath}:`, err && err.stack ? err.stack : err);
    // Rethrow so process exits if desired, but include helpful context
    throw err;
  }
};

mountSafe('/api/certificates', certificateRouter, 'certificateRouter');
mountSafe('/api/testimonials', testimonialRouter, 'testimonialRouter');
mountSafe('/api/products', productRouter, 'productRouter');

// SPA fallback or safe redirect: any non-API route should return index.html if a client build exists,
// otherwise redirect to home '/' so the client can handle routing.
app.all('/{*any}', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  if (fs.existsSync(clientDist)) {
    return res.sendFile(path.join(clientDist, 'index.html'));
  }
  // No client build on server - redirect to root as a safe fallback
  return res.redirect('/');
});

// Error handling for file uploads
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size is too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    status: err.status || 500,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query
  });
  res.status(err.status || 500).json({ 
    error: err.message || 'Something went wrong!',
    path: req.path,
    method: req.method
  });
});

const PORT = process.env.PORT || 3001;

// Start server only after DB connection is established
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


