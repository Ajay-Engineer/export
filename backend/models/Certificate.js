const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true // This will automatically manage createdAt and updatedAt
});

// Create indexes for better query performance
certificateSchema.index({ title: 1 });
certificateSchema.index({ createdAt: -1 });

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
