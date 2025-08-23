const express = require('express');
const router = express.Router();
const Header = require('../models/Header');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'upload', 'headers');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `header-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all headers
router.get('/', async (req, res) => {
  try {
    const headers = await Header.find().sort({ createdAt: -1 });
    res.json(headers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new header
router.post('/', upload.single('backgroundImage'), async (req, res) => {
  try {
    const headerData = req.body;
    if (req.file) {
      headerData.backgroundImage = `/uploads/headers/${req.file.filename}`;
    }

    const header = new Header(headerData);
    await header.save();
    res.status(201).json(header);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update header
router.put('/:id', upload.single('backgroundImage'), async (req, res) => {
  try {
    const headerData = req.body;
    if (req.file) {
      headerData.backgroundImage = `/uploads/headers/${req.file.filename}`;
      
      // Delete old image if it exists
      const oldHeader = await Header.findById(req.params.id);
      if (oldHeader && oldHeader.backgroundImage) {
        const oldImagePath = path.join(__dirname, '..', oldHeader.backgroundImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const header = await Header.findByIdAndUpdate(
      req.params.id,
      headerData,
      { new: true }
    );
    res.json(header);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete header
router.delete('/:id', async (req, res) => {
  try {
    const header = await Header.findById(req.params.id);
    if (header && header.backgroundImage) {
      const imagePath = path.join(__dirname, '..', header.backgroundImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Header.findByIdAndDelete(req.params.id);
    res.json({ message: 'Header deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
