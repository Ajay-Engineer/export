const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'upload')); // Changed from 'uploads' to 'upload'
  },
  filename: function (req, file, cb) {
    cb(null, `testimonial-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Create upload directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, '..', 'upload'); // Changed from 'uploads' to 'upload'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Add file filter for images
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
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
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
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
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new testimonial (admin only)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    const testimonial = new Testimonial({
      name: req.body.name,
      companyName: req.body.companyName,
      country: req.body.country,
      quote: req.body.quote,
      image: `/upload/${req.file.filename}`
    });

    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update testimonial (admin only)
router.patch('/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Update text fields if provided
    if (req.body.name) testimonial.name = req.body.name;
    if (req.body.companyName) testimonial.companyName = req.body.companyName;
    if (req.body.country) testimonial.country = req.body.country;
    if (req.body.quote) testimonial.quote = req.body.quote;

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (testimonial.image) {
        const oldImagePath = path.join(__dirname, '..', testimonial.image);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      testimonial.image = `/upload/${req.file.filename}`;
    }

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete testimonial (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Delete the image file
    if (testimonial.image) {
      const imagePath = path.join(__dirname, '..', testimonial.image);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
