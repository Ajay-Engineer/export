require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const certificateRouter = require('./routes/certificate');
const testimonialRouter = require('./routes/testimonial');
const productRouter = require('./routes/product');
const cookieParser = require('cookie-parser');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow both Vite and React default ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

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

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


