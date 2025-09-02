const mongoose = require('mongoose');

const packagingStandardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
packagingStandardSchema.index({ order: 1 });
packagingStandardSchema.index({ createdAt: -1 });

const PackagingStandard = mongoose.model('PackagingStandard', packagingStandardSchema);

module.exports = PackagingStandard;
