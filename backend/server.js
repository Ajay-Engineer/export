require('dotenv').config();
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

// Security & middleware
app.set('trust proxy', 1); // trust first proxy (useful when behind load balancer)

// Strict CORS configuration driven by env var ALLOWED_ORIGINS (comma separated)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: function (origin, callback) {
    // allow non-browser requests like curl or servers (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Basic security headers
app.use(helmet());

// Input sanitization and protections
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize()); // prevent NoSQL injection
app.use(xss()); // basic XSS protection
app.use(hpp()); // protect against HTTP parameter pollution
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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

// API Routes
app.use('/api/products', productRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: 'File upload error: ' + err.message
    });
  }
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});
app.use('/api/certificates', certificateRouter);
app.use('/api/testimonials', testimonialRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Something went wrong!' 
  });
});

// Routes
app.use('/api/certificates', certificateRouter);
app.use('/api/testimonials', testimonialRouter);
app.use('/api/products', productRouter);

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
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


