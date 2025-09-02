const express = require('express');
const router = express.Router();
const PackagingStandard = require('../models/PackagingStandard');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Helper function to handle async routes
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'packaging',
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

// Get all packaging standards
router.get('/', asyncHandler(async (req, res) => {
  const standards = await PackagingStandard.find().sort({ order: 1, createdAt: -1 });
  res.json({
    success: true,
    data: standards
  });
}));

// Add packaging standard
router.post('/', upload.single('image'), asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;
  const image = req.file ? req.file.path : null;

  if (!title || !description || !image) {
    res.status(400).json({
      success: false,
      error: 'Please provide title, description, and image'
    });
    return;
  }

  const standard = await PackagingStandard.create({
    title,
    description,
    image,
    order: order || 0
  });

  res.status(201).json({
    success: true,
    data: standard
  });
}));

// Update packaging standard
router.put('/:id', upload.single('image'), asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;
  const updateData = { title, description, order };
  
  if (req.file) {
    updateData.image = req.file.path;
  }

  const standard = await PackagingStandard.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!standard) {
    res.status(404).json({
      success: false,
      error: 'Packaging standard not found'
    });
    return;
  }

  res.json({
    success: true,
    data: standard
  });
}));

// Delete packaging standard
router.delete('/:id', asyncHandler(async (req, res) => {
  const standard = await PackagingStandard.findById(req.params.id);
  
  if (!standard) {
    res.status(404).json({
      success: false,
      error: 'Packaging standard not found'
    });
    return;
  }

  // Delete image from Cloudinary if exists
  if (standard.image) {
    const publicId = standard.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  }

  await standard.deleteOne();

  res.json({
    success: true,
    message: 'Packaging standard deleted successfully'
  });
}));

module.exports = router;
