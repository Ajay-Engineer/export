require('dotenv').config();

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
  'http://192.168.29.17:3000 ',
  'http://localhost:8080',
  'http://192.168.29.17:3000',  // Added local IP
  'https://rebecca-backendfinal.el.r.appspot.com'  // Added App Engine domain
];

// Development mode - allow all origins
const corsOptions = process.env.NODE_ENV === 'development' 
  ? {
      origin: true, // Allow all origins in development
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }
  : {
      origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.log('Blocked origin:', origin); // Debug logging
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    };

app.use(cors(corsOptions));

// --------------------
// Middleware
// --------------------
app.set('trust proxy', 1); // Trust first proxy
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../vite-project/dist')));

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

// Connect DB before API routes (with error handling)
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection failed:', err);
    return res.status(503).json({ success: false, error: 'Database connection failed' });
  }
});

// Initialize DB connection on startup (don't block server start)
connectDB().catch(err => {
  console.error('Initial database connection failed, but server will continue:', err);
});

// Health check endpoint (doesn't require DB)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Rebecca Backend API', version: '1.0.0', status: 'running' });
});

// --------------------
// API Routes
// --------------------
app.use('/api/products', productRouter);
app.use('/api/testimonials', testimonialRouter);
app.use('/api/packaging', packagingRouter);
app.use('/api/certificates', certificateRouter);
app.use('/api/categories', categoriesRouter);

// Catch-all handler: send back index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../vite-project/dist/index.html'));
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

// --------------------
// For Cloud Run or direct running
// --------------------
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  console.log(`Starting server on port ${PORT}...`);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server successfully started and listening on port ${PORT}`);
    console.log(`📍 Health check available at: http://localhost:${PORT}/health`);
  }).on('error', (err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
}

// Dummy comment to trigger nodemon restart
