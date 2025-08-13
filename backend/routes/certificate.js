const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper function to handle async routes
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../upload');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  // Test write permissions
  const testFile = path.join(uploadDir, '.test');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('Upload directory ready:', uploadDir);
} catch (error) {
  console.error('Error with upload directory:', error);
  throw new Error('Failed to setup upload directory');
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
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

// Add certificate
router.post('/add', upload.single('image'), asyncHandler(async (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  if (!req.file) {
    return res.status(400).json({ error: 'Image is required' });
  }

  // Store the relative path in the database
  const filename = req.file.filename;
  const image = `/upload/${filename}`;
  console.log('Saving certificate:', { 
    title, 
    image,
    fullPath: path.join(__dirname, '../upload', filename)
  });
  try {
    const cert = new Certificate({ title, image });
    await cert.save();
    console.log('Certificate saved successfully:', cert); // Debug log
    res.status(201).json(cert);
  } catch (error) {
    console.error('Error saving certificate:', error);
    res.status(500).json({ error: error.message });
  }
  
  res.status(201).json(cert);
}));

// Edit certificate
router.put('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { title } = req.body;
    const oldCert = await Certificate.findById(req.params.id);
    if (!oldCert) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const update = { title };
    if (req.file) {
      // Delete old image if it exists
      if (oldCert.image) {
        const oldImagePath = path.join(__dirname, '..', oldCert.image);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      update.image = `/upload/${req.file.filename}`;
    }

    const cert = await Certificate.findByIdAndUpdate(req.params.id, update, { new: true });
    console.log('Updated certificate:', cert); // Debug log
    res.json(cert);
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ error: 'Failed to update certificate' });
  }
});

// Delete certificate
router.delete('/delete/:id', async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' });
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
    console.log('Found certificates:', certs); // Debug log
    res.json(certs);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
