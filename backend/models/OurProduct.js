const mongoose = require('mongoose');

const ourProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['herbal', 'palm-jaggery', 'coir', 'tea', 'health-mix', 'handicraft']
  },
  image: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('OurProduct', ourProductSchema);
