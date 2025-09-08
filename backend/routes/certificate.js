const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const functions = require('firebase-functions');

// Configure Cloudinary (lazy-loaded)
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
};

// Configure Cloudinary storage for certificates
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'certificates',
    format: async (req, file) => 'webp',
    public_id: async (req, file) => {
      const timestamp = Date.now();
      const uniqueSuffix = Math.round(Math.random() * 1E9);
      return `cert_${timestamp}_${uniqueSuffix}`;
    },
    transformation: [{
      width: 800,
      height: 800,
      crop: 'limit',
      format: 'webp',
      quality: 'auto'
    }]
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;

  const mimeTypeOk = allowedMimeTypes.includes(file.mimetype);
  const extensionOk = file.originalname.toLowerCase().match(allowedExtensions);

  if (!mimeTypeOk || !extensionOk) {
    return cb(new Error(`File ${file.originalname} not allowed: must be an image file`), false);
  }

  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function for async error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all certificates
router.get('/', asyncHandler(async (req, res) => {
  const certificates = await Certificate.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    data: certificates
  });
}));

// Add new certificate
router.post('/add', upload.single('image'), asyncHandler(async (req, res) => {
  // Configure Cloudinary at runtime
  configureCloudinary();

  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No image file provided'
    });
  }

  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Title is required'
    });
  }

  const certificate = new Certificate({
    title: title.trim(),
    image: req.file.path
  });

  await certificate.save();

  res.status(201).json({
    success: true,
    message: 'Certificate added successfully',
    data: certificate
  });
}));

// Update certificate
router.put('/edit/:id', upload.single('image'), asyncHandler(async (req, res) => {
  // Configure Cloudinary at runtime
  configureCloudinary();

  const { id } = req.params;
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Title is required'
    });
  }

  const certificate = await Certificate.findById(id);
  if (!certificate) {
    return res.status(404).json({
      success: false,
      error: 'Certificate not found'
    });
  }

  // Update title
  certificate.title = title.trim();

  // Update image if provided
  if (req.file) {
    // Delete old image from Cloudinary
    if (certificate.image && certificate.image.includes('cloudinary')) {
      try {
        const publicId = certificate.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }
    certificate.image = req.file.path;
  }

  await certificate.save();

  res.json({
    success: true,
    message: 'Certificate updated successfully',
    data: certificate
  });
}));

// Delete certificate
router.delete('/delete/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const certificate = await Certificate.findById(id);
  if (!certificate) {
    return res.status(404).json({
      success: false,
      error: 'Certificate not found'
    });
  }

  // Delete image from Cloudinary
  if (certificate.image && certificate.image.includes('cloudinary')) {
    try {
      const publicId = certificate.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  await certificate.deleteOne();

  res.json({
    success: true,
    message: 'Certificate deleted successfully'
  });
}));

module.exports = router;