const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const functions = require('firebase-functions');

// Helper function to handle async routes
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Configure Cloudinary (lazy-loaded)
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
};

// Configure Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'testimonials',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

// Add file filter for images
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Configure multer with Cloudinary storage
const upload = multer({
  storage: cloudinaryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware to verify admin token (temporarily disabled for testing)
const verifyToken = (req, res, next) => {
  // Temporarily skip authentication
  next();
};

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check admin credentials (replace with your admin credentials)
  if (username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD) {
    // Create and assign token
    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET);

    // Set cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({ success: true });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

// Get all testimonials
router.get('/', asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    data: testimonials
  });
}));

// Create new testimonial (admin only)
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    // Configure Cloudinary at runtime
    configureCloudinary();

    console.log('Request body:', req.body);
    console.log('File:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    const imageUrl = req.file.path; // Cloudinary URL
    
    const testimonial = new Testimonial({
      name: req.body.name,
      companyName: req.body.companyName,
      country: req.body.country,
      quote: req.body.quote,
      image: imageUrl
    });

    const newTestimonial = await testimonial.save();
    res.status(201).json({ success: true, testimonial: newTestimonial });
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update testimonial (admin only)
router.patch('/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    // Configure Cloudinary at runtime
    configureCloudinary();

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    // Update text fields if provided
    if (req.body.name) testimonial.name = req.body.name;
    if (req.body.companyName) testimonial.companyName = req.body.companyName;
    if (req.body.country) testimonial.country = req.body.country;
    if (req.body.quote) testimonial.quote = req.body.quote;

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (testimonial.image) {
        const publicId = testimonial.image.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(`testimonials/${publicId}`);
        } catch (err) {
          console.error('Error deleting old image from Cloudinary:', err);
        }
      }
      testimonial.image = req.file.path;
    }

    const updatedTestimonial = await testimonial.save();
    res.json({ success: true, testimonial: updatedTestimonial });
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete testimonial (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    // Delete the image from Cloudinary
    if (testimonial.image) {
      const publicId = testimonial.image.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`testimonials/${publicId}`);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin logout
router.post('/logout', (req, res) => {
  res.cookie('adminToken', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
