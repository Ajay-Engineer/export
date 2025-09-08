const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { onRequest } = require('firebase-functions/v2/https');

// Import routers
const testimonialRouter = require('./routes/testimonial');
const productRouter = require('./routes/product');
const packagingRouter = require('./routes/packaging');
const certificateRouter = require('./routes/certificate');
const categoriesRouter = require('./routes/categories');

// Environment variables
const mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI;

const app = express();

// --------------------
// CORS Middleware
// --------------------
const allowedOrigins = [
  'https://rebeccaexim.netlify.app',
  'https://rebecca05151-14c39.web.app',
  'https://rebecca05151-14c39.firebaseapp.com',
  'https://rebeccaexim.co.in',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// --------------------
// Middleware
// --------------------
app.set('trust proxy', 1); // Trust first proxy
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// --------------------
// MongoDB Connection
// --------------------
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Connect DB before API routes
app.use('/api', async (req, res, next) => {
  await connectDB();
  next();
});

// --------------------
// API Routes
// --------------------
app.use('/products', productRouter);
app.use('/testimonials', testimonialRouter);
app.use('/packaging', packagingRouter);
app.use('/certificates', certificateRouter);
app.use('/categories', categoriesRouter);

// Catch-all route for 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// --------------------
// Error Handling
// --------------------
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

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: 'File size too large (max 5MB)' });
    }
    return res.status(400).json({ success: false, error: err.message });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    path: req.path,
    method: req.method
  });
});

// --------------------
// Export Firebase Function
// --------------------
exports.api = onRequest(app);
