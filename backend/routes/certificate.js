const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
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
    folder: 'certificates',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
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

// Add certificate
router.post('/add', upload.single('image'), asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Image is required' });
    }

    // Store the Cloudinary URL in the database
    const imageUrl = req.file.path;
    console.log('Saving certificate:', { 
      title, 
      imageUrl
    });

    const cert = new Certificate({ 
      title, 
      image: imageUrl 
    });
    await cert.save();
    
    console.log('Certificate saved successfully:', cert);
    res.status(201).json({ 
      success: true, 
      certificate: cert 
    });
  } catch (error) {
    console.error('Error saving certificate:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

// Edit certificate
router.put('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { title } = req.body;
    const oldCert = await Certificate.findById(req.params.id);
    if (!oldCert) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }

    const update = { title };
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (oldCert.image) {
        try {
          const publicId = oldCert.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`certificates/${publicId}`);
        } catch (err) {
          console.error('Error deleting old image from Cloudinary:', err);
        }
      }
      update.image = req.file.path; // Cloudinary URL
    }

    const cert = await Certificate.findByIdAndUpdate(req.params.id, update, { new: true });
    console.log('Updated certificate:', cert);
    res.json({ success: true, certificate: cert });
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ success: false, error: 'Failed to update certificate' });
  }
});

// Delete certificate
router.delete('/delete/:id', async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }

    // Delete image file if it exists
    if (cert.image) {
      const imagePath = path.join(__dirname, '..', cert.image);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

// Preview certificate
router.get('/preview/:id', async (req, res) => {
  const cert = await Certificate.findById(req.params.id);
  res.json(cert);
});

// List all certificates (for admin panel)
router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    console.log('Found certificates:', certs);
    res.json({ 
      success: true, 
      certificates: certs 
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
