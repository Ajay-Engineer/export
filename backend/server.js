require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');
const hpp = require('hpp');

const testimonialRouter = require('./routes/testimonial');
const productRouter = require('./routes/product');
const packagingRouter = require('./routes/packaging');
const certificateRouter = require('./routes/certificate');
const categoriesRouter = require('./routes/categories');
const cookieParser = require('cookie-parser');

const app = express();

 // Security & middleware
app.set('trust proxy', 1); // trust first proxy (useful when behind load balancer)

// CORS configuration - allow all origins temporarily
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Basic security headers first
app.use(helmet({
  xssFilter: false // We handle XSS in our custom middleware
}));

// Parse JSON bodies and cookies
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Security middlewares
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(require('./middleware/security')); // Custom security middleware

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
app.use('/api/testimonials', testimonialRouter);
app.use('/api/packaging', packagingRouter);
app.use('/api/certificates', certificateRouter);
app.use('/api/categories', categoriesRouter);

// Unified error handling middleware
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

  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        error: 'File size is too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    path: req.path,
    method: req.method
  });
});


mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

