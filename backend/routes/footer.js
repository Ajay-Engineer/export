const express = require('express');
const router = express.Router();
const Footer = require('../models/Footer');

// Get all footer sections
router.get('/', async (req, res) => {
  try {
    const footers = await Footer.find().sort('order');
    res.json(footers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new footer section
router.post('/', async (req, res) => {
  try {
    const footer = new Footer(req.body);
    await footer.save();
    res.status(201).json(footer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update footer section
router.put('/:id', async (req, res) => {
  try {
    const footer = await Footer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(footer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete footer section
router.delete('/:id', async (req, res) => {
  try {
    await Footer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Footer section deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
